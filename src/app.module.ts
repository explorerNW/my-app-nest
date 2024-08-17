import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { init as dbInit, User as UserEntity } from './db';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './auth';

@Module({
  imports: [
    dbInit([UserEntity]),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
