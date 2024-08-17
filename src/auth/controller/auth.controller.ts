import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../../modules/user';
import { UserDTO } from '../../modules/user';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
    constructor(private readonly userService: UserService) {}

    @Post('login')
    async login(@Body('email') email: string, @Body('user') user: UserDTO) {
        const exist = await this.userService.findByEmail(email);
        if(exist) {
            const match = await bcrypt.compare(user.password, exist.password);
            if (match) {
                return { success: true, login_success: true };
            } else {
                return { success: false, login_success: false };
            }
        } else {
            return { success: false, user_exist: false };
        }
    }
}
