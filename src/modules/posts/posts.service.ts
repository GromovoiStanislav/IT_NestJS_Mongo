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
import { PostLikesRepository } from "./postLikes.repository";
import { GetUserByIdCommand } from "../users/users.service";


//////////////////////////////////////////////////////////////
export class ClearAllPostsCommand {
}

@CommandHandler(ClearAllPostsCommand)
export class ClearAllPostsUseCase implements ICommandHandler<ClearAllPostsCommand> {
  constructor(
    protected postsRepository: PostsRepository,
    protected postLikesRepository: PostLikesRepository
  ) {
  }

  async execute(command: ClearAllPostsCommand) {
    await Promise.all([
      await this.postsRepository.clearAll(),
      await this.postLikesRepository.clearAll()
    ]).catch(() => {
    });
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
    return PostMapper._fromModelToView(post);
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
  constructor(public postId: string, public userId?: string) {
  }
}

@CommandHandler(GetOnePostCommand)
export class GetOnePostUseCase implements ICommandHandler<GetOnePostCommand> {
  constructor(protected postsRepository: PostsRepository) {
  }

  async execute(command: GetOnePostCommand): Promise<Post | null> {
    const post = await this.postsRepository.getOnePost(command.postId);
    if (post) {
      return PostMapper._fromModelToView(post);
    }
    return null;
  }
}

//////////////////////////////////////////////////////////////
export class GetOnePostWithLikesCommand {
  constructor(public postId: string, public userId: string) {
  }
}

@CommandHandler(GetOnePostWithLikesCommand)
export class GetOnePostWithLikesUseCase implements ICommandHandler<GetOnePostWithLikesCommand> {
  constructor(
    protected postsRepository: PostsRepository,
    protected postLikesRepository: PostLikesRepository
  ) {
  }

  async execute(command: GetOnePostWithLikesCommand): Promise<Post | null> {
    const post = await this.postsRepository.getOnePost(command.postId);
    if (post) {
      const likes = await this.postLikesRepository.likesInfoByPostID(command.postId, command.userId);
      return PostMapper.fromModelToView(post, likes);
    }
    return null;
  }
}


//////////////////////////////////////////////////////////////
export class GetAllPostsCommand {
  constructor(public paginationParams: PaginationParams, public userId: string) {
  }
}

@CommandHandler(GetAllPostsCommand)
export class GetAllPostsUseCase implements ICommandHandler<GetAllPostsCommand> {
  constructor(
    protected postsRepository: PostsRepository,
    protected postLikesRepository: PostLikesRepository
  ) {
  }

  //: Promise<PaginatorDto<ViewPostDto[]>>
  async execute(command: GetAllPostsCommand) {

    const result = await this.postsRepository.getAllPosts(command.paginationParams);

    result.items = await Promise.all(result.items.map(async post => {
      const likes = await this.postLikesRepository.likesInfoByPostID(post.id, command.userId);
      return PostMapper.fromModelToView(post, likes);
    }));

    return result;
  }
}


//////////////////////////////////////////////////////////////
export class GetAllPostsByBlogIdCommand {
  constructor(public blogId: string, public userId: string, public paginationParams: PaginationParams) {
  }
}

@CommandHandler(GetAllPostsByBlogIdCommand)
export class GetAllPostsByBlogIdUseCase implements ICommandHandler<GetAllPostsByBlogIdCommand> {
  constructor(
    protected postsRepository: PostsRepository,
    protected postLikesRepository: PostLikesRepository
  ) {
  }

  //: Promise<PaginatorDto<ViewPostDto[]>>
  async execute(command: GetAllPostsByBlogIdCommand) {
    const result = await this.postsRepository.getAllPosts(command.paginationParams, command.blogId);
    //return PostMapper.fromModelsToPaginator(result);
    result.items = await Promise.all(result.items.map(async post => {
      const likes = await this.postLikesRepository.likesInfoByPostID(post.id, command.userId);
      return PostMapper.fromModelToView(post, likes);
    }));
    return result;
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
    return PostMapper._fromModelToView(post);
  }
}

//////////////////////////////////////////////////////////////
export class PostsUpdateLikeByIDCommand {
  constructor(public postId: string, public userId: string, public likeStatus: string) {
  }
}

@CommandHandler(PostsUpdateLikeByIDCommand)
export class PostsUpdateLikeByIDUseCase implements ICommandHandler<PostsUpdateLikeByIDCommand> {
  constructor(
    private commandBus: CommandBus,
    protected postLikesRepository: PostLikesRepository
  ) {
  }

  async execute(command: PostsUpdateLikeByIDCommand) {
    const user = await this.commandBus.execute(new GetUserByIdCommand(command.userId));

    if (command.likeStatus === "None") {
      await this.postLikesRepository.deleteByPostIDUserID(command.postId, command.userId);
    } else {
      await this.postLikesRepository.updateLikeByID(command.postId, command.userId, user.login, command.likeStatus);
    }
  }
}