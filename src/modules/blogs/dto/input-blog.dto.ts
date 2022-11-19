import { IsString, IsNotEmpty, MaxLength, Matches, IsUrl } from "class-validator";

export class InputBlogDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  name: string

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string

  @IsNotEmpty()
  @MaxLength(100)
  @Matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/ as RegExp)
  @IsUrl()
  websiteUrl: string
}

