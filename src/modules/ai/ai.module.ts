import { Module } from '@nestjs/common';
import { AiService } from './service';
import { AiController } from './controllers/ai.controller';

@Module({
  providers: [AiService],
  controllers: [AiController],
})
export class AiModule {}
