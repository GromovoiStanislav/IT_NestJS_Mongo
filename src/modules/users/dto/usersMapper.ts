import { CreateUserDto } from "./create-user.dto";
import { InputUserDto } from "./input-user.dto";
import uid from "../../../utils/IdGenerator";
import dateAt from "../../../utils/DateGenerator";
import { ViewBanUsersInfo, ViewUserDto } from "./view-user.dto";
import { User } from "../schemas/users.schema";
import { PaginatorDto } from "../../../commonDto/paginator.dto";


export default class UsersMapper {

  static fromInputToCreate(inputUser: InputUserDto): CreateUserDto {
    const user = new CreateUserDto();
    user.id = uid();
    user.login = inputUser.login;
    user.password = inputUser.password;
    user.email = inputUser.email;
    user.createdAt = dateAt();
    return user;
  }

  static fromModelToView(user: User): ViewUserDto {
    const viewUser = new ViewUserDto();
    viewUser.id = user.id;
    viewUser.login = user.login;
    viewUser.email = user.email;
    viewUser.createdAt = user.createdAt;
    viewUser.banInfo = new ViewBanUsersInfo();
    return viewUser;
  }

  static fromModelsToPaginator(users: PaginatorDto<User[]>): PaginatorDto<ViewUserDto[]>{
    return {
      pagesCount: users.pagesCount,
      page: users.page,
      pageSize: users.pageSize,
      totalCount: users.totalCount,
      items:users.items.map(user => UsersMapper.fromModelToView(user))
    }
  }


}