/**
 * Codes de permissions — reflètent la matrice affichée dans le frontend
 * Angular (`/roles/permissions`). Regroupés par module.
 */
export enum PermissionCode {
  // Signalements
  REPORTS_CREATE = 'reports.create',
  REPORTS_VIEW = 'reports.view',
  REPORTS_MANAGE = 'reports.manage',
  REPORTS_DELETE = 'reports.delete',

  // Interventions
  INTERVENTIONS_VIEW = 'interventions.view',
  INTERVENTIONS_ASSIGN = 'interventions.assign',
  INTERVENTIONS_UPDATE = 'interventions.update',

  // Utilisateurs
  USERS_VIEW = 'users.view',
  USERS_MANAGE = 'users.manage',

  // Organisations
  ORGANIZATIONS_VIEW = 'organizations.view',
  ORGANIZATIONS_MANAGE = 'organizations.manage',

  // Catégories
  CATEGORIES_MANAGE = 'categories.manage',

  // Rôles & permissions
  ROLES_MANAGE = 'roles.manage',

  // Équipes & zones de terrain
  TEAMS_VIEW = 'teams.view',
  TEAMS_MANAGE = 'teams.manage',
  ZONES_VIEW = 'zones.view',
  ZONES_MANAGE = 'zones.manage',
  COLLECTION_SCHEDULES_MANAGE = 'collection-schedules.manage',

  // Collectes (missions de terrain planifiées)
  COLLECTIONS_VIEW = 'collections.view',
  COLLECTIONS_MANAGE = 'collections.manage',

  // Paramètres
  SETTINGS_MANAGE = 'settings.manage',

  // Tableau de bord
  DASHBOARD_VIEW_GLOBAL = 'dashboard.view_global',
  DASHBOARD_VIEW_ORGANIZATION = 'dashboard.view_organization',
}

export const PERMISSION_CATALOG: Array<{ code: PermissionCode; label: string; module: string }> = [
  { code: PermissionCode.REPORTS_CREATE, label: 'Créer un signalement', module: 'Signalements' },
  { code: PermissionCode.REPORTS_VIEW, label: 'Voir les signalements', module: 'Signalements' },
  { code: PermissionCode.REPORTS_MANAGE, label: 'Gérer les signalements', module: 'Signalements' },
  { code: PermissionCode.REPORTS_DELETE, label: 'Supprimer un signalement', module: 'Signalements' },
  { code: PermissionCode.INTERVENTIONS_VIEW, label: 'Voir les interventions', module: 'Interventions' },
  { code: PermissionCode.INTERVENTIONS_ASSIGN, label: 'Assigner une intervention', module: 'Interventions' },
  { code: PermissionCode.INTERVENTIONS_UPDATE, label: 'Mettre à jour une intervention', module: 'Interventions' },
  { code: PermissionCode.USERS_VIEW, label: 'Voir les utilisateurs', module: 'Utilisateurs' },
  { code: PermissionCode.USERS_MANAGE, label: 'Gérer les utilisateurs', module: 'Utilisateurs' },
  { code: PermissionCode.ORGANIZATIONS_VIEW, label: 'Voir les organisations', module: 'Organisations' },
  { code: PermissionCode.ORGANIZATIONS_MANAGE, label: 'Gérer les organisations', module: 'Organisations' },
  { code: PermissionCode.CATEGORIES_MANAGE, label: 'Gérer les catégories', module: 'Catégories' },
  { code: PermissionCode.ROLES_MANAGE, label: 'Gérer les rôles et permissions', module: 'Rôles' },
  { code: PermissionCode.TEAMS_VIEW, label: 'Voir les équipes de terrain', module: 'Équipes' },
  { code: PermissionCode.TEAMS_MANAGE, label: "Gérer les équipes de terrain", module: 'Équipes' },
  { code: PermissionCode.ZONES_VIEW, label: "Voir les zones d'intervention", module: 'Zones' },
  { code: PermissionCode.ZONES_MANAGE, label: "Gérer les zones d'intervention", module: 'Zones' },
  {
    code: PermissionCode.COLLECTION_SCHEDULES_MANAGE,
    label: 'Gérer les plannings de collecte',
    module: 'Zones',
  },
  { code: PermissionCode.COLLECTIONS_VIEW, label: 'Voir les collectes', module: 'Collectes' },
  { code: PermissionCode.COLLECTIONS_MANAGE, label: 'Gérer les collectes (démarrer/terminer/signaler)', module: 'Collectes' },
  { code: PermissionCode.SETTINGS_MANAGE, label: 'Gérer les paramètres', module: 'Paramètres' },
  { code: PermissionCode.DASHBOARD_VIEW_GLOBAL, label: 'Voir le tableau de bord global', module: 'Tableau de bord' },
  {
    code: PermissionCode.DASHBOARD_VIEW_ORGANIZATION,
    label: "Voir le tableau de bord de l'organisation",
    module: 'Tableau de bord',
  },
];
