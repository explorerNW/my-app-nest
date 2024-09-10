import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Ctx, MessagePattern, NatsContext, Payload } from '@nestjs/microservices';
import * as nast from 'nats';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('nast-message')
  message(@Payload() message: string, @Ctx() context: NatsContext) {
    
  }
}
