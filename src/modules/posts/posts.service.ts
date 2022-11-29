import { Injectable } from "@nestjs/common";
import { PostsRepository } from "./posts.repository";
import { InputPostDto } from "./dto/input-post.dto";
import { ViewPostDto } from "./dto/view-post.dto";
import PostMapper from "./dto/postsMapper";
import { BlogsService } from "../blogs/blogs.service";
import { Post } from "./schemas/posts.schema";
import { PaginationParams } from "../../commonDto/paginationParams.dto";
import { PaginatorDto } from "../../commonDto/paginator.dto";
import { InputBlogPostDto } from "./dto/input-blog-post.dto";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";


//////////////////////////////////////////////////////////////
export class ClearAllPostsCommand {
  constructor() {
  }
}

@CommandHandler(ClearAllPostsCommand)
export class ClearAllPostsCase implements ICommandHandler<ClearAllPostsCommand> {
  constructor(protected postsRepository: PostsRepository) {
  }

  async execute(command: ClearAllPostsCommand) {
    await this.postsRepository.clearAll();
  }
}

//////////////////////////////////////////////////////////////
@Injectable()
export class PostsService {

  constructor(
    protected postsRepository: PostsRepository,
    private blogsService: BlogsService
  ) {
  }


  async deletePost(postId: string): Promise<Post | null> {
    return this.postsRepository.deletePost(postId);
  }


  async createPost(inputPost: InputPostDto): Promise<ViewPostDto> {
    let blogName = "";
    const blog = await this.blogsService.getOneBlog(inputPost.blogId);
    if (blog) {
      blogName = blog.name;
    }

    const post = await this.postsRepository.createPost(PostMapper.fromInputToCreate(inputPost, blogName));
    return PostMapper.fromModelToView(post);
  }


  async updatePost(postId: string, inputPost: InputPostDto): Promise<Post | null> {
    let blogName = "";
    const blog = await this.blogsService.getOneBlog(inputPost.blogId);
    if (blog) {
      blogName = blog.name;
    }
    return this.postsRepository.updatePost(postId, PostMapper.fromUpdateToCreate(inputPost, blogName));
  }


  async createPostByBlogId(blogId: string, inputPost: InputBlogPostDto): Promise<ViewPostDto | null> {
    const blog = await this.blogsService.getOneBlog(blogId);
    if (!blog) {
      return null;
    }

    const post = await this.postsRepository.createPost(PostMapper.fromInputToCreate({
      ...inputPost,
      blogId
    }, blog.name));
    return PostMapper.fromModelToView(post);
  }


  async getOnePost(postId: string): Promise<ViewPostDto | null> {
    const post = await this.postsRepository.getOnePost(postId);
    if (post) {
      return PostMapper.fromModelToView(post);
    }
    return null;
  }


  async getAllPosts(paginationParams: PaginationParams): Promise<PaginatorDto<ViewPostDto[]>> {
    const result = await this.postsRepository.getAllPosts(paginationParams);
    return PostMapper.fromModelsToPaginator(result);
  }

  async getAllPostsByBlogId(blogId: string, paginationParams: PaginationParams): Promise<PaginatorDto<ViewPostDto[]>> {
    const result = await this.postsRepository.getAllPosts(paginationParams, blogId);
    return PostMapper.fromModelsToPaginator(result);
  }

}
