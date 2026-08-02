import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { RoleName } from '@prisma/client';

import { HashService } from '../../common/services/hash.service';

import { UsersRepository } from './repositories/users.repository';

import { UsersMapper } from './mappers/users.mapper';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { QueryUsersDto } from './dto/query-users.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UsersRepository,
    private readonly hashService: HashService,
  ) {}

  async findAll(query: QueryUsersDto) {
    const skip = (query.page - 1) * query.limit;

    const [users, total] = await Promise.all([
      this.repository.findAll({
        skip,
        take: query.limit,
        search: query.search,
        status: query.status,
      }),
      this.repository.count(),
    ]);

    return {
      data: users.map(UsersMapper.toResponse),
      meta: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit),
      },
    };
  }

  async findById(id: string) {
    const user = await this.repository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return UsersMapper.toResponse(user);
  }

  async create(dto: CreateUserDto) {
    const existingUser = await this.repository.findByEmail(dto.email);

    if (existingUser) {
      throw new BadRequestException(
        'Email already exists',
      );
    }

    const password = await this.hashService.hash(
      dto.password,
    );

    const user = await this.repository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      password,

      role: {
        connect: {
          name: dto.role,
        },
      },

      organization: {
        connect: {
          id: dto.organizationId,
        },
      },
    });

    return UsersMapper.toResponse(user);
  }

  async update(
    id: string,
    dto: UpdateUserDto,
  ) {
    await this.findById(id);

    const user = await this.repository.update(id, dto);

    return UsersMapper.toResponse(user);
  }

  async updateStatus(
    id: string,
    dto: UpdateUserStatusDto,
  ) {
    await this.findById(id);

    const user =
      await this.repository.updateStatus(
        id,
        dto.status,
      );

    return UsersMapper.toResponse(user);
  }

  async updateRole(
    id: string,
    dto: UpdateUserRoleDto,
  ) {
    await this.findById(id);

    const user =
      await this.repository.update(id, {
        role: {
          connect: {
            name: dto.role,
          },
        },
      });

    return UsersMapper.toResponse(user);
  }

  async delete(id: string) {
    await this.findById(id);

    await this.repository.delete(id);

    return {
      message: 'User deleted successfully',
    };
  }
}