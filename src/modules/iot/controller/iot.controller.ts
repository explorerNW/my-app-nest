import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { IotService } from '../service';
import { AuthGuard } from '../../../auth';

@Controller('iot')
@UseGuards(AuthGuard)
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
