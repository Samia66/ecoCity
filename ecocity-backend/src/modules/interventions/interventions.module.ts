import { Module } from '@nestjs/common';
import { ReportsModule } from '../reports/reports.module';
import { InterventionsController } from './interventions.controller';
import { InterventionsService } from './interventions.service';
import { InterventionsRepository } from './interventions.repository';
import { InterventionsMapper } from './interventions.mapper';

@Module({
  imports: [ReportsModule],
  controllers: [InterventionsController],
  providers: [InterventionsService, InterventionsRepository, InterventionsMapper],
  exports: [InterventionsService, InterventionsRepository, InterventionsMapper],
})
export class InterventionsModule {}
