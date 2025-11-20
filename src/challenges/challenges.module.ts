import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // 이거 추가됨
import { ChallengesService } from './challenges.service';
import { ChallengesController } from './challenges.controller';
import { Challenge } from './entities/challenge.entity'; // 이것도 추가됨

@Module({
  imports: [TypeOrmModule.forFeature([Challenge])], // "이 모듈에서 Challenge 테이블 쓸거야!" 라고 선언
  controllers: [ChallengesController],
  providers: [ChallengesService],
})
export class ChallengesModule { }