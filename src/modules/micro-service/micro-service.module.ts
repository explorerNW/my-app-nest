import { Module } from '@nestjs/common';
import { MicroServiceController } from './controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "MICRO_BASIC_SERVICE",
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 9001,
        }
      },
      {
        name: "REDIS_SERVICE",
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
        }
      },
      {
        name: "MQTT_SERVICE",
        transport: Transport.MQTT,
        options: {
          url: 'mqtt://localhost:1883',
        }
      },
      {
        name: "NATS_SERVICE",
        transport: Transport.NATS,
        options: {
          servers: ['nats://localhost:4222'],
        }
      }
    ])
  ],
  controllers: [MicroServiceController],
  providers: []
})
export class MicroServiceModule {}
