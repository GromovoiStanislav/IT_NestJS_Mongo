import { configModule } from './config/configModule'

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from "./users/users.controller";
import { UsersService } from "./users/users.service";
import { UsersRepository } from "./users/users.repository";
import { DatabaseModule } from "./db/mongo.module";
import { UsersModule } from "./users/users.module";


@Module({
  imports: [configModule, DatabaseModule,UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
