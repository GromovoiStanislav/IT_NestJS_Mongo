import { Injectable } from "@nestjs/common";

const users = [{ id: 1, "name": "Ira" }, { id: 2, "name": "Yra" }];


@Injectable()
export class UsersRepository{

  findUsers(term:string){
    return users.filter(u => !term || u.name.includes(term));
  }
}