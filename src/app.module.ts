import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { init as postgresDBInit, User as UserEntity } from './db';
import { UserModule, CatModule } from './modules';
import { AuthModule } from './auth';
import { mongo } from './db';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventsGateway } from './gateway/events/events.gateway';
import { GatewayModule } from './gateway';
import { ConfigModule } from './modules/config/config.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import type { RedisOptions } from 'ioredis';
import * as redisStore  from 'cache-manager-redis-store';
import { TaskService } from './task.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.register({ folder: './config' }),
    CacheModule.register<RedisOptions>({
      store: redisStore as any,
    }),
    ScheduleModule.forRoot(),
    postgresDBInit([UserEntity]),
    mongo.init(),
    UserModule,
    AuthModule,
    CatModule,
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100
      }
    ]),
    GatewayModule,
  ],
  controllers: [AppController],
  providers: [
    AppService, EventsGateway,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor
    },
    TaskService
  ],
})
export class AppModule {}
