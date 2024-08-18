import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { init as postgresDBInit, User as UserEntity } from './db';
import { UserModule, CatModule } from './modules';
import { AuthModule } from './auth';
import { mongo } from './db';

@Module({
  imports: [
    postgresDBInit([UserEntity]),
    mongo.init(),
    UserModule,
    AuthModule,
    CatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
