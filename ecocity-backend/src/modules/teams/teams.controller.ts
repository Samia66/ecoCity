import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { PermissionCode } from '../../common/constants/permissions.constant';
import { RoleName } from '../../common/constants/roles.constant';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { AddTeamMemberDto } from './dto/add-team-member.dto';
import { AssignTeamZoneDto } from './dto/assign-team-zone.dto';

@Controller('teams')
@Roles(RoleName.SUPER_ADMIN, RoleName.ADMIN, RoleName.TEAM_LEADER, RoleName.AGENT)
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.teamsService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.teamsService.findById(id, user);
  }

  @Post()
  @RequirePermissions(PermissionCode.TEAMS_MANAGE)
  create(@Body() dto: CreateTeamDto, @CurrentUser() user: AuthenticatedUser) {
    return this.teamsService.create(dto, user);
  }

  @Patch(':id')
  @RequirePermissions(PermissionCode.TEAMS_MANAGE)
  update(@Param('id') id: string, @Body() dto: UpdateTeamDto, @CurrentUser() user: AuthenticatedUser) {
    return this.teamsService.update(id, dto, user);
  }

  @Delete(':id')
  @RequirePermissions(PermissionCode.TEAMS_MANAGE)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.teamsService.remove(id, user);
  }

  // --- Membres -------------------------------------------------------

  @Get(':id/members')
  getMembers(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.teamsService.getMembers(id, user);
  }

  @Post(':id/members')
  @RequirePermissions(PermissionCode.TEAMS_MANAGE)
  addMember(
    @Param('id') id: string,
    @Body() dto: AddTeamMemberDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.teamsService.addMember(id, dto.agentId, user);
  }

  @Delete(':id/members/:agentId')
  @RequirePermissions(PermissionCode.TEAMS_MANAGE)
  @HttpCode(HttpStatus.NO_CONTENT)
  removeMember(
    @Param('id') id: string,
    @Param('agentId') agentId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.teamsService.removeMember(id, agentId, user);
  }

  // --- Affectation de zone ---------------------------------------------

  @Post(':id/zone')
  @RequirePermissions(PermissionCode.TEAMS_MANAGE)
  assignZone(
    @Param('id') id: string,
    @Body() dto: AssignTeamZoneDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.teamsService.assignZone(id, dto, user);
  }

  @Delete(':id/zone')
  @RequirePermissions(PermissionCode.TEAMS_MANAGE)
  @HttpCode(HttpStatus.NO_CONTENT)
  unassignZone(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.teamsService.unassignZone(id, user);
  }
}
