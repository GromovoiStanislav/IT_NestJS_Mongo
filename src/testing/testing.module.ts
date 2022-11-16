import { Module } from "@nestjs/common";
import { TestingController } from "./testing.controller";
import { TestingService } from "./testing.service";
import { UsersModule } from "../users/users.module";
import { BlogsModule } from "../blogs/blogs.module";

@Module({
  imports: [UsersModule, BlogsModule],
  controllers: [TestingController],
  providers: [TestingService]
})
export class TestingModule {
}