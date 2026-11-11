import { Controller, Get, Post, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { DevicesService } from './devices.service';

@ApiTags('Endpoint Guardian - Android Device Management')
@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Get()
  @ApiOperation({ summary: 'List and filter registered Android endpoints' })
  getDevices(@Query('status') status?: string, @Query('search') search?: string) {
    return this.devicesService.getDevices({ status, search });
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
