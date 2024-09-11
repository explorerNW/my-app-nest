import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Ctx, MessagePattern, MqttContext, Payload } from '@nestjs/microservices';
import * as MQTT from "mqtt";

@Controller()
export class AppController {
  private readonly mqtt = MQTT;
  constructor(
    private readonly appService: AppService,
  ) { }

  @MessagePattern('mqtt-message')
  getMessage(@Payload() message: string, @Ctx() context: MqttContext) {

    return new Promise((resolve, reject) => {
      try {
        const topic = `${context.getTopic()}:test`;
        const client = this.mqtt.connect('mqtt://localhost:1884');
        client.on('connect', () => {
          client.publish(topic, message);
          client.end();
          resolve({ sucess: true, message: context.getTopic() });
        });
        client.subscribe(topic);
        client.on('message', (topic, message)=>{
          console.log(`topic: ${topic}, message: ${message}`);
        });
      } catch (err) {
        reject({ success: false, message: err });
      }
    });
  }
}
