import {
  Body,
  Controller,
  Delete, Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param, Post, Put, Query,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import { PostsService } from "./posts.service";
import { InputPostDto } from "./dto/input-post.dto";
import { ViewPostDto } from "./dto/view-post.dto";
import { PaginatorDto } from "../../commonDto/paginator.dto";
import { PaginationParams } from "../../commonDto/paginationParams.dto";

@Controller('posts')
export class PostsController {

  constructor(protected postsService: PostsService) {
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
  async updatePost(@Param("id") postId: string, @Body() inputPost: InputPostDto): Promise<void>{
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
  getAllPosts(@Query() query): Promise<PaginatorDto<ViewPostDto[]>> {
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

    return this.postsService.getAllPosts(paginationParams);
  }



}
