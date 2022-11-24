import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";

import { InputUserDto } from "./dto/input-user.dto";
import { RegisterUserCommand } from "./auth.service";



@Controller("auth")
export class AuthController {

  constructor(private commandBus: CommandBus) {
  }

  @Post('registration')
  //@HttpCode(HttpStatus.NO_CONTENT)
  async registerUser(@Body() inputUser: InputUserDto){
    return this.commandBus.execute(new RegisterUserCommand(inputUser))
  }

}
