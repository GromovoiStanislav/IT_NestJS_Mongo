import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PostsController } from "./posts.controller";
import {
  ClearAllPostsUseCase, CreatePostByBlogIdUseCase,
  CreatePostUseCase,
  DeletePostUseCase, GetAllPostsByBlogIdUseCase,
  GetAllPostsUseCase,
  GetOnePostUseCase, PostsUpdateLikeByIDUseCase,
  UpdatePostUseCase
} from "./posts.service";
import { PostsRepository } from "./posts.repository";
import { Post, PostSchema } from "./schemas/posts.schema";
import { CqrsModule } from "@nestjs/cqrs";
import { JWT_Service } from "../../utils/jwtService";
import { Settings } from "../../settings";
import { JwtService } from "@nestjs/jwt";
import { PostLike, PostLikeSchema } from "./schemas/post-likes.schema";
import { PostLikesRepository } from "./postLikes.repository";
import { UserIdMiddleware } from "../../middlewares/userId.middleware";

const useCases = [
  ClearAllPostsUseCase,
  DeletePostUseCase,
  CreatePostUseCase,
  UpdatePostUseCase,
  GetOnePostUseCase,
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
    ])],
  controllers: [PostsController],
  providers: [...useCases, PostsRepository,PostLikesRepository, JWT_Service, JwtService, Settings]

})
//export class PostsModule {}
export class PostsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserIdMiddleware)
      .forRoutes('posts');
  }
}