import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { BloggerBlogsController, BlogsController, SaBlogsController } from "./blogs.controller";
import {
  BindBlogWithUserUseCase,
  ClearAllBlogsUseCase,
  CreateBlogUseCase,
  DeleteBlogUseCase, GetAllBlogsByUserIdUseCase, GetAllBlogsUseCase, GetOneBlogUseCase,
  UpdateBlogUseCase
} from "./blogs.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Blog, BlogSchema } from "./schemas/blogs.schema";
import { BlogsRepository } from "./blogs.repository";
import { CqrsModule } from "@nestjs/cqrs";
import { JWT_Module } from "../jwt/jwt.module";
import { UserIdMiddleware } from "../../middlewares/userId.middleware";


const useCases = [
  ClearAllBlogsUseCase,
  CreateBlogUseCase,
  UpdateBlogUseCase,
  DeleteBlogUseCase,
  GetOneBlogUseCase,
  GetAllBlogsUseCase,
  BindBlogWithUserUseCase,
  GetAllBlogsByUserIdUseCase
];

@Module({
  imports: [MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]), CqrsModule, JWT_Module],
  controllers: [BlogsController, BloggerBlogsController, SaBlogsController],
  providers: [...useCases, BlogsRepository],
  exports: []
})
export class BlogsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserIdMiddleware)
      .forRoutes('blogger/blogs');
  }
}