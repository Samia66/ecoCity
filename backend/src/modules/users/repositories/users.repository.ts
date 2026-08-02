import { Injectable } from '@nestjs/common';
import { Prisma, RoleName, UserStatus } from '@prisma/client';

import { PrismaService } from '../../../infrastructure/prisma/prisma.service';

@Injectable()
export class UsersRepository {
    constructor(
        private readonly prisma: PrismaService,
    ) { }


    async findAll(query: {
        skip: number;
        take: number;
        search?: string;
        status?: UserStatus;
        role?: RoleName;
    }) {
        return this.prisma.user.findMany({
            skip: query.skip,
            take: query.take,

            where: {
                deletedAt: null,

                ...(query.status && {
                    status: query.status,
                }),

                ...(query.role && {
                    role: {
                        name: query.role,
                    },
                }),

                ...(query.search && {
                    OR: [
                        {
                            firstName: {
                                contains: query.search,
                                mode: 'insensitive',
                            },
                        },
                        {
                            lastName: {
                                contains: query.search,
                                mode: 'insensitive',
                            },
                        },
                        {
                            email: {
                                contains: query.search,
                                mode: 'insensitive',
                            },
                        },
                    ],
                }),
            },

            include: {
                role: true,
                organization: true,
            },

            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async count(search?: string, status?: UserStatus) {
        return this.prisma.user.count({
            where: {
                deletedAt: null,
                status,

                OR: search
                    ? [
                        {
                            firstName: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                        {
                            lastName: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                        {
                            email: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                    ]
                    : undefined,
            },
        });
    }

    async findById(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
            include: {
                role: true,
                organization: true,
            },
        });
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
            include: {
                role: true,
                organization: true,
            },
        });
    }

    async create(data: Prisma.UserCreateInput) {
        return this.prisma.user.create({
            data,
            include: {
                role: true,
                organization: true,
            },
        });
    }

    async update(
        id: string,
        data: Prisma.UserUpdateInput,
    ) {
        return this.prisma.user.update({
            where: {
                id,
            },
            data,
            include: {
                role: true,
                organization: true,
            },
        });
    }

    async updateStatus(
        id: string,
        status: UserStatus,
    ) {
        return this.prisma.user.update({
            where: {
                id,
            },
            data: {
                status,
            },
            include: {
                role: true,
                organization: true,
            },
        });
    }

    async delete(id: string) {
        return this.prisma.user.update({
            where: {
                id,
            },
            data: {
                deletedAt: new Date(),
            },
        });
    }
}