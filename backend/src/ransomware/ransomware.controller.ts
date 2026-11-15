import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RansomwareService } from './ransomware.service';
import { TripwireTestDto, IsolateHostDto } from './dto/ransomware.dto';
import { RequireActiveModule } from '../common/decorators/require-active-module.decorator';
import { ModuleActiveGuard } from '../common/guards/module-active.guard';

@ApiTags('SIS Ransomware Guardian [M06]')
@Controller('ransomware')
@UseGuards(ModuleActiveGuard)
@RequireActiveModule('sis-ransomware')
export class RansomwareController {
  constructor(private readonly ransomwareService: RansomwareService) {}

  @Get('canaries')
  @ApiOperation({ summary: 'List all active canary honeypot files across network storage' })
  @ApiResponse({ status: 200, description: 'Active canary honeypot sensor list' })
  getCanaries() {
    return this.ransomwareService.getCanaries();
  }

  @Post('tripwires/test')
  @ApiOperation({ summary: 'Simulate canary mutation or high-entropy encryption burst to test tripwire' })
  @ApiResponse({ status: 200, description: 'Tripwire execution report with SOC alert status' })
  testTripwire(@Body() dto: TripwireTestDto) {
    return this.ransomwareService.testTripwire(dto);
  }

  @Get('entropy')
  @ApiOperation({ summary: 'Real-time Shannon entropy monitoring metrics for storage volumes' })
  @ApiResponse({ status: 200, description: 'Volume entropy telemetry' })
  getEntropy() {
    return this.ransomwareService.getEntropyStream();
  }

  @Post('isolate-host')
  @ApiOperation({ summary: 'Isolate compromised endpoint from enterprise network segment' })
  @ApiResponse({ status: 200, description: 'Network isolation enforcement status' })
  isolateHost(@Body() dto: IsolateHostDto) {
    return this.ransomwareService.isolateHost(dto);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Telemetry, active honeypots, and mass rename interceptor metrics' })
  @ApiResponse({ status: 200, description: 'Ransomware guardian operational statistics' })
  getStatistics() {
    return this.ransomwareService.getStatistics();
  }
}
