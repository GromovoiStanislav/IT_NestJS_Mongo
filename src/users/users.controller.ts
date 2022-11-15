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


import { InputUserDto } from "./dto/input-user.dto";
import { UsersService } from "./users.service";
import { PaginationParams } from "./dto/paginationParams.dto";


@Controller("users")
export class UsersController {

  constructor(protected usersService: UsersService) {
  }

  // @Get()
  // getUsers(@Query("name") name: string) {
  //   return this.usersService.findUsers(name);
  // }


  @Get()
  getUsers(@Query() query) {

    const searchLogin = query.searchLoginTerm as string || "";
    const searchEmail = query.searchEmailTerm as string || "";

    const paginationParams: PaginationParams = {
      pageNumber: Number(query.pageNumber) || 1,
      pageSize: Number(query.pageSize) || 10,
      sortBy: query.sortBy as string || "createdAt",
      sortDirection: query.sortDirection as string || "desc"
    };

    return this.usersService.findAll(searchLogin, searchEmail, paginationParams);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)//204
  async deleteUser(@Param("id") userId: string) {
    const result = await this.usersService.deleteUser(userId);
    if (!result) {
      throw new HttpException("Specified user is not exists", HttpStatus.NOT_FOUND);
    }
    return;
  }


  @Post()
  @HttpCode(HttpStatus.CREATED)//201
  async createUser(@Body() inputUser: InputUserDto) {
    return await this.usersService.createUser(inputUser);
  }

}

