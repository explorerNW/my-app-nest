import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Ctx, MessagePattern, Payload, RedisContext } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('notifications')
  getNotifications(@Payload() key: string, @Ctx() ctx: RedisContext) {
    return this.appService.get(key);
  }

  @MessagePattern('keys')
  getKeys() {
    return this.appService.keys();
  }

  @MessagePattern('redis-key-type')
  keyType(@Payload() key: string) {
    return this.appService.keyType(key);
  }

  @MessagePattern('redis-key-lrange')
  lrange(@Payload() key: string) {
    return this.appService.getList(key);
  }

}