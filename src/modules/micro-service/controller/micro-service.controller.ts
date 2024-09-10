import { Body, Controller, Get, Inject, Param, Post, Query } from '@nestjs/common';
import { ClientMqtt, ClientProxy, ClientRedis } from '@nestjs/microservices';

@Controller('micro-service')
export class MicroServiceController {
    constructor(
        @Inject('MICRO_BASIC_SERVICE') private client: ClientProxy,
        @Inject('REDIS_SERVICE') private redis: ClientRedis,
        @Inject('MQTT_SERVICE') private mqtt: ClientMqtt,
    ) {}

    @Post('accumulator')
    accumulator(@Body('data') data: number[]){
        return this.client.send<number[]>({ cmd: 'accumulate' }, data);
    }

    @Get('redis')
    notification(@Param('key') key: string) {
        return this.redis.send('notifications', key) ;
    }

    @Get('redis/keys')
    getKeys() {
        return this.redis.send('keys', '');
    }

    @Get('redis/key-type')
    keyType(@Query('key') key: string) {
        return this.redis.send('redis-key-type', key);
    }

    @Get('redis/list')
    getList(@Query('key') key: string) {
        return this.redis.send('redis-key-lrange', key);
    }

    @Post('message')
    sendMessage(@Body('message') message: string) {
        return this.mqtt.send('mqtt-message', message);
    }
}
