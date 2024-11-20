import { UseFilters } from '@nestjs/common';
import {
  BaseWsExceptionFilter,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MicroService } from '../../modules';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  interval = null;

  constructor(private microService: MicroService) {}

  @SubscribeMessage('events')
  @UseFilters(new BaseWsExceptionFilter())
  message(@MessageBody() data: any): { data: string } {
    data;
    if (this.interval === null) {
      this.interval = setInterval(() => {
        this.server.emit('to-client', { data: 'hello' });
      }, 1000);
    }
    return { data: 'hello world!' };
  }

  @SubscribeMessage('stop-interval')
  stopInterval() {
    clearInterval(this.interval);
    this.interval = null;
    return { data: 'ok' };
  }

  @SubscribeMessage('channel-message')
  channelMeaage(@MessageBody() payload: { channel: string; message: string }) {
    this.server.emit(payload.channel, { data: payload.message });
  }
}
