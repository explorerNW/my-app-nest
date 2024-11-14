import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User, User as UserEntity } from 'src/db';
import { FindOptionsSelect, Repository } from 'typeorm';
import { QueuesService } from '../../queues';
import { LoggerService } from 'src/modules/logger';
import { MicroService } from 'src/modules/micro-service';
import { concatMap, from, map, of, switchMap } from 'rxjs';

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
    const key = 'user-list';
    return this.microService.hGet(key).pipe(
      concatMap((res) => {
        if (res && res.length) {
          return of(res);
        } else {
          return from(
            this.userRepo.find({
              select: this.specificFileds as FindOptionsSelect<User>,
            }),
          ).pipe(
            concatMap((users) => {
              return this.microService.hSet(key, users).pipe(map(() => users));
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
    return this.microService.removeKey('user-list').pipe(
      switchMap(() =>
        from(
          this.userRepo
            .update(id, { ...user })
            .then((res) => res)
            .catch((e) => e),
        ),
      ),
    );
  }

  queueHandler(name: string, data) {
    this.queue.add(name, data);
  }
}
