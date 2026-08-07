import { Injectable } from '@nestjs/common';
import {
  InterventionStatus,
  Prisma,
} from '@prisma/client';

import { PrismaService } from '../../../infrastructure/prisma/prisma.service';

@Injectable()
export class InterventionsRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    data: Prisma.InterventionCreateInput,
  ) {
    return this.prisma.intervention.create({
      data,

      include: {
        report: true,
        agent: true,
      },
    });
  }

  async findAll() {
    return this.prisma.intervention.findMany({
      include: {
        report: true,
        agent: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(
    id: string,
  ) {
    return this.prisma.intervention.findUnique({
      where: {
        id,
      },

      include: {
        report: true,
        agent: true,
      },
    });
  }

  async update(
    id: string,
    data: Prisma.InterventionUpdateInput,
  ) {
    return this.prisma.intervention.update({
      where: {
        id,
      },

      data,

      include: {
        report: true,
        agent: true,
      },
    });
  }

  async updateStatus(
    id: string,
    status: InterventionStatus,
  ) {
    return this.prisma.intervention.update({
      where: {
        id,
      },

      data: {
        status,

        ...(status ===
          InterventionStatus.PENDING && {
          startedAt: new Date(),
        }),

        ...(status ===
          InterventionStatus.COMPLETED && {
          completedAt: new Date(),
        }),
      },

      include: {
        report: true,
        agent: true,
      },
    });
  }

  async delete(
    id: string,
  ) {
    return this.prisma.intervention.delete({
      where: {
        id,
      },
    });
  }

  async reportExists(
    id: string,
  ) {
    return this.prisma.report.findUnique({
      where: {
        id,
      },
    });
  }

  async agentExists(
    id: string,
  ) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }
}