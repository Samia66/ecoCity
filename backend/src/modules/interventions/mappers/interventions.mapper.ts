import { Intervention } from '@prisma/client';

export class InterventionsMapper {
  static toResponse(
    intervention: Intervention,
  ) {
    return {
      id: intervention.id,

      reportId: intervention.reportId,

      agentId: intervention.agentId,

      status: intervention.status,

      notes: intervention.notes,

      startedAt: intervention.startedAt,

      completedAt: intervention.completedAt,

      createdAt: intervention.createdAt,

      updatedAt: intervention.updatedAt,
    };
  }
}