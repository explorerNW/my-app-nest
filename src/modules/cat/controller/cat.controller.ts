import { Role, Roles } from './../../../auth/guard/roles.decorator';
import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { CatService } from '../service';
import { Cat } from '../../../db';
import { AuthGuard } from '../../../auth';

@Controller('cat')
export class CatController {

    constructor(private readonly catService: CatService ){}

    @Get('all')
    getAll() {
        return this.catService.getAll().then(res => res).catch(e => ({ success: false, message: e }))
    }
    
    @Post('create')
    @UseGuards(AuthGuard)
    async create(@Body('cat') cat: Cat){
        const exist = await this.catService.findByName(cat.name as string);
        if (exist?.name === cat.name) {
            return { success: false, message: { exist: true } };
        }
        return this.catService.create(cat).then(res => {
            return { success: true, message: res };
        }).catch(e => ({ success: false, message: e }));
    }

    @Post('delete')
    @UseGuards(AuthGuard)
    async delete(@Body('cat') cat: Cat){
        const exist = await this.catService.findByName(cat.name as string);
        if (!exist) {
            return { success: false, message: { exist: false } };
        } else {
            return this.catService.delete(cat.name as string).then(res => {
                return { success: true, message: res };
            }).catch(e => ({ success: false, message: e }));
        }
    }

    @Post(':id')
    findById(@Param('id') id: string) {
        return this.catService.findById(id).then(res => res).catch(e => ({ success: false, message: e }))
    }

    @Get('/search')
    findByName(@Query('name') name: string) {
        return this.catService.findByName(name).then(res => {
            return { success: true, message: res };
        }).catch(e => ({ success: false, message: e }));
    }
}
