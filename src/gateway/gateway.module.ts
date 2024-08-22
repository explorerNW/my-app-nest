import { Module } from '@nestjs/common';
import { EventsGateway } from './events';
import { WebSocketGateway } from '@nestjs/websockets';


@WebSocketGateway(81, { transports: ['websocket'] })
@Module({
    providers: [EventsGateway]
})
export class GatewayModule {}
