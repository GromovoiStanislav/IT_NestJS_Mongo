import { Injectable } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import { IsEmail, IsInt, Length, Min, validateOrReject } from "class-validator";


export class CreateUserInputModelType {
  @Length(3, 10)
  name: string;
  @IsEmail({}, { message: "Incorrect email" })
  email: string;
  @IsInt()
  @Min(0)
  childrenCount: number;
}


const validateOrRejectModel = async (model: any, ctor: { new(): any }) => {
  if (!(model instanceof ctor)) {
    throw new Error("Incorrect input data");
  }

  try {
    await validateOrReject(model);
  }catch (error) {
    throw new Error(error);
  }
};

@Injectable()
export class UsersService {
  constructor(protected usersRepository: UsersRepository) {
  }

  findUsers(term: string) {
    return this.usersRepository.findUsers(term);
  }

  async deleteUser(userId: string) {
    return null;
  }


  async createUser(inputModel: CreateUserInputModelType) {
    await validateOrRejectModel(inputModel, CreateUserInputModelType)
    //do business logic
  }
}