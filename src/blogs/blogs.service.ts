import { Injectable } from "@nestjs/common";
import { BlogsRepository } from "./blogs.repository";

@Injectable()
export class BlogsService {
  constructor(protected blogsRepository: BlogsRepository) {
  }

  async clearAllBlogs(): Promise<void> {
    await this.blogsRepository.clearAll();
  }

}
