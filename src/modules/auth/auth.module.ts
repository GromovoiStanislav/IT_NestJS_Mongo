import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { CqrsModule } from "@nestjs/cqrs";

import {
  ConfirmEmailUseCase,
  LoginUserUseCase,
  RegisterUserUseCase,
  ResendConfirmationCodeUseCase
} from "./auth.service";

import { EmailAdapter } from "../../utils/email-adapter";
import { Settings } from "../../settings";
import { JWT_Module } from "../jwt/jwt.module";


const useCases = [
  RegisterUserUseCase,
  ResendConfirmationCodeUseCase,
  ConfirmEmailUseCase,
  LoginUserUseCase
];


@Module({
  imports: [CqrsModule,JWT_Module],
  controllers: [AuthController],
  providers: [...useCases, EmailAdapter, Settings]
})
export class AuthModule {
}
