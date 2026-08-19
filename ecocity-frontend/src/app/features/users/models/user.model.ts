import { UserRole } from '../../../core/constants/app.constants';

export interface UserItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  organizationName: string;
  organizationId: string;
  active: boolean;
  createdAt: string;
}

export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  organizationId?: string;
  phone?: string;
}

/** Réponse de création d'un compte staff : le mot de passe temporaire n'est renvoyé qu'une seule fois. */
export interface CreateStaffUserResult {
  user: UserItem;
  temporaryPassword: string;
}
