import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  SecurityEventPattern,
  ThreatDetectedEvent,
  ModuleLifecycleEvent,
  IncidentCreatedEvent,
  DeviceComplianceEvent,
  VaultAuditEvent,
  BaseSecurityEvent,
} from './security-events';

@Injectable()
export class EventBusService {
  private readonly logger = new Logger('CentralEventBus');
  // Deduplication cache with TTL ring buffer to prevent duplicate event loops
  private readonly processedEventIds = new Set<string>();
  private readonly maxCacheSize = 1000;

  constructor(private readonly eventEmitter: EventEmitter2) {}

  /**
   * Safe event emission with deduplication and error isolation
   */
  emit<T extends BaseSecurityEvent>(pattern: string, event: T): boolean {
    if (!event || !event.eventId) {
      this.logger.warn(`Rejected event emission: Event missing required eventId for pattern "${pattern}"`);
      return false;
    }

    // Deduplication guard
    if (this.processedEventIds.has(event.eventId)) {
      this.logger.warn(`Duplicate event suppressed: ${event.eventId} [${pattern}]`);
      return false;
    }

    // Register event in deduplication ring buffer
    this.trackEventId(event.eventId);

    this.logger.log(`📡 [BUS DISPATCH] Pattern: "${pattern}" | Source: ${event.sourceModuleId} | ID: ${event.eventId}`);

    try {
      this.eventEmitter.emit(pattern, event);
      return true;
    } catch (err: any) {
      this.logger.error(`Error dispatching event "${pattern}": ${err?.message}`, err?.stack);
      return false;
    }
  }

  // --- Strongly Typed Convenience Publishers ---

  publishThreat(event: ThreatDetectedEvent): boolean {
    return this.emit(SecurityEventPattern.THREAT_DETECTED, event);
  }

  publishLifecycle(event: ModuleLifecycleEvent): boolean {
    return this.emit(SecurityEventPattern.MODULE_STATE_CHANGED, event);
  }

  publishIncident(event: IncidentCreatedEvent): boolean {
    return this.emit(SecurityEventPattern.INCIDENT_CREATED, event);
  }

  publishDeviceCompliance(event: DeviceComplianceEvent): boolean {
    return this.emit(SecurityEventPattern.DEVICE_COMPLIANCE_CHANGED, event);
  }

  publishVaultAudit(event: VaultAuditEvent): boolean {
    return this.emit(SecurityEventPattern.VAULT_KEY_ACCESSED, event);
  }

  private trackEventId(id: string) {
    if (this.processedEventIds.size >= this.maxCacheSize) {
      // Remove first inserted item
      const first = this.processedEventIds.values().next().value;
      if (first) this.processedEventIds.delete(first);
    }
    this.processedEventIds.add(id);
  }
}
