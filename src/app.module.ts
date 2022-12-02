import { configModule } from "./config/configModule";

import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "./db/mongo.module";
import { UsersModule } from "./modules/users/users.module";
import { TestingModule } from "./modules/testing/testing.module";
import { BlogsModule } from "./modules/blogs/blogs.module";
import { PostsModule } from "./modules/posts/posts.module";
import { AuthModule } from "./modules/auth/auth.module";
import { CqrsModule } from "@nestjs/cqrs";
import { CommentsModule } from "./modules/comments/comments.module";


@Module({
  imports: [CqrsModule, configModule, DatabaseModule, UsersModule, TestingModule, BlogsModule, PostsModule, AuthModule,CommentsModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
}
