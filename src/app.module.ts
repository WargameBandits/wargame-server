import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // ★ 추가됨
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChallengesModule } from './modules/challenges/challenges.module';
import { UsersModule } from './modules/users/users.module';
import { SubmissionsModule } from './modules/submissions/submissions.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    // 1. 환경변수 모듈 설정 (제일 위에 있어야 함)
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // 2. 데이터베이스 연결 (환경변수에서 주소 가져옴)
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL, // ★ .env에 있는 주소를 가져와라!
      autoLoadEntities: true,
      synchronize: true, // 개발용: 테이블 자동 생성
      ssl: {
        rejectUnauthorized: false, // Neon 접속 필수 설정
      },
    }),
    ChallengesModule,
    UsersModule,
    SubmissionsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }