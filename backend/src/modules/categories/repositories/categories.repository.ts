import { Injectable } from '@nestjs/common';
import {
    Category,
    Prisma,
} from '@prisma/client';

import { PrismaService } from '../../../infrastructure/prisma/prisma.service';

@Injectable()
export class CategoriesRepository {
    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async findAll(params: {
        skip: number;
        take: number;
        search?: string;
        isActive?: boolean;
        organizationId?: string;
    }) {
        const {
            skip,
            take,
            search,
            isActive,
            organizationId,
        } = params;

        return this.prisma.category.findMany({
            skip,
            take,

            where: {
                deletedAt: null,

                ...(organizationId && {
                    organizationId,
                }),

                ...(isActive !== undefined && {
                    isActive,
                }),

                ...(search && {
                    OR: [
                        {
                            name: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                        {
                            description: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                    ],
                }),
            },

            include: {
                organization: true,
            },

            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async count(params: {
        search?: string;
        isActive?: boolean;
        organizationId?: string;
    }) {
        return this.prisma.category.count({
            where: {
                deletedAt: null,

                ...(params.organizationId && {
                    organizationId: params.organizationId,
                }),

                ...(params.isActive !== undefined && {
                    isActive: params.isActive,
                }),

                ...(params.search && {
                    OR: [
                        {
                            name: {
                                contains: params.search,
                                mode: 'insensitive',
                            },
                        },
                        {
                            description: {
                                contains: params.search,
                                mode: 'insensitive',
                            },
                        },
                    ],
                }),
            },
        });
    }

    async findById(id: string) {
        return this.prisma.category.findFirst({
            where: {
                id,
                deletedAt: null,
            },

            include: {
                organization: true,
            },
        });
    }

    async findByName(
        name: string,
        organizationId: string,
    ) {
        return this.prisma.category.findFirst({
            where: {
                name,
                organizationId,
                deletedAt: null,
            },
        });
    }

    async create(
        data: Prisma.CategoryCreateInput,
    ) {
        return this.prisma.category.create({
            data,

            include: {
                organization: true,
            },
        });
    }

    async update(
        id: string,
        data: Prisma.CategoryUpdateInput,
    ) {
        return this.prisma.category.update({
            where: {
                id,
            },

            data,

            include: {
                organization: true,
            },
        });
    }

    async delete(id: string) {
        return this.prisma.category.update({
            where: {
                id,
            },
            data: {
                deletedAt: new Date(),
            },
            include: {
                organization: true,
            },
        });
    }

    async activate(id: string) {
        return this.prisma.category.update({
            where: {
                id,
            },
            data: {
                isActive: true,
            },
            include: {
                organization: true,
            },
        });
    }

    async deactivate(id: string) {
        return this.prisma.category.update({
            where: {
                id,
            },
            data: {
                isActive: false,
            },
            include: {
                organization: true,
            },
        });
    }
}