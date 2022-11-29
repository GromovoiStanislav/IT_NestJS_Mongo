import { Body, Controller, HttpCode, HttpStatus, Post, Res} from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { Response } from 'express';

import { InputUserDto } from "./dto/input-user.dto";
import {
  RegisterUserCommand,
  ResendConfirmationCodeCommand,
  ConfirmEmailCommand,
  LoginUserCommand
} from "./auth.service";
import { InputEmailDto } from "./dto/input-email.dto";
import { InputCodeDto } from "./dto/input-code.dto";
import { InputLoginDto } from "./dto/input-login.dto";


@Controller("auth")
export class AuthController {

  constructor(private commandBus: CommandBus) {
  }

  @Post("registration")
  @HttpCode(HttpStatus.NO_CONTENT)
  async registerUser(@Body() inputUser: InputUserDto) {
    return this.commandBus.execute(new RegisterUserCommand(inputUser));
  }

  @Post("registration-confirmation")
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationConfirmation(@Body() inputCode: InputCodeDto) {
    return this.commandBus.execute(new ConfirmEmailCommand(inputCode.code));
  }

  @Post("registration-email-resending")
  @HttpCode(HttpStatus.NO_CONTENT)
  async resendConfirmationCode(@Body() inputEmail: InputEmailDto) {
    return this.commandBus.execute(new ResendConfirmationCodeCommand(inputEmail.email));
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() inputLogin: InputLoginDto,@Res({ passthrough: true }) res: Response) {
    const JWT_Tokens = await this.commandBus.execute(new LoginUserCommand(inputLogin.loginOrEmail, inputLogin.password));
    res.cookie('refreshToken', JWT_Tokens.refreshToken, {
      maxAge: 1000 * 20,
      httpOnly: true,
      secure: true,
    })
    return {accessToken: JWT_Tokens.accessToken}
  }

}
