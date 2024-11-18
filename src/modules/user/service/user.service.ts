import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, User as UserEntity } from 'src/db';
import { FindOptionsSelect, Raw, Repository } from 'typeorm';
import { QueuesService } from '../../queues';
import { LoggerService } from 'src/modules/logger';
import { MicroService } from 'src/modules/micro-service';
import {
  catchError,
  concatMap,
  from,
  map,
  Observable,
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

  private listKeyName = '';

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly queue: QueuesService,
    readonly myLogger: LoggerService,
    private microService: MicroService,
  ) {
    this.logger = myLogger;
  }

  getAll(start: number = 0, end: number = -1) {
    const key = `user:page:start:${start}:end:${end}`;
    return this.microService.getKeyValue<string>(key).pipe(
      concatMap((users) => {
        users = JSON.parse(users);
        if (users?.length) {
          return of(users);
        } else {
          return from(
            this.userRepo.find({
              select: this.specificFileds as FindOptionsSelect<User>,
              order: { createdAt: 'ASC' },
              skip: start,
              take: end - start + 1,
            }),
          ).pipe(
            switchMap((users) => {
              return this.microService
                .batchCommandsExc([
                  {
                    command: 'del',
                    key,
                  },
                  {
                    command: 'set',
                    key,
                    value: JSON.stringify(users),
                  },
                  {
                    command: 'expire',
                    key,
                    value: '1800',
                  },
                ])
                .pipe(map(() => users));
            }),
          );
        }
      }),
      switchMap((users) =>
        this.microService.getKeyValue('user:total').pipe(
          switchMap((count) => {
            count = Number(count);
            if (count) {
              return of({ users, totalLength: count });
            } else {
              return from(this.userRepo.count()).pipe(
                switchMap((count) =>
                  this.microService
                    .setKeyValue('user:total', count.toString())
                    .pipe(
                      map(() => {
                        return { users, totalLength: count };
                      }),
                    ),
                ),
              );
            }
          }),
        ),
      ),
    );
  }

  create<T>(user: UserEntity): Observable<T> {
    return from(
      this.userRepo
        .save(user)
        .then((res) => res)
        .catch((e) => e),
    ).pipe(
      switchMap((res) =>
        this.resetPagenation().pipe(
          map(() => {
            return res;
          }),
        ),
      ),
      catchError((e) => of({ success: false, message: e })),
    );
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

  findByLike(value: string) {
    return this.userRepo.find({
      where: [
        {
          firstName: Raw((alias) => `${alias} LIKE '%${value}%'`),
        },
        {
          lastName: Raw((alias) => `${alias} LIKE '%${value}%'`),
        },
        {
          email: Raw((alias) => `${alias} LIKE '%${value}%'`),
        },
      ],
    });
  }

  deleteOne<T>(id: string): Observable<T> {
    return from(
      this.userRepo
        .findOne({ where: { id } })
        .then(async (user) => {
          if (user) {
            await this.userRepo.remove(user);
            return true;
          } else {
            return false;
          }
        })
        .catch((e) => e),
    ).pipe(
      switchMap((res) =>
        this.resetPagenation().pipe(
          map(() => {
            return res;
          }),
        ),
      ),
      catchError((e) => of({ success: false, message: e })),
    );
  }

  resetPagenation() {
    return this.microService
      .scan<[record: number, string[]]>(`user:page:start*:end:*`)
      .pipe(
        switchMap(([, keys]) => {
          if (keys.length) {
            return this.microService
              .removeKey(keys)
              .pipe(switchMap(() => this.microService.removeKey('user:total')));
          }
        }),
      );
  }

  update(id: string, user: User) {
    return from(
      this.userRepo
        .update(id, { ...user })
        .then((res) => res)
        .catch((e) => e),
    ).pipe(
      switchMap((res) => this.resetPagenation().pipe(map(() => res))),
      catchError((e) => of({ success: false, message: e })),
    );
  }

  queueHandler(name: string, data) {
    this.queue.add(name, data);
  }
}
