import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { TransformInterceptor } from './interceptors/transform';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/date')
  @UseInterceptors(TransformInterceptor<string>)
  getDate(): string {
    return this.appService.getDate();
  }
}
