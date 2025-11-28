import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirstBloodsService } from './first-bloods.service';     // s 붙음
import { FirstBloodsController } from './first-bloods.controller'; // s 붙음
import { FirstBlood } from './entities/first-blood.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FirstBlood])],
  controllers: [FirstBloodsController],
  providers: [FirstBloodsService],
  exports: [FirstBloodsService], // ★ 중요: Submissions에서 쓰도록 수출!
})
export class FirstBloodsModule { } // 클래스명에 s 붙음