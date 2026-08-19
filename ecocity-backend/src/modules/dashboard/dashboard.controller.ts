import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RoleName } from '../../common/constants/roles.constant';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('citizen')
  @Roles(RoleName.CITIZEN)
  getCitizenDashboard(@CurrentUser() user: AuthenticatedUser) {
    return this.dashboardService.getCitizenDashboard(user);
  }

  @Get('agent')
  @Roles(RoleName.AGENT)
  getAgentDashboard(@CurrentUser() user: AuthenticatedUser) {
    return this.dashboardService.getAgentDashboard(user);
  }

  @Get('team-leader')
  @Roles(RoleName.TEAM_LEADER)
  getTeamLeaderDashboard(@CurrentUser() user: AuthenticatedUser) {
    return this.dashboardService.getTeamLeaderDashboard(user);
  }

  /**
   * Vue globale (back-office). Alias `''` conservé pour l'Angular existant
   * qui appelle `GET /dashboard` directement.
   */
  @Get(['overview', ''])
  @Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN)
  getOverview(@CurrentUser() user: AuthenticatedUser) {
    return this.dashboardService.getOverview(user);
  }
}
