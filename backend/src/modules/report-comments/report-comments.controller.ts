import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { ReportCommentsService } from './report-comments.service';

import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

@Controller('report-comments')
@UseGuards(
  JwtAuthGuard,
  PermissionsGuard,
)
export class ReportCommentsController {
  constructor(
    private readonly service: ReportCommentsService,
  ) {}

  @Post()
  @Permissions('reports.update')
  create(
    @Body()
    dto: CreateCommentDto,
  ) {
    return this.service.create(dto);
  }

  @Get('report/:reportId')
  @Permissions('reports.read')
  findByReport(
    @Param('reportId')
    reportId: string,
  ) {
    return this.service.findByReport(
      reportId,
    );
  }

  @Patch(':id')
  @Permissions('reports.update')
  update(
    @Param('id')
    id: string,

    @Body()
    dto: UpdateCommentDto,
  ) {
    return this.service.update(
      id,
      dto,
    );
  }

  @Delete(':id')
  @Permissions('reports.update')
  delete(
    @Param('id')
    id: string,
  ) {
    return this.service.delete(id);
  }
}