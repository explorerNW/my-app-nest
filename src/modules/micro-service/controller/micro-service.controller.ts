import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('micro-service')
export class MicroServiceController {
    constructor(@Inject('MICRO_SERVICE') private client: ClientProxy) {}

    @Post('accumulator')
    accumulator(@Body('data') data: number[]){
        return this.client.send({ cmd: 'accumulate' }, data);
    }
}
