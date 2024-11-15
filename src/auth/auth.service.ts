import { Injectable } from '@nestjs/common';
import { MicroService } from '../modules/micro-service';

@Injectable()
export class AuthService {
  private readonly key = 'token';
  constructor(private microService: MicroService) {}

  getTokenByEmail(email: string) {
    return this.microService.getKeyValue(`${this.key}:${email}`);
  }

  logout(email: string) {
    return this.microService.removeKey(`${this.key}:${email}`);
  }
}
