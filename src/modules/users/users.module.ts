import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // ★ 추가
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity'; // ★ 추가
import { UserScore } from './entities/user-score.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserScore])], // ★ 여기에 등록!
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule { }