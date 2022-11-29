import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { CqrsModule } from "@nestjs/cqrs";
import { RegisterUserUseCase, ResendConfirmationCodeUseCase } from "./auth.service";
import { UsersModule } from "../users/users.module";
import { EmailAdapter } from "../../utils/email-adapter";
import { Settings } from "../../settings";

const useCases= [
  RegisterUserUseCase,
  ResendConfirmationCodeUseCase
]



@Module({
  imports:[CqrsModule,UsersModule],
  controllers: [AuthController],
  providers: [...useCases,EmailAdapter,Settings],
})
export class AuthModule {}
