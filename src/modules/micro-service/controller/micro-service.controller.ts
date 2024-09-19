import { Body, Controller, Get, Inject, OnModuleInit, Post, Query, UseFilters, UseInterceptors } from '@nestjs/common';
import { ClientKafka, ClientMqtt, ClientNats, ClientProxy, ClientRedis, ClientRMQ } from '@nestjs/microservices';

import { LoggingInterceptor } from '../../../interceptors';
import { ExceptionFilter } from '../../../filters';

@Controller('micro-service')
export class MicroServiceController implements OnModuleInit {
    constructor(
        @Inject('MICRO_BASIC_SERVICE') private client: ClientProxy,
        @Inject('REDIS_SERVICE') private redis: ClientRedis,
        @Inject('MQTT_SERVICE') private mqtt: ClientMqtt,
        @Inject('NATS_SERVICE') private nats: ClientNats,
        @Inject('RMQ_SERVICE') private rmq: ClientRMQ,
        @Inject('KAFKA_SERVICE') private kafka: ClientKafka,
    ) { }

    async onModuleInit() {
        this.kafka.subscribeToResponseOf('kafka-message');
        await this.kafka.connect();
    }

    @Post('accumulator')
    @UseInterceptors(LoggingInterceptor)
    @UseFilters(new ExceptionFilter())
    accumulator(@Body('data') data: number[]) {
        return this.client.send<number[]>({ cmd: 'accumulate' }, data);
    }

    @Get('redis/notifications')
    notification(@Query('key') key: string) {
        return this.redis.send('notifications', key);
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

    @Post('message-mqtt')
    sendMessage(@Body('message') message: string) {
        return this.mqtt.send('mqtt-message', message);
    }

    @Post('message-nats')
    sendMessageToNAST(@Body('message') message: string) {
        return this.nats.send('nast-message', message);
    }

    @Post('message-rmq')
    sendMessageRMQ(@Body('message') message: string) {
        return this.rmq.send('rmq-message', message);
    }

    @Post('message-kafka')
    sendMessageKAFKA(@Body('message') message: string) {
        return this.kafka.send('kafka-message', message);
    }

}
