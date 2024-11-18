import { MigrationInterface, QueryRunner } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { User as UserEntity } from '../entities';

export class Create10000Users1731859624762 implements MigrationInterface {
  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.startTransaction();
    for (let i = 0; i < 50000; i++) {
      const saltRounds = 10;
      await bcrypt.genSalt(saltRounds);
      const password = await bcrypt.hash('admin@me', saltRounds);
      const user: UserEntity = new UserEntity();
      user.id = uuidv4();
      user.email = `${i}@163.com`;
      user.firstName = 'Wang' + i;
      user.lastName = 'Nie' + i;
      user.password = password;
      user.happinessScore = 100;
      user.sex = 'male';
      user.age = 20;
      user.salary = '¥1000000';
      user.confirmed = false;
      user.forgotPasswordLocked = false;
      user.createdAt = new Date().toUTCString();
      user.updatedAt = null;
      user.isActive = true;
      await queryRunner.query(
        `INSERT INTO "user"("id", "firstName", "lastName", "email", "age", "password", "confirmed", "forgotPasswordLocked", "createdAt", "happinessScore", "salary", "updatedAt", "isActive") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          user.id,
          user.firstName,
          user.lastName,
          user.email,
          user.age,
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
    await queryRunner.commitTransaction().catch(async () => {
      await queryRunner.rollbackTransaction();
    });
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.startTransaction();

    for (let i = 0; i < 10000; i++) {
      const email = `${i}@163.com`;
      await queryRunner.query(
        `
            DELETE FROM "user" WHERE "email" = $1
        `,
        [email],
      );
    }
    await queryRunner.commitTransaction().catch(async () => {
      await queryRunner.rollbackTransaction();
    });
  }
}
