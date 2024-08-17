import { TypeOrmModule } from "@nestjs/typeorm";
import * as dotenv from 'dotenv';

dotenv.config();

export const init = (entities = []) => TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: Number(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: entities,
    synchronize: true,
});