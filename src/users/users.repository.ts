import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./schemas/users.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import { PaginatorDto } from "../commonDto/paginator.dto";
import { PaginationParams } from "../commonDto/paginationParams.dto";


@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
  }

  async clearAll(): Promise<void> {
    await this.userModel.deleteMany({});
  }

  async deleteUser(userId: string): Promise<boolean> {
    const result = await this.userModel.deleteOne({ id: userId });
    return result.deletedCount > 0;
  }


  async findAll(searchLogin: string, searchEmail: string, {
    pageNumber,
    pageSize,
    sortBy,
    sortDirection
  }: PaginationParams): Promise<PaginatorDto<User[]>> {

    const loginRegExp = RegExp(`${searchLogin}`, 'i')
    const emailRegExp = RegExp(`${searchEmail}`, 'i')

    type FilterType = {
      [key: string]: unknown
    }
    const filter: FilterType = {}

    if (searchLogin !== '' && searchEmail !== '') {
      filter.$or = [
        {login: loginRegExp},
        {email: emailRegExp}
      ]
    } else if (searchLogin !== '') {
      filter.login = loginRegExp
    } else if (searchEmail !== '') {
      filter.email = emailRegExp
    }

    const items = await this.userModel.find(filter).sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
      .limit(pageSize).skip((pageNumber - 1) * pageSize);

    const totalCount = await this.userModel.countDocuments(filter)
    const pagesCount = Math.ceil(totalCount / pageSize)
    const page = pageNumber

    return { pagesCount, page, pageSize, totalCount, items };
  }


  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }


}