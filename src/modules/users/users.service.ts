import { UsersRepository } from "./users.repository";
import { InputUserDto } from "./dto/input-user.dto";
import { PaginatorDto } from "../../commonDto/paginator.dto";
import { PaginationParams } from "../../commonDto/paginationParams.dto";
import { generateHash } from "../../utils/bcryptUtils";

import UsersMapper from "./dto/usersMapper";


import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { User } from "./schemas/users.schema";

//////////////////////////////////////////////////////////////
export class ClearAllUsersCommand {
  constructor() {
  }
}

@CommandHandler(ClearAllUsersCommand)
export class ClearAllUsersUseCase implements ICommandHandler<ClearAllUsersCommand> {
  constructor(protected usersRepository: UsersRepository) {
  }

  async execute(command: ClearAllUsersCommand) {
    await this.usersRepository.clearAll();
  }
}

////////////////////////////////////////////////////
export class FindAllUsersCommand {
  constructor(public searchLogin: string, public searchEmail: string, public paginationParams: PaginationParams) {
  }
}

@CommandHandler(FindAllUsersCommand)
export class FindAllUsersUseCase implements ICommandHandler<FindAllUsersCommand> {
  constructor(protected usersRepository: UsersRepository) {
  }

  async execute(command: FindAllUsersCommand) {

    const loginRegExp = RegExp(`${command.searchLogin}`, "i");
    const emailRegExp = RegExp(`${command.searchEmail}`, "i");

    type FilterType = {
      [key: string]: unknown
    }
    const filter: FilterType = {};

    if (command.searchLogin !== "" && command.searchEmail !== "") {
      filter.$or = [
        { login: loginRegExp },
        { email: emailRegExp }
      ];
    } else if (command.searchLogin !== "") {
      filter.login = loginRegExp;
    } else if (command.searchEmail !== "") {
      filter.email = emailRegExp;
    }

    const items = await this.usersRepository.findUsers(filter, command.paginationParams);

    const { pageSize, pageNumber } = command.paginationParams;
    const totalCount = await this.usersRepository.countDocuments(filter);
    const pagesCount = Math.ceil(totalCount / pageSize);
    const page = pageNumber;

    const result: PaginatorDto<User[]> = { pagesCount, page, pageSize, totalCount, items };
    return UsersMapper.fromModelsToPaginator(result);
  }
}

////////////////////////////////////////////////////////////
export class DeleteUserCommand {
  constructor(public userId: string) {
  }
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase implements ICommandHandler<DeleteUserCommand> {
  constructor(protected usersRepository: UsersRepository) {
  }

  async execute(command: DeleteUserCommand) {
    return this.usersRepository.deleteUser(command.userId);
  }
}

////////////////////////////////////////////////////////////
export class CreateUserCommand {
  constructor(public inputUser: InputUserDto) {
  }
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(protected usersRepository: UsersRepository) {
  }

  async execute(command: CreateUserCommand) {
    const createUser = UsersMapper.fromInputToCreate(command.inputUser);
    createUser.password = await generateHash(createUser.password);
    return UsersMapper.fromModelToView(await this.usersRepository.createUser(createUser));
  }
}

