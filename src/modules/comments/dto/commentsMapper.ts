import { InputCommentDto } from "./input-comment.dto";
import { UpdateCommentDto } from "./update-comment.dto";
import { Comment } from "../schemas/comments.schema";
import { ViewCommentDto } from "./view-comment.dto";
import { LikesInfoDto } from "../../../commonDto/likesInfoDto";

export default class CommentsMapper {

  static fromInputToUpdate(inputComment: InputCommentDto): UpdateCommentDto {
    const updatedComment = new UpdateCommentDto();
    updatedComment.content = inputComment.content;
    return updatedComment;
  }

  static fromModelToView(comment: Comment, likes: LikesInfoDto): ViewCommentDto {
    const viewComment = new ViewCommentDto();
    viewComment.id = comment.id;
    viewComment.content = comment.content;
    viewComment.userId = comment.userId;
    viewComment.userLogin = comment.userLogin;
    viewComment.createdAt = comment.createdAt;
    viewComment.likesInfo = likes;
    return viewComment;
  }


}