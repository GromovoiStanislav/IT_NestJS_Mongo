import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { CqrsModule } from "@nestjs/cqrs";

import {
  ConfirmEmailUseCase, GetMeInfoUseCase,
  LoginUserUseCase,
  RegisterUserUseCase,
  ResendConfirmationCodeUseCase
} from "./auth.service";


import { Settings } from "../../settings";
import { JWT_Module } from "../jwt/jwt.module";
import { EmailModule } from "../email/email.module";


const useCases = [
  RegisterUserUseCase,
  ResendConfirmationCodeUseCase,
  ConfirmEmailUseCase,
  LoginUserUseCase,
  GetMeInfoUseCase
];


@Module({
  imports: [CqrsModule, JWT_Module, EmailModule],
  controllers: [AuthController],
  providers: [...useCases, Settings]
})
export class AuthModule {
}
