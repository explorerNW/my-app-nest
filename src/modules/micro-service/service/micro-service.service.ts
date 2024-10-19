import { Inject, Injectable } from '@nestjs/common';
import { ClientRedis } from '@nestjs/microservices';

@Injectable()
export class MicroService {
  constructor(@Inject('REDIS_SERVICE') private redis: ClientRedis) {}

  getKeys(pattern: string) {
    return this.redis.send('redis-keys-pattern', pattern);
  }

  getKeyValue(key: string) {
    return this.redis.send('redis-key-value', key);
  }

  setKeyValue(key: string, value: string) {
    return this.redis.send('redis-set-key-value', { key, value });
  }

  removeKey(key: string) {
    return this.redis.send('redis-delete-key', { key });
  }
}
