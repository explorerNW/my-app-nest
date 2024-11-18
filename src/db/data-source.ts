import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [], //['src/db/entities/**/*.entity.ts'],
  migrations: ['src/db/migrations/1731859624762-create-10000-users.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
});
