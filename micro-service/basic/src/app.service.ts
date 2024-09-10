import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  accumuate(data: number[] = []): number {
    return data.reduce((a, b) => a+b, 0);
  }
}
