import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PostsController } from "./posts.controller";
import { PostsService } from "./posts.service";
import { PostsRepository } from "./posts.repository";
import { Post, PostSchema } from "./schemas/posts.schema";
import { BlogsModule } from "../blogs/blogs.module";


@Module({
  imports: [MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]), forwardRef(() => BlogsModule)],
  controllers: [PostsController],
  providers: [PostsService, PostsRepository],
  exports: [PostsService, PostsRepository]
})
export class PostsModule {
}
