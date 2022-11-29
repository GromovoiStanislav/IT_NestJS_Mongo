import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PostsController } from "./posts.controller";
import { ClearAllPostsCase, PostsService } from "./posts.service";
import { PostsRepository } from "./posts.repository";
import { Post, PostSchema } from "./schemas/posts.schema";
import { BlogsModule } from "../blogs/blogs.module";
import { CqrsModule } from "@nestjs/cqrs";

const useCases = [ClearAllPostsCase];

@Module({
  imports: [CqrsModule, MongooseModule.forFeature([{
    name: Post.name,
    schema: PostSchema
  }]), forwardRef(() => BlogsModule)],
  controllers: [PostsController],
  providers: [...useCases, PostsService, PostsRepository],
  exports: [...useCases, PostsService, PostsRepository]
})
export class PostsModule {
}
