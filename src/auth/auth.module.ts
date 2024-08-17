import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { UserModule } from '../modules/user';

@Module({
  imports: [
    forwardRef(() => UserModule)
  ],
  controllers: [AuthController],
})
export class AuthModule {}
