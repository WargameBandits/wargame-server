import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserScore } from './entities/user-score.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(UserScore) // 점수판 관리자 추가
    private userScoreRepo: Repository<UserScore>,
  ) { }

  // 1. 유저 생성 (회원가입 시 내부적으로 호출됨)
  async create(username: string, githubId: string, email?: string) {
    // 유저 객체 생성
    const newUser = this.userRepo.create({
      username,
      githubId,
      email,
    });

    // 유저 저장
    const savedUser = await this.userRepo.save(newUser);

    // ★ 중요: 유저 만들면서 '빈 점수판(UserScore)'도 같이 생성!
    const newScoreBoard = this.userScoreRepo.create({
      user: savedUser, // 방금 만든 유저랑 연결
      totalScore: 0,
      solvedCount: 0,
    });
    await this.userScoreRepo.save(newScoreBoard);

    return savedUser;
  }

  // 2. 랭킹 조회 (UserScore 테이블 기준)
  async getLeaderboard() {
    return await this.userScoreRepo.find({
      relations: ['user'], // 유저 정보도 같이 가져와!
      order: {
        totalScore: 'DESC', // 점수 높은 순
        lastSolvedAt: 'ASC', // 동점이면 빨리 푼 순
      },
      take: 10, // 상위 10명
    });
  }

  async findOneByGithubId(githubId: string) {
    return await this.userRepo.findOne({ where: { githubId } });
  }
}