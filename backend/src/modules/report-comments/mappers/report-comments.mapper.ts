import { ReportComment } from '@prisma/client';

export class ReportCommentsMapper {
  static toResponse(
    comment: ReportComment,
  ) {
    return {
      id: comment.id,

      reportId: comment.reportId,

      authorId: comment.authorId,

      content: comment.message,

      createdAt: comment.createdAt,

      updatedAt: comment.updatedAt,
    };
  }
}