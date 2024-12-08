import { Module } from '@nestjs/common';

import { CacheModule as CacheModuleManager } from '@nestjs/cache-manager';
import type { RedisOptions } from 'ioredis';
import * as redisStore from 'cache-manager-redis-store';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModuleManager.register<RedisOptions>({
      store: redisStore as any,
    }),
  ],
  providers: [CacheInterceptor],
  exports: [],
})
export class CacheModule {}
