import { Controller, UseFilters } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ExceptionFilter } from './filters';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'accumulate' })
  @UseFilters(new ExceptionFilter())
  accumulate(@Payload() data: number[]): number {
    return this.appService.accumuate(data);
  }
}
