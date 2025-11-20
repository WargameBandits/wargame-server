import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChallengesModule } from './challenges/challenges.module';

@Module({
  imports: [
    // 1. 데이터베이스 연결 설정
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'dreamhack.db', // 프로젝트 폴더에 이 파일이 자동으로 생깁니다.
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // 모든 entity 파일을 자동으로 읽어옵니다.
      synchronize: true, // 개발 중엔 true (코드가 바뀌면 DB 테이블도 알아서 고쳐줌)
    }),
    // 2. 기능 모듈
    ChallengesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }