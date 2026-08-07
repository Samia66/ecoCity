import { Prisma } from '@prisma/client';

type CommentWithRelations =
  Prisma.ReportCommentGetPayload<{
    include: {
      author: true;
    };
  }>;

export class CommentsMapper {
  static toResponse(
    comment: CommentWithRelations,
  ) {
    return {
      id: comment.id,

      message: comment.message,

      author: `${comment.author.firstName} ${comment.author.lastName}`,

      createdAt: comment.createdAt,
    };
  }
}