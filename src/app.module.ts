import { configModule } from './config/configModule'

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from "./db/mongo.module";
import { UsersModule } from "./users/users.module";
import { TestingModule } from "./testing/testing.module";
import { BlogsModule } from './blogs/blogs.module';


@Module({
  imports: [configModule, DatabaseModule,UsersModule,TestingModule, BlogsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
