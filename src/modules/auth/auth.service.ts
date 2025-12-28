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
    private readonly httpService: HttpService, // 깃허브랑 통신하는 전화기
    private readonly jwtService: JwtService,   // 토큰 찍어내는 기계
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(UserScore) private userScoreRepo: Repository<UserScore>,
  ) { }

  // 프론트에서 'code(임시표)'를 받아옵니다.
  async githubLogin(code: string) {
    // 1. [GitHub에게] "이 코드 진짜야? 진짜면 토큰 줘."
    try {
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
      if (!accessToken) throw new UnauthorizedException('GitHub 토큰 실패');

      // 2. [GitHub에게] "토큰 줄게, 이 사람 누군지 정보 좀 줘."
      const userResponse = await firstValueFrom(
        this.httpService.get('https://api.github.com/user', {
          headers: { Authorization: `Bearer ${accessToken}` },
        }),
      );
      const githubData = userResponse.data;

      // 3. [우리 DB] "이 사람(githubId) 우리 회원이야?"
      let user = await this.userRepo.findOne({
        where: { githubId: githubData.id.toString() },
        relations: ['scoreInfo']
      });

      // 4. [회원가입] 없으면 새로 만들기
      if (!user) {
        // 유저 정보 저장
        const newUser = this.userRepo.create({
          username: githubData.login,
          githubId: githubData.id.toString(),
          email: githubData.email,
          role: 'user',
        });
        user = await this.userRepo.save(newUser);

        // 점수판(1+1) 생성
        const newScore = this.userScoreRepo.create({
          user: user,
          totalScore: 0,
          solvedCount: 0,
        });
        await this.userScoreRepo.save(newScore);

        user.scoreInfo = newScore;
      }

      // 5. [토큰발급] 로그인 성공! 우리 사이트 이용권(JWT) 발급
      const payload = { username: user.username, sub: user.id, role: user.role };

      return {
        accessToken: this.jwtService.sign(payload), // 이게 진짜 중요!
        user: {
          id: user.id,
          username: user.username,
          score: user.scoreInfo?.totalScore || 0,
        }
      };

    } catch (e) {
      console.error(e);
      throw new UnauthorizedException('로그인 처리 중 에러 발생');
    }
  }
}