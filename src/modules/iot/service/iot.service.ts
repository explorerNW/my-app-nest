import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import environment from '../../../environments/local.env';
import { map, Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
export interface IChipInfo {
  chipId: string;
  cores: string;
  model: string;
}

@Injectable()
export class IotService {
  constructor(private httpService: HttpService) {}

  getChipInfo(): Observable<AxiosResponse<{ data: IChipInfo }>> {
    return this.httpService
      .get(`http://${environment.chipHost}/chip-info`)
      .pipe(
        map((res) => {
          return res.data;
        }),
      );
  }

  lightsUp() {
    return this.httpService
      .post(`http://${environment.chipHost}/light_up`)
      .pipe(
        map((res) => {
          return res.data;
        }),
      );
  }

  lightsDown() {
    return this.httpService
      .post(`http://${environment.chipHost}/light_down`)
      .pipe(
        map((res) => {
          return res.data;
        }),
      );
  }
}
