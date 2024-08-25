import { Module } from '@nestjs/common';
import { QueuesService } from './service/queues.service';
import { BullModule } from '@nestjs/bullmq';
import { join } from 'path';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    // BullModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     connection: {
    //       host: configService.get('REDIS_HOST'),
    //       port: configService.get('REDIS_PORT'),
    //     },
    //   }) as QueueOptions,
    //   inject: [ConfigService],
    // }),
    BullModule.registerQueue({
      name: 'video',
      processors: [join(__dirname, 'processor.js')]
    }),
  ],
  providers: [QueuesService],
  exports: [QueuesService]
})
export class QueuesModule {}
