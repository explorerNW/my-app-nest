import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { init as postgresDBInit, mongo, User as UserEntity } from './db';
import {
  ConfigModule,
  UserModule,
  CatModule,
  FileUploadModule,
  MicroServiceModule,
  AiModule,
} from './modules';
import { AuthModule } from './auth';
import { ThrottlerModule } from '@nestjs/throttler';
import { GatewayModule } from './gateway';
import { TaskService } from './task.service';
import { ScheduleModule } from '@nestjs/schedule';
import { IotModule } from './modules/iot';
import { SseModule } from './modules/sse';
import { GraphqlModule } from './modules/graphql/graphql.module';
import { CacheModule } from './cache.module';

@Module({
  imports: [
    ConfigModule.register({ folder: './config' }),
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
        limit: 20,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),
    CacheModule,
    GatewayModule,
    FileUploadModule,
    MicroServiceModule,
    IotModule,
    SseModule,
    GraphqlModule,
    AiModule,
  ],
  controllers: [AppController],
  providers: [AppService, TaskService],
})
export class AppModule {}
