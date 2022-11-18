import { forwardRef, Module } from "@nestjs/common";
import { BlogsController } from "./blogs.controller";
import { BlogsService } from "./blogs.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Blog, BlogSchema } from "./schemas/blogs.schema";
import { BlogsRepository } from "./blogs.repository";
import { PostsModule } from "../posts/posts.module";


@Module({
  imports: [MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]), forwardRef(() => PostsModule)],
  controllers: [BlogsController],
  providers: [BlogsService, BlogsRepository],
  exports: [BlogsService, BlogsRepository]
})
export class BlogsModule {
}
