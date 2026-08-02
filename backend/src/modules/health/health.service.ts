import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async check() {
    await this.prisma.$queryRaw`SELECT 1`;

    return {
      status: 'UP',
      service: 'EcoCity API',
      version: '1.0.0',
      environment: process.env.NODE_ENV,
      database: 'CONNECTED',
      timestamp: new Date().toISOString(),
    };
  }
}