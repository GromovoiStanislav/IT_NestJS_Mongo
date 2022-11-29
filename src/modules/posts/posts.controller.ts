import {
  Body,
  Controller,
  Delete, Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param, Post, Put,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { PostsService } from "./posts.service";
import { InputPostDto } from "./dto/input-post.dto";
import { ViewPostDto } from "./dto/view-post.dto";
import { PaginatorDto } from "../../commonDto/paginator.dto";
import { PaginationParams } from "../../commonDto/paginationParams.dto";
import { Pagination } from "../../decorators/paginationDecorator";

@Controller("posts")
export class PostsController {
  constructor(
    private commandBus: CommandBus,
    protected postsService: PostsService) {
  }


  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param("id") postId: string): Promise<void> {
    const result = await this.postsService.deletePost(postId);
    if (!result) {
      throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
    }
    return;
  }


  @UsePipes(new ValidationPipe())
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPost(@Body() inputPost: InputPostDto): Promise<ViewPostDto> {
    return await this.postsService.createPost(inputPost);
  }


  @UsePipes(new ValidationPipe())
  @Put(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(@Param("id") postId: string, @Body() inputPost: InputPostDto): Promise<void> {
    const result = await this.postsService.updatePost(postId, inputPost);
    if (!result) {
      throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
    }
    return;
  }


  @Get(":id")
  async getOnePost(@Param("id") postId: string): Promise<ViewPostDto> {
    const result = await this.postsService.getOnePost(postId);
    if (!result) {
      throw new HttpException("Not Found Get", HttpStatus.NOT_FOUND);
    }
    return result;
  }


  @Get()
  getAllPosts(@Pagination() paginationParams: PaginationParams): Promise<PaginatorDto<ViewPostDto[]>> {
    return this.postsService.getAllPosts(paginationParams);
  }


}
