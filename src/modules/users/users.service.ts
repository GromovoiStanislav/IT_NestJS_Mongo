import { Injectable } from "@nestjs/common";
import * as bcryptjs from "bcryptjs";
import { UsersRepository } from "./users.repository";
import { InputUserDto } from "./dto/input-user.dto";
import { ViewUserDto } from "./dto/view-user.dto";
import { PaginatorDto } from "../../commonDto/paginator.dto";
import { PaginationParams } from "../../commonDto/paginationParams.dto";

import UsersMapper from "./dto/usersMapper";


@Injectable()
export class UsersService {

  constructor(protected usersRepository: UsersRepository) {
  }


  async clearAllUsers():Promise<void>{
    await this.usersRepository.clearAll()
  }


  async findAll(searchLogin: string, searchEmail: string, paginationParams: PaginationParams): Promise<PaginatorDto<ViewUserDto[]>> {
    const result = await this.usersRepository.findAll(searchLogin, searchEmail, paginationParams);
    return UsersMapper.fromModelsToPaginator(result)
  }


  async deleteUser(userId: string): Promise<boolean> {
    return this.usersRepository.deleteUser(userId);
  }


  async createUser(inputUser: InputUserDto): Promise<ViewUserDto> {
    const createUser = UsersMapper.fromInputToCreate(inputUser)
    createUser.password = await generateHash(createUser.password)
    return UsersMapper.fromModelToView(await this.usersRepository.createUser(createUser));
  }

}

const generateHash = async (password: string): Promise<string> => {
  return await bcryptjs.hash(password, 10);
};

const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcryptjs.compare(password, hash);
};