import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserService } from '../../modules/user';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDTO } from '../dto.validator';
import { MicroService } from '../../modules/micro-service';
import { map, switchMap } from 'rxjs';
import { AuthService } from '../auth.service';
import { filter } from 'rxjs/operators';

@Controller('auth')
export class AuthController {
  private key = 'token';
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private microService: MicroService,
    private authService: AuthService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body('user') user: UserLoginDTO) {
    const existUser = await this.userService.findByEmail(user.email);
    if (existUser) {
      const match = await bcrypt.compare(user.password, existUser.password);
      if (match) {
        const access_token = await this.jwtService.signAsync({
          id: existUser.id,
          email: existUser.email,
        });
        // store token to redis
        return this.microService.removeKey(`${this.key}:${user.email}`).pipe(
          switchMap(() =>
            this.microService
              .setKeyValue(`${this.key}:${user.email}`, access_token)
              .pipe(
                filter((res) => res === 'OK'),
                map(() => {
                  return {
                    success: true,
                    login_success: true,
                    user_id: existUser.id,
                    access_token,
                  };
                }),
              ),
          ),
        );
      } else {
        return { success: false, login_success: false };
      }
    } else {
      return { success: false, user_exist: false };
    }
  }

  @Post('logout')
  async logout(@Body('email') email: string) {
    return this.microService.removeKey(`${this.key}:${email}`).pipe(
      map(() => {
        return { success: true, logout: true };
      }),
    );
  }
}
