import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class AppService {
  constructor(private readonly redis: Redis) {}

  async set(key: string, value: string) {
    return await this.redis.setex(key, 3600, value);
  }

  async get(key: string) {
    return await this.redis.get(key);
  }

  async hSet(key: string, value: any) {
    return await this.redis.hset(key, value);
  }

  async hGet(key: string) {
    return await this.redis.hgetall(key).then((res) => {
      if (Object.keys(res).length) {
        return res;
      } else {
        return [];
      }
    });
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

  async deleteKey(key: string) {
    return await this.redis.del(key);
  }
}
