import { Prisma } from '@prisma/client';
import { AuthResponseDto } from '../dto/response/auth-response.dto';

type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    role: true;
    organization: true;
  };
}>;

export class AuthMapper {
  static toAuthResponse(
    user: UserWithRelations,
    accessToken: string,
    refreshToken: string,
  ): AuthResponseDto {
    return {
      accessToken,
      refreshToken,

      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role.name,
        organization: user.organization.name,
      },
    };
  }
}