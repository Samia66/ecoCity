import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { InterventionsModule } from '../interventions/interventions.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { DashboardRepository } from './dashboard.repository';

@Module({
  imports: [UsersModule, InterventionsModule],
  controllers: [DashboardController],
  providers: [DashboardService, DashboardRepository],
})
export class DashboardModule {}
