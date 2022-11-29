import { forwardRef, Module } from "@nestjs/common";
import { BlogsController } from "./blogs.controller";
import {
  ClearAllBlogsUseCase,
  CreateBlogUseCase,
  DeleteBlogUseCase, GetAllBlogsUseCase, GetOneBlogUseCase,
  UpdateBlogUseCase
} from "./blogs.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Blog, BlogSchema } from "./schemas/blogs.schema";
import { BlogsRepository } from "./blogs.repository";
import { PostsModule } from "../posts/posts.module";
import { CqrsModule } from "@nestjs/cqrs";

const useCases = [
  ClearAllBlogsUseCase,
  CreateBlogUseCase,
  UpdateBlogUseCase,
  DeleteBlogUseCase,
  GetOneBlogUseCase,
  GetAllBlogsUseCase
];

@Module({
  imports: [MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]), CqrsModule, forwardRef(() => PostsModule)],
  controllers: [BlogsController],
  providers: [...useCases, BlogsRepository],
  exports: [...useCases, BlogsRepository]
})
export class BlogsModule {
}
