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
  Query, UseGuards, UsePipes, ValidationPipe
} from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";

import { InputUserDto } from "./dto/input-user.dto";
import { CreateUserCommand, DeleteUserCommand, FindAllUsersCommand, UsersService } from "./users.service";
import { PaginationParams } from "../../commonDto/paginationParams.dto";
import { BaseAuthGuard } from "../../guards/base.auth.guard";

@UseGuards(BaseAuthGuard)
@Controller("users")
export class UsersController {

  constructor(
    //protected usersService: UsersService,
    private commandBus: CommandBus,
    ) {
  }


  @Get()
  getUsers(@Query() query) {
    // console.log("pageNumber", query.pageNumber);
    // console.log("pageSize", query.pageSize);

    const searchLogin = query.searchLoginTerm as string || "";
    const searchEmail = query.searchEmailTerm as string || "";
    const sortBy = query.sortBy as string || "createdAt";
    const sortDirection = query.sortDirection as string || "desc";
    const pageNumber = parseInt(query.pageNumber) || 1;
    const pageSize = parseInt(query.pageSize) || 10;

    const paginationParams: PaginationParams = {
      pageNumber,
      pageSize,
      sortBy: sortBy.trim(),
      sortDirection: sortDirection.trim()
    };

    //return this.usersService.findAll(searchLogin.trim(), searchEmail.trim(), paginationParams);
    return this.commandBus.execute(new FindAllUsersCommand(searchLogin.trim(), searchEmail.trim(), paginationParams))
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)//204
  async deleteUser(@Param("id") userId: string) {
    //const result = await this.usersService.deleteUser(userId);
    const result = await this.commandBus.execute(new DeleteUserCommand(userId))
    if (!result) {
      throw new HttpException("Specified user is not exists", HttpStatus.NOT_FOUND);
    }
    return;
  }

  @UsePipes(new ValidationPipe())
  @Post()
  @HttpCode(HttpStatus.CREATED)//201
  async createUser(@Body() inputUser: InputUserDto) {
    //return await this.usersService.createUser(inputUser);
    return this.commandBus.execute(new CreateUserCommand(inputUser));
  }

}

