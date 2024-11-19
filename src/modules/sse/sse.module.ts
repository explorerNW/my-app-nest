import { Module } from '@nestjs/common';
import { SseController } from './controller';
import { SseService } from './service';

@Module({
  controllers: [SseController],
  providers: [SseService],
  exports: [SseService],
})
export class SseModule {}
