import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserService } from '../../modules/user';
import { UserDTO } from '../../modules/user';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async login(@Body('email') email: string, @Body('user') user: UserDTO) {
        const exist = await this.userService.findByEmail(email);
        if(exist) {
            const match = await bcrypt.compare(user.password, exist.password);
            if (match) {
                return { success: true, login_success: true, access_token: await this.jwtService.signAsync({ id: exist.id, email: exist.email }) };
            } else {
                return { success: false, login_success: false };
            }
        } else {
            return { success: false, user_exist: false };
        }
    }
}
