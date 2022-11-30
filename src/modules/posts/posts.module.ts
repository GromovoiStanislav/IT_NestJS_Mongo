import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PostsController } from "./posts.controller";
import {
  ClearAllPostsUseCase, CreatePostByBlogIdUseCase,
  CreatePostUseCase,
  DeletePostUseCase, GetAllPostsByBlogIdUseCase,
  GetAllPostsUseCase,
  GetOnePostUseCase,
  UpdatePostUseCase
} from "./posts.service";
import { PostsRepository } from "./posts.repository";
import { Post, PostSchema } from "./schemas/posts.schema";
import { BlogsModule } from "../blogs/blogs.module";
import { CqrsModule } from "@nestjs/cqrs";
import { JWT_Service } from "../../utils/jwtService";
import { Settings } from "../../settings";
import { JwtService } from "@nestjs/jwt";

const useCases = [
  ClearAllPostsUseCase,
  DeletePostUseCase,
  CreatePostUseCase,
  UpdatePostUseCase,
  GetOnePostUseCase,
  GetAllPostsUseCase,
  GetAllPostsByBlogIdUseCase,
  CreatePostByBlogIdUseCase
];

@Module({
  imports: [CqrsModule, MongooseModule.forFeature([{
    name: Post.name,
    schema: PostSchema
  }])],//, forwardRef(() => BlogsModule)
  controllers: [PostsController],
  providers: [...useCases, PostsRepository,JWT_Service, JwtService, Settings],
  //exports: [PostsRepository]
})
export class PostsModule {
}
