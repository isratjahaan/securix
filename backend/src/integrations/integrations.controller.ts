import { Controller, Get, Post, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { IntegrationsService } from './integrations.service';

@ApiTags('API & Integration Management')
@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Get()
  @ApiOperation({ summary: 'List registered APIs, endpoints, module services and latencies' })
  getIntegrations() {
    return this.integrationsService.getIntegrations();
  }

  @Post(':id/test')
  @ApiOperation({ summary: 'Trigger non-destructive live ping / health check against API endpoint' })
  testIntegration(@Param('id') id: string) {
    return this.integrationsService.testIntegration(id);
  }
}
