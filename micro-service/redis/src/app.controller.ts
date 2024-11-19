import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { Ctx, MessagePattern, Payload, RedisContext } from '@nestjs/microservices';
import { RedisKey } from 'ioredis';

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

  @MessagePattern('redis-key-value')
  getKeyValue(@Payload() key: string) {
    return this.appService.get(key);
  }

  @MessagePattern('redis-set-key-value')
  setKeyValue(@Payload() payload: { key: string; value:string }) {
    return this.appService.set(payload.key, payload.value);
  }

  @MessagePattern('redis-delete-key')
  deleteKey(@Payload() payload: { key: RedisKey[];}) {
    return this.appService.deleteKey(payload.key);
  }

  @MessagePattern('redis-lrem')
  lrem(@Payload() payload: { key: string; count: number; element: string }) {
    return this.appService.lrem(payload.key, payload.count, payload.element);
  }

  @MessagePattern('redis-hset')
  hSet(@Payload() payload: { key: string; value: any }){
    return this.appService.hSet(payload.key, payload.value);
  }

  @MessagePattern('redis-hget')
  hGet(@Payload() payload: { key: string; field: string }){
    return this.appService.hGet(payload.key, payload.field);
  }

  @MessagePattern('redis-hgetAll')
  hGetAll(@Payload() payload: { key: string; }){
    return this.appService.hGetAll(payload.key);
  }

  @MessagePattern('redis-rpush')
  rPush(@Payload() payload: { key: string; value: string }) {
    return this.appService.listRpush(payload.key, payload.value);
  }

  @MessagePattern('redis-batchRpush')
  batchRpush(@Payload() payload: { key: string; values: string[] }) {
    return this.appService.batchRpush(payload.key, payload.values);
  }

  @MessagePattern('redis-batchCommandsExc')
  batchCommandsExc(@Payload() payload: { command: string; key: string; value: any }[]) {
    return this.appService.batchCommandsExc(payload);
  }

  @MessagePattern('redis-lrange')
  lrange(@Payload() payload: { key: string; start: number; end: number }) {
    return this.appService.lrange(payload.key, payload.start, payload.end);
  }

  @MessagePattern('redis-llen')
  llen(@Payload() payload: { key: string }){
    return this.appService.llen(payload.key);
  }

  @MessagePattern('redis-scan')
  scan(@Payload() payload: { pattern: string; position: number; }){
    return this.appService.scan(payload.pattern, payload.position);
  }
  

}