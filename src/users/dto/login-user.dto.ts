import { IsAlphanumeric, IsEmail } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsAlphanumeric()
  password: string;
}
