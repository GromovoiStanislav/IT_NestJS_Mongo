import {
  Body,
  Controller,
  Delete, Get,
  HttpCode,
  HttpStatus, NotFoundException,
  Param, Post, Put,
} from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import {
  CreatePostCommand,
  DeletePostCommand,
  GetAllPostsCommand,
  GetOnePostCommand,
  UpdatePostCommand
} from "./posts.service";
import { InputPostDto } from "./dto/input-post.dto";
import { ViewPostDto } from "./dto/view-post.dto";
import { PaginatorDto } from "../../commonDto/paginator.dto";
import { PaginationParams } from "../../commonDto/paginationParams.dto";
import { Pagination } from "../../decorators/paginationDecorator";

@Controller("posts")
export class PostsController {
  constructor(
    private commandBus: CommandBus) {
  }


  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param("id") postId: string): Promise<void> {
    const result = this.commandBus.execute(new DeletePostCommand(postId));
    if (!result) {
      throw new NotFoundException();
    }
  }


  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPost(@Body() inputPost: InputPostDto): Promise<ViewPostDto> {
    return this.commandBus.execute(new CreatePostCommand(inputPost));
  }


  @Put(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(@Param("id") postId: string, @Body() inputPost: InputPostDto): Promise<void> {
    const result = await this.commandBus.execute(new UpdatePostCommand(postId, inputPost));
    if (!result) {
      throw new NotFoundException();
    }
  }


  @Get(":id")
  async getOnePost(@Param("id") postId: string): Promise<ViewPostDto> {
    const result = await this.commandBus.execute(new GetOnePostCommand(postId));
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }


  @Get()
  getAllPosts(@Pagination() paginationParams: PaginationParams): Promise<PaginatorDto<ViewPostDto[]>> {
    return this.commandBus.execute(new GetAllPostsCommand(paginationParams));
  }


}
