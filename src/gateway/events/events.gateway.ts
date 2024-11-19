import { UseFilters } from '@nestjs/common';
import {
  BaseWsExceptionFilter,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  interval = null;

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
}
