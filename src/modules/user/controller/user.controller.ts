import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from '../service';
import { UserDTO, UserUpdateDTO } from '../dto';
import { v4 as uuidv4 } from 'uuid';
import { User as UserEntity } from 'src/db';
import * as bcrypt from 'bcrypt';
import { AuthGuard, Role, Roles, RolesGuard } from '../../../auth/guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { catchError, map, of } from 'rxjs';
import { ThrottlerGuard } from '@nestjs/throttler';

type UpdateResult = {
  generatedMaps: [];
  raw: [];
  affected: number;
};

@Controller('user')
@UseGuards(AuthGuard, ThrottlerGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('all')
  @Roles(Role.Admin)
  getAll(@Query('start') start: number, @Query('end') end: number) {
    return this.userService.getAll(start || 0, end || -1);
  }

  @Post('create')
  @ApiBearerAuth()
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  async create(@Body() user: UserDTO) {
    const exist = await this.userService.findByEmail(user.email);
    if (exist) {
      return {
        success: false,
        message: { user_exist: true, user_id: exist.id },
      };
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
      age: user.age,
      sex: user.sex,
      happinessScore: 100,
      salary: user.salary || '¥1000000',
      confirmed: false,
      forgotPasswordLocked: false,
      createdAt: new Date().toUTCString(),
      updatedAt: null,
      isActive: true,
    };
    return this.userService.create(user_entity).pipe(
      map((res: UserEntity) => {
        if (res.id === user_entity.id) {
          return { success: true, user_id: res.id };
        }
      }),
      catchError((e) => of({ success: false, message: e })),
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id).then((user) => {
      if (!user) {
        return { success: false, user_exist: false };
      }
      return user;
    });
  }

  @Get('findByLike')
  findByLike(@Query('value') value: string) {
    return this.userService.findByLike(value);
  }

  @Post('update/:id')
  async update(@Param('id') id: string, @Body('user') user: UserUpdateDTO) {
    const exist = await this.userService.findOne(id);
    if (!exist) {
      return { success: false, message: { user_exist: false } };
    }
    user.updatedAt = new Date().toUTCString();
    return this.userService.update(id, { ...exist, ...user }).pipe(
      map((res: UpdateResult) => {
        if (res.affected === 1) {
          return { success: true };
        }
        return { success: false };
      }),
      catchError((e) => {
        return of({ success: false, message: e });
      }),
    );
  }

  @Delete(':id')
  @Roles(Role.Admin)
  deleteOne(@Param('id') id: string) {
    return this.userService.deleteOne<boolean>(id).pipe(
      map((res) => {
        if (res) {
          return { success: true };
        } else {
          return { success: false, user_exist: false };
        }
      }),
    );
  }

  @Get('process')
  handler(
    @Query('name') name: string,
    @Query('data') data: Record<string, any>,
  ) {
    this.userService.logger.error(`name: ${name}, data: ${data}`);
    this.userService.queueHandler(name, data);
  }
}
