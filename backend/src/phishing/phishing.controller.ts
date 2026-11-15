import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PhishingService } from './phishing.service';
import { ScanPhishingDto, QuarantineActionDto } from './dto/phishing.dto';
import { RequireActiveModule } from '../common/decorators/require-active-module.decorator';
import { ModuleActiveGuard } from '../common/guards/module-active.guard';

@ApiTags('SIS Phishing Shield [M02]')
@Controller('phishing')
@UseGuards(ModuleActiveGuard)
@RequireActiveModule('sis-phishing')
export class PhishingController {
  constructor(private readonly phishingService: PhishingService) {}

  @Post('scan')
  @ApiOperation({ summary: 'Heuristic & AI phishing inspection for URLs, emails, and SMS messages' })
  @ApiResponse({ status: 200, description: 'Inspection report with threat verdict and indicators' })
  scan(@Body() dto: ScanPhishingDto) {
    return this.phishingService.scan(dto);
  }

  @Get('quarantine')
  @ApiOperation({ summary: 'List all currently quarantined threats' })
  @ApiResponse({ status: 200, description: 'Active quarantined artifacts list' })
  getQuarantine() {
    return this.phishingService.getQuarantine();
  }

  @Post('quarantine/:id/release')
  @ApiOperation({ summary: 'Release verified benign artifact from quarantine' })
  @ApiResponse({ status: 200, description: 'Quarantine release confirmation' })
  releaseFromQuarantine(@Param('id') id: string, @Body() dto: QuarantineActionDto) {
    return this.phishingService.releaseFromQuarantine(id, dto);
  }

  @Post('quarantine/:id/purge')
  @ApiOperation({ summary: 'Permanently purge quarantined threat artifact' })
  @ApiResponse({ status: 200, description: 'Quarantine purge confirmation' })
  purgeQuarantinedItem(@Param('id') id: string) {
    return this.phishingService.purgeQuarantinedItem(id);
  }

  @Get('rules')
  @ApiOperation({ summary: 'List active detection rules and brand filters' })
  @ApiResponse({ status: 200, description: 'Detection rules and brand filters list' })
  getRules() {
    return this.phishingService.getRules();
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Telemetry metrics and detection accuracy rates' })
  @ApiResponse({ status: 200, description: 'Phishing shield operational metrics' })
  getStatistics() {
    return this.phishingService.getStatistics();
  }
}
