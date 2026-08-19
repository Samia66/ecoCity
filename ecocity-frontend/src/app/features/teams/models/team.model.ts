export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  zoneId?: string;
  zoneName?: string;
  members: TeamMember[];
  createdAt: string;
}

export interface CreateTeamPayload {
  name: string;
  description?: string;
}

/** Une équipe de terrain doit compter entre 2 et 3 agents (inclus). */
export const TEAM_MIN_MEMBERS = 2;
export const TEAM_MAX_MEMBERS = 3;
