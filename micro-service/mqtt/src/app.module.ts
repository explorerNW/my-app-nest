
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AedesProvider } from './aedes.provider';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, AedesProvider],
})
export class AppModule {}
