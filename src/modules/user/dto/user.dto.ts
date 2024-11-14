import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class UserDTO {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  sex: 'male' | 'female';

  @IsNumber()
  age: number;

  @IsNotEmpty()
  password: string;
}

export class UserUpdateDTO {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsNumber()
  age?: number;

  @IsString()
  salary?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsBoolean()
  confirmed?: boolean;

  @IsOptional()
  @IsBoolean()
  forgotPasswordLocked?: boolean;

  updatedAt?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
