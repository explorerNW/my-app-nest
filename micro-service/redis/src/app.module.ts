import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Redis } from 'ioredis';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, Redis],
})
export class AppModule {}
