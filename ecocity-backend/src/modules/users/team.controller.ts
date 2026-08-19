import { Controller, Get, Param } from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { RoleName } from '../../common/constants/roles.constant';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { UsersService } from './users.service';

/**
 * Vue "mon équipe" consommée par l'app Flutter (rôle TEAM_LEADER) :
 * `/team/agents`, `/team/agents/:id`, `/team/stats`.
 */
@Controller('team')
@Roles(RoleName.TEAM_LEADER, RoleName.SUPER_ADMIN, RoleName.ADMIN)
export class TeamController {
  constructor(private readonly usersService: UsersService) {}

  @Get('agents')
  getAgents(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.getMyTeamAgentsWithStats(user.userId);
  }

  @Get('agents/:id')
  getAgent(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.usersService.getMyTeamAgentDetail(user.userId, id);
  }

  @Get('stats')
  getStats(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.getMyTeamStats(user.userId);
  }
}
