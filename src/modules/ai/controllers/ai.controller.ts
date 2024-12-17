import { Body, Controller, Post } from '@nestjs/common';
import { AiService } from '../service';

@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('chat')
  prompt(@Body('prompt') prompt: string) {
    return this.aiService.prompt(prompt);
  }
}
