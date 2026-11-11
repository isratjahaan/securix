import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  getAuditLogs(query?: { action?: string; actor?: string; search?: string }) {
    let list = [...this.prisma.memDb.auditLogs];

    if (query?.action) {
      list = list.filter((a) => a.action.toUpperCase().includes(query.action.toUpperCase()));
    }
    if (query?.actor) {
      list = list.filter((a) => a.actorName.toLowerCase().includes(query.actor.toLowerCase()));
    }
    if (query?.search) {
      const q = query.search.toLowerCase();
      list = list.filter(
        (a) =>
          a.action.toLowerCase().includes(q) ||
          a.targetResource.toLowerCase().includes(q) ||
          a.actorName.toLowerCase().includes(q) ||
          (a.ipAddress && a.ipAddress.includes(q)),
      );
    }

    return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  exportAuditCsv() {
    const logs = this.prisma.memDb.auditLogs;
    const header = 'ID,Timestamp,Actor,Role,Action,Target Resource,Result,IP Address\n';
    const rows = logs
      .map(
        (l) =>
          `"${l.id}","${l.timestamp}","${l.actorName}","${l.actorRole}","${l.action}","${l.targetResource}","${l.result}","${l.ipAddress || ''}"`,
      )
      .join('\n');
    return header + rows;
  }
}
