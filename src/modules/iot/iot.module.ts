import { Module } from '@nestjs/common';
import { IotController } from './controller';
import { IotService } from './service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [IotController],
  providers: [IotService],
})
export class IotModule {}
