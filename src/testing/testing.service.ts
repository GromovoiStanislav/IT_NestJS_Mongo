import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";

@Injectable()
export class TestingService {

  constructor(private userService: UsersService) {
  }

  async deleteAllData(): Promise<void> {
    await Promise.all([
      this.userService.clearAllUsers()
    ]);
  }

}