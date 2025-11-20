import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. CORS 허용 (팀원 프론트엔드가 접속할 수 있게 문 열어주기)
  app.enableCors();

  // 2. 포트 설정 (Render가 주는 PORT가 있으면 그거 쓰고, 없으면 3000번 써라)
  await app.listen(process.env.PORT || 3000);
}
bootstrap();