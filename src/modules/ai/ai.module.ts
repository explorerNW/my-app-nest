import { Module } from '@nestjs/common';
import { AiService } from './service';
import { AiController } from './controllers/ai.controller';
import { AZureOpenAiService } from './service/ai.azure.service';

@Module({
  providers: [AiService, AZureOpenAiService],
  controllers: [AiController],
})
export class AiModule {}
