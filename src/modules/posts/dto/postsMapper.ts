import uid from "../../../utils/IdGenerator";
import { PaginatorDto } from "../../../commonDto/paginator.dto";
import { CreatePostDto } from "./create-post.dto";
import dateAt from "../../../utils/DateGenerator";
import { InputPostDto } from "./input-post.dto";
import { ViewPostDto } from "./view-post.dto";
import { Post } from "../schemas/posts.schema";
import { ExtendedLikesInfoDto } from "../../../commonDto/extendedLikesInfoDto";


export default class PostMapper {

  static fromInputToCreate(inputPost: InputPostDto, blogName:string): CreatePostDto {
    const createdPost =  new CreatePostDto();
    createdPost.id = uid();
    console.log(createdPost.id);
    createdPost.title = inputPost.title;
    createdPost.shortDescription = inputPost.shortDescription;
    createdPost.content = inputPost.content;
    createdPost.blogId = inputPost.blogId;
    createdPost.blogName = blogName;
    createdPost.createdAt = dateAt();
    return createdPost
  }


  static fromModelToView(post: Post): ViewPostDto {
    const viewPost = new ViewPostDto();
    viewPost.id = post.id;
    viewPost.title = post.title;
    viewPost.shortDescription = post.shortDescription;
    viewPost.content = post.content;
    viewPost.blogId = post.blogId;
    viewPost.blogName = post.blogName;
    viewPost.createdAt = post.createdAt;
    //viewPost.extendedLikesInfo = new ExtendedLikesInfoDto();
    return viewPost;
  }


  static fromModelsToPaginator(posts: PaginatorDto<Post[]>): PaginatorDto<ViewPostDto[]> {
    return {
      pagesCount: posts.pagesCount,
      page: posts.page,
      pageSize: posts.pageSize,
      totalCount: posts.totalCount,
      items: posts.items.map(post => PostMapper.fromModelToView(post))
    }
  }

}