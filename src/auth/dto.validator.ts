import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class UserLoginDTO {
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}