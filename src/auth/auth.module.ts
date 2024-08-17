import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { UserModule } from '../modules/user';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constant';

@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' }
    })
  ],
  controllers: [AuthController],
})
export class AuthModule {}
