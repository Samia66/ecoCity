import { Injectable } from '@nestjs/common';
import { ZoneWithRelations } from './zones.repository';

export interface ZoneDto {
  id: string;
  name: string;
  description?: string | null;
  agentsCount: number;
  /** Nombre d'équipes de terrain actuellement affectées à cette zone. */
  teamsCount: number;
  reportsCount: number;
  agents: { agentId: string; agentName: string }[];
  createdAt: string;
}

@Injectable()
export class ZonesMapper {
  toDto(zone: ZoneWithRelations): ZoneDto {
    return {
      id: zone.id,
      name: zone.name,
      description: zone.description,
      agentsCount: zone._count.assignments,
      teamsCount: zone._count.teams,
      reportsCount: zone._count.reports,
      agents: zone.assignments.map((a) => ({ agentId: a.agentId, agentName: a.agentName })),
      createdAt: zone.createdAt.toISOString(),
    };
  }

  toDtoList(zones: ZoneWithRelations[]): ZoneDto[] {
    return zones.map((z) => this.toDto(z));
  }
}
