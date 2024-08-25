import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User as UserEntity } from 'src/db';
import { Repository } from 'typeorm';
import { QueuesService } from '../../queues';
import { LoggerService } from 'src/modules/logger';

@Injectable()
export class UserService {

    logger: LoggerService;

    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
        private readonly queue: QueuesService,
        readonly myLogger: LoggerService,
    ) {
        this.logger = myLogger;
    }

    getAll() {
        return this.userRepo.find({
            select: ['id','firstName', 'lastName', 'email', 'createdAt', 'updatedAt', 'isActive']
        });
    }

    create(user: UserEntity) {
        return this.userRepo.save(user).then(res => res).catch( e => e);
    }

    findOne(id: string) {
        return this.userRepo.findOne({ where: { id } });
    }

    findByEmail(email: string) {
        return this.userRepo.findOne({ where: { email } });
    }

    deleteOne(id: string) {
        return this.userRepo.findOne({ where: { id } }).then(async (user)=>{
            if (user) {
                await this.userRepo.remove(user);
                return true;
            } else {
                return false;
            }
        }).catch( e => e);
    }

    update(id: string, user: Omit<UserEntity, 'id' | 'createdAt'> ) {
        return this.userRepo.update(id, { ...user }).then(res => res).catch(e => e);
    }

    queueHandler(name: string, data: Object) {
        this.queue.add(name, data);
    }
}
