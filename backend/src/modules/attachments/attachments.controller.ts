import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import {
  RoleName,
} from '@prisma/client';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

import { AttachmentsService } from './attachments.service';
import { DEFAULT_ROLE } from '../auth/constants/auth.roles';

@Controller('attachments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttachmentsController {
  constructor(
    private readonly service: AttachmentsService,
  ) {}

  @Post(':reportId')
  @Roles(
    DEFAULT_ROLE,
    RoleName.AGENT,
    RoleName.ADMIN,
  )
  @UseInterceptors(
    FileInterceptor('file'),
  )
  upload(
    @Param('reportId') reportId: string,

    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.service.upload(
      reportId,
      file,
    );
  }

  @Get(':reportId')
  findByReport(
    @Param('reportId') reportId: string,
  ) {
    return this.service.findByReport(
      reportId,
    );
  }

  @Delete(':id')
  @Roles(
    RoleName.ADMIN,
    RoleName.SUPER_ADMIN,
  )
  delete(
    @Param('id') id: string,
  ) {
    return this.service.delete(id);
  }
}