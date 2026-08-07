import { Module } from '@nestjs/common';

import { ReportsRepository } from './repositories/reports.repository';
import { ReportsController } from './report.controller';
import { ReportsService } from './report.service';

@Module({
  controllers: [
    ReportsController,
  ],

  providers: [
    ReportsService,
    ReportsRepository,
  ],
})
export class ReportsModule {}