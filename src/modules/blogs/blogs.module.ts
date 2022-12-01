import { Module } from "@nestjs/common";
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
import { CqrsModule } from "@nestjs/cqrs";
import { JWT_Module } from "../jwt/jwt.module";

const useCases = [
  ClearAllBlogsUseCase,
  CreateBlogUseCase,
  UpdateBlogUseCase,
  DeleteBlogUseCase,
  GetOneBlogUseCase,
  GetAllBlogsUseCase
];

@Module({
  imports: [MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]), CqrsModule,JWT_Module],
  controllers: [BlogsController],
  providers: [...useCases, BlogsRepository],
  exports:[]
})
export class BlogsModule {
}
