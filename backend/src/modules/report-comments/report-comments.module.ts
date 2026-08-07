import { Module } from '@nestjs/common';

import { ReportCommentsController } from './report-comments.controller';
import { ReportCommentsService } from './report-comments.service';
import { ReportCommentsRepository } from './repositories/report-comments.repository';

@Module({
  controllers: [
    ReportCommentsController,
  ],
  providers: [
    ReportCommentsService,
    ReportCommentsRepository,
  ],
})
export class ReportCommentsModule {}