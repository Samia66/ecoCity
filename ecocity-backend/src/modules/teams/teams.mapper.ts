import { Injectable } from '@nestjs/common';
import { TeamWithRelations } from './teams.repository';

/** Correspond exactement à `TeamMember` côté Angular. */
export interface TeamMemberDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

/** Correspond exactement à `Team` côté Angular (`features/teams/models/team.model.ts`). */
export interface TeamDto {
  id: string;
  name: string;
  description?: string | null;
  zoneId?: string | null;
  zoneName?: string | null;
  members: TeamMemberDto[];
  createdAt: string;
}

@Injectable()
export class TeamsMapper {
  toDto(team: TeamWithRelations): TeamDto {
    return {
      id: team.id,
      name: team.name,
      description: team.description,
      zoneId: team.zoneId,
      zoneName: team.zone?.name ?? null,
      members: team.members.map((m) => this.toMemberDto(m)),
      createdAt: team.createdAt.toISOString(),
    };
  }

  toDtoList(teams: TeamWithRelations[]): TeamDto[] {
    return teams.map((t) => this.toDto(t));
  }

  toMemberDto(member: { agentId: string; agentName: string; agentEmail: string }): TeamMemberDto {
    const [firstName, ...rest] = member.agentName.split(' ');
    return {
      id: member.agentId,
      firstName: firstName ?? member.agentName,
      lastName: rest.join(' '),
      email: member.agentEmail,
    };
  }
}
