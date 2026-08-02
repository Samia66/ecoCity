import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({
    summary: 'Health check',
    description: "Vérifie l'état de l'API et de la base de données.",
  })
  @ApiResponse({
    status: 200,
    description: 'API opérationnelle',
  })
  async check() {
    return this.healthService.check();
  }
}