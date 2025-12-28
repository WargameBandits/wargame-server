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
    HttpModule, // Axios
    TypeOrmModule.forFeature([User, UserScore]), // DB
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '1d' }, // 토큰 유효기간 1일
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }