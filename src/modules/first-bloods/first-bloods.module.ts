import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirstBlood } from './first-blood.entity';
import { FirstBloodsService } from './first-bloods.service';
import { FirstBloodsController } from './first-bloods.controller'; // (컨트롤러 파일 만들었다면 포함)

@Module({
  // 1. Imports: 이 모듈이 동작하기 위해 필요한 외부 재료
  // "FirstBlood 엔티티(테이블)를 쓸 거니까 DB 연결해줘!"라는 뜻
  imports: [
    TypeOrmModule.forFeature([FirstBlood]) 
  ],

  // 2. Controllers: 외부 요청(HTTP)을 받는 창구
  // (아직 컨트롤러 파일 안 만들었으면 이 줄은 주석 처리 하세요!)
  controllers: [FirstBloodsController],

  // 3. Providers: 핵심 비즈니스 로직 (Service)
  // "이 모듈 안에서 FirstBloodsService를 객체로 생성해서 쓸 거야"
  providers: [FirstBloodsService],

  // 4. Exports: 외부 공개 (Public)
  // "다른 모듈(예: Submissions)에서도 우리 서비스 함수를 쓸 수 있게 허락해 줄게"
  exports: [FirstBloodsService], 
})
export class FirstBloodsModule {}