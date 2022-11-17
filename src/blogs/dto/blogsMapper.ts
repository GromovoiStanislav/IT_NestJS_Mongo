import { Blog } from "../schemas/blogs.schema";
import { CreateBlogDto } from "./create-blog.dto";
import { InputBlogDto } from "./input-blog.dto";
import { ViewBlogDto } from "./view-blog.dto";
import uid from "../../utils/IdGenerator";
import dateAt from "../../utils/DateGenerator";

export default class BlogMapper {

  static fromModelToView(blog: Blog): ViewBlogDto {

    const viewBlog = new ViewBlogDto();
    viewBlog.id = blog.id;
    viewBlog.name = blog.name;
    viewBlog.youtubeUrl = blog.youtubeUrl;
    viewBlog.createdAt = blog.createdAt;

    return viewBlog;
  }


  static fromInputToCreate(inputBlog: InputBlogDto): CreateBlogDto {

    const createdBlog =  new CreateBlogDto();
    createdBlog.id = uid();
    createdBlog.name = inputBlog.name;
    createdBlog.youtubeUrl = inputBlog.youtubeUrl;
    createdBlog.createdAt = dateAt();

    return createdBlog
  }


}