export interface Zone {
  id: string;
  name: string;
  description?: string;
  agentsCount?: number;
  /** Nombre d'équipes actuellement affectées à cette zone. */
  teamsCount?: number;
  createdAt?: string;
}

export interface CreateZonePayload {
  name: string;
  description?: string;
}
