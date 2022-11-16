import { Injectable } from "@nestjs/common";
import * as bcryptjs from "bcryptjs";
import { UsersRepository } from "./users.repository";
import { validateOrReject } from "class-validator";
import { CreateUserDto } from "./dto/create-user.dto";
import { InputUserDto } from "./dto/input-user.dto";
import { ViewUserDto } from "./dto/view-user.dto";
import { PaginatorDto } from "../commonDto/paginator.dto";
import { PaginationParams } from "../commonDto/paginationParams.dto";

const uid = () => String(Date.now());


const validateOrRejectModel = async (model: any, ctor: { new(): any }) => {
  if (!(model instanceof ctor)) {
    throw new Error("Incorrect input data");
  }

  try {
    await validateOrReject(model);
  } catch (error) {
    throw new Error(error);
  }
};

@Injectable()
export class UsersService {
  constructor(protected usersRepository: UsersRepository) {
  }

  // findUsers(term: string) {
  //   return this.usersRepository.findUsers(term);
  // }

  async findAll(searchLogin: string, searchEmail: string, paginationParams: PaginationParams): Promise<PaginatorDto<ViewUserDto[]>> {
    const result = await this.usersRepository.findAll(searchLogin, searchEmail, paginationParams);

    return {
      pagesCount: result.pagesCount,
      page: result.page,
      pageSize: result.pageSize,
      totalCount: result.totalCount,
      items: result.items.map(el => ({
        id: el.id,
        login: el.login,
        email: el.email,
        createdAt: el.createdAt
      }))
    };
  }


  async deleteUser(userId: string): Promise<boolean> {
    return this.usersRepository.deleteUser(userId);
  }


  async createUser(inputUser: InputUserDto): Promise<ViewUserDto> {
    //await validateOrRejectModel(createUserDto, CreateUserInputModelType)

    const createUserDto: CreateUserDto = {
      id: uid(),
      login: inputUser.login,
      password: await this._generateHash(inputUser.password),
      email: inputUser.email,
      createdAt: new Date().toISOString()
    };

    const result = await this.usersRepository.createUser(createUserDto);

    const createdUser: ViewUserDto = {
      id: result.id,
      login: result.login,
      email: result.email,
      createdAt: result.createdAt
    };

    return createdUser;
  }

  async _generateHash(password: string): Promise<string> {
    return await bcryptjs.hash(password, 10);
  }


}

const generateHash = async (password: string): Promise<string> => {
  return await bcryptjs.hash(password, 10);
};

const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcryptjs.compare(password, hash);
};