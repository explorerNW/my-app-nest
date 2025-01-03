import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  EntitySchema,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ default: false })
  confirmed: boolean;

  @Column({ default: false })
  forgotPasswordLocked: boolean;

  @CreateDateColumn()
  createdAt: string;

  @Column({ nullable: true })
  age: number;

  @Column({ default: 0 })
  happinessScore: number;

  @Column({ default: '¥1000000' })
  salary: string;

  @Column({ default: 'male' })
  sex: 'male' | 'female';

  @UpdateDateColumn({ nullable: true })
  updatedAt: string;

  @Column({ default: true })
  isActive: boolean;
}

export const UserSchema = new EntitySchema({
  name: 'User',
  target: User,
  columns: {
    id: {
      type: String,
      primary: true,
      generated: true,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    forgotPasswordLocked: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: String,
    },
    happinessScore: {
      type: Number,
    },
    salary: {
      type: Number,
    },
    updatedAt: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  relations: {},
});
