import { Injectable } from '@nestjs/common';
import {
  Prisma,
  ReportStatus,
} from '@prisma/client';

import { PrismaService } from '../../../infrastructure/prisma/prisma.service';

@Injectable()
export class ReportsRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(
    data: Prisma.ReportCreateInput,
  ) {
    return this.prisma.report.create({
      data,

      include: {
        organization: true,
        category: true,
        author: true,
        assignedTo: true,
        attachments: true,
      },
    });
  }

  async findAll(params: {
    skip: number;
    take: number;
    search?: string;
    status?: ReportStatus;
    organizationId?: string;
  }) {
    return this.prisma.report.findMany({
      skip: params.skip,
      take: params.take,

      where: {
        deletedAt: null,

        ...(params.organizationId && {
          organizationId: params.organizationId,
        }),

        ...(params.status && {
          status: params.status,
        }),

        ...(params.search && {
          OR: [
            {
              title: {
                contains: params.search,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: params.search,
                mode: 'insensitive',
              },
            },
            {
              reference: {
                contains: params.search,
                mode: 'insensitive',
              },
            },
          ],
        }),
      },

      include: {
        category: true,
        author: true,
        assignedTo: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async count(params: {
    search?: string;
    status?: ReportStatus;
    organizationId?: string;
  }) {
    return this.prisma.report.count({
      where: {
        deletedAt: null,

        ...(params.organizationId && {
          organizationId: params.organizationId,
        }),

        ...(params.status && {
          status: params.status,
        }),

        ...(params.search && {
          OR: [
            {
              title: {
                contains: params.search,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: params.search,
                mode: 'insensitive',
              },
            },
            {
              reference: {
                contains: params.search,
                mode: 'insensitive',
              },
            },
          ],
        }),
      },
    });
  }

  async findById(id: string) {
    return this.prisma.report.findFirst({
      where: {
        id,
        deletedAt: null,
      },

      include: {
        organization: true,
        category: true,
        author: true,
        assignedTo: true,
        attachments: true,
        comments: {
          include: {
            author: true,
          },
        },
        interventions: {
          include: {
            agent: true,
          },
        },
      },
    });
  }

  async assignAgent(
    reportId: string,
    agentId: string,
  ) {
    return this.prisma.report.update({
      where: {
        id: reportId,
      },

      data: {
        assignedTo: {
          connect: {
            id: agentId,
          },
        },
        status: ReportStatus.ASSIGNED,
      },
    });
  }

  async updateStatus(
    reportId: string,
    status: ReportStatus,
  ) {
    return this.prisma.report.update({
      where: {
        id: reportId,
      },

      data: {
        status,

        ...(status === ReportStatus.RESOLVED && {
          resolvedAt: new Date(),
        }),
      },
    });
  }

  async update(
    id: string,
    data: Prisma.ReportUpdateInput,
  ) {
    return this.prisma.report.update({
      where: {
        id,
      },

      data,

      include: {
        category: true,
        author: true,
        assignedTo: true,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.report.update({
      where: {
        id,
      },

      data: {
        deletedAt: new Date(),
      },
    });
  }

  async organizationExists(
  id: string,
) {
  return this.prisma.organization.findUnique({
    where: {
      id,
    },
  });
}

async categoryExists(
  id: string,
) {
  return this.prisma.category.findFirst({
    where: {
      id,
      deletedAt: null,
    },
  });
}

async userExists(
  id: string,
) {
  return this.prisma.user.findUnique({
    where: {
      id,
      deletedAt: null,
    },
  });
}

}