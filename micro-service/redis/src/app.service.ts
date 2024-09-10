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

  async keyType(key: string) {
    return await this.redis.type(key);
  }

  async getList(key: string) {
    return await this.redis.lrange(key, 0, -1);
  }
}
