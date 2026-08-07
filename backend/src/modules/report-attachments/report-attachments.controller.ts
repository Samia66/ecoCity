import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Permissions } from '../auth/decorators/permissions.decorator';

import { ReportAttachmentsService } from './report-attachments.service';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { UploadAttachmentDto } from './dto/upload-attachment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('report-attachments')
@ApiBearerAuth('JWT')
@Controller('report-attachments')
@UseGuards(
  JwtAuthGuard,
  PermissionsGuard,
)
export class ReportAttachmentsController {
  constructor(
    private readonly service: ReportAttachmentsService,
  ) { }


  @Post()
  @Permissions('reports.update')
  create(
    @Body()
    dto: UploadAttachmentDto,
  ) {
    return this.service.create(dto);
  }

  @Get(':reportId')
  @Permissions('reports.read')
  findByReport(
    @Param('reportId')
    reportId: string,
  ) {
    return this.service.findByReport(
      reportId,
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