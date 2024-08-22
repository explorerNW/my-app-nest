import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User as UserEntity, UserSchema } from 'src/db';
import { UserService } from './service';
import { UserController } from './controller';
import { AuthModule } from '../../auth';
import { MongooseModule } from '@nestjs/mongoose';
import { Cat, CatSchema } from '../../db';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, UserSchema]),
        forwardRef(() => AuthModule),
        MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }])
    ],
    providers: [
        UserService,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        }
          
    ],
    controllers: [UserController],
    exports: [UserService]
})
export class UserModule {}
