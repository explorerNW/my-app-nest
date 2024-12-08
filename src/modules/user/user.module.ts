import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User as UserEntity, UserSchema } from 'src/db';
import { UserService } from './service';
import { UserController } from './controller';
import { AuthModule } from '../../auth';
import { MongooseModule } from '@nestjs/mongoose';
import { Cat, CatSchema } from '../../db';
import { QueuesModule } from '../queues';
import { LoggerModule } from '../logger';
import { MicroServiceModule } from '../micro-service';
import { CacheModule } from '../../cache.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, UserSchema]),
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }]),
    QueuesModule,
    LoggerModule,
    MicroServiceModule,
    CacheModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
