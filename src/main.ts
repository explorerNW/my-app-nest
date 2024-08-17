import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { LoggingInterceptor } from './interceptors';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new LoggingInterceptor());
  await app.listen(process.env.SERVER_PORT, ()=>{
    console.log(`server start on: ${process.env.SERVER_PORT}`);
  });
}
bootstrap();
