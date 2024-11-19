import { Controller, Header, MessageEvent, Sse } from '@nestjs/common';
import { interval, map, Observable } from 'rxjs';

@Controller('sse')
export class SseController {
  @Sse('message')
  @Header('Transfer-Encoding', 'chunked')
  message(): Observable<MessageEvent> {
    return interval(1000).pipe(
      map(() => {
        return { data: 'data: hello \n\n' };
      }),
    );
  }
}
