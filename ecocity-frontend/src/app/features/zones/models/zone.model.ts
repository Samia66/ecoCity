export interface ZoneTeamRef {
  id: string;
  name: string;
}

export interface Zone {
  id: string;
  name: string;
  description?: string;
  /** Équipes actuellement responsables de la collecte dans cette zone. */
  teams?: ZoneTeamRef[];
  teamsCount?: number;
  reportsCount?: number;
  createdAt?: string;
}

export interface CreateZonePayload {
  name: string;
  description?: string;
}
