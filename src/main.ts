import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

let app; // 서버를 메모리에 캐시(저장)해두기 위함

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(AppModule);

    // CORS 설정 (프론트엔드 접속 허용)
    app.enableCors();

    // Vercel은 app.listen() 대신 app.init()을 사용합니다.
    await app.init();
  }
  return app;
}

// ★ Vercel이 실행할 수 있게 함수를 내보냅니다 (Export)
export default async (req, res) => {
  const app = await bootstrap();
  const instance = app.getHttpAdapter().getInstance();
  return instance(req, res);
};