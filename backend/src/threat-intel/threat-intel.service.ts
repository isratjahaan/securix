import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ThreatIntelService {
  constructor(private readonly prisma: PrismaService) {}

  getIndicators(query?: { type?: string; severity?: string; search?: string }) {
    let list = [...this.prisma.memDb.threatIndicators];

    if (query?.type) {
      list = list.filter((i) => i.type.toUpperCase() === query.type.toUpperCase());
    }
    if (query?.severity) {
      list = list.filter((i) => i.severity.toUpperCase() === query.severity.toUpperCase());
    }
    if (query?.search) {
      const q = query.search.toLowerCase();
      list = list.filter(
        (i) =>
          i.indicatorValue.toLowerCase().includes(q) ||
          i.threatCategory.toLowerCase().includes(q) ||
          i.source.toLowerCase().includes(q),
      );
    }

    return list.sort((a, b) => new Date(b.lastSeenAt).getTime() - new Date(a.lastSeenAt).getTime());
  }

  getFeeds() {
    return this.prisma.memDb.threatFeedSources;
  }

  createIndicator(data: any, actor: string = 'Security Analyst') {
    if (!data.indicatorValue || !data.type) {
      throw new BadRequestException('Indicator value and type (IP/DOMAIN/URL/FILE_HASH) are required.');
    }

    // Check duplicates
    const duplicate = this.prisma.memDb.threatIndicators.find(
      (i) => i.indicatorValue.toLowerCase() === data.indicatorValue.toLowerCase(),
    );
    if (duplicate) {
      throw new BadRequestException(`Duplicate IOC: Indicator "${data.indicatorValue}" already recorded.`);
    }

    const newIoc = {
      id: 'ioc-' + Date.now(),
      indicatorValue: data.indicatorValue,
      type: data.type.toUpperCase(),
      severity: data.severity || 'HIGH',
      confidenceScore: data.confidenceScore || 85,
      threatCategory: data.threatCategory || 'Suspicious Infrastructure',
      source: data.source || 'SIS Analyst Internal Attribution',
      description: data.description || 'Manually registered threat indicator.',
      firstSeenAt: new Date().toISOString(),
      lastSeenAt: new Date().toISOString(),
      expiresAt: data.expiresAt || new Date(Date.now() + 86400000 * 90).toISOString(),
    };

    this.prisma.memDb.threatIndicators.unshift(newIoc);

    this.prisma.memDb.auditLogs.unshift({
      id: 'aud-' + Date.now(),
      actorName: actor,
      actorRole: 'SECURITY_ADMIN',
      action: 'IOC_REGISTERED',
      targetResource: `IOC ${newIoc.indicatorValue} (${newIoc.type})`,
      result: 'SUCCESS',
      ipAddress: '192.168.10.14',
      timestamp: new Date().toISOString(),
      details: { confidence: newIoc.confidenceScore, category: newIoc.threatCategory },
    });

    return newIoc;
  }

  syncFeed(id: string, actor: string = 'Security Admin') {
    const feed = this.prisma.memDb.threatFeedSources.find((f) => f.id === id);
    if (!feed) throw new NotFoundException('Threat feed source not found');

    feed.lastSyncAt = new Date().toISOString();
    feed.status = 'HEALTHY';
    feed.totalIndicatorsCount += Math.floor(Math.random() * 25) + 5;

    this.prisma.memDb.auditLogs.unshift({
      id: 'aud-' + Date.now(),
      actorName: actor,
      actorRole: 'SECURITY_ADMIN',
      action: 'THREAT_FEED_SYNCED',
      targetResource: `Feed ${feed.name}`,
      result: 'SUCCESS',
      ipAddress: '192.168.10.14',
      timestamp: new Date().toISOString(),
      details: { totalIndicators: feed.totalIndicatorsCount },
    });

    return {
      success: true,
      message: `Threat feed "${feed.name}" synchronized. Retrieved latest validated indicators.`,
      feed,
    };
  }

  exportIndicatorsCsv() {
    const iocs = this.prisma.memDb.threatIndicators;
    const header = 'ID,Indicator Value,Type,Severity,Confidence Score,Category,Source,First Seen,Last Seen\n';
    const rows = iocs
      .map(
        (i) =>
          `"${i.id}","${i.indicatorValue}","${i.type}","${i.severity}",${i.confidenceScore},"${i.threatCategory}","${i.source}","${i.firstSeenAt}","${i.lastSeenAt}"`,
      )
      .join('\n');
    return header + rows;
  }
}
