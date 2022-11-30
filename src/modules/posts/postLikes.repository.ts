import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PostLike, PostLikeDocument } from "./schemas/post-likes.schema";


@Injectable()
export class PostLikesRepository {

  constructor(@InjectModel(PostLike.name) private postLikeModel: Model<PostLikeDocument>) {
  }


  async clearAll(): Promise<void> {
    await this.postLikeModel.deleteMany({});
  }

  async deleteByPostIDUserID(postId: string, userId: string): Promise<void> {
    await this.postLikeModel.deleteMany({ postId, userId });
  }


  async updateLikeByID(postId: string, userId: string, userLogin: string, likeStatus: string): Promise<void> {
    const addedAt = new Date().toISOString();
    await this.postLikeModel.findOneAndUpdate({ postId, userId },
      {
        likeStatus,
        userLogin,
        addedAt
      }, { upsert: true });
  }


}