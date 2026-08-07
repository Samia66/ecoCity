import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../../infrastructure/prisma/prisma.service';

@Injectable()
export class AttachmentsRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    data: Prisma.ReportAttachmentCreateInput,
  ) {
    return this.prisma.reportAttachment.create({
      data,
      include: {
        report: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.reportAttachment.findUnique({
      where: {
        id,
      },
      include: {
        report: true,
      },
    });
  }

  async findByReport(reportId: string) {
    return this.prisma.reportAttachment.findMany({
      where: {
        reportId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async delete(id: string) {
    return this.prisma.reportAttachment.delete({
      where: {
        id,
      },
    });
  }
}