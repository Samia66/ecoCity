export interface Organization {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  logoUrl?: string;
  usersCount: number;
  reportsCount: number;
  active: boolean;
  createdAt: string;
}

export interface CreateOrganizationPayload {
  name: string;
  city: string;
  address: string;
  phone: string;
  email: string;
}
