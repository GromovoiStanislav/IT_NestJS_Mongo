import {
  Body,
  Controller,
  Delete, Get,
  HttpCode,
  HttpStatus, NotFoundException,
  Param, Post, Put, UseGuards
} from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import {
  CreatePostCommand,
  DeletePostCommand,
  GetAllPostsCommand,
  GetOnePostCommand, PostsUpdateLikeByIDCommand,
  UpdatePostCommand
} from "./posts.service";
import { InputPostDto } from "./dto/input-post.dto";
import { ViewPostDto } from "./dto/view-post.dto";
import { PaginatorDto } from "../../commonDto/paginator.dto";
import { PaginationParams } from "../../commonDto/paginationParams.dto";
import { Pagination } from "../../decorators/paginationDecorator";
import { InputLikeDto } from "./dto/input-like.dto";
import { CurrentUserId } from "../../decorators/current-userId.decorator";
import { AuthUserIdGuard } from "../../guards/auth.userId.guard";
import { BearerAuthGuard } from "../../guards/bearer.auth.guard";


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
  //@UseGuards(BearerUserIdGuard)
  async getOnePost(
    @Param("id") postId: string,
    @CurrentUserId() userId: string
    ): Promise<ViewPostDto> {
    const result = await this.commandBus.execute(new GetOnePostCommand(postId));
    if (!result) {
      throw new NotFoundException();
    }
    return result;
  }


  @Get()
  async getAllPosts(@Pagination() paginationParams: PaginationParams): Promise<PaginatorDto<ViewPostDto[]>> {
    return this.commandBus.execute(new GetAllPostsCommand(paginationParams));
  }


  @Put(":postId/like-status")
  @HttpCode(HttpStatus.NO_CONTENT)
  //@UseGuards(BearerAuthGuard)
  @UseGuards(AuthUserIdGuard)
  async updateLikeByID(
    @Param("postId") postId: string,
    @Body() inputLike: InputLikeDto,
    @CurrentUserId() userId: string) {
    const result = await this.commandBus.execute(new GetOnePostCommand(postId));
    if (!result) {
      throw new NotFoundException();
    }
    return this.commandBus.execute(new PostsUpdateLikeByIDCommand(postId, userId, inputLike.likeStatus));
  }


}
