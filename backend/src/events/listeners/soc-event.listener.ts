import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  SecurityEventPattern,
  ThreatDetectedEvent,
  ModuleLifecycleEvent,
  IncidentCreatedEvent,
  DeviceComplianceEvent,
  VaultAuditEvent,
} from '../security-events';
import { PrismaService } from '../../prisma/prisma.service';
import { SocGateway } from '../../soc/soc.gateway';

@Injectable()
export class SocEventListener {
  private readonly logger = new Logger('SocEventListener');

  constructor(
    private readonly prisma: PrismaService,
    private readonly socGateway: SocGateway,
  ) {}

  @OnEvent(SecurityEventPattern.THREAT_DETECTED, { async: true })
  async handleThreatDetected(event: ThreatDetectedEvent) {
    this.logger.log(`🚨 [CROSS-MODULE INGESTION] ${event.sourceModuleName} -> Cyber SOC: "${event.title}" [${event.severity}]`);

    const newAlert = {
      id: `alt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: event.title,
      severity: event.severity,
      threatCategory: event.threatType,
      source: event.sourceModuleName,
      status: 'NEW',
      assetTarget: event.targetEntity || event.sourceModuleId,
      timestamp: event.timestamp,
      acknowledgedBy: null,
      description: event.description,
      rawDetails: event.rawDetails,
    };

    // 1. Commit alert into central data store
    this.prisma.memDb.alerts.unshift(newAlert);

    // 2. Broadcast via WebSocket to Web Admin and Android real-time consumers
    this.socGateway.broadcastNewAlert(newAlert);

    // 3. Append to immutable Audit Trail
    this.prisma.memDb.auditLogs.unshift({
      id: `aud-${Date.now()}`,
      actorName: event.sourceModuleName,
      actorRole: 'AUTOMATED_SECURITY_PIPELINE',
      action: 'THREAT_ALERT_GENERATED',
      targetResource: event.targetEntity || event.sourceModuleId,
      result: 'DETECTED',
      ipAddress: '127.0.0.1',
      timestamp: event.timestamp,
      details: {
        alertId: newAlert.id,
        severity: event.severity,
        threatType: event.threatType,
        eventId: event.eventId,
      },
    });
  }

  @OnEvent(SecurityEventPattern.MODULE_STATE_CHANGED, { async: true })
  async handleModuleStateChanged(event: ModuleLifecycleEvent) {
    this.logger.log(`⚙️ [MODULE STATE INGESTION] ${event.moduleDisplayName} transitioned to ${event.currentStatus} by ${event.actor}`);

    const targetModule = this.prisma.memDb.modules.find((m) => m.id === event.moduleId);
    if (targetModule) {
      this.socGateway.broadcastModuleStateChange(targetModule);
    }
  }

  @OnEvent(SecurityEventPattern.INCIDENT_CREATED, { async: true })
  async handleIncidentCreated(event: IncidentCreatedEvent) {
    this.logger.log(`📋 [INCIDENT INGESTION] Incident created: ${event.incidentId} - ${event.title}`);
    this.socGateway.broadcastIncidentUpdate(event);
  }

  @OnEvent(SecurityEventPattern.DEVICE_COMPLIANCE_CHANGED, { async: true })
  async handleDeviceComplianceChanged(event: DeviceComplianceEvent) {
    this.logger.log(`📱 [DEVICE INGESTION] Device ${event.deviceName} compliance: ${event.isCompliant ? 'COMPLIANT' : 'VIOLATION'}`);
    if (!event.isCompliant) {
      this.handleThreatDetected(
        new ThreatDetectedEvent({
          sourceModuleId: 'sis-endpoint',
          sourceModuleName: 'SIS Endpoint Guardian',
          threatType: 'ROOT_INTEGRITY_VIOLATION',
          severity: 'CRITICAL',
          title: `Hardware Root / Integrity Violation on ${event.deviceName}`,
          description: `Device ID ${event.deviceId} failed Knox/Play Integrity attestations. Automatic quarantine recommended.`,
          targetEntity: event.deviceId,
        }),
      );
    }
  }

  @OnEvent(SecurityEventPattern.VAULT_KEY_ACCESSED, { async: true })
  async handleVaultAccess(event: VaultAuditEvent) {
    this.logger.log(`🔒 [VAULT INGESTION] Zero-knowledge secret accessed: ${event.recordIdentifier} (${event.action})`);
  }
}
