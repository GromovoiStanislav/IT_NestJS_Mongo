import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { CqrsModule } from "@nestjs/cqrs";
import { RegisterUserUseCase } from "./auth.service";
import { UsersModule } from "../users/users.module";

const useCases= [
  RegisterUserUseCase,
]



@Module({
  imports:[CqrsModule,UsersModule],
  controllers: [AuthController],
  providers: [...useCases],
})
export class AuthModule {}
