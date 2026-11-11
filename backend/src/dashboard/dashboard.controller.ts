import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('Command Center Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('kpis')
  @ApiOperation({ summary: 'Retrieve high-level key performance metrics' })
  getKpis() {
    return this.dashboardService.getKpis();
  }

  @Get('posture')
  @ApiOperation({ summary: 'Retrieve documented security posture and risk metrics' })
  getSecurityPosture() {
    return this.dashboardService.getSecurityPosture();
  }

  @Get('charts')
  @ApiOperation({ summary: 'Get security activity time-series and breakdown charts' })
  getActivityCharts(@Query('timeframe') timeframe?: string) {
    return this.dashboardService.getActivityCharts(timeframe);
  }

  @Get('recent-activity')
  @ApiOperation({ summary: 'Get unified recent logins, alerts, device registrations & audits' })
  getRecentActivity() {
    return this.dashboardService.getRecentActivity();
  }
}
