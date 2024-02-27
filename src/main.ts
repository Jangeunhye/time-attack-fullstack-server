import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/handler.error';
import enhancerMiddleware from './middlewares/enhancer.middleware';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });

  app.use(cookieParser());
  app.use(enhancerMiddleware);
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(5050);
}
bootstrap();
