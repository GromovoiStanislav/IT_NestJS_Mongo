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
import { CreateUserCommand, DeleteUserCommand, FindAllUsersCommand } from "./users.service";
import { BaseAuthGuard } from "../../guards/base.auth.guard";
import { Pagination } from "../../decorators/paginationDecorator";
import { PaginationParams } from "../../commonDto/paginationParams.dto";

@UseGuards(BaseAuthGuard)
@Controller("users")
export class UsersController {

  constructor(
    private commandBus: CommandBus
  ) {
  }


  @Get()
  getUsers(@Query() query, @Pagination() paginationParams: PaginationParams) {
    const searchLogin = query.searchLoginTerm as string || "";
    const searchEmail = query.searchEmailTerm as string || "";
    return this.commandBus.execute(new FindAllUsersCommand(searchLogin.trim(), searchEmail.trim(), paginationParams));
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)//204
  async deleteUser(@Param("id") userId: string) {
    const result = await this.commandBus.execute(new DeleteUserCommand(userId));
    if (!result) {
      throw new HttpException("Specified user is not exists", HttpStatus.NOT_FOUND);
    }
    return;
  }

  @UsePipes(new ValidationPipe())
  @Post()
  @HttpCode(HttpStatus.CREATED)//201
  async createUser(@Body() inputUser: InputUserDto) {
    return this.commandBus.execute(new CreateUserCommand(inputUser,''));
  }

}

