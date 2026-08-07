export const APP_NAME = 'EcoCity';

export type ReportStatus =
  | 'NOUVEAU'
  | 'EN_ATTENTE'
  | 'VALIDE'
  | 'ASSIGNE'
  | 'EN_COURS'
  | 'RESOLU'
  | 'REJETE'
  | 'ARCHIVE';

export type ReportPriority = 'BASSE' | 'MOYENNE' | 'HAUTE' | 'CRITIQUE';

export type UserRole = 'SUPER_ADMIN' | 'ADMIN_ORGANISATION' | 'AGENT' | 'CITOYEN';

export const STATUS_LABELS: Record<ReportStatus, string> = {
  NOUVEAU: 'Nouveau',
  EN_ATTENTE: 'En attente',
  VALIDE: 'Validé',
  ASSIGNE: 'Assigné',
  EN_COURS: 'En cours',
  RESOLU: 'Résolu',
  REJETE: 'Rejeté',
  ARCHIVE: 'Archivé',
};

export const STATUS_COLORS: Record<ReportStatus, { bg: string; text: string }> = {
  NOUVEAU: { bg: '#F1F5F9', text: '#64748B' },
  EN_ATTENTE: { bg: '#FEF3C7', text: '#B45309' },
  VALIDE: { bg: '#DBEAFE', text: '#1D4ED8' },
  ASSIGNE: { bg: '#EDE9FE', text: '#6D28D9' },
  EN_COURS: { bg: '#E0F2FE', text: '#0369A1' },
  RESOLU: { bg: '#DCFCE7', text: '#15803D' },
  REJETE: { bg: '#FEE2E2', text: '#B91C1C' },
  ARCHIVE: { bg: '#F1F5F9', text: '#94A3B8' },
};

export const PRIORITY_LABELS: Record<ReportPriority, string> = {
  BASSE: 'Basse',
  MOYENNE: 'Moyenne',
  HAUTE: 'Haute',
  CRITIQUE: 'Critique',
};

export const PRIORITY_COLORS: Record<ReportPriority, { bg: string; text: string }> = {
  BASSE: { bg: '#F1F5F9', text: '#64748B' },
  MOYENNE: { bg: '#DBEAFE', text: '#1D4ED8' },
  HAUTE: { bg: '#FEF3C7', text: '#B45309' },
  CRITIQUE: { bg: '#FEE2E2', text: '#B91C1C' },
};

export const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN_ORGANISATION: "Admin d'organisation",
  AGENT: 'Agent / Technicien',
  CITOYEN: 'Citoyen',
};

export const REPORT_TYPES = [
  'Dépôts sauvages de déchets',
  'Poubelles débordantes',
  'Éclairage public défectueux',
  'Nids-de-poule',
  'Voirie endommagée',
  'Caniveaux bouchés',
  "Fuites d'eau",
  'Pollution',
  'Espaces verts dégradés',
  'Autres problèmes urbains',
];
