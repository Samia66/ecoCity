import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';


import { InterventionsRepository } from './repositories/interventions.repository';

import { CreateInterventionDto } from './dto/create-intervention.dto';
import { UpdateInterventionDto } from './dto/update-intervention.dto';

import {
  INTERVENTION_ERRORS,
  INTERVENTION_MESSAGES,
} from './constants/interventions.constants';

import { InterventionsMapper } from './mappers/interventions.mapper';
import { UpdateInterventionStatusDto } from './dto/update-intervention-status.dto';

@Injectable()
export class InterventionsService {
  constructor(
    private readonly repository: InterventionsRepository,
  ) {}

  async create(
    dto: CreateInterventionDto,
  ) {
    const [report, agent] =
      await Promise.all([
        this.repository.reportExists(
          dto.reportId,
        ),
        this.repository.agentExists(
          dto.agentId,
        ),
      ]);

    if (!report) {
      throw new NotFoundException(
        INTERVENTION_ERRORS.REPORT_NOT_FOUND,
      );
    }

    if (!agent) {
      throw new NotFoundException(
        INTERVENTION_ERRORS.AGENT_NOT_FOUND,
      );
    }

    const intervention =
      await this.repository.create({
        notes: dto.notes,

        report: {
          connect: {
            id: dto.reportId,
          },
        },

        agent: {
          connect: {
            id: dto.agentId,
          },
        },
      });

    return InterventionsMapper.toResponse(
      intervention,
    );
  }

  async findAll() {
    const interventions =
      await this.repository.findAll();

    return interventions.map(
      InterventionsMapper.toResponse,
    );
  }

  async findById(id: string) {
    const intervention =
      await this.repository.findById(id);

    if (!intervention) {
      throw new NotFoundException(
        INTERVENTION_ERRORS.NOT_FOUND,
      );
    }

    return InterventionsMapper.toResponse(
      intervention,
    );
  }

  async update(
    id: string,
    dto: UpdateInterventionDto,
  ) {
    await this.findById(id);

    const intervention =
      await this.repository.update(
        id,
        {
          notes: dto.notes,
        },
      );

    return InterventionsMapper.toResponse(
      intervention,
    );
  }

  async updateStatus(
    id: string,
    dto: UpdateInterventionStatusDto,
  ) {
    const intervention =
      await this.findById(id);

    if (
      intervention.status ===
      dto.status
    ) {
      throw new BadRequestException(
        INTERVENTION_ERRORS.INVALID_STATUS,
      );
    }

    const updated =
      await this.repository.updateStatus(
        id,
        dto.status,
      );

    return InterventionsMapper.toResponse(
      updated,
    );
  }

  async delete(id: string) {
    await this.findById(id);

    await this.repository.delete(id);

    return {
      message:
        INTERVENTION_MESSAGES.DELETED,
    };
  }
}