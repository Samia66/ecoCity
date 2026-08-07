import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ReportStatus } from '@prisma/client';

import { ReportsRepository } from './repositories/reports.repository';

import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { AssignReportDto } from './dto/assign-report.dto';
import { QueryReportsDto } from './dto/query-reports.dto';
import { UpdateReportStatusDto } from './dto/update-report-status.dto';
import { ReportsMapper } from './mappers/reports.mapper';
import { REPORT_ERRORS, REPORT_MESSAGES } from './constants/reports.constants';

@Injectable()
export class ReportsService {
  constructor(
    private readonly repository: ReportsRepository,
  ) { }

 async create(dto: CreateReportDto) {
  await this.validateReportCreation(dto);

  const report = await this.repository.create({
    reference: this.generateReference(),

    title: dto.title,
    description: dto.description,

    latitude: dto.latitude,
    longitude: dto.longitude,

    address: dto.address,
    district: dto.district,
    city: dto.city,

    organization: {
      connect: {
        id: dto.organizationId,
      },
    },

    category: {
      connect: {
        id: dto.categoryId,
      },
    },

    author: {
      connect: {
        id: dto.authorId,
      },
    },
  });

  return ReportsMapper.toResponse(report);
}

  private generateReference(): string {
    return `REP-${Date.now()}`;
  }

  async findAll(query: QueryReportsDto) {
    const skip =
      (query.page - 1) * query.limit;

    const [reports, total] =
      await Promise.all([
        this.repository.findAll({
          skip,
          take: query.limit,
          search: query.search,
          status: query.status,
        }),

        this.repository.count({
          search: query.search,
          status: query.status,
        }),
      ]);

    return {
      data: reports.map(
        ReportsMapper.toResponse,
      ),

      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(
          total / query.limit,
        ),
      },
    };
  }

  async findById(id: string) {
    const report =
      await this.repository.findById(id);

    if (!report) {
      throw new NotFoundException(
        REPORT_ERRORS.NOT_FOUND,
      );
    }

    return ReportsMapper.toResponse(report);
  }

  async update(
    id: string,
    dto: UpdateReportDto,
  ) {
    await this.findById(id);

    return this.repository.update(
      id,
      dto,
    );
  }

  async assignAgent(
    reportId: string,
    dto: AssignReportDto,
  ) {
    await this.findById(reportId);

    return this.repository.assignAgent(
      reportId,
      dto.agentId,
    );
  }

  async updateStatus(
    reportId: string,
    dto: UpdateReportStatusDto,
  ) {
    const report =
      await this.findById(reportId);

    if (
      report.status ===
      ReportStatus.RESOLVED &&
      dto.status !==
      ReportStatus.CLOSED
    ) {
      throw new BadRequestException(
        REPORT_ERRORS.INVALID_STATUS,);
    }

    return this.repository.updateStatus(
      reportId,
      dto.status,
    );
  }

  async delete(id: string) {
    await this.findById(id);

    await this.repository.delete(id);

    return {
      message:
        REPORT_MESSAGES.DELETED,
    };
  }


  private async validateReportCreation(
    dto: CreateReportDto,
  ) {
    const [
      organization,
      category,
      author,
    ] = await Promise.all([
      this.repository.organizationExists(
        dto.organizationId,
      ),

      this.repository.categoryExists(
        dto.categoryId,
      ),

      this.repository.userExists(
        dto.authorId,
      ),
    ]);

    if (!organization) {
      throw new NotFoundException(
        REPORT_ERRORS.ORGANIZATION_NOT_FOUND,
      );
    }

    if (!category) {
      throw new NotFoundException(
        REPORT_ERRORS.CATEGORY_NOT_FOUND,
      );
    }

    if (!author) {
      throw new NotFoundException(
        REPORT_ERRORS.AUTHOR_NOT_FOUND,
      );
    }
  }



  
}