import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardController } from './leaderboard.controller';
import { UserScore } from '../users/entities/user-score.entity'; // ★ 경로 확인!

@Module({
  imports: [
    // 랭킹 모듈에서 'UserScore' 테이블을 쓰겠다고 등록
    TypeOrmModule.forFeature([UserScore]),
  ],
  controllers: [LeaderboardController],
  providers: [LeaderboardService],
})
export class LeaderboardModule { }