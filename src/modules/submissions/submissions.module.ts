import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubmissionsService } from './submissions.service';
import { SubmissionsController } from './submissions.controller';
import { Submission } from './entities/submission.entity';
// ★ 다른 모듈의 Entity들도 불러옵니다.
import { Challenge } from '../challenges/entities/challenge.entity';
import { User } from '../users/entities/user.entity';
import { UserScore } from '../users/entities/user-score.entity';

@Module({
  imports: [
    // 여기에 다 등록해야 Service에서 쓸 수 있습니다.
    TypeOrmModule.forFeature([Submission, Challenge, User, UserScore]),
  ],
  controllers: [SubmissionsController],
  providers: [SubmissionsService],
})
export class SubmissionsModule { }