import { Controller, Get, Post } from '@nestjs/common';
import { IotService } from '../service';

@Controller('iot')
export class IotController {
  constructor(private iotService: IotService) {}
  @Get('chip-info')
  getChipInfo() {
    return this.iotService.getChipInfo();
  }

  @Post('lights-up')
  lightsUp() {
    return this.iotService.lightsUp();
  }

  @Post('lights-down')
  lightsDown() {
    return this.iotService.lightsDown();
  }

  @Post('light-status')
  lightsStatus() {
    return this.iotService.lightsStatus();
  }
}
