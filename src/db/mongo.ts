
import { MongooseModule } from '@nestjs/mongoose';

export const init = () => MongooseModule.forRoot('mongodb://localhost:27017/nest');