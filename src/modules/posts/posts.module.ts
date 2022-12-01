import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PostsController } from "./posts.controller";
import {
  ClearAllPostsUseCase, CreatePostByBlogIdUseCase,
  CreatePostUseCase,
  DeletePostUseCase, GetAllPostsByBlogIdUseCase,
  GetAllPostsUseCase,
  GetOnePostUseCase, GetOnePostWithLikesUseCase, PostsUpdateLikeByIDUseCase,
  UpdatePostUseCase
} from "./posts.service";
import { PostsRepository } from "./posts.repository";
import { Post, PostSchema } from "./schemas/posts.schema";
import { CqrsModule } from "@nestjs/cqrs";
import { PostLike, PostLikeSchema } from "./schemas/post-likes.schema";
import { PostLikesRepository } from "./postLikes.repository";
import { UserIdMiddleware } from "../../middlewares/userId.middleware";
import { JWT_Module } from "../jwt/jwt.module";
import { BlogIdValidator } from "./dto/blogId.validator";


const useCases = [
  ClearAllPostsUseCase,
  DeletePostUseCase,
  CreatePostUseCase,
  UpdatePostUseCase,
  GetOnePostUseCase,
  GetOnePostWithLikesUseCase,
  GetAllPostsUseCase,
  GetAllPostsByBlogIdUseCase,
  CreatePostByBlogIdUseCase,
  PostsUpdateLikeByIDUseCase
];

@Module({
  imports: [CqrsModule,
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: PostLike.name, schema: PostLikeSchema }
    ]),
    JWT_Module],
  controllers: [PostsController],
  providers: [...useCases, PostsRepository, PostLikesRepository, BlogIdValidator],
  exports:[]
})

export class PostsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserIdMiddleware)
      .forRoutes('posts');
  }
}