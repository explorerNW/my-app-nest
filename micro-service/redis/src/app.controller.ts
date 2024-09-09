import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Ctx, MessagePattern, Payload, RedisContext } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('notifications')
  getNotifications(@Payload() data: number[], @Ctx() ctx: RedisContext) {
    console.log(`contenxt-channel: ${ctx.getChannel()}`);
    return data;
  }

}