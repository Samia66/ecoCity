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
  password?: string;
}
