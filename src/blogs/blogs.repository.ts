import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Blog, BlogDocument } from "./schemas/blogs.schema";
import { CreateBlogDto } from "./dto/create-blog.dto";
import { PaginatorDto } from "../commonDto/paginator.dto";
import { PaginationParams } from "../commonDto/paginationParams.dto";


@Injectable()
export class BlogsRepository {

  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogDocument>) {
  }

  async clearAll(): Promise<void> {
    await this.blogModel.deleteMany({});
  }

  async deleteBlog(blogId: string): Promise<boolean> {
    const result = await this.blogModel.deleteOne({ id: blogId });
    return result.deletedCount > 0;
  }


  async findAll(searchLogin: string, searchEmail: string, {
    pageNumber,
    pageSize,
    sortBy,
    sortDirection
  }: PaginationParams): Promise<PaginatorDto<Blog[]>> {

    const loginRegExp = RegExp(`${searchLogin}`, 'i')
    const emailRegExp = RegExp(`${searchEmail}`, 'i')

    type FilterType = {
      [key: string]: unknown
    }
    const filter: FilterType = {}

    if (searchLogin !== '' && searchEmail !== '') {
      filter.$or = [
        {login: loginRegExp},
        {email: emailRegExp}
      ]
    } else if (searchLogin !== '') {
      filter.login = loginRegExp
    } else if (searchEmail !== '') {
      filter.email = emailRegExp
    }

    const items = await this.blogModel.find(filter).sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
      .limit(pageSize).skip((pageNumber - 1) * pageSize);

    const totalCount = await this.blogModel.countDocuments(filter)
    const pagesCount = Math.ceil(totalCount / pageSize)
    const page = pageNumber

    return { pagesCount, page, pageSize, totalCount, items };
  }


  async createBlog(createBlogDto: CreateBlogDto): Promise<Blog> {
    const createdBlog = new this.blogModel(createBlogDto);
    return createdBlog.save();
  }


}