import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { Ctx, KafkaContext, MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('kafka-message')
  message(@Payload() message: string, @Ctx() context: KafkaContext) {
    return { message: context.getMessage()};
  }
}
