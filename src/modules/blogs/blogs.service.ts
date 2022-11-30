import { BlogsRepository } from "./blogs.repository";
import { ViewBlogDto } from "./dto/view-blog.dto";
import { InputBlogDto } from "./dto/input-blog.dto";
import BlogMapper from "./dto/blogsMapper";
import { PaginationParams } from "../../commonDto/paginationParams.dto";
import { PaginatorDto } from "../../commonDto/paginator.dto";
import { Blog } from "./schemas/blogs.schema";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";


//////////////////////////////////////////////////////////////
export class ClearAllBlogsCommand {
  constructor() {
  }
}

@CommandHandler(ClearAllBlogsCommand)
export class ClearAllBlogsUseCase implements ICommandHandler<ClearAllBlogsCommand> {
  constructor(protected blogsRepository: BlogsRepository) {
  }

  async execute(command: ClearAllBlogsCommand) {
    await this.blogsRepository.clearAll();
  }
}

//////////////////////////////////////////////////////////////
export class CreateBlogCommand {
  constructor(public inputBlog: InputBlogDto) {
  }
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
  constructor(protected blogsRepository: BlogsRepository) {
  }

  async execute(command: CreateBlogCommand): Promise<ViewBlogDto> {
    const blog = await this.blogsRepository.createBlog(BlogMapper.fromInputToCreate(command.inputBlog));
    return BlogMapper.fromModelToView(blog);
  }
}

//////////////////////////////////////////////////////////////
export class UpdateBlogCommand {
  constructor(public blogId: string, public inputBlog: InputBlogDto) {
  }
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
  constructor(protected blogsRepository: BlogsRepository) {
  }

  async execute(command: UpdateBlogCommand): Promise<Blog | null> {
    return this.blogsRepository.updateBlog(command.blogId, BlogMapper.fromInputToUpdate(command.inputBlog));
  }
}

//////////////////////////////////////////////////////////////
export class DeleteBlogCommand {
  constructor(public blogId: string) {
  }
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase implements ICommandHandler<DeleteBlogCommand> {
  constructor(protected blogsRepository: BlogsRepository) {
  }

  async execute(command: DeleteBlogCommand): Promise<Blog | null> {
    return this.blogsRepository.deleteBlog(command.blogId);
  }
}


//////////////////////////////////////////////////////////////
export class GetOneBlogCommand {
  constructor(public blogId: string) {
  }
}

@CommandHandler(GetOneBlogCommand)
export class GetOneBlogUseCase implements ICommandHandler<GetOneBlogCommand> {
  constructor(protected blogsRepository: BlogsRepository) {
  }

  async execute(command: GetOneBlogCommand): Promise<ViewBlogDto | null> {
    const blog = await this.blogsRepository.getOneBlog(command.blogId);
    if (blog) {
      return BlogMapper.fromModelToView(blog);
    }
    return null;
  }
}


//////////////////////////////////////////////////////////////
export class GetAllBlogsCommand {
  constructor(public searchName: string, public paginationParams: PaginationParams) {
  }
}

@CommandHandler(GetAllBlogsCommand)
export class GetAllBlogsUseCase implements ICommandHandler<GetAllBlogsCommand> {
  constructor(protected blogsRepository: BlogsRepository) {
  }

  async execute(command: GetAllBlogsCommand): Promise<PaginatorDto<ViewBlogDto[]>> {
    const result = await this.blogsRepository.getAllBlogs(command.searchName, command.paginationParams);
    return BlogMapper.fromModelsToPaginator(result);
  }
}

