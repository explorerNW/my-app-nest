import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserService } from '../../modules/user';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDTO } from '../dto.validator';
import { MicroService } from '../../modules/micro-service';
import { map, of, switchMap } from 'rxjs';
import { AuthService } from '../auth.service';

@Controller('auth')
export class AuthController {
    private key = 'token';
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private microService: MicroService,
        private authService: AuthService,
    ) { }

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
                // get all storeToken
                return this.microService.setKeyValue(
                    `${this.key}:${user.email}`,
                    access_token,
                ).pipe(
                    switchMap(() => this.authService.getAllStoredToken(),
                    ),
                    map(() => {
                        return {
                            success: true,
                            login_success: true,
                            user_id: existUser.id,
                            access_token,
                        };
                    }),
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
        return this.authService.getAllStoredToken().pipe(
            switchMap(() => this.microService.getKeyValue(`${this.key}:${email}`)),
            map((token) => {
                const decodeToken: { id: string; email: string } =
                    this.jwtService.decode(token);
                this.authService.tokenList = this.authService.tokenList
                    .map((tokenValue) => this.jwtService.decode(tokenValue))
                    .filter(
                        (tokenValue: { id: string; email: string }) =>
                            tokenValue.id !== tokenValue.id &&
                            tokenValue.email !== decodeToken.email,
                    );
            }),
            switchMap(() => this.microService.removeKey(`${this.key}:${email}`)),
            map(() => {
                return { success: true, logout: true };
            }),
        );
    }
}
