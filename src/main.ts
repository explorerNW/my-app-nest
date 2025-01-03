import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import dotenv from 'dotenv';
import { LoggingInterceptor } from './interceptors';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCsrf from '@fastify/csrf-protection';
import { LoggerService } from './modules/logger/logger.service';
import fastifyCookie from '@fastify/cookie';
import compression from '@fastify/compress';
import fastifyMultipart from '@fastify/multipart';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { constants } from 'zlib';
import fs from 'fs';
dotenv.config();

const httpsOptions = {
  key: fs.readFileSync('secrets/explorernw.top.key'),
  cert: fs.readFileSync('secrets/explorernw.top_bundle.crt'),
};

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ https: httpsOptions }),
  );
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableVersioning({ type: VersioningType.MEDIA_TYPE, key: 'v=' });
  app.use(helmet({ xssFilter: true }));
  app.enableCors();
  app.use(cookieParser());
  app.useLogger(app.get(LoggerService)); //  ['error', 'warn']
  const apiConfig = new DocumentBuilder()
    .setTitle('API')
    .setDescription('project discription')
    .setVersion(process.env.npm_package_version)
    .addServer(`http://localhost:${process.env.SERVER_PORT}/`)
    .build();
  const document = SwaggerModule.createDocument(app, apiConfig);
  SwaggerModule.setup('swagger', app, document);
  await app.register(fastifyCookie, {
    secret: 'my-secret',
  });
  await app.register(fastifyCsrf);
  await app.register(compression, {
    encodings: ['gzip', 'deflate'],
    brotliOptions: { params: { [constants.BROTLI_PARAM_QUALITY]: 4 } },
  });
  await app.register(fastifyMultipart);
  await app.listen(process.env.SERVER_PORT, '0.0.0.0', () => {
    console.log(`server start on: ${process.env.SERVER_PORT}`);
  });
}
bootstrap();
