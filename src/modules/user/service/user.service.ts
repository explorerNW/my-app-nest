import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User as UserEntity } from 'src/db';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>
    ) {}

    getAll() {
        return this.userRepo.find();
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
}
