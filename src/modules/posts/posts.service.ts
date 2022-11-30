import { PostsRepository } from "./posts.repository";
import { InputPostDto } from "./dto/input-post.dto";
import { ViewPostDto } from "./dto/view-post.dto";
import PostMapper from "./dto/postsMapper";
import { GetOneBlogCommand } from "../blogs/blogs.service";
import { Post } from "./schemas/posts.schema";
import { PaginationParams } from "../../commonDto/paginationParams.dto";
import { PaginatorDto } from "../../commonDto/paginator.dto";
import { InputBlogPostDto } from "./dto/input-blog-post.dto";
import { CommandBus, CommandHandler, ICommandHandler } from "@nestjs/cqrs";


//////////////////////////////////////////////////////////////
export class ClearAllPostsCommand {
}

@CommandHandler(ClearAllPostsCommand)
export class ClearAllPostsUseCase implements ICommandHandler<ClearAllPostsCommand> {
  constructor(protected postsRepository: PostsRepository) {
  }

  async execute(command: ClearAllPostsCommand) {
    await this.postsRepository.clearAll();
  }
}

//////////////////////////////////////////////////////////////
export class DeletePostCommand {
  constructor(public postId: string) {
  }
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
  constructor(protected postsRepository: PostsRepository) {
  }

  async execute(command: DeletePostCommand): Promise<Post | null> {
    return this.postsRepository.deletePost(command.postId);
  }
}


//////////////////////////////////////////////////////////////
export class CreatePostCommand {
  constructor(public inputPost: InputPostDto) {
  }
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
  constructor(protected postsRepository: PostsRepository,
              private commandBus: CommandBus) {
  }

  async execute(command: CreatePostCommand): Promise<ViewPostDto | null> {
    let blogName = "";
    const blog = await this.commandBus.execute(new GetOneBlogCommand(command.inputPost.blogId));
    if (blog) {
      blogName = blog.name;
    }

    const post = await this.postsRepository.createPost(PostMapper.fromInputToCreate(command.inputPost, blogName));
    return PostMapper.fromModelToView(post);
  }
}

//////////////////////////////////////////////////////////////
export class UpdatePostCommand {
  constructor(public postId: string, public inputPost: InputPostDto) {
  }
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand> {
  constructor(protected postsRepository: PostsRepository,
              private commandBus: CommandBus) {
  }

  async execute(command: UpdatePostCommand): Promise<Post | null> {
    let blogName = "";
    const blog = await this.commandBus.execute(new GetOneBlogCommand(command.inputPost.blogId));
    if (blog) {
      blogName = blog.name;
    }
    return this.postsRepository.updatePost(command.postId, PostMapper.fromUpdateToCreate(command.inputPost, blogName));
  }
}


//////////////////////////////////////////////////////////////
export class GetOnePostCommand {
  constructor(public postId: string) {
  }
}

@CommandHandler(GetOnePostCommand)
export class GetOnePostUseCase implements ICommandHandler<GetOnePostCommand> {
  constructor(protected postsRepository: PostsRepository) {
  }

  async execute(command: GetOnePostCommand): Promise<Post | null> {
    const post = await this.postsRepository.getOnePost(command.postId);
    if (post) {
      return PostMapper.fromModelToView(post);
    }
    return null;
  }
}

//////////////////////////////////////////////////////////////
export class GetAllPostsCommand {
  constructor(public paginationParams: PaginationParams) {
  }
}

@CommandHandler(GetAllPostsCommand)
export class GetAllPostsUseCase implements ICommandHandler<GetAllPostsCommand> {
  constructor(protected postsRepository: PostsRepository) {
  }

  async execute(command: GetAllPostsCommand): Promise<PaginatorDto<ViewPostDto[]>> {
    const result = await this.postsRepository.getAllPosts(command.paginationParams);
    return PostMapper.fromModelsToPaginator(result);
  }
}


//////////////////////////////////////////////////////////////
export class GetAllPostsByBlogIdCommand {
  constructor(public blogId: string, public paginationParams: PaginationParams) {
  }
}

@CommandHandler(GetAllPostsByBlogIdCommand)
export class GetAllPostsByBlogIdUseCase implements ICommandHandler<GetAllPostsByBlogIdCommand> {
  constructor(protected postsRepository: PostsRepository) {
  }

  async execute(command: GetAllPostsByBlogIdCommand): Promise<PaginatorDto<ViewPostDto[]>> {
    const result = await this.postsRepository.getAllPosts(command.paginationParams, command.blogId);
    return PostMapper.fromModelsToPaginator(result);
  }
}


//////////////////////////////////////////////////////////////
export class CreatePostByBlogIdCommand {
  constructor(public blogId: string, public inputPost: InputBlogPostDto) {
  }
}

@CommandHandler(CreatePostByBlogIdCommand)
export class CreatePostByBlogIdUseCase implements ICommandHandler<CreatePostByBlogIdCommand> {
  constructor(protected postsRepository: PostsRepository,
              private commandBus: CommandBus) {
  }

  async execute(command: CreatePostByBlogIdCommand): Promise<ViewPostDto | null> {
    const blog = await this.commandBus.execute(new GetOneBlogCommand(command.blogId));
    if (!blog) {
      return null;
    }

    const post = await this.postsRepository.createPost(PostMapper.fromInputToCreate({
      ...command.inputPost,
      blogId: command.blogId
    }, blog.name));
    return PostMapper.fromModelToView(post);
  }
}


