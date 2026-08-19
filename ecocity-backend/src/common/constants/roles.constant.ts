/**
 * Noms de rôles "système" créés par le seed. Les organisations peuvent créer
 * des rôles supplémentaires (RBAC dynamique via la matrice de permissions),
 * mais ces cinq rôles existent toujours et pilotent la logique métier de
 * plus haut niveau (garde-fous au-delà du simple système de permissions).
 */
export enum RoleName {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  TEAM_LEADER = 'TEAM_LEADER',
  AGENT = 'AGENT',
  CITIZEN = 'CITIZEN',
}

export const SYSTEM_ROLE_NAMES: string[] = Object.values(RoleName);

/** Rôles internes à l'organisation (back-office), par opposition au citoyen. */
export const STAFF_ROLE_NAMES: string[] = [
  RoleName.SUPER_ADMIN,
  RoleName.ADMIN,
  RoleName.TEAM_LEADER,
  RoleName.AGENT,
];
