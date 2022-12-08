import {
  Body,
  Controller, Delete,
  Get,
  HttpCode,
  HttpStatus, NotFoundException,
  Param,
  Post, Put, Query, UseGuards
} from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import {
  BindBlogWithUserCommand,
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
import { CreatePostByBlogIdCommand, GetAllPostsByBlogIdCommand } from "../posts/posts.service";
import { InputBlogPostDto } from "../posts/dto/input-blog-post.dto";
import { Pagination } from "../../decorators/paginationDecorator";
import { BaseAuthGuard } from "../../guards/base.auth.guard";
import { BearerUserIdGuard } from "../../guards/bearer.userId.guard";
import { CurrentUserId } from "../../decorators/current-userId.decorator";
import { AuthUserIdGuard } from "../../guards/auth.userId.guard";

@Controller("blogs")
export class BlogsController {

  constructor(
    private commandBus: CommandBus) {
  }

  @Get()
  getAllBlogs(@Query() query, @Pagination() paginationParams: PaginationParams): Promise<PaginatorDto<ViewBlogDto[]>> {
    const searchNameTerm = query.searchNameTerm as string || "";
    return this.commandBus.execute(new GetAllBlogsCommand(searchNameTerm.trim(), paginationParams));
  }


  @Get(":id")
  async getOneBlog(@Param("id") blogId: string): Promise<ViewBlogDto> {
    const result = await this.commandBus.execute(new GetOneBlogCommand(blogId));
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }


  @Get(":blogId/posts")
  @UseGuards(BearerUserIdGuard)
  async getOnePost(
    @Param("blogId") blogId: string,
    @CurrentUserId() userId: string,
    @Pagination() paginationParams: PaginationParams): Promise<PaginatorDto<ViewPostDto[]>> {
    if (!await this.commandBus.execute(new GetOneBlogCommand(blogId))) {
      throw new NotFoundException();
    }
    return this.commandBus.execute(new GetAllPostsByBlogIdCommand(blogId, userId, paginationParams));
  }

}


@UseGuards(AuthUserIdGuard)
@Controller("blogger/blogs")
export class BloggerBlogsController {

  constructor(
    private commandBus: CommandBus) {
  }

  @Post()
  @UseGuards(BaseAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createBlog(@Body() inputBlog: InputBlogDto,
                   @CurrentUserId() userId: string): Promise<ViewBlogDto> {
    return this.commandBus.execute(new CreateBlogCommand(inputBlog, userId));
  }


  @Put(":id")
  @UseGuards(BaseAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(@Param("id") blogId: string,
                   @Body() inputBlog: InputBlogDto,
                   @CurrentUserId() userId: string): Promise<void> {
    const result = await this.commandBus.execute(new UpdateBlogCommand(blogId, inputBlog));
    if (!result) {
      throw new NotFoundException();
    }
    return;
  }


  @Delete(":id")
  @UseGuards(BaseAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param("id") blogId: string,
                   @CurrentUserId() userId: string): Promise<void> {
    await this.commandBus.execute(new DeleteBlogCommand(blogId, userId));
  }


  @Post(":blogId/posts")
  @UseGuards(BaseAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createPostByBlogId(@Param("blogId") blogId: string,
                           @Body() inputPost: InputBlogPostDto,
                           @CurrentUserId() userId: string): Promise<ViewPostDto> {
    const result = await this.commandBus.execute(new CreatePostByBlogIdCommand(blogId, inputPost));

    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }


}

@Controller("sa/blogs")
export class SaBlogsController {
  constructor(
    private commandBus: CommandBus) {
  }

  @Get()
  getAllBlogs(@Query() query, @Pagination() paginationParams: PaginationParams): Promise<PaginatorDto<ViewBlogDto[]>> {
    const searchNameTerm = query.searchNameTerm as string || "";
    return this.commandBus.execute(new GetAllBlogsCommand(searchNameTerm.trim(), paginationParams, true));
  }


  @Put(":blogId/bind-with-user/:userId")
  @UseGuards(BaseAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(@Param("blogId") blogId: string, @Param("userId") userId: string): Promise<void> {
    await this.commandBus.execute(new BindBlogWithUserCommand(blogId, userId));
  }

}