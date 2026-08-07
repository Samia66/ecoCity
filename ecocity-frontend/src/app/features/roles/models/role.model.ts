export interface Permission {
  id: string;
  code: string;
  label: string;
  module: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  usersCount: number;
  permissionCodes: string[];
  createdAt: string;
}

export interface CreateRolePayload {
  name: string;
  description: string;
  permissionCodes: string[];
}
