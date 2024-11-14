import { MigrationInterface, QueryRunner } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { User as UserEntity } from '../entities';

export class InitUser1724331525567 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const saltRounds = 10;
    await bcrypt.genSalt(saltRounds);
    const password = await bcrypt.hash('admin@me', saltRounds);
    const user: UserEntity = new UserEntity();
    user.id = uuidv4();
    user.email = 'superexplorernw@163.com';
    user.firstName = 'Wang';
    user.lastName = 'Nie';
    user.password = password;
    user.happinessScore = 100;
    user.sex = 'male';
    user.salary = '¥1000000';
    user.confirmed = false;
    user.forgotPasswordLocked = false;
    user.createdAt = new Date().toUTCString();
    user.updatedAt = null;
    user.isActive = true;
    await queryRunner.query(
      `INSERT INTO "user"("id", "firstName", "lastName", "email", "password", "confirmed", "forgotPasswordLocked", "createdAt", "happinessScore", "salary", "updatedAt", "isActive") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        user.id,
        user.firstName,
        user.lastName,
        user.email,
        user.password,
        user.confirmed,
        user.forgotPasswordLocked,
        user.createdAt,
        user.happinessScore,
        user.salary,
        user.updatedAt,
        user.isActive,
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner;
  }
}
