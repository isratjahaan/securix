import { Controller, Get, Query, Header } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuditService } from './audit.service';

@ApiTags('Central Audit Log & Immutable Compliance Trails')
@Controller('audit-logs')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @ApiOperation({ summary: 'Search and filter centralized immutable audit log entries' })
  getAuditLogs(
    @Query('action') action?: string,
    @Query('actor') actor?: string,
    @Query('search') search?: string,
  ) {
    return this.auditService.getAuditLogs({ action, actor, search });
  }

  @Get('export')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="sis_immutable_audit_logs.csv"')
  @ApiOperation({ summary: 'Export authorized audit trail to CSV format' })
  exportAuditLogs() {
    return this.auditService.exportAuditCsv();
  }
}
