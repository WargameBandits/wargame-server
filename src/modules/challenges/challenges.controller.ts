import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ChallengesService } from './challenges.service';

@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) { }

  @Post()
  create(@Body() createChallengeDto: any) { // 일단 any로 받음
    return this.challengesService.create(createChallengeDto);
  }

  @Get()
  findAll() {
    return this.challengesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.challengesService.findOne(+id);
  }

  // 🚨 중요: 여기에 있던 @Patch(수정), @Delete(삭제), @Post(':id/solve')(채점)
  // 이 친구들은 다 지웠습니다! 
  // (채점은 submissions.controller.ts가 담당하니까요)
}