import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { CqrsModule } from "@nestjs/cqrs";
import { JwtService } from "@nestjs/jwt";
import {
  ConfirmEmailUseCase,
  LoginUserUseCase,
  RegisterUserUseCase,
  ResendConfirmationCodeUseCase
} from "./auth.service";

import { EmailAdapter } from "../../utils/email-adapter";
import { Settings } from "../../settings";
import { JWT_Service } from "../../utils/jwtService";


const useCases = [
  RegisterUserUseCase,
  ResendConfirmationCodeUseCase,
  ConfirmEmailUseCase,
  LoginUserUseCase
];


@Module({
  imports: [CqrsModule],
  controllers: [AuthController],
  providers: [...useCases, EmailAdapter, JWT_Service, JwtService, Settings]
})
export class AuthModule {
}
