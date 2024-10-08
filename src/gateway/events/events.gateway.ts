import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway()
export class EventsGateway {
  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: string): string {
    return 'Hello world!';
  }
}
