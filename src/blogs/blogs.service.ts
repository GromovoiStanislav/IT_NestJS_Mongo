import { Injectable } from "@nestjs/common";
import { BlogsRepository } from "./blogs.repository";
import { ViewBlogDto } from "./dto/view-blog.dto";
import { InputBlogDto } from "./dto/input-blog.dto";
import BlogMapper from "./dto/blogsMapper";

@Injectable()
export class BlogsService {
  constructor(protected blogsRepository: BlogsRepository) {
  }

  async clearAllBlogs(): Promise<void> {
    await this.blogsRepository.clearAll();
  }

  async createBlog(inputBlog: InputBlogDto): Promise<ViewBlogDto> {
    const blog = await this.blogsRepository.createBlog(BlogMapper.fromInputToCreate(inputBlog));
    return BlogMapper.fromModelToView(blog);
  }

  async deleteBlog(blogId: string): Promise<boolean> {
    return this.blogsRepository.deleteBlog(blogId);
  }


  async getOneBlog(blogId: string): Promise<ViewBlogDto | null> {
    const blog = await this.blogsRepository.getOneBlog(blogId);
    if (blog) {
      return BlogMapper.fromModelToView(blog);
    }
    return null;
  }


}
