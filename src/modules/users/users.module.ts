import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SaUsersController } from "./users.controller";
import {
  BanUserUserUseCase,
  ClearAllUsersUseCase,
  ConfirmUserUseCase,
  CreateUserUseCase,
  DeleteUserUseCase,
  FindAllUsersUseCase, GetIdBannedUsersUseCase,
  GetUserByConfirmationCodeUseCase,
  GetUserByIdUseCase,
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
  ConfirmUserUseCase,
  GetUserByIdUseCase,
  BanUserUserUseCase,
  GetIdBannedUsersUseCase
];

@Module({
  imports: [CqrsModule, MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [SaUsersController],
  providers: [...useCases, UsersRepository]
  //exports: [ UsersRepository]
})
export class UsersModule {
}