/**
 * SIS CYBER FORTRESS — Typed Inter-Module Event Contracts
 * Standard: Reverse-DNS dot-delimited taxonomy (e.g. 'threat.detected', 'module.lifecycle')
 */

export enum SecurityEventPattern {
  THREAT_DETECTED = 'threat.detected',
  THREAT_QUARANTINED = 'threat.quarantined',
  MODULE_STATE_CHANGED = 'module.lifecycle.changed',
  MODULE_CONFIG_UPDATED = 'module.config.updated',
  INCIDENT_CREATED = 'incident.created',
  INCIDENT_RESOLVED = 'incident.resolved',
  DEVICE_COMPLIANCE_CHANGED = 'device.compliance.changed',
  VAULT_KEY_ACCESSED = 'vault.access.audited',
  BACKUP_COMPLETED = 'backup.completed',
  FORENSIC_EVIDENCE_SEALED = 'forensics.evidence.sealed',
}

export interface BaseSecurityEvent {
  eventId: string;
  timestamp: string;
  sourceModuleId: string;
  sourceModuleName: string;
}

export class ThreatDetectedEvent implements BaseSecurityEvent {
  eventId: string;
  timestamp: string;
  sourceModuleId: string;
  sourceModuleName: string;

  threatType: string; // PHISHING, RANSOMWARE_CANARY, ROOT_VIOLATION, MITM_ARP, BRUTE_FORCE, MALICIOUS_IOC
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  targetEntity?: string; // IP, URL, User, DeviceId, FilePath
  iocIndicators?: string[];
  rawDetails?: Record<string, any>;

  constructor(partial: Partial<ThreatDetectedEvent> & { sourceModuleId: string; title: string; severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' }) {
    this.eventId = partial.eventId || `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    this.timestamp = partial.timestamp || new Date().toISOString();
    this.sourceModuleId = partial.sourceModuleId;
    this.sourceModuleName = partial.sourceModuleName || partial.sourceModuleId;
    this.threatType = partial.threatType || 'UNKNOWN_THREAT';
    this.severity = partial.severity;
    this.title = partial.title;
    this.description = partial.description || '';
    this.targetEntity = partial.targetEntity;
    this.iocIndicators = partial.iocIndicators || [];
    this.rawDetails = partial.rawDetails || {};
  }
}

export class ModuleLifecycleEvent implements BaseSecurityEvent {
  eventId: string;
  timestamp: string;
  sourceModuleId: string;
  sourceModuleName: string;

  moduleId: string;
  moduleDisplayName: string;
  action: 'ENABLED' | 'DISABLED' | 'RESTARTED' | 'MAINTENANCE' | 'REGISTERED';
  previousStatus?: string;
  currentStatus: string;
  actor: string;
  affectedDependents?: string[];

  constructor(partial: Partial<ModuleLifecycleEvent> & { moduleId: string; action: 'ENABLED' | 'DISABLED' | 'RESTARTED' | 'MAINTENANCE' | 'REGISTERED'; currentStatus: string }) {
    this.eventId = partial.eventId || `evt-mod-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    this.timestamp = partial.timestamp || new Date().toISOString();
    this.sourceModuleId = 'sis-module-center';
    this.sourceModuleName = 'Central Module Registry';
    this.moduleId = partial.moduleId;
    this.moduleDisplayName = partial.moduleDisplayName || partial.moduleId;
    this.action = partial.action;
    this.previousStatus = partial.previousStatus;
    this.currentStatus = partial.currentStatus;
    this.actor = partial.actor || 'SYSTEM';
    this.affectedDependents = partial.affectedDependents || [];
  }
}

export class IncidentCreatedEvent implements BaseSecurityEvent {
  eventId: string;
  timestamp: string;
  sourceModuleId: string;
  sourceModuleName: string;

  incidentId: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  assignedTo?: string;
  description: string;

  constructor(partial: Partial<IncidentCreatedEvent> & { incidentId: string; title: string; severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' }) {
    this.eventId = partial.eventId || `evt-inc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    this.timestamp = partial.timestamp || new Date().toISOString();
    this.sourceModuleId = partial.sourceModuleId || 'sis-cyber-soc';
    this.sourceModuleName = partial.sourceModuleName || 'SIS Cyber SOC';
    this.incidentId = partial.incidentId;
    this.title = partial.title;
    this.severity = partial.severity;
    this.assignedTo = partial.assignedTo;
    this.description = partial.description || '';
  }
}

export class DeviceComplianceEvent implements BaseSecurityEvent {
  eventId: string;
  timestamp: string;
  sourceModuleId: string;
  sourceModuleName: string;

  deviceId: string;
  deviceName: string;
  isCompliant: boolean;
  rootDetected: boolean;
  securityPostureScore: number;

  constructor(partial: Partial<DeviceComplianceEvent> & { deviceId: string; deviceName: string; isCompliant: boolean }) {
    this.eventId = partial.eventId || `evt-dev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    this.timestamp = partial.timestamp || new Date().toISOString();
    this.sourceModuleId = 'sis-endpoint';
    this.sourceModuleName = 'SIS Endpoint Guardian';
    this.deviceId = partial.deviceId;
    this.deviceName = partial.deviceName;
    this.isCompliant = partial.isCompliant;
    this.rootDetected = partial.rootDetected || false;
    this.securityPostureScore = partial.securityPostureScore ?? (partial.isCompliant ? 100 : 45);
  }
}

export class VaultAuditEvent implements BaseSecurityEvent {
  eventId: string;
  timestamp: string;
  sourceModuleId: string;
  sourceModuleName: string;

  action: string;
  recordIdentifier: string;
  zeroKnowledgeVerified: boolean;

  constructor(partial: Partial<VaultAuditEvent> & { action: string; recordIdentifier: string }) {
    this.eventId = partial.eventId || `evt-vlt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    this.timestamp = partial.timestamp || new Date().toISOString();
    this.sourceModuleId = 'sis-vault';
    this.sourceModuleName = 'SIS Vault Guardian';
    this.action = partial.action;
    this.recordIdentifier = partial.recordIdentifier;
    this.zeroKnowledgeVerified = true;
  }
}
