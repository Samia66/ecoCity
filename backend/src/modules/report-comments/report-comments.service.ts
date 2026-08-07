import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ReportCommentsRepository } from './repositories/report-comments.repository';

import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

import {
  REPORT_COMMENT_ERRORS,
  REPORT_COMMENT_MESSAGES,
} from './constants/report-comments.constants';

import { ReportCommentsMapper } from './mappers/report-comments.mapper';

@Injectable()
export class ReportCommentsService {
  constructor(
    private readonly repository: ReportCommentsRepository,
  ) {}

  async create(
    dto: CreateCommentDto,
  ) {
    const comment =
      await this.repository.create({
        message: dto.content,

        report: {
          connect: {
            id: dto.reportId,
          },
        },

        author: {
          connect: {
            id: dto.authorId,
          },
        },
      });

    return ReportCommentsMapper.toResponse(
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
      ReportCommentsMapper.toResponse,
    );
  }

  async findById(id: string) {
    const comment =
      await this.repository.findById(id);

    if (!comment) {
      throw new NotFoundException(
        REPORT_COMMENT_ERRORS.NOT_FOUND,
      );
    }

    return comment;
  }

  async update(
    id: string,
    dto: UpdateCommentDto,
  ) {
    await this.findById(id);

    const comment =
      await this.repository.update(
        id,
        {
          message: dto.content,
        },
      );

    return ReportCommentsMapper.toResponse(
      comment,
    );
  }

  async delete(id: string) {
    await this.findById(id);

    await this.repository.delete(id);

    return {
      message:
        REPORT_COMMENT_MESSAGES.DELETED,
    };
  }
}