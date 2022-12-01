import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Comment, CommentDocument } from "./schemas/comments.schema";
import { UpdatePostDto } from "../posts/dto/update-post.dto";


@Injectable()
export class CommentsRepository {

  constructor(@InjectModel(Comment.name) private commentsModel: Model<CommentDocument>) {
  }

  async clearAll(): Promise<void> {
    await this.commentsModel.deleteMany({});
  }

  async deleteComment(commentId: string): Promise<Comment | null> {
    return this.commentsModel.findOneAndDelete({ id: commentId });
  }

  async findComment(commentId: string): Promise<Comment | null> {
    return this.commentsModel.findOne({ id: commentId });
  }

  async updatePost(commentId: string, updatePostDto: UpdatePostDto): Promise<Comment | null> {
    return this.commentsModel.findOneAndUpdate({ id: commentId }, updatePostDto);
  }

}