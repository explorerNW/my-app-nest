import { Module } from '@nestjs/common';
import { MicroServiceController } from './controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
console.log(`path: ${join(__dirname)}`);

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
          url: 'mqtt://localhost:1884',
        }
      },
      {
        name: "NATS_SERVICE",
        transport: Transport.NATS,
        options: {
          servers: ['nats://localhost:4222'],
        }
      },
      {
        name: 'RMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'cats_queue',
          queueOptions: {
            durable: false
          },
        },
      },
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'hero',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'hero-consumer'
          }
        },
      },
      {
        name: 'GRPC_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'hero',
          protoPath: join(__dirname, 'hero/hero.proto'),
        }
      }
    ])
  ],
  controllers: [MicroServiceController],
  providers: []
})
export class MicroServiceModule { }
