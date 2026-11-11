import { Controller, Get, Patch, Param, Body, Query, Header } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('Identity & User Management')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'List and filter registered users' })
  getUsers(@Query('search') search?: string, @Query('status') status?: string) {
    return this.usersService.getUsers({ search, status });
  }

  @Get('export')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="sis_users_export.csv"')
  @ApiOperation({ summary: 'Export authorized user records to CSV' })
  exportUsers() {
    return this.usersService.exportUsersCsv();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get full user security profile, devices and activity' })
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Activate or suspend user account' })
  updateUserStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.usersService.updateUserStatus(id, status);
  }

  @Patch(':id/revoke-sessions')
  @ApiOperation({ summary: 'Revoke all active sessions for a user' })
  revokeUserSessions(@Param('id') id: string) {
    return this.usersService.revokeUserSessions(id);
  }
}
