import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { TransformInterceptor } from './interceptors/transform';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
