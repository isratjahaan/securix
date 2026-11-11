import { Controller, Get, Post, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { BackupsService } from './backups.service';

@ApiTags('Cloud Backup Guardian & Disaster Recovery')
@Controller('backups')
export class BackupsController {
  constructor(private readonly backupsService: BackupsService) {}

  @Get('jobs')
  @ApiOperation({ summary: 'List immutable cloud backup jobs, schedules & retention rules' })
  getJobs() {
    return this.backupsService.getJobs();
  }

  @Get('jobs/:id')
  @ApiOperation({ summary: 'Get backup job execution details and integrity checksums' })
  getJobById(@Param('id') id: string) {
    return this.backupsService.getJobById(id);
  }

  @Post('jobs/:id/retry')
  @ApiOperation({ summary: 'Execute manual retry of backup job with real-time verification' })
  retryJob(@Param('id') id: string) {
    return this.backupsService.retryJob(id);
  }

  @Post('jobs/:id/verify')
  @ApiOperation({ summary: 'Run SHA-256 block-level cryptographic verification check' })
  verifyIntegrity(@Param('id') id: string) {
    return this.backupsService.verifyIntegrity(id);
  }

  @Get('recovery-history')
  @ApiOperation({ summary: 'List recovery and sandbox restore logs' })
  getRecoveryHistory() {
    return this.backupsService.getRecoveryHistory();
  }
}
