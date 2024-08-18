import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cat } from '../../../db';

@Injectable()
export class CatService {
    constructor(@InjectModel(Cat.name) private catModel: Model<Cat>) {}

    create(cat: Cat) {
        const createdCat = new this.catModel(cat);
        return createdCat.save().then(res => res).catch(e => e);
    }

    findById(id: string) {
        return this.catModel.findById(id);
    }

    findByName(name: string) {
        return this.catModel.findOne({ name });
    }

    getAll() {
        return this.catModel.find();
    }

    delete(name: string){
        return this.catModel.deleteOne({ name });
    }
}
