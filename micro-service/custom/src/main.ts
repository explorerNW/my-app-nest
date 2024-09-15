import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions } from '@nestjs/microservices';
import { AppService } from './app.service';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,
    {
      strategy: new AppService()
    }
  );
  await app.listen().then(()=>{
    console.log(`Micro-server: Custom start.`);
  });
}
bootstrap();
