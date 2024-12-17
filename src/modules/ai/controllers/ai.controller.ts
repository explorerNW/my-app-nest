import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from '../service';
import { AZureOpenAiService } from '../service/ai.azure.service';

@Controller('ai')
export class AiController {
  constructor(
    private aiService: AiService,
    private aZureOpenAiService: AZureOpenAiService,
  ) {}

  @Post('chat')
  prompt(@Body('prompt') prompt: string) {
    return this.aiService.prompt(prompt);
  }

  @Post('azure/chat')
  azurePrompt(@Body('prompt') prompt: string) {
    return this.aZureOpenAiService.ask(prompt);
  }
}
