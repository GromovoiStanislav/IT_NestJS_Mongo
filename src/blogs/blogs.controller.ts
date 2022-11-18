import {
  Body,
  Controller, Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post, Put, Query,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import { BlogsService } from "./blogs.service";
import { InputBlogDto } from "./dto/input-blog.dto";
import { ViewBlogDto } from "./dto/view-blog.dto";
import { PaginationParams } from "../commonDto/paginationParams.dto";
import { PaginatorDto } from "../commonDto/paginator.dto";
import { ViewPostDto } from "../posts/dto/view-post.dto";
import { PostsService } from "../posts/posts.service";
import { InputBlogPostDto } from "../posts/dto/input-blog-post.dto";

@Controller("blogs")
export class BlogsController {
  constructor(
    protected blogsService: BlogsService,
    protected postsService: PostsService) {
  }

  @UsePipes(new ValidationPipe())
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBlog(@Body() inputBlog: InputBlogDto): Promise<ViewBlogDto> {
    return await this.blogsService.createBlog(inputBlog);
  }


  @UsePipes(new ValidationPipe())
  @Put(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(@Param("id") blogId: string, @Body() inputBlog: InputBlogDto): Promise<void> {
    const result = await this.blogsService.updateBlog(blogId, inputBlog);
    if (!result) {
      throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
    }
    return;
  }


  @Get()
  getAllBlogs(@Query() query): Promise<PaginatorDto<ViewBlogDto[]>> {
    const searchNameTerm = query.searchNameTerm as string || "";
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

    return this.blogsService.getAllBlogs(searchNameTerm.trim(), paginationParams);
  }


  @Get(":id")
  async getOneBlog(@Param("id") blogId: string): Promise<ViewBlogDto> {
    const result = await this.blogsService.getOneBlog(blogId);
    if (!result) {
      throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
    }
    return result;
  }


  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param("id") blogId: string): Promise<void> {
    const result = await this.blogsService.deleteBlog(blogId);
    if (!result) {
      throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
    }
    return;
  }


  @UsePipes(new ValidationPipe())
  @Post(":blogId/posts")
  @HttpCode(HttpStatus.CREATED)
  async createPostByBlogId(
    @Param("blogId") blogId: string,
    @Body() inputPost: InputBlogPostDto): Promise<ViewPostDto> {
    const result = await this.postsService.createPostByBlogId(blogId, inputPost);
    if (!result) {
      throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
    }
    return result;
  }


  @Get(":blogId/posts")
  async getOnePost(@Param("blogId") blogId: string, @Query() query): Promise<PaginatorDto<ViewPostDto[]>> {

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


    if (!await this.blogsService.getOneBlog(blogId)) {
      throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
    }
    return await this.postsService.getAllPostsByBlogId(blogId, paginationParams);
  }

}
