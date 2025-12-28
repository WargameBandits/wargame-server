// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// let app; // 서버를 메모리에 캐시(저장)해두기 위함

// async function bootstrap() {
//   if (!app) {
//     app = await NestFactory.create(AppModule);

//     // CORS 설정 (프론트엔드 접속 허용)
//     app.enableCors();

//     // Vercel은 app.listen() 대신 app.init()을 사용합니다.
//     await app.init();
//   }
//   return app;
// }

// // ★ Vercel이 실행할 수 있게 함수를 내보냅니다 (Export)
// export default async (req, res) => {
//   const app = await bootstrap();
//   const instance = app.getHttpAdapter().getInstance();
//   return instance(req, res);
// };

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

let app; // 서버를 메모리에 캐시(저장)해두기 위함

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(AppModule);

    // ★ [수정] CORS 설정을 구체적으로 적어야 안전합니다!
    app.enableCors({
      origin: [
        'http://localhost:3000', // 로컬 프론트 테스트용
        'http://localhost:5173', // Vite 로컬 테스트용 (혹시 몰라서 추가)
        'https://WargameBandits.github.io' // ★ 팀원이 만든 실제 프론트엔드 주소
      ],
      credentials: true, // 인증 정보(토큰 등) 허용
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    });

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