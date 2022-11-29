import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersController } from "./users.controller";
import {
  ClearAllUsersUseCase, ConfirmUserUseCase,
  CreateUserUseCase,
  DeleteUserUseCase,
  FindAllUsersUseCase, GetUserByConfirmationCodeUseCase,
  GetUserByLoginOrEmailUseCase,
  UpdateConfirmCodeUseCase
} from "./users.service";
import { User, UserSchema } from "./schemas/users.schema";
import { UsersRepository } from "./users.repository";
import { CqrsModule } from "@nestjs/cqrs";

const useCases = [
  ClearAllUsersUseCase,
  FindAllUsersUseCase,
  DeleteUserUseCase,
  CreateUserUseCase,
  GetUserByLoginOrEmailUseCase,
  UpdateConfirmCodeUseCase,
  GetUserByConfirmationCodeUseCase,
  ConfirmUserUseCase
];

@Module({
  imports: [CqrsModule, MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UsersController],
  providers: [...useCases, UsersRepository],
  exports: [...useCases, UsersRepository]
})
export class UsersModule {
}