import { Blog } from "../schemas/blogs.schema";
import { CreateBlogDto } from "./create-blog.dto";
import { InputBlogDto } from "./input-blog.dto";
import { ViewBlogDto } from "./view-blog.dto";
import uid from "../../../utils/IdGenerator";
import { PaginatorDto } from "../../../commonDto/paginator.dto";
import { UpdateBlogDto } from "./update-blog.dto";
import dateAt from "../../../utils/DateGenerator";

export default class BlogMapper {

  static fromInputToCreate(inputBlog: InputBlogDto): CreateBlogDto {
    const createdBlog =  new CreateBlogDto();
    createdBlog.id = uid();
    createdBlog.name = inputBlog.name;
    createdBlog.websiteUrl = inputBlog.websiteUrl;
    createdBlog.description = inputBlog.description;
    createdBlog.createdAt = dateAt();
    return createdBlog
  }

  static fromInputToUpdate(inputBlog: InputBlogDto): UpdateBlogDto {
    const updatedBlog =  new UpdateBlogDto();
    updatedBlog.name = inputBlog.name;
    updatedBlog.websiteUrl = inputBlog.websiteUrl;
    updatedBlog.description = inputBlog.description;
    return updatedBlog
  }

  static fromModelToView(blog: Blog): ViewBlogDto {
    const viewBlog = new ViewBlogDto();
    viewBlog.id = blog.id;
    viewBlog.name = blog.name;
    viewBlog.websiteUrl = blog.websiteUrl;
    viewBlog.description = blog.description;
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