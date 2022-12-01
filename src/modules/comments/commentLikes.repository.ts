import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CommentLike, CommentLikeDocument } from "./schemas/comment-likes.schema";

@Injectable()
export class CommentLikesRepository {

  constructor(@InjectModel(CommentLike.name) private commentsModel: Model<CommentLikeDocument>) {
  }

  async clearAll(): Promise<void> {
    await this.commentsModel.deleteMany({});
  }



}