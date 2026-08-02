import { Prisma } from '@prisma/client';

type UserWithRelations =
  Prisma.UserGetPayload<{
    include: {
      role: true;
      organization: true;
    };
  }>;

export class UsersMapper {
  static toResponse(user: UserWithRelations) {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      status: user.status,
      role: user.role.name,
      organization: user.organization.name,
      createdAt: user.createdAt,
    };
  }
}