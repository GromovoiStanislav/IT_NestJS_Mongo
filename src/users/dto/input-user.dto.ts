//import { IsEmail, IsInt, Length, Min } from "class-validator";

export class InputUserDto {
  login: string
  password: string
  email: string
}


// export class CreateUserInputModelType {
//   @Length(3, 10)
//   name: string;
//   @IsEmail({}, { message: "Incorrect email" })
//   email: string;
//   @IsInt()
//   @Min(0)
//   childrenCount: number;
// }