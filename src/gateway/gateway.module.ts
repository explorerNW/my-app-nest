import { Module } from '@nestjs/common';
import { EventsGateway } from './events';
import { WebSocketGateway } from '@nestjs/websockets';
import { MicroServiceModule } from '../modules';

@WebSocketGateway(81, { transports: ['websocket'] })
@Module({
  imports: [MicroServiceModule],
  providers: [EventsGateway],
})
export class GatewayModule {}
