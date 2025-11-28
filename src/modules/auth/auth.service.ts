import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';
import { User } from '../users/entities/user.entity';
import { UserScore } from '../users/entities/user-score.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(UserScore) private userScoreRepo: Repository<UserScore>,
  ) { }

  async githubLogin(code: string) {
    // 1. 프론트에서 받은 code로 깃허브 Access Token 요청
    // (try-catch로 감싸서 에러 처리하면 더 좋습니다)
    const tokenResponse = await firstValueFrom(
      this.httpService.post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code: code,
        },
        { headers: { Accept: 'application/json' } },
      ),
    );

    const accessToken = tokenResponse.data.access_token;
    if (!accessToken) throw new UnauthorizedException('GitHub 토큰 받아오기 실패');

    // 2. 깃허브 유저 정보 가져오기
    const userResponse = await firstValueFrom(
      this.httpService.get('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    );
    const githubData = userResponse.data;

    // 3. 우리 DB에 있는 사람인지 확인 (githubId로 찾기)
    let user = await this.userRepo.findOne({
      where: { githubId: githubData.id.toString() },
      relations: ['scoreInfo'] // 점수 정보도 같이 가져옴
    });

    // 4. 없으면 회원가입 (User + UserScore 생성)
    if (!user) {
      // (1) 유저 저장
      const newUser = this.userRepo.create({
        username: githubData.login, // 깃허브 아이디
        githubId: githubData.id.toString(),
        email: githubData.email,
        role: 'user', // 기본 권한
      });
      user = await this.userRepo.save(newUser);

      // (2) 빈 점수판 생성 (1+1)
      const newScore = this.userScoreRepo.create({
        user: user,
        totalScore: 0,
        solvedCount: 0,
      });
      await this.userScoreRepo.save(newScore);

      // 리턴을 위해 연결해줌
      user.scoreInfo = newScore;
    }

    // 5. 로그인 성공! JWT 토큰 발급 (우리 사이트 출입증)
    const payload = { username: user.username, sub: user.id, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        score: user.scoreInfo?.totalScore || 0, // 점수도 같이 줌
        role: user.role
      }
    };
  }
}