import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('github')
  async githubLogin(@Body('code') code: string) {
    return this.authService.githubLogin(code);
  }
}