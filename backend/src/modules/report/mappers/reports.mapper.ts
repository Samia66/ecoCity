import { Report } from '@prisma/client';

export class ReportsMapper {
  static toResponse(report: Report) {
    return {
      id: report.id,

      reference: report.reference,

      title: report.title,

      description: report.description,

      status: report.status,

      priority: report.priority,

      latitude: report.latitude,

      longitude: report.longitude,

      address: report.address,

      district: report.district,

      city: report.city,

      organizationId: report.organizationId,

      categoryId: report.categoryId,

      authorId: report.authorId,

      assignedToId: report.assignedToId,

      resolvedAt: report.resolvedAt,

      createdAt: report.createdAt,

      updatedAt: report.updatedAt,
    };
  }
}