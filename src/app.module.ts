import { configModule } from './config/configModule'

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from "./users/users.controller";
import { UsersService } from "./users/users.service";
import { UsersRepository } from "./users/users.repository";
import { DatabaseModule } from "./db/mongo";


@Module({
  imports: [configModule, DatabaseModule],
  controllers: [AppController,UsersController],
  providers: [AppService,UsersService,UsersRepository],
})
export class AppModule {}
