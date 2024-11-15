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

  async hGetAll(key: string) {
    return await this.redis.hgetall(key).then((res) => {
      if (Object.keys(res).length) {
        return res;
      } else {
        return [];
      }
    });
  }

  async hGet(key: string, field: string) {
    return await this.redis.hget(key, field);
  }

  async listRpush(key: string, value: string) {
    return await this.redis.rpush(key, value);
  }

  async batchRpush(listName: string, values: string[]) {
    const pipeline = this.redis.pipeline();
    for (let i = 0; i < values.length; i++) {
      pipeline.rpush(listName, values[i]);
    }

    return pipeline
      .exec((error, result) => {
        if (error) {
          return error;
        }
        return result[1];
      })
      .then((res) => {
        pipeline.quit();
        return res;
      });
  }

  async batchCommandsExc(excs: { command: string; key: string; value: any }[]) {
    const pipeline = this.redis.pipeline();
    excs.forEach((exc) => {
      if (exc.value) {
        pipeline[exc.command](exc.key, exc.value);
      } else {
        pipeline[exc.command](exc.key);
      }
    });
    const result = await pipeline
      .exec()
      .then((res) => {
        pipeline.quit();
        return res;
      });

    return result.map((item) => {
      if (
        item &&
        ![undefined, null].includes(item[1]) &&
        !Object.keys(item[1]).length
      ) {
        return null;
      }
      return item[1];
    });
  }

  async lrange(key: string, start: number, end: number) {
    return await this.redis.lrange(key, start, end);
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

  async lrem(key: string, count: number = 0, element: string) {
    return await this.redis.lrem(key, count, element);
  }
}
