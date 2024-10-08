import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, 
    {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: Number(process.env.MICRO_SERVICE_PORT)
      }
    }
  );
  await app.listen().then(()=>{
    console.log(`Micro-server: TCP start on: ${process.env.MICRO_SERVICE_PORT}`);
  });
}
bootstrap();
