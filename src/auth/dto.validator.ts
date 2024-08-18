import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class UserLoginDTO {
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Length(8, 20)
    password: string;
}