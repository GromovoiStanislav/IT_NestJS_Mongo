import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { MongooseModule } from "@nestjs/mongoose";
import { Comment, CommentSchema } from "./schemas/comments.schema";
import { CommentLike, CommentLikeSchema } from "./schemas/comment-likes.schema";
import { CommentsRepository } from "./comments.repository";
import { CommentLikesRepository } from "./commentLikes.repository";

const useCases = [];

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: CommentLike.name, schema: CommentLikeSchema }
    ])
  ],
  controllers: [],
  providers: [...useCases, CommentsRepository, CommentLikesRepository]
})

export class CommentsModule {
}