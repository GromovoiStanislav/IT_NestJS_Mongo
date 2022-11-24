import { Module } from "@nestjs/common";
import { TestingController } from "./testing.controller";
import { TestingService } from "./testing.service";
import { UsersModule } from "../users/users.module";
import { BlogsModule } from "../blogs/blogs.module";
import { PostsModule } from "../posts/posts.module";
import { CqrsModule } from "@nestjs/cqrs";

@Module({
  imports: [CqrsModule,UsersModule, BlogsModule, PostsModule],
  controllers: [TestingController],
  providers: [TestingService]
})
export class TestingModule {
}