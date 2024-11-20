import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppService } from './app.service';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://admin:admin@me@localhost:5672'],
        queue: 'chat.general',
        prefetchCount: 10,
        queueOptions: {
          durable: false,
          persistent: true,
        },
      },
    }
  );
  await app.listen().then(()=>{
    console.log(`Micro-server: rabbitMQ start on: ${ 5672 }`);
  });
}
bootstrap();
