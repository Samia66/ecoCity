import { Injectable } from '@nestjs/common';
import { TeamWithRelations } from './teams.repository';
import { DayOfWeek, TeamStatus } from '@prisma/client';

/** Correspond exactement à `TeamMember` côté Angular. */
export interface TeamMemberDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'LEADER' | 'AGENT';
}

export interface TeamZoneDto {
  id: string;
  name: string;
}

/** Correspond exactement à `Team` côté Angular (`features/teams/models/team.model.ts`). */
export interface TeamDto {
  id: string;
  name: string;
  description?: string | null;
  status: TeamStatus;
  leaderId?: string | null;
  leaderName?: string | null;
  members: TeamMemberDto[];
  zones: TeamZoneDto[];
  scheduleDays: DayOfWeek[];
  createdAt: string;
}

@Injectable()
export class TeamsMapper {
  toDto(team: TeamWithRelations, scheduleDays: DayOfWeek[] = []): TeamDto {
    const leader = team.members.find((m) => m.role === 'LEADER');

    return {
      id: team.id,
      name: team.name,
      description: team.description,
      status: team.status,
      leaderId: leader?.agentId ?? null,
      leaderName: leader?.agentName ?? null,
      members: team.members.map((m) => this.toMemberDto(m)),
      zones: team.teamZones.map((tz) => ({ id: tz.zone.id, name: tz.zone.name })),
      scheduleDays,
      createdAt: team.createdAt.toISOString(),
    };
  }

  toDtoList(teams: TeamWithRelations[]): TeamDto[] {
    return teams.map((t) => this.toDto(t));
  }

  toMemberDto(member: { agentId: string; agentName: string; agentEmail: string; role: 'LEADER' | 'AGENT' }): TeamMemberDto {
    const [firstName, ...rest] = member.agentName.split(' ');
    return {
      id: member.agentId,
      firstName: firstName ?? member.agentName,
      lastName: rest.join(' '),
      email: member.agentEmail,
      role: member.role,
    };
  }
}
