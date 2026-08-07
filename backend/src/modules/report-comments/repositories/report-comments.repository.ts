import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../infrastructure/prisma/prisma.service';

@Injectable()
export class ReportCommentsRepository {
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
    });
  }

  async update(
    id: string,
    data: Prisma.ReportCommentUpdateInput,
  ) {
    return this.prisma.reportComment.update({
      where: {
        id,
      },

      data,

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