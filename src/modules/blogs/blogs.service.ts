import { Injectable } from "@nestjs/common";
import { BlogsRepository } from "./blogs.repository";
import { ViewBlogDto } from "./dto/view-blog.dto";
import { InputBlogDto } from "./dto/input-blog.dto";
import BlogMapper from "./dto/blogsMapper";
import { PaginationParams } from "../../commonDto/paginationParams.dto";
import { PaginatorDto } from "../../commonDto/paginator.dto";
import { Blog } from "./schemas/blogs.schema";

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


  async updateBlog(blogId: string, inputBlog: InputBlogDto): Promise<Blog | null> {
    return this.blogsRepository.updateBlog(blogId, BlogMapper.fromInputToUpdate(inputBlog));
  }


  async deleteBlog(blogId: string): Promise<Blog | null> {
    return this.blogsRepository.deleteBlog(blogId);
  }


  async getOneBlog(blogId: string): Promise<ViewBlogDto | null> {
    const blog = await this.blogsRepository.getOneBlog(blogId);
    if (blog) {
      return BlogMapper.fromModelToView(blog);
    }
    return null;
  }


  async getAllBlogs(searchName: string, paginationParams: PaginationParams): Promise<PaginatorDto<ViewBlogDto[]>> {
    const result = await this.blogsRepository.getAllBlogs(searchName, paginationParams);
    return BlogMapper.fromModelsToPaginator(result)
  }

}
