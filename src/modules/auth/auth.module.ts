import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../users/entities/user.entity';
import { UserScore } from '../users/entities/user-score.entity';

@Module({
  imports: [
    HttpModule, // axios용
    TypeOrmModule.forFeature([User, UserScore]), // DB 사용 허락
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey', // 환경변수 사용 권장
      signOptions: { expiresIn: '12h' }, // 토큰 12시간 유효
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }