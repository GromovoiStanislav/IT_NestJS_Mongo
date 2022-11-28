import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersController } from "./users.controller";
import {
  ClearAllUsersUseCase,
  CreateUserUseCase,
  DeleteUserUseCase,
  FindAllUsersUseCase, GetUserByLoginOrEmailUseCase
} from "./users.service";
import { User, UserSchema } from "./schemas/users.schema";
import { UsersRepository } from "./users.repository";
import { CqrsModule } from "@nestjs/cqrs";

const useCases = [
  ClearAllUsersUseCase,
  FindAllUsersUseCase,
  DeleteUserUseCase,
  CreateUserUseCase,
  GetUserByLoginOrEmailUseCase
];

@Module({
  imports: [CqrsModule, MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UsersController],
  providers: [...useCases, UsersRepository],
  exports: [...useCases, UsersRepository]
})
export class UsersModule {
}