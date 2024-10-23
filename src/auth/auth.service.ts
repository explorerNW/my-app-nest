import { Injectable } from '@nestjs/common';
import { cloneDeep } from 'lodash';
import { MicroService } from '../modules/micro-service';
import { forkJoin, map, of, switchMap } from 'rxjs';

@Injectable()
export class AuthService {
  private $tokenList = [];
  private readonly key = 'token';
  constructor(private microService: MicroService) {}

  set tokenList(list: string[]) {
    this.$tokenList = cloneDeep(list);
  }

  get tokenList() {
    return this.$tokenList;
  }

  getTokenByEmail(email: string) {
    return this.microService.getKeyValue(`${this.key}:${email}`);
  }

  getAllStoredToken() {
    return this.microService.getKeys(`${this.key}:*`).pipe(
      map((keys: string[]) => {
        return keys.map((key) => {
          return this.microService.getKeyValue(key);
        });
      }),
      switchMap((list) => (list.length ? forkJoin(list) : of([]))),
      map((list) => {
        // store all token to a list
        this.tokenList = list;
        return list;
      }),
    );
  }

  logout(email: string) {
    return this.microService.removeKey(`${this.key}:${email}`);
  }
}
