import { Module } from "@nestjs/common";
import { TestingController } from "./testing.controller";
import { DeleteAllDataUseCase } from "./testing.service";
import { UsersModule } from "../users/users.module";
import { BlogsModule } from "../blogs/blogs.module";
import { PostsModule } from "../posts/posts.module";
import { CqrsModule } from "@nestjs/cqrs";


const useCases = [DeleteAllDataUseCase]

@Module({
  imports: [CqrsModule, UsersModule, BlogsModule, PostsModule],
  controllers: [TestingController],
  providers: [...useCases],
  exports: [...useCases]
})
export class TestingModule {
}