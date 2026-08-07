import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../infrastructure/prisma/prisma.service';

@Injectable()
export class CommentsRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    data: Prisma.ReportCommentCreateInput,
  ) {
    return this.prisma.reportComment.create({
      data,
      include: {
        author: true,
        report: true,
      },
    });
  }

  async findByReport(
    reportId: string,
  ) {
    return this.prisma.reportComment.findMany({
      where: {
        reportId,
      },

      include: {
        author: true,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async findById(id: string) {
    return this.prisma.reportComment.findUnique({
      where: {
        id,
      },
      include: {
        author: true,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.reportComment.delete({
      where: {
        id,
      },
    });
  }
}