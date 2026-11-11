import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  getReportTemplates() {
    return [
      { id: 'sec-summary', name: 'Overall Security Summary', category: 'Executive' },
      { id: 'mod-perf', name: 'Module Performance & Telemetry', category: 'Infrastructure' },
      { id: 'mod-avail', name: 'Module Availability & SLA History', category: 'Infrastructure' },
      { id: 'sec-incidents', name: 'Security Incidents & Triage Log', category: 'SOC' },
      { id: 'threat-intel', name: 'Threat Intelligence & IOC Report', category: 'Threat Intel' },
      { id: 'dev-compliance', name: 'Endpoint Device Compliance', category: 'Compliance' },
      { id: 'usr-activity', name: 'User Authentication & Activity', category: 'Identity' },
      { id: 'adm-activity', name: 'Administrative RBAC & Policy Changes', category: 'Audit' },
      { id: 'web-assessment', name: 'Website & Perimeter Assessment', category: 'Perimeter' },
      { id: 'backup-recovery', name: 'Backup Readiness & Integrity Proof', category: 'Data Protection' },
      { id: 'audit-summary', name: 'Audit Trail Summary', category: 'Governance' },
      { id: 'int-health', name: 'Integration & API Health SLA', category: 'Engineering' },
    ];
  }

  generateReport(dto: { reportType: string; format?: string; dateRange?: string }, actor: string = 'Dr. Sarah Vance') {
    const templates = this.getReportTemplates();
    const template = templates.find((t) => t.id === dto.reportType);
    if (!template) {
      throw new BadRequestException(`Unknown report type "${dto.reportType}".`);
    }

    const reportId = 'REP-2026-' + Math.floor(1000 + Math.random() * 9000);
    const format = (dto.format || 'PDF').toUpperCase();

    this.prisma.memDb.auditLogs.unshift({
      id: 'aud-' + Date.now(),
      actorName: actor,
      actorRole: 'SUPER_ADMIN',
      action: 'REPORT_GENERATED',
      targetResource: `Report ${template.name}`,
      result: 'SUCCESS',
      ipAddress: '192.168.10.14',
      timestamp: new Date().toISOString(),
      details: { format, dateRange: dto.dateRange || 'Last 30 Days' },
    });

    return {
      reportId,
      title: template.name,
      category: template.category,
      format,
      generatedAt: new Date().toISOString(),
      generatedBy: actor,
      dateRange: dto.dateRange || 'Last 30 Days',
      downloadUrl: `/api/reports/download/${reportId}?format=${format.toLowerCase()}`,
      metricsSummary: {
        activeModules: this.prisma.memDb.modules.filter((m) => m.status === 'ACTIVE').length,
        openIncidents: this.prisma.memDb.incidents.filter((i) => i.status !== 'CLOSED').length,
        compliantDevices: this.prisma.memDb.devices.filter((d) => d.isCompliant).length,
        verifiedBackups: this.prisma.memDb.backupJobs.filter((b) => b.isIntegrityVerified).length,
      },
    };
  }
}
