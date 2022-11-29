import { forwardRef, Module } from "@nestjs/common";
import { BlogsController } from "./blogs.controller";
import { BlogsService, ClearAllBlogsUseCase } from "./blogs.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Blog, BlogSchema } from "./schemas/blogs.schema";
import { BlogsRepository } from "./blogs.repository";
import { PostsModule } from "../posts/posts.module";
import { CqrsModule } from "@nestjs/cqrs";

const useCases = [ClearAllBlogsUseCase];

@Module({
  imports: [CqrsModule, MongooseModule.forFeature([{
    name: Blog.name,
    schema: BlogSchema
  }]), forwardRef(() => PostsModule)],
  controllers: [BlogsController],
  providers: [...useCases, BlogsService, BlogsRepository],
  exports: [...useCases, BlogsService, BlogsRepository]
})
export class BlogsModule {
}
