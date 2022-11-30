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
  providers: [...useCases, PostsRepository],
  //exports: [PostsRepository]
})
export class PostsModule {
}
