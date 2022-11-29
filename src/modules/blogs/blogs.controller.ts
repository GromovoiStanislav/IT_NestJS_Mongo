import {
  Body,
  Controller, Delete,
  Get,
  HttpCode,
  HttpStatus, NotFoundException,
  Param,
  Post, Put, Query,
} from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import {
  CreateBlogCommand,
  DeleteBlogCommand, GetAllBlogsCommand,
  GetOneBlogCommand,
  UpdateBlogCommand
} from "./blogs.service";
import { InputBlogDto } from "./dto/input-blog.dto";
import { ViewBlogDto } from "./dto/view-blog.dto";
import { PaginationParams } from "../../commonDto/paginationParams.dto";
import { PaginatorDto } from "../../commonDto/paginator.dto";
import { ViewPostDto } from "../posts/dto/view-post.dto";
import { PostsService } from "../posts/posts.service";
import { InputBlogPostDto } from "../posts/dto/input-blog-post.dto";
import { Pagination } from "../../decorators/paginationDecorator";

@Controller("blogs")
export class BlogsController {
  constructor(
    private commandBus: CommandBus,
    protected postsService: PostsService) {
  }


  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createBlog(@Body() inputBlog: InputBlogDto): Promise<ViewBlogDto> {
    return this.commandBus.execute(new CreateBlogCommand(inputBlog))
  }


  @Put(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(@Param("id") blogId: string, @Body() inputBlog: InputBlogDto): Promise<void> {
    //const result = await this.blogsService.updateBlog(blogId, inputBlog);
    const result = await this.commandBus.execute(new UpdateBlogCommand(blogId, inputBlog))
    if (!result) {
      //throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
      throw new NotFoundException();
    }
    return;
  }


  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param("id") blogId: string): Promise<void> {
    //const result = await this.blogsService.deleteBlog(blogId);
    const result = await this.commandBus.execute(new DeleteBlogCommand(blogId))
    if (!result) {
      throw new NotFoundException();
    }
    return;
  }


  @Get(":id")
  async getOneBlog(@Param("id") blogId: string): Promise<ViewBlogDto> {
    const result = await this.commandBus.execute(new GetOneBlogCommand(blogId))
    //const result = await this.blogsService.getOneBlog(blogId);
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }


  @Get()
  getAllBlogs(@Query() query, @Pagination() paginationParams: PaginationParams): Promise<PaginatorDto<ViewBlogDto[]>> {
    const searchNameTerm = query.searchNameTerm as string || "";
    //return this.blogsService.getAllBlogs(searchNameTerm.trim(), paginationParams);
    return this.commandBus.execute(new GetAllBlogsCommand(searchNameTerm.trim(), paginationParams))
  }



//////////////////////////////////////////////////////////////////////


  @Post(":blogId/posts")
  @HttpCode(HttpStatus.CREATED)
  async createPostByBlogId(
    @Param("blogId") blogId: string,
    @Body() inputPost: InputBlogPostDto): Promise<ViewPostDto> {
    const result = await this.postsService.createPostByBlogId(blogId, inputPost);
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }


  @Get(":blogId/posts")
  async getOnePost(@Param("blogId") blogId: string, @Pagination() paginationParams: PaginationParams): Promise<PaginatorDto<ViewPostDto[]>> {
    if (!await this.commandBus.execute(new GetOneBlogCommand(blogId))) {
      throw new NotFoundException();
    }
    return await this.postsService.getAllPostsByBlogId(blogId, paginationParams);
  }

}
