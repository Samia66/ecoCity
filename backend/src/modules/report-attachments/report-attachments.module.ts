import { Module } from '@nestjs/common';

import { ReportAttachmentsController } from './report-attachments.controller';
import { ReportAttachmentsService } from './report-attachments.service';
import { ReportAttachmentsRepository } from './repositories/report-attachments.repository';

@Module({
  controllers: [
    ReportAttachmentsController,
  ],
  providers: [
    ReportAttachmentsService,
    ReportAttachmentsRepository,
  ],
})
export class ReportAttachmentsModule {}