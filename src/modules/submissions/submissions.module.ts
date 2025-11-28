import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubmissionsService } from './submissions.service';
import { SubmissionsController } from './submissions.controller';
import { Submission } from './entities/submission.entity';
import { Challenge } from '../challenges/entities/challenge.entity';
import { User } from '../users/entities/user.entity';
import { UserScore } from '../users/entities/user-score.entity';
// ★ 경로랑 이름 바뀜 (s 붙음)
import { FirstBloodsModule } from '../first-bloods/first-bloods.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Submission, Challenge, User, UserScore]),
    FirstBloodsModule, // ★ 여기 등록
  ],
  controllers: [SubmissionsController],
  providers: [SubmissionsService],
})
export class SubmissionsModule { }