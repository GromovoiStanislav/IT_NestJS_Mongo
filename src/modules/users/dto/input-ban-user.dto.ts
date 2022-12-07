import { Transform, TransformFnParams } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsString, MaxLength } from "class-validator";


export class InputBanUserDto {
  @IsNotEmpty()
  @IsBoolean()
  isBanned: boolean;

  @Transform(({value}:TransformFnParams)=>value?.trim())
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  banReason: string;
}