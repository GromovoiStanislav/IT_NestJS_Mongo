import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { CqrsModule } from "@nestjs/cqrs";
import {
  ConfirmEmailUseCase,
  LoginUserUseCase,
  RegisterUserUseCase,
  ResendConfirmationCodeUseCase
} from "./auth.service";
import { UsersModule } from "../users/users.module";
import { EmailAdapter } from "../../utils/email-adapter";
import { Settings } from "../../settings";
import { JWT_Service } from "../../utils/jwtService";

const useCases= [
  RegisterUserUseCase,
  ResendConfirmationCodeUseCase,
  ConfirmEmailUseCase,
  LoginUserUseCase
]



@Module({
  imports:[CqrsModule,UsersModule],
  controllers: [AuthController],
  providers: [...useCases,EmailAdapter,JWT_Service,Settings],
})
export class AuthModule {}
