import { CreateUserCommand } from "../users/users.service";
import { InputUserDto } from "./dto/input-user.dto";
import { CommandBus } from "@nestjs/cqrs";

import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";



export class RegisterUserCommand {
  constructor(public inputUser: InputUserDto) {
  }
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserUseCase implements ICommandHandler<RegisterUserCommand> {
  constructor(private commandBus: CommandBus,) {}

  async execute(command: RegisterUserCommand) {
    console.log(command);
    return this.commandBus.execute(new CreateUserCommand(command.inputUser));
  }
}