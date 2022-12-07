import { BlogsRepository } from "./blogs.repository";
import { ViewBlogDto } from "./dto/view-blog.dto";
import { InputBlogDto } from "./dto/input-blog.dto";
import BlogMapper from "./dto/blogsMapper";
import { PaginationParams } from "../../commonDto/paginationParams.dto";
import { PaginatorDto } from "../../commonDto/paginator.dto";
import { Blog } from "./schemas/blogs.schema";
import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { BadRequestException } from "@nestjs/common";
import { BlogOwnerDto } from "./dto/blog-owner.dto";
import { GetUserByIdCommand } from "../users/users.service";


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

    const blogOwner: BlogOwnerDto = {
      userId: 'userId_TO_DO',
      userLogin: 'userLogin_TO_DO'
    };

    const blog = await this.blogsRepository.createBlog(BlogMapper.fromInputToCreate(command.inputBlog,blogOwner));
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

//////////////////////////////////////////////////////////////
export class BindBlogWithUserCommand {
  constructor(public blogId: string, public userId: string) {
  }
}

@CommandHandler(BindBlogWithUserCommand)
export class BindBlogWithUserUseCase implements ICommandHandler<BindBlogWithUserCommand> {
  constructor(
    private commandBus: CommandBus,
    private blogsRepository: BlogsRepository) {
  }

  async execute(command: BindBlogWithUserCommand): Promise<void> {
    const blog = await this.blogsRepository.getOneBlog(command.blogId);
    if (!blog) {
      throw new BadRequestException('blog not found');
    }
    if (blog.blogOwnerInfo.userId) {
      throw new BadRequestException('blogId has user already');
    }

    const user = await this.commandBus.execute(new GetUserByIdCommand(command.userId))
    if (!user) {
      throw new BadRequestException('user not found');
    }

    const blogOwner: BlogOwnerDto = {
      userId: user.id,
      userLogin: user.login
    };

    await this.blogsRepository.bindBlogWithUser(command.blogId, blogOwner);
  }
}