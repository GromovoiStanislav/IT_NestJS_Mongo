import { IsString, IsNotEmpty, MaxLength } from "class-validator";

export class InputBlogPostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  title: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  shortDescription: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  content: string

}