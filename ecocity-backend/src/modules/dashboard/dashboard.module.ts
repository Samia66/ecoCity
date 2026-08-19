import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { InterventionsModule } from '../interventions/interventions.module';
import { TeamsModule } from '../teams/teams.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { DashboardRepository } from './dashboard.repository';

@Module({
  imports: [UsersModule, InterventionsModule, TeamsModule],
  controllers: [DashboardController],
  providers: [DashboardService, DashboardRepository],
})
export class DashboardModule {}
