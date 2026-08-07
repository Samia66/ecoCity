import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';


import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { AssignReportDto } from './dto/assign-report.dto';
import { QueryReportsDto } from './dto/query-reports.dto';
import { Permissions } from '../auth/decorators/permissions.decorator';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { ReportsService } from './report.service';
import { UpdateReportStatusDto } from './dto/update-report-status.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('reports')
@ApiBearerAuth('JWT')
@Controller('reports')
@UseGuards(
  JwtAuthGuard,
  PermissionsGuard,
)
export class ReportsController {
  constructor(
    private readonly service: ReportsService,
  ) { }

  @Post()
  @Permissions('reports.create')
  create(
    @Body()
    dto: CreateReportDto,
  ) {
    return this.service.create(dto);
  }

  @Get()
  @Permissions('reports.read')
  findAll(
    @Query()
    query: QueryReportsDto,
  ) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @Permissions('reports.read')
  findById(
    @Param('id')
    id: string,
  ) {
    return this.service.findById(id);
  }

  @Patch(':id')
  @Permissions('reports.update')
  update(
    @Param('id')
    id: string,

    @Body()
    dto: UpdateReportDto,
  ) {
    return this.service.update(
      id,
      dto,
    );
  }

  @Patch(':id/assign')
  @Permissions('reports.assign')
  assign(
    @Param('id')
    id: string,

    @Body()
    dto: AssignReportDto,
  ) {
    return this.service.assignAgent(
      id,
      dto,
    );
  }

  @Patch(':id/status')
  @Permissions('reports.resolve')
  updateStatus(
    @Param('id')
    id: string,

    @Body()
    dto: UpdateReportStatusDto,
  ) {
    return this.service.updateStatus(
      id,
      dto,
    );
  }

  @Delete(':id')
  @Permissions('reports.delete')
  delete(
    @Param('id')
    id: string,
  ) {
    return this.service.delete(id);
  }
}