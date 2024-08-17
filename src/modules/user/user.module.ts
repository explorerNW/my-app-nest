import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User as UserEntity } from 'src/db';
import { UserService } from './service';
import { UserController } from './controller';
import { AuthModule } from '../../auth';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity]),
        forwardRef(() => AuthModule)
    ],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService]
})
export class UserModule {}
