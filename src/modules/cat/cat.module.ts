import { Module } from '@nestjs/common';
import { CatService } from './service';
import { CatController } from './controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cat, CatSchema } from '../../db';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }])
  ],
  providers: [CatService],
  controllers: [CatController]
})
export class CatModule {}
