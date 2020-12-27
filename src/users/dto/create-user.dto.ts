import {
  IsAlphanumeric,
  IsBase64,
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
export class CreateUserDto {
  @MinLength(3)
  @MaxLength(15)
  @IsString()
  firstName: string;

  @MinLength(3)
  @MaxLength(15)
  lastName: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  @IsAlphanumeric()
  password: string;

  @IsString()
  country: string;

  @IsString()
  state: string;

  @IsBase64()
  imageUrl: string;
}
