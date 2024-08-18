import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserDTO {
  @IsNotEmpty()
  firstName: string;
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
}

export class UserUpdateDTO extends UserDTO {
  confirmed: boolean;
  forgotPasswordLocked: boolean;
  updatedAt: string;
  isActive: boolean;
}
