import { Inject, Injectable } from '@nestjs/common';
import { ClientRedis } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class MicroService {
  constructor(@Inject('REDIS_SERVICE') private redis: ClientRedis) {}

  getKeys(pattern: string) {
    return this.redis.send('redis-keys-pattern', pattern);
  }

  getKeyValue<T>(key: string): Observable<T> {
    return this.redis.send('redis-key-value', key);
  }

  setKeyValue(key: string, value: string) {
    return this.redis.send('redis-set-key-value', { key, value });
  }

  removeKey(key: string | string[]) {
    return this.redis.send('redis-delete-key', { key });
  }

  lrem(key: string, count: number = 0, element: string) {
    return this.redis.send('redis-lrem', { key, count, element });
  }

  hSet<T>(key: string, value: T) {
    return this.redis.send('redis-hset', { key, value });
  }

  hGet(key: string, field: string) {
    return this.redis.send('redis-hget', { key, field });
  }

  hGetAll<T>(key: string): Observable<T> {
    return this.redis.send('redis-hgetAll', { key });
  }

  rPush(key: string, value: string) {
    return this.redis.send('redis-rpush', { key, value });
  }

  lRange(key: string, start: number, end: number): Observable<string[]> {
    return this.redis.send('redis-lrange', { key, start, end });
  }

  llen(key: string) {
    return this.redis.send('redis-llen', { key });
  }

  batchRpush(key: string, values: string[]) {
    return this.redis.send('redis-batchRpush', { key, values });
  }

  batchCommandsExc<T>(
    excs: { command: string; key: string; value?: T }[],
  ): Observable<T> {
    return this.redis.send('redis-batchCommandsExc', excs);
  }

  scan<T>(pattern: string): Observable<T> {
    return this.redis.send('redis-scan', { pattern });
  }
}
