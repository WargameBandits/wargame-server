import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserScore } from '../users/entities/user-score.entity';

@Injectable()
export class LeaderboardService {
  constructor(
    @InjectRepository(UserScore)
    private userScoreRepo: Repository<UserScore>,
  ) { }

  // 전체 랭킹 조회
  async findAll() {
    return await this.userScoreRepo.find({
      relations: ['user'], // 점수판 주인(유저) 정보 가져오기
      select: {
        id: true,
        totalScore: true,
        solvedCount: true,
        lastSolvedAt: true,
        user: {
          username: true, // 유저 이름만 공개 (이메일 등은 비밀)
          // avatarUrl: true, (프로필 사진 있으면 추가)
        },
      },
      order: {
        totalScore: 'DESC',   // 점수 높은 순
        lastSolvedAt: 'ASC',  // 빨리 푼 순
      },
      take: 20, // Top 20만 조회
    });
  }
}