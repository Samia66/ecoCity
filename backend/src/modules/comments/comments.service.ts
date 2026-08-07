import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CommentsRepository } from './repositories/comments.repository';

import { CommentsMapper } from './mappers/comments.mapper';

import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    private readonly repository: CommentsRepository,
  ) {}

  async create(
    dto: CreateCommentDto,
    authorId: string,
  ) {
    const comment =
      await this.repository.create({
        message: dto.message,

        author: {
          connect: {
            id: authorId,
          },
        },

        report: {
          connect: {
            id: dto.reportId,
          },
        },
      });

    return CommentsMapper.toResponse(
      comment,
    );
  }

  async findByReport(
    reportId: string,
  ) {
    const comments =
      await this.repository.findByReport(
        reportId,
      );

    return comments.map(
      CommentsMapper.toResponse,
    );
  }

  async delete(id: string) {
    const comment =
      await this.repository.findById(id);

    if (!comment) {
      throw new NotFoundException(
        'Comment not found',
      );
    }

    await this.repository.delete(id);

    return {
      message:
        'Comment deleted successfully',
    };
  }
}