import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./schemas/users.schema";
import { CreateUserDto } from "./dto/create-user.dto";
import { PaginationParams } from "../../commonDto/paginationParams.dto";


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

  async findUserByLoginOrEmail(search): Promise<User> {

    const filter = {
      $or: [
        { login: search },
        { email: search },
      ],
    };

    return this.userModel.findOne(filter)
  }

  async countDocuments(filter): Promise<number> {
    return this.userModel.count(filter);
  }

  async findUsers(filter, {
    pageNumber,
    pageSize,
    sortBy,
    sortDirection
  }: PaginationParams): Promise<User[]> {
    return this.userModel.find(filter).sort({ [sortBy]: sortDirection === "asc" ? 1 : -1 })
      .limit(pageSize).skip((pageNumber - 1) * pageSize);
  }


  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }


}