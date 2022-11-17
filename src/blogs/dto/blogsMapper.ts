import { Blog } from "../schemas/blogs.schema";
import { CreateBlogDto } from "./create-blog.dto";
import { InputBlogDto } from "./input-blog.dto";
import { ViewBlogDto } from "./view-blog.dto";
import uid from "../../utils/IdGenerator";
import dateAt from "../../utils/DateGenerator";
import { PaginatorDto } from "../../commonDto/paginator.dto";

export default class BlogMapper {

  static fromInputToCreate(inputBlog: InputBlogDto): CreateBlogDto {
    const createdBlog =  new CreateBlogDto();
    createdBlog.id = uid();
    createdBlog.name = inputBlog.name;
    createdBlog.youtubeUrl = inputBlog.youtubeUrl;
    createdBlog.createdAt = dateAt();
    return createdBlog
  }

  static fromModelToView(blog: Blog): ViewBlogDto {
    const viewBlog = new ViewBlogDto();
    viewBlog.id = blog.id;
    viewBlog.name = blog.name;
    viewBlog.youtubeUrl = blog.youtubeUrl;
    viewBlog.createdAt = blog.createdAt;
    return viewBlog;
  }

  static fromModelsToPaginator(blogs: PaginatorDto<Blog[]>): PaginatorDto<ViewBlogDto[]> {
    return {
      pagesCount: blogs.pagesCount,
      page: blogs.page,
      pageSize: blogs.pageSize,
      totalCount: blogs.totalCount,
      items: blogs.items.map(blog => BlogMapper.fromModelToView(blog))
    }
  }

}