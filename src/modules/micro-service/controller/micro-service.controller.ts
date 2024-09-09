import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy, ClientRedis } from '@nestjs/microservices';

@Controller('micro-service')
export class MicroServiceController {
    constructor(
        @Inject('MICRO_SERVICE') private client: ClientProxy,
        @Inject('MATH_SERVICE') private redis: ClientRedis
    ) {}

    @Post('accumulator')
    accumulator(@Body('data') data: number[]){
        return this.client.send<number[]>({ cmd: 'accumulate' }, data);
    }

    @Post('notification')
    notification(@Body('data') data: number[]) {
        return this.redis.send('notifications', data) ;
    }
}
