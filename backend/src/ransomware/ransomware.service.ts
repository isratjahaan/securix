import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventBusService } from '../events/event-bus.service';
import { ThreatDetectedEvent } from '../events/security-events';
import { TripwireTestDto, IsolateHostDto } from './dto/ransomware.dto';

export interface CanaryHoneypot {
  id: string;
  filename: string;
  path: string;
  status: 'INTACT' | 'MUTATED' | 'COMPROMISED';
  lastIntegrityHash: string;
  monitoredSince: string;
  sector: string;
}

@Injectable()
export class RansomwareService {
  private readonly logger = new Logger('RansomwareService');

  private canaries: CanaryHoneypot[] = [
    {
      id: 'CANARY-FINANCE-01',
      filename: '~$_Executive_Compensation_2026.docx',
      path: '/shared/finance/decoy/~$_Executive_Compensation_2026.docx',
      status: 'INTACT',
      lastIntegrityHash: '9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b',
      monitoredSince: '2026-01-15T00:00:00Z',
      sector: 'FINANCE_STORAGE',
    },
    {
      id: 'CANARY-LEGAL-02',
      filename: 'Patent_Litigation_Internal_Confidential.xlsx',
      path: '/shared/legal/confidential/Patent_Litigation_Internal_Confidential.xlsx',
      status: 'INTACT',
      lastIntegrityHash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
      monitoredSince: '2026-02-01T00:00:00Z',
      sector: 'LEGAL_VAULT',
    },
    {
      id: 'CANARY-DATABASE-03',
      filename: 'customer_credentials_backup_unencrypted.sql',
      path: '/data/backups/raw/customer_credentials_backup_unencrypted.sql',
      status: 'INTACT',
      lastIntegrityHash: '5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9a8b7c6d',
      monitoredSince: '2026-03-10T00:00:00Z',
      sector: 'DB_CLUSTER',
    },
  ];

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventBus: EventBusService,
  ) {}

  getCanaries() {
    return this.canaries;
  }

  testTripwire(dto: TripwireTestDto, actor: string = 'Security Auditor') {
    const canary = this.canaries.find((c) => c.id === dto.canaryId || c.filename === dto.canaryId);
    if (!canary) throw new NotFoundException(`Canary honeypot ${dto.canaryId} not found`);

    const entropy = dto.simulatedEntropy || 8.14;
    canary.status = 'MUTATED';

    this.logger.warn(`⚠️ [RANSOMWARE TRIPWIRE TRIGGERED] Honeypot ${canary.id} modified! Entropy: ${entropy}`);

    // Decoupled Event Publication
    this.eventBus.publishThreat(
      new ThreatDetectedEvent({
        sourceModuleId: 'sis-ransomware',
        sourceModuleName: 'SIS Ransomware Guardian',
        threatType: 'RANSOMWARE_CANARY_TRIPWIRE',
        severity: 'CRITICAL',
        title: `Honeypot Canary Mutated: ${canary.filename}`,
        description: `Canary decoy file altered in ${canary.sector}. High Shannon entropy (${entropy}/8.00) indicates active ransomware encryption process.`,
        targetEntity: canary.path,
        iocIndicators: ['SHANNON_ENTROPY_ANOMALY', canary.filename],
        rawDetails: {
          canaryId: canary.id,
          sector: canary.sector,
          entropy,
          actor,
        },
      }),
    );

    return {
      success: true,
      alertDispatched: true,
      canaryStatus: canary.status,
      simulatedEntropy: entropy,
      message: `Ransomware tripwire triggered. Critical incident dispatched to Cyber SOC.`,
    };
  }

  getEntropyStream() {
    return {
      baselineEntropy: 4.35,
      currentThreshold: 7.95,
      activeStreamsMonitored: 84,
      anomalyDetected: false,
      algorithm: 'Shannon-Entropy-64KB-Block',
      timestamp: new Date().toISOString(),
    };
  }

  isolateHost(dto: IsolateHostDto, actor: string = 'SOC Automated Containment') {
    this.logger.log(`🛡️ Host ${dto.hostIdentifier} quarantined by ${actor}. Reason: ${dto.reason}`);

    // Record in central audit
    this.prisma.memDb.auditLogs.unshift({
      id: `aud-iso-${Date.now()}`,
      actorName: actor,
      actorRole: 'RANSOMWARE_AUTOMATED_CONTAINMENT',
      action: 'HOST_ISOLATED_FROM_SEGMENT',
      targetResource: dto.hostIdentifier,
      result: 'SUCCESS',
      ipAddress: '127.0.0.1',
      timestamp: new Date().toISOString(),
      details: {
        host: dto.hostIdentifier,
        reason: dto.reason,
      },
    });

    return {
      success: true,
      isolatedHost: dto.hostIdentifier,
      networkState: 'QUARANTINED_ISOLATED',
      timestamp: new Date().toISOString(),
      message: `Host ${dto.hostIdentifier} isolated from enterprise network segment. Lateral movement severed.`,
    };
  }

  getStatistics() {
    return {
      canariesDeployed: this.canaries.length,
      intactCanaries: this.canaries.filter((c) => c.status === 'INTACT').length,
      tripwiresActive: true,
      massRenameInterceptorsActive: true,
      shannonThreshold: 7.95,
      lastTripwireAudit: new Date().toISOString(),
    };
  }
}
