export class UserDTO {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export class UserUpdateDTO extends UserDTO {
    confirmed: boolean;
    forgotPasswordLocked: boolean;
    updatedAt: string;
    isActive: boolean;
}