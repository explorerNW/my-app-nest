import { Module } from '@nestjs/common';
import { CatService } from './service';
import { CatController } from './controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Cat, CatSchema } from '../../db';
import { AuthModule } from '../../auth';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cat.name, schema: CatSchema }]),
    AuthModule,
  ],
  providers: [CatService],
  controllers: [CatController],
})
export class CatModule {}
