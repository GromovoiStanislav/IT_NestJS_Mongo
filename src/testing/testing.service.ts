import { Injectable } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { BlogsService } from "../blogs/blogs.service";
import { PostsService } from "../posts/posts.service";

@Injectable()
export class TestingService {

  constructor(private usersService: UsersService,
              private blogsService: BlogsService,
              private postsService: PostsService,

  ) {
  }

  async deleteAllData(): Promise<void> {
    await Promise.all([
      this.usersService.clearAllUsers(),
      this.blogsService.clearAllBlogs(),
      this.postsService.clearAllPosts(),
    ]).catch(()=>{});
  }

}