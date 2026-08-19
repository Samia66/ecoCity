import { Controller, Get, Param } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RoleName } from '../../common/constants/roles.constant';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { TeamsService } from './teams.service';

/**
 * Vue "mon équipe" consommée par l'app Flutter (rôle TEAM_LEADER) :
 * `/team/agents`, `/team/agents/:id`, `/team/stats`, `/team/zones`.
 */
@Controller('team')
@Roles(RoleName.TEAM_LEADER, RoleName.SUPER_ADMIN, RoleName.ADMIN)
export class MyTeamController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get('agents')
  getAgents(@CurrentUser() user: AuthenticatedUser) {
    return this.teamsService.getMyAgents(user);
  }

  @Get('agents/:id')
  getAgent(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.teamsService.getMyAgentDetail(user, id);
  }

  @Get('stats')
  getStats(@CurrentUser() user: AuthenticatedUser) {
    return this.teamsService.getMyStats(user);
  }

  @Get('zones')
  getZones(@CurrentUser() user: AuthenticatedUser) {
    return this.teamsService.getMyZones(user);
  }
}
