import { Controller, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'accumulate' })
  accumulate(@Payload() data: number[]): number {
    return this.appService.accumuate(data);
  }
}
