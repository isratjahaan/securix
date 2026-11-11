import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HealthService } from './health.service';

@ApiTags('System & Database Health Checks')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('system')
  @ApiOperation({ summary: 'Verified system-wide telemetry, uptime and microservice health' })
  getSystemHealth() {
    return this.healthService.getSystemHealth();
  }

  @Get('database')
  @ApiOperation({ summary: 'Verified PostgreSQL database connection and engine status' })
  getDatabaseHealth() {
    return this.healthService.getDatabaseHealth();
  }
}
