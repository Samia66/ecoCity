export type TeamMemberRole = 'LEADER' | 'AGENT';

export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: TeamMemberRole;
}

export interface TeamZoneRef {
  id: string;
  name: string;
}

export type TeamStatus = 'ACTIVE' | 'INACTIVE';

export const DAYS_OF_WEEK = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI', 'DIMANCHE'] as const;
export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

export const DAY_LABELS: Record<DayOfWeek, string> = {
  LUNDI: 'Lundi',
  MARDI: 'Mardi',
  MERCREDI: 'Mercredi',
  JEUDI: 'Jeudi',
  VENDREDI: 'Vendredi',
  SAMEDI: 'Samedi',
  DIMANCHE: 'Dimanche',
};

export interface Team {
  id: string;
  name: string;
  description?: string;
  status: TeamStatus;
  leaderId?: string | null;
  leaderName?: string | null;
  members: TeamMember[];
  zones: TeamZoneRef[];
  scheduleDays: DayOfWeek[];
  createdAt: string;
}

export interface CreateTeamPayload {
  name: string;
  description?: string;
  leaderId: string;
  agentIds: string[];
  zoneIds?: string[];
  status?: TeamStatus;
}

export interface UpdateTeamPayload {
  name?: string;
  description?: string;
  status?: TeamStatus;
}

/** Une équipe de terrain doit compter entre 2 et 3 membres au total (chef inclus). */
export const TEAM_MIN_MEMBERS = 2;
export const TEAM_MAX_MEMBERS = 3;
