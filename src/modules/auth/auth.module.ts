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
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";


const useCases = [
  RegisterUserUseCase,
  ResendConfirmationCodeUseCase,
  ConfirmEmailUseCase,
  LoginUserUseCase,
  GetMeInfoUseCase
];


@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 10,
      limit: 1
    }),
    CqrsModule, JWT_Module, EmailModule],
  controllers: [AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    ...useCases, Settings]
})
export class AuthModule {
}
