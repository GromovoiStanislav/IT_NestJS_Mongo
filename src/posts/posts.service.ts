import { Injectable } from "@nestjs/common";
import { PostsRepository } from "./posts.repository";
import { InputPostDto } from "./dto/input-post.dto";
import { ViewPostDto } from "./dto/view-post.dto";
import PostMapper from "./dto/postsMapper";
import { BlogsService } from "../blogs/blogs.service";
import { ExtendedLikesInfoDto } from "../commonDto/extendedLikesInfoDto";
import { Post } from "./schemas/posts.schema";
import { PaginationParams } from "../commonDto/paginationParams.dto";
import { PaginatorDto } from "../commonDto/paginator.dto";


@Injectable()
export class PostsService {

  constructor(
    protected postsRepository: PostsRepository,
    private blogsService: BlogsService
  ) {
  }


  async clearAllPosts(): Promise<void> {
    await this.postsRepository.clearAll();
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


  async getOnePost(postId: string): Promise<ViewPostDto | null> {
    const post = await this.postsRepository.getOnePost(postId);
    if (post) {

      return PostMapper.fromModelToView(post);
    }
    return null;
  }


  async getAllPosts(paginationParams: PaginationParams): Promise<PaginatorDto<ViewPostDto[]>> {
    const result = await this.postsRepository.getAllPosts(paginationParams);
    return PostMapper.fromModelsToPaginator(result)
  }

}
