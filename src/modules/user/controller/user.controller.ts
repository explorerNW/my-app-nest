import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { UserService } from '../service';
import { UserDTO, UserUpdateDTO } from '../dto';
import { v4 as uuidv4 } from 'uuid';
import { User as UserEntity } from 'src/db';
import * as bcrypt from 'bcrypt';

type UpdateResult = {
    generatedMaps: [];
    raw: [];
    affected: number;
}

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get('all')
    getAll() {
        return this.userService.getAll();
    }

    @Post('create')
    async create(@Body() user: UserDTO) {
        const exist = await this.userService.findByEmail(user.email);
        if (exist) {
            return { success: false, message: { user_exist: true, user_id: exist.id } };
        }
        const saltRounds = 10;
        await bcrypt.genSalt(saltRounds);
        const password = await bcrypt.hash(user.password, saltRounds);
        const user_entity: UserEntity = {
            id: uuidv4(),
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            password,
            confirmed: false,
            forgotPasswordLocked: false,
            createdAt: new Date().toUTCString(),
            updatedAt: null,
            isActive: true,
        };
        return this.userService.create(user_entity).then((res:UserEntity) => {
            if(res.id === user_entity.id) {
                return { success: true, user_id: res.id };
            }
        }).catch( e => {
            return { success: false, message: e };
        });
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.userService.findOne(id).then(user => {
            if(!user) {
                return { success: false, user_exist: false };
            }
            return user;
        });
    }

    @Post('update/:id')
    async update(@Param('id') id: string, @Body('user') user: UserUpdateDTO) {
        const exist = await this.userService.findOne(id);
        if (!exist) {
            return { success: false, message: { user_exist: false } };
        }
        user.updatedAt = new Date().toUTCString();
        return this.userService.update(id, user).then((res: UpdateResult) => {
            if (res.affected === 1) {
                return { success: true };
            }
            return { success: false };
        }).catch( e => ({ success: false,message: e }));
    }

    @Delete(':id')
    deleteOne(@Param('id') id: string){
        return this.userService.deleteOne(id).then(res => {
            if (res) {
                return { success: true };
            } else {
                return { success: false, user_exist: false };
            }
        }).catch((e)=>{
            return { success: false, message: e };
        });
    }
}
