import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { FirstBloodsService } from './first-bloods.service';

@Controller('first-bloods') // 주소: http://localhost:3000/first-bloods
export class FirstBloodsController {
  constructor(private readonly firstBloodsService: FirstBloodsService) {}

  /**
   * [GET] 특정 문제의 First Blood 유저 조회
   * 사용법: /first-bloods/challenge/1 (1번 문제 누가 1등으로 풀었어?)
   */
  @Get('challenge/:challengeId')
  async getFirstBlood(@Param('challengeId', ParseIntPipe) challengeId: number) {
    return this.firstBloodsService.getFirstBloodByChallenge(challengeId);
  }
}