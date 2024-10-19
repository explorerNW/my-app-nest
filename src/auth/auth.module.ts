import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { UserModule } from '../modules/user';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constant';
import { MicroServiceModule } from 'src/modules';
import { AuthService } from './auth.service';
import { AuthGuard } from './guard';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => MicroServiceModule),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthGuard, AuthService],
})
export class AuthModule {}
