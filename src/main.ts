import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { LoggingInterceptor } from './interceptors';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import * as csurf from 'csurf';
import * as cookieParser from 'cookie-parser';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import fastifyCsrf from '@fastify/csrf-protection';
dotenv.config();

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableVersioning({ type:VersioningType.MEDIA_TYPE, key: 'v=' });
  app.use(helmet());
  app.enableCors();
  // app.use(cookieParser());
  // app.use(csurf({ cookie: true }));
  await app.register(fastifyCsrf);
  await app.listen(process.env.SERVER_PORT, ()=>{
    console.log(`server start on: ${process.env.SERVER_PORT}`);
  });
}
bootstrap();
