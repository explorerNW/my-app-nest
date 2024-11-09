import { Module } from '@nestjs/common';
import { IotController } from './controller';
import { IotService } from './service';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from '../../auth';

@Module({
  imports: [HttpModule, AuthModule],
  controllers: [IotController],
  providers: [IotService],
})
export class IotModule {}
