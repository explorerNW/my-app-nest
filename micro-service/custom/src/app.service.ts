import { Injectable } from '@nestjs/common';
import { CustomTransportStrategy, Server, Transport } from '@nestjs/microservices';

@Injectable()
export class AppService extends Server implements CustomTransportStrategy {

  transportId?: symbol | Transport;

  listen(callback: (...optionalParams: unknown[]) => void) {
    callback();
  }

  close() {

  }

}
