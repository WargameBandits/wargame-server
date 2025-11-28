import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // 1. 유저 생성 (테스트용 수동 가입)
  @Post()
  create(@Body() body: any) {
    // 서비스의 create 함수는 (username, githubId, email) 3개를 원하는데
    // 컨트롤러가 1개(DTO)만 던져서 에러났던 겁니다. 이렇게 쪼개서 넣어줍니다.
    return this.usersService.create(body.username, body.githubId, body.email);
  }

  // 2. 랭킹 조회 (UsersService에 만들어둔 게 있다면 사용)
  // (만약 LeaderboardModule을 따로 쓴다면 이 함수는 지워도 됩니다)
  @Get('leaderboard')
  getLeaderboard() {
    return this.usersService.getLeaderboard();
  }

  // 3. 특정 유저 정보 조회 (Github ID로 찾기)
  @Get(':githubId')
  findOne(@Param('githubId') githubId: string) {
    return this.usersService.findOneByGithubId(githubId);
  }

  // 🚨 중요: 여기에 있던 @Patch(update), @Delete(remove)는
  // 서비스 파일에 해당 함수가 없으므로 지워야 에러가 안 납니다!
}