import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';

@Controller('challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) { }

  @Post()
  create(@Body() createChallengeDto: CreateChallengeDto) {
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChallengeDto: UpdateChallengeDto) {
    return this.challengesService.update(+id, updateChallengeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.challengesService.remove(+id);
  }
  // 정답 확인
  @Post(':id/solve') // POST /challenges/1/solve 주소로 요청이 오면
  async solve(@Param('id') id: string, @Body('flag') flag: string) {
    const isCorrect = await this.challengesService.checkFlag(+id, flag);

    if (isCorrect) {
      return { message: '정답입니다! 🎉', result: true };
    } else {
      return { message: '오답입니다 ㅠㅠ', result: false };
    }
  }
}
