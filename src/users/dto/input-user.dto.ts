import { IsString, IsNotEmpty, IsEmail, Length } from "class-validator";

export class InputUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 10)
  login: string

  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  password: string

  @IsEmail()
  email: string
}

