import {
  Body,
  Controller, Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post, Query,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import { BlogsService } from "./blogs.service";
import { InputBlogDto } from "./dto/input-blog.dto";
import { ViewBlogDto } from "./dto/view-blog.dto";
import { PaginationParams } from "../commonDto/paginationParams.dto";
import { PaginatorDto } from "../commonDto/paginator.dto";

@Controller("blogs")
export class BlogsController {
  constructor(protected blogsService: BlogsService) {
  }

  @UsePipes(new ValidationPipe())
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBlog(@Body() inputBlog: InputBlogDto): Promise<ViewBlogDto> {
    return await this.blogsService.createBlog(inputBlog);
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

}
