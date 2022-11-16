import { Module } from "@nestjs/common";
import { BlogsController } from "./blogs.controller";
import { BlogsService } from "./blogs.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Blog, BlogSchema } from "./schemas/blogs.schema";
import { BlogsRepository } from "./blogs.repository";


@Module({
  imports: [MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }])],
  controllers: [BlogsController],
  providers: [BlogsService, BlogsRepository],
  exports: [BlogsService, BlogsRepository]
})
export class BlogsModule {
}
