import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import {
  Ctx,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { io, Socket } from 'socket.io-client';

@Controller()
export class AppController {
  socketIO: Socket;
  channel = null;
  constructor(private readonly appService: AppService) {
    this.socketIO = io('ws://s0.v100.vip:16220');
  }

  @MessagePattern('rmq-message')
  async message(
    @Payload() payload: { channel: string; data: string },
    @Ctx() context: RmqContext,
  ) {
    this.socketIO.connect();
    this.socketIO.emit('channel-message', {
      channel: payload.channel,
      message: payload.data,
    });
    return { message_send: true };
  }
}
