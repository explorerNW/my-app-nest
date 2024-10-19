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

  @MessagePattern('redis-keys')
  getKeys() {
    return this.appService.keys();
  }

  @MessagePattern('redis-keys-pattern')
  keyPattern(@Payload() pattern: string) {
    return this.appService.keysPattern(pattern);
  }

  @MessagePattern('redis-key-type')
  keyType(@Payload() key: string) {
    return this.appService.keyType(key);
  }

  @MessagePattern('redis-key-lrange')
  lrange(@Payload() key: string) {
    return this.appService.getList(key);
  }

  @MessagePattern('redis-key-value')
  getKeyValue(@Payload() key: string) {
    return this.appService.get(key);
  }

  @MessagePattern('redis-set-key-value')
  setKeyValue(@Payload() payload: { key: string; value:string }) {
    return this.appService.set(payload.key, payload.value);
  }

  @MessagePattern('redis-delete-key')
  deleteKey(@Payload() payload: { key: string;}) {
    return this.appService.deleteKey(payload.key);
  }

}