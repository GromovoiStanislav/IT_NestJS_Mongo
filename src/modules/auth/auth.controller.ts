import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";

import { InputUserDto } from "./dto/input-user.dto";
import { RegisterUserCommand,ResendConfirmationCodeCommand,ConfirmEmailCommand } from "./auth.service";
import { InputEmailDto } from "./dto/input-email.dto";
import { InputCodeDto } from "./dto/input-code.dto";



@Controller("auth")
export class AuthController {

  constructor(private commandBus: CommandBus) {
  }

  @Post('registration')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registerUser(@Body() inputUser: InputUserDto){
    return this.commandBus.execute(new RegisterUserCommand(inputUser))
  }


  @Post('registration-confirmation')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registrationConfirmation(@Body() inputCode: InputCodeDto){
    return this.commandBus.execute(new ConfirmEmailCommand(inputCode.code))
  }

  @Post('registration-email-resending')
  @HttpCode(HttpStatus.NO_CONTENT)
  async resendConfirmationCode(@Body() inputEmail: InputEmailDto){
    return this.commandBus.execute(new ResendConfirmationCodeCommand(inputEmail.email))
  }

}
