import { Injectable } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { ClearAllUsersCommand, UsersService } from "../users/users.service";
import { BlogsService } from "../blogs/blogs.service";
import { PostsService } from "../posts/posts.service";

@Injectable()
export class TestingService {

  constructor(
    private commandBus: CommandBus,
    //private usersService: UsersService,
    private blogsService: BlogsService,
    private postsService: PostsService
  ) {
  }

  async deleteAllData(): Promise<void> {
    await Promise.all([
      //this.usersService.clearAllUsers(),
      this.commandBus.execute(new ClearAllUsersCommand()),
      this.blogsService.clearAllBlogs(),
      this.postsService.clearAllPosts()
    ]).catch(() => {
    });
  }

}