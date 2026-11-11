import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AdminsService } from './admins.service';

@ApiTags('Admin Management & RBAC')
@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Get()
  @ApiOperation({ summary: 'List privileged system administrators and assigned roles' })
  getAdministrators() {
    return this.adminsService.getAdministrators();
  }

  @Get('roles')
  @ApiOperation({ summary: 'List system roles and granted permission lists' })
  getRoles() {
    return this.adminsService.getRoles();
  }

  @Get('permissions')
  @ApiOperation({ summary: 'List granular security permissions directory' })
  getPermissions() {
    return this.adminsService.getPermissions();
  }

  @Get('sessions')
  @ApiOperation({ summary: 'List active administrative sessions' })
  getActiveSessions() {
    return this.adminsService.getActiveSessions();
  }

  @Get('logins')
  @ApiOperation({ summary: 'Get administrative login history audit' })
  getLoginHistory() {
    return this.adminsService.getLoginHistory();
  }

  @Patch(':id/mfa')
  @ApiOperation({ summary: 'Enforce or relax administrative MFA requirement' })
  toggleAdminMfa(@Param('id') id: string, @Body('enforce') enforce: boolean) {
    return this.adminsService.toggleAdminMfa(id, enforce);
  }
}
