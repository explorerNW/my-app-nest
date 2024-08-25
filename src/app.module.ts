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

@Module({
  imports: [
    ConfigModule.register({ folder: './config' }),
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
  providers: [AppService, EventsGateway],
})
export class AppModule {}
