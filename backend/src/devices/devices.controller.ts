import { Controller, Get, Post, Param, Query, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DevicesService } from './devices.service';

@ApiTags('Endpoint Guardian - Android Device Management & Anti-Theft')
@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Get()
  @ApiOperation({ summary: 'List and filter registered Android endpoints' })
  getDevices(@Query('status') status?: string, @Query('search') search?: string) {
    return this.devicesService.getDevices({ status, search });
  }

  @Post('register')
  @ApiOperation({ summary: 'Register or update an Android endpoint' })
  registerEndpoint(@Body() body: any) {
    return this.devicesService.registerDevice(body);
  }

  @Post()
  @ApiOperation({ summary: 'Register an Android endpoint (REST standard)' })
  registerDevice(@Body() body: any) {
    return this.devicesService.registerDevice(body);
  }

  @Get(':id/command-state')
  @ApiOperation({ summary: 'Get remote anti-theft command state (locked, siren, wipe)' })
  getCommandState(@Param('id') id: string) {
    return this.devicesService.getCommandState(id);
  }

  @Post(':id/heartbeat')
  @ApiOperation({ summary: 'Mobile endpoint heartbeat and sync telemetry' })
  heartbeat(@Param('id') id: string, @Body() body: any) {
    return this.devicesService.heartbeat(id, body);
  }

  @Post(':id/lock')
  @ApiOperation({ summary: 'Remote Anti-Theft: Emergency Lock Stolen Device' })
  lockDevice(@Param('id') id: string, @Body() body?: { reason?: string }) {
    return this.devicesService.lockDevice(id, body?.reason);
  }

  @Post(':id/unlock')
  @ApiOperation({ summary: 'Remote Anti-Theft: Unlock Recovered Device' })
  unlockDevice(@Param('id') id: string) {
    return this.devicesService.unlockDevice(id);
  }

  @Post(':id/siren')
  @ApiOperation({ summary: 'Remote Anti-Theft: Trigger / Mute Alarm Siren' })
  triggerSiren(@Param('id') id: string, @Body() body: { active: boolean }) {
    return this.devicesService.triggerSiren(id, body.active);
  }

  @Post(':id/wipe')
  @ApiOperation({ summary: 'Remote Anti-Theft: Wipe Local Vault & Sensitive Cache' })
  triggerWipe(@Param('id') id: string) {
    return this.devicesService.triggerWipe(id);
  }

  @Post(':id/isolate')
  @ApiOperation({ summary: 'Network Isolation: Quarantine Device' })
  isolateDevice(@Param('id') id: string) {
    return this.devicesService.isolateDevice(id);
  }

  @Post(':id/scan')
  @ApiOperation({ summary: 'Trigger Endpoint Threat Scan' })
  triggerScan(@Param('id') id: string) {
    return this.devicesService.triggerDeviceScan(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get device compliance report, posture score and OS attributes' })
  getDeviceById(@Param('id') id: string) {
    return this.devicesService.getDeviceById(id);
  }

  @Post(':id/deregister')
  @ApiOperation({ summary: 'Authorized deregistration of device from endpoint monitoring' })
  deregisterDevice(@Param('id') id: string) {
    return this.devicesService.deregisterDevice(id);
  }
}
