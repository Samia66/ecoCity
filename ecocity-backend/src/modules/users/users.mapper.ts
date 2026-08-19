import { Injectable } from '@nestjs/common';
import { UserWithRelations } from './users.repository';

/** Correspond à `UserItem` côté Angular (`features/users/models/user.model.ts`). */
export interface UserItemDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  role: string;
  organizationName: string;
  organizationId: string;
  active: boolean;
  status: string;
  mustChangePassword: boolean;
  avatarUrl?: string | null;
  createdAt: string;
}

@Injectable()
export class UsersMapper {
  toItem(user: UserWithRelations): UserItemDto {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role.name,
      organizationName: user.organization.name,
      organizationId: user.organizationId,
      active: user.status === 'ACTIVE',
      status: user.status,
      mustChangePassword: user.mustChangePassword,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt.toISOString(),
    };
  }

  toItemList(users: UserWithRelations[]): UserItemDto[] {
    return users.map((u) => this.toItem(u));
  }
}
