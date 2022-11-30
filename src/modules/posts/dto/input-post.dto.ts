import {
  IsString,
  IsNotEmpty,
  MaxLength,
  Validate,
  ValidatorConstraintInterface,
  ValidatorConstraint
} from "class-validator";
import { Transform, TransformFnParams } from "class-transformer";
import { CommandBus } from "@nestjs/cqrs";
import { GetOneBlogCommand } from "../../blogs/blogs.service";
import { Injectable } from "@nestjs/common";



@ValidatorConstraint({ name: 'BlogIsExist', async: false })
@Injectable()
class BlogIsExist implements ValidatorConstraintInterface {
  constructor(private commandBus: CommandBus) {}

  async validate(blogId: string){
    if(await this.commandBus.execute(new GetOneBlogCommand(blogId)))
      return false
  }

  defaultMessage() {
    return `blog isn't exist`;
  }
}


export class InputPostDto {
  @Transform(({value}:TransformFnParams)=>value?.trim())
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  title: string

  @Transform(({value}:TransformFnParams)=>value?.trim())
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  shortDescription: string

  @Transform(({value}:TransformFnParams)=>value?.trim())
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  content: string

  @Transform(({value}:TransformFnParams)=>value?.trim())
  @IsString()
  @IsNotEmpty()
  @Validate(BlogIsExist)
  blogId: string
}

