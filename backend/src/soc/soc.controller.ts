import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SocService } from './soc.service';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Security Operations Center (SOC)')
@Controller('soc')
export class SocController {
  constructor(private readonly socService: SocService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Retrieve SOC high-level metrics, active alerts & incident breakdown' })
  getOverview() {
    return this.socService.getOverview();
  }

  @Get('alerts')
  @ApiOperation({ summary: 'Search and filter security alerts across all 12 cybersecurity modules' })
  getAlerts(
    @Query('severity') severity?: string,
    @Query('status') status?: string,
    @Query('moduleId') moduleId?: string,
    @Query('search') search?: string,
  ) {
    return this.socService.getAlerts({ severity, status, moduleId, search });
  }

  @Post('alerts/:id/acknowledge')
  @ApiOperation({ summary: 'Acknowledge an active security alert' })
  acknowledgeAlert(@Param('id') id: string) {
    return this.socService.acknowledgeAlert(id);
  }

  @Post('alerts/:id/assign')
  @ApiOperation({ summary: 'Assign security alert to analyst or responder' })
  assignAlert(@Param('id') id: string, @Body('assignedTo') assignedTo: string) {
    return this.socService.assignAlert(id, assignedTo);
  }

  @Post('alerts/:id/escalate')
  @ApiOperation({ summary: 'Escalate security alert to formal incident with commander assignment' })
  escalateAlert(@Param('id') id: string, @Body('incidentTitle') incidentTitle: string) {
    return this.socService.escalateAlert(id, incidentTitle);
  }

  @Post('alerts/:id/resolve')
  @ApiOperation({ summary: 'Mark security alert as resolved' })
  resolveAlert(@Param('id') id: string) {
    return this.socService.resolveAlert(id);
  }

  @Get('incidents')
  @ApiOperation({ summary: 'List all security incidents with severity, containment and timeline' })
  getIncidents() {
    return this.socService.getIncidents();
  }

  @Get('incidents/:id')
  @ApiOperation({ summary: 'Retrieve complete incident details, linked alerts and evidence' })
  getIncidentById(@Param('id') id: string) {
    return this.socService.getIncidentById(id);
  }

  @Post('incidents')
  @ApiOperation({ summary: 'Create new security incident' })
  createIncident(@Body() body: any) {
    return this.socService.createIncident(body);
  }

  @Patch('incidents/:id/status')
  @ApiOperation({ summary: 'Advance or update incident lifecycle state (New -> Investigating -> Contained -> Resolved -> Closed)' })
  updateIncidentStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('resolutionSummary') resolutionSummary?: string,
  ) {
    return this.socService.updateIncidentStatus(id, status, resolutionSummary);
  }
}
