import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, User as UserEntity } from 'src/db';
import { FindOptionsSelect, Repository } from 'typeorm';
import { QueuesService } from '../../queues';
import { LoggerService } from 'src/modules/logger';
import { MicroService } from 'src/modules/micro-service';
import {
  catchError,
  concatMap,
  from,
  map,
  mergeMap,
  of,
  switchMap,
} from 'rxjs';

@Injectable()
export class UserService {
  logger: LoggerService;

  private readonly specificFileds = [
    'id',
    'firstName',
    'lastName',
    'email',
    'age',
    'sex',
    'createdAt',
    'updatedAt',
    'isActive',
    'salary',
  ];

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly queue: QueuesService,
    readonly myLogger: LoggerService,
    private microService: MicroService,
  ) {
    this.logger = myLogger;
  }

  getAll() {
    return this.microService.lRange('user:ids', 0, -1).pipe(
      mergeMap((ids) => {
        if (ids.length) {
          const excs = ids.map((id) => {
            return {
              command: 'hgetall',
              key: `user:${id}`,
            };
          });
          return this.microService.batchCommandsExc<User[]>(excs).pipe(
            map((res) => {
              return res.filter((res) => res);
            }),
          );
        } else {
          return of([]);
        }
      }),
      concatMap((res: User[]) => {
        if (res && res.length) {
          return of(res);
        } else {
          return from(
            this.userRepo.find({
              select: this.specificFileds as FindOptionsSelect<User>,
            }),
          ).pipe(
            concatMap((users) => {
              const ids = users.map((user) => user.id);
              return this.microService.removeKey('user:ids').pipe(
                concatMap(() => {
                  return this.microService.batchRpush('user:ids', ids).pipe(
                    switchMap(() => {
                      const excs = users.map((user) => {
                        return {
                          command: 'hset',
                          key: `user:${user.id}`,
                          value: user,
                        };
                      });
                      return this.microService.batchCommandsExc<User>(excs);
                    }),
                    map(() => {
                      return users;
                    }),
                  );
                }),
              );
            }),
          );
        }
      }),
    );
  }

  create(user: UserEntity) {
    return this.userRepo
      .save(user)
      .then((res) => res)
      .catch((e) => e);
  }

  findOne(id: string) {
    this.microService.hGetAll(`user:${id}`).pipe(
      map((res) => {
        console.log(res);
      }),
    );
    return this.userRepo.findOne({
      where: { id },
      select: this.specificFileds as FindOptionsSelect<User>,
    });
  }

  findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }

  deleteOne(id: string) {
    return this.userRepo
      .findOne({ where: { id } })
      .then(async (user) => {
        if (user) {
          await this.userRepo.remove(user);
          return true;
        } else {
          return false;
        }
      })
      .catch((e) => e);
  }

  update(id: string, user: Omit<UserEntity, 'id' | 'createdAt'>) {
    return this.microService.removeKey(`user:${id}`).pipe(
      switchMap(() => this.microService.removeKey('user:ids')),
      switchMap(() =>
        from(
          this.userRepo
            .update(id, { ...user })
            .then((res) => res)
            .catch((e) => e),
        ),
      ),
      map((res) => {
        setTimeout(async () => {
          await from(
            this.microService
              .removeKey(`user:${id}`)
              .pipe(switchMap(() => this.microService.removeKey('user:ids'))),
          );
        }, 500);
        return res;
      }),
      catchError((e) => of({ success: false, message: e })),
    );
  }

  queueHandler(name: string, data) {
    this.queue.add(name, data);
  }
}
