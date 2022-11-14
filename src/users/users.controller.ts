import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode, HttpException, HttpStatus,
  Param,
  Post,
  Put,
  Query, UseGuards
} from "@nestjs/common";
import { CreateUserInputModelType, UsersService } from "./users.service";


@Controller("users")
export class UsersController {

  constructor(protected usersService: UsersService) {
  }

  @Get()
  getUsers(@Query("name") name: string) {
    return this.usersService.findUsers(name);
  }


  @Delete(":id")
  @HttpCode(204)
  async deleteUser(@Param("id") userId: string) {
    const result = await this.usersService.deleteUser(userId)
    if (!result){
      throw new HttpException('Specified user is not exists', HttpStatus.NOT_FOUND)
    }
    return;
  }


  @Post()
  async createUser(@Body() inputModel: CreateUserInputModelType) {
    // if (11 > 10) {
    //   throw new BadRequestException([{ field: "bloggerId", message: "Bad bloggerId" }]);
    // }
    //inputModel.email=''
    await this.usersService.createUser(inputModel);
    return inputModel;
  }

}

