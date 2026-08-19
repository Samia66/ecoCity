import { Injectable } from '@nestjs/common';
import { ZoneWithRelations } from './zones.repository';

export interface ZoneDto {
  id: string;
  name: string;
  description?: string | null;
  /** Équipes actuellement responsables de la collecte dans cette zone. */
  teams: { id: string; name: string }[];
  teamsCount: number;
  reportsCount: number;
  createdAt: string;
}

@Injectable()
export class ZonesMapper {
  toDto(zone: ZoneWithRelations): ZoneDto {
    return {
      id: zone.id,
      name: zone.name,
      description: zone.description,
      teams: zone.teamZones.map((tz) => ({ id: tz.team.id, name: tz.team.name })),
      teamsCount: zone._count.teamZones,
      reportsCount: zone._count.reports,
      createdAt: zone.createdAt.toISOString(),
    };
  }

  toDtoList(zones: ZoneWithRelations[]): ZoneDto[] {
    return zones.map((z) => this.toDto(z));
  }
}
