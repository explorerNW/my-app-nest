import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { init as postgresDBInit, mongo, User as UserEntity } from './db';
import { ConfigModule, UserModule, CatModule, FileUploadModule } from './modules';
import { AuthModule } from './auth';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventsGateway } from './gateway/events/events.gateway';
import { GatewayModule } from './gateway';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import type { RedisOptions } from 'ioredis';
import * as redisStore  from 'cache-manager-redis-store';
import { TaskService } from './task.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ClientsModule, Transport } from '@nestjs/microservices';

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
    FileUploadModule,
    ClientsModule.register([
      {
        name: 'MATCH_SERVICE',
        transport: Transport.TCP
      },
      {
        name: 'REDIS',
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: Number(process.env.SERVER_PORT)
        }
      }
    ]),
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
