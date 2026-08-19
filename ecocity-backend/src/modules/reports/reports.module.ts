import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { ReportsRepository } from './reports.repository';
import { ReportsMapper } from './reports.mapper';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService, ReportsRepository, ReportsMapper],
  exports: [ReportsService, ReportsRepository],
})
export class ReportsModule {}
