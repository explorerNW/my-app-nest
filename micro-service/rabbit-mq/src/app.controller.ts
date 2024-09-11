import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('rmq-message')
  message(@Payload() message: string, @Ctx() context: RmqContext) {
      console.log(context.getMessage());
      return context.getMessage();
  }
}
