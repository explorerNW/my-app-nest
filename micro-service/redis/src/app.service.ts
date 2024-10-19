import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class AppService {
  constructor(private readonly redis: Redis) { }

  async get(key: string) {
    return await this.redis.get(key);
  }

  async hGet(key: string) {
    return await this.redis.hget(key, '');
  }

  async keys() {
    return await this.redis.keys('*');
  }

  async keysPattern(pattern: string) {
    return await this.redis.keys(pattern);
  }

  async keyType(key: string) {
    return await this.redis.type(key);
  }

  async getList(key: string) {
    return await this.redis.lrange(key, 0, -1);
  }

  async set(key: string, value: string) {
    return await this.redis.set(key, value);
  }

  async deleteKey(key: string) {
    return await this.redis.del(key);
  }
}
