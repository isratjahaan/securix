import { Controller, Get, Post, Param, Body, Query, Header } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ThreatIntelService } from './threat-intel.service';

@ApiTags('Threat Intelligence Center & IOC Repository')
@Controller('threat-intelligence')
export class ThreatIntelController {
  constructor(private readonly threatIntelService: ThreatIntelService) {}

  @Get('indicators')
  @ApiOperation({ summary: 'List and filter threat indicators (IPs, domains, hashes, URLs)' })
  getIndicators(
    @Query('type') type?: string,
    @Query('severity') severity?: string,
    @Query('search') search?: string,
  ) {
    return this.threatIntelService.getIndicators({ type, severity, search });
  }

  @Get('feeds')
  @ApiOperation({ summary: 'List external threat feed subscriptions (AlienVault, MISP, AbuseIPDB)' })
  getFeeds() {
    return this.threatIntelService.getFeeds();
  }

  @Post('indicators')
  @ApiOperation({ summary: 'Register new IOC with severity and confidence score' })
  createIndicator(@Body() body: any) {
    return this.threatIntelService.createIndicator(body);
  }

  @Post('feeds/:id/sync')
  @ApiOperation({ summary: 'Trigger synchronization of external threat intelligence feed' })
  syncFeed(@Param('id') id: string) {
    return this.threatIntelService.syncFeed(id);
  }

  @Get('export')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="sis_threat_indicators.csv"')
  @ApiOperation({ summary: 'Export threat indicators to CSV for SIEM ingestion' })
  exportIndicators() {
    return this.threatIntelService.exportIndicatorsCsv();
  }
}
