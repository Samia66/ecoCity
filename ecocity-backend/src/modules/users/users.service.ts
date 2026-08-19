import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { AppConfig } from '../../config/configuration';
import { hashPassword } from '../../common/utils/hash.util';
import { generateTempPassword } from '../../common/utils/password-generator.util';
import { paginate, toSkipTake, PaginatedResult } from '../../common/utils/pagination.util';
import { RoleName } from '../../common/constants/roles.constant';
import { AuthenticatedUser } from '../auth/strategies/jwt.strategy';
import { UsersRepository } from './users.repository';
import { UsersMapper, UserItemDto } from './users.mapper';
import { CreateStaffUserDto } from './dto/create-staff-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';

/** Qui peut créer quel rôle "staff" — hiérarchie stricte. */
const CREATION_HIERARCHY: Record<string, RoleName[]> = {
  [RoleName.SUPER_ADMIN]: [RoleName.ADMIN, RoleName.TEAM_LEADER, RoleName.AGENT],
  [RoleName.ADMIN]: [RoleName.TEAM_LEADER, RoleName.AGENT],
  [RoleName.TEAM_LEADER]: [RoleName.AGENT],
};

export interface CreateStaffUserResult {
  user: UserItemDto;
  temporaryPassword: string;
}

@Injectable()
export class UsersService {
  private readonly appConfig: AppConfig;

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersMapper: UsersMapper,
    private readonly configService: ConfigService,
  ) {
    this.appConfig = this.configService.get<AppConfig>('app')!;
  }

  async findAll(query: QueryUserDto, requester: AuthenticatedUser): Promise<PaginatedResult<UserItemDto>> {
    const { skip, take } = toSkipTake(query.page, query.limit);

    const where: Prisma.UserWhereInput = {
      deletedAt: null,
      ...(requester.roleName !== RoleName.SUPER_ADMIN ? { organizationId: requester.organizationId } : {}),
      ...(query.organizationId ? { organizationId: query.organizationId } : {}),
      ...(query.status ? { status: query.status as Prisma.EnumUserStatusFilter['equals'] } : {}),
      ...(query.role ? { role: { name: query.role } } : {}),
      ...(query.search
        ? {
            OR: [
              { firstName: { contains: query.search, mode: 'insensitive' } },
              { lastName: { contains: query.search, mode: 'insensitive' } },
              { email: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [users, total] = await Promise.all([
      this.usersRepository.findMany({ where, skip, take }),
      this.usersRepository.count(where),
    ]);

    return paginate(this.usersMapper.toItemList(users), total, query.page, query.limit);
  }

  async findById(id: string, requester: AuthenticatedUser): Promise<UserItemDto> {
    const user = await this.usersRepository.findById(id);
    if (!user || user.deletedAt) {
      throw new NotFoundException('Utilisateur introuvable.');
    }
    this.assertSameOrganization(user.organizationId, requester);
    return this.usersMapper.toItem(user);
  }

  async createStaff(dto: CreateStaffUserDto, requester: AuthenticatedUser): Promise<CreateStaffUserResult> {
    const allowedRoles = CREATION_HIERARCHY[requester.roleName] ?? [];
    if (!allowedRoles.includes(dto.role)) {
      throw new ForbiddenException(
        `Un utilisateur ${requester.roleName} ne peut pas créer de compte ${dto.role}.`,
      );
    }

    const existing = await this.usersRepository.findByEmail(dto.email.toLowerCase().trim());
    if (existing) {
      throw new ConflictException('Un compte existe déjà avec cette adresse email.');
    }

    const role = await this.usersRepository.findRoleByName(dto.role);
    if (!role) {
      throw new NotFoundException(`Le rôle ${dto.role} n'est pas configuré. Lancez le seed.`);
    }

    // SUPER_ADMIN peut créer dans n'importe quelle organisation ; les autres
    // créateurs restent cantonnés à la leur.
    const organizationId =
      requester.roleName === RoleName.SUPER_ADMIN && dto.organizationId
        ? dto.organizationId
        : requester.organizationId;

    const temporaryPassword = generateTempPassword();
    const hashedPassword = await hashPassword(temporaryPassword, this.appConfig.bcryptSaltRounds);

    const user = await this.usersRepository.create({
      firstName: dto.firstName.trim(),
      lastName: dto.lastName.trim(),
      email: dto.email.toLowerCase().trim(),
      phone: dto.phone,
      password: hashedPassword,
      mustChangePassword: true,
      organization: { connect: { id: organizationId } },
      role: { connect: { id: role.id } },
    });

    return { user: this.usersMapper.toItem(user), temporaryPassword };
  }

  async update(id: string, dto: UpdateUserDto, requester: AuthenticatedUser): Promise<UserItemDto> {
    const existing = await this.usersRepository.findById(id);
    if (!existing || existing.deletedAt) {
      throw new NotFoundException('Utilisateur introuvable.');
    }
    this.assertSameOrganization(existing.organizationId, requester);

    const updated = await this.usersRepository.update(id, {
      ...(dto.firstName !== undefined ? { firstName: dto.firstName } : {}),
      ...(dto.lastName !== undefined ? { lastName: dto.lastName } : {}),
      ...(dto.phone !== undefined ? { phone: dto.phone } : {}),
      ...(dto.avatarUrl !== undefined ? { avatarUrl: dto.avatarUrl } : {}),
      ...(dto.status !== undefined ? { status: dto.status } : {}),
    });

    return this.usersMapper.toItem(updated);
  }

  async remove(id: string, requester: AuthenticatedUser): Promise<void> {
    const existing = await this.usersRepository.findById(id);
    if (!existing || existing.deletedAt) {
      throw new NotFoundException('Utilisateur introuvable.');
    }
    this.assertSameOrganization(existing.organizationId, requester);

    if (existing.id === requester.userId) {
      throw new BadRequestException('Vous ne pouvez pas supprimer votre propre compte.');
    }

    await this.usersRepository.softDelete(id);
    await this.usersRepository.removeFromAllTeams(id);
  }

  // --------------------------------------------------------------------

  private assertSameOrganization(organizationId: string, requester: AuthenticatedUser): void {
    if (requester.roleName === RoleName.SUPER_ADMIN) return;
    if (organizationId !== requester.organizationId) {
      throw new ForbiddenException("Vous n'avez pas accès à cette organisation.");
    }
  }
}
