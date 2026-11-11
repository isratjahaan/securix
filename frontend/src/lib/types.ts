export type SeverityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATIONAL';
export type ModuleStatus = 'INSTALLED' | 'ACTIVE' | 'DISABLED' | 'MAINTENANCE' | 'DEGRADED' | 'BLOCKED' | 'ARCHIVED';
export type HealthStatus = 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY' | 'OFFLINE' | 'UNKNOWN';
export type AlertStatus = 'NEW' | 'ACKNOWLEDGED' | 'ASSIGNED' | 'ESCALATED' | 'RESOLVED' | 'DISMISSED';
export type IncidentStatus = 'NEW' | 'ACKNOWLEDGED' | 'INVESTIGATING' | 'CONTAINED' | 'RESOLVED' | 'CLOSED';
export type IncidentPriority = 'P0_CRITICAL' | 'P1_HIGH' | 'P2_MEDIUM' | 'P3_LOW';
export type DeviceStatus = 'ONLINE' | 'OFFLINE' | 'COMPLIANT' | 'NON_COMPLIANT' | 'FLAGGED' | 'DEREGISTERED';
export type AssetType = 'WEBSITE' | 'DOMAIN' | 'IP_ADDRESS' | 'NETWORK' | 'ANDROID_DEVICE' | 'PROJECT_ENVIRONMENT' | 'TEST_ENVIRONMENT';
export type AuthorizationStatus = 'AUTHORIZED' | 'PENDING_VERIFICATION' | 'UNAUTHORIZED' | 'REVOKED';

export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  phone?: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION' | 'LOCKED' | 'DEACTIVATED';
  isEmailVerified: boolean;
  mfaEnabled: boolean;
  lastLoginAt?: string;
  lastLoginIp?: string;
  createdAt: string;
  updatedAt: string;
  roles?: string[];
}

export interface AdminUser extends User {
  adminRoleType: 'SUPER_ADMIN' | 'SECURITY_ADMIN' | 'MODULE_ADMIN' | 'AUDITOR';
  department?: string;
  assignedModules?: string[];
  mfaEnforced: boolean;
  securityBadgeNumber?: string;
  permissions?: string[];
}

export interface ModuleInfo {
  id: string;
  name: string;
  displayName: string;
  description: string;
  version: string;
  status: ModuleStatus;
  healthStatus: HealthStatus;
  isCore: boolean;
  apiEndpoint: string;
  documentationUrl?: string;
  icon?: string;
  lastActivityAt: string;
  lastHealthCheckAt: string;
  dependencies?: string[];
  dependents?: string[];
  permissions?: string[];
  responseTimeMs?: number;
  cpuUsage?: number;
  memoryUsageMb?: number;
}

export interface SecurityAlert {
  id: string;
  alertId: string;
  title: string;
  description: string;
  moduleId: string;
  moduleName?: string;
  severity: SeverityLevel;
  status: AlertStatus;
  sourceIp?: string;
  targetResource?: string;
  deviceId?: string;
  assetId?: string;
  incidentId?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Incident {
  id: string;
  incidentCode: string;
  title: string;
  description: string;
  moduleId?: string;
  moduleName?: string;
  priority: IncidentPriority;
  status: IncidentStatus;
  assetId?: string;
  assetTarget?: string;
  assignedInvestigators?: { id: string; name: string; role: string }[];
  resolutionSummary?: string;
  containedAt?: string;
  resolvedAt?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
  alertsCount?: number;
}

export interface DeviceInfo {
  id: string;
  deviceId: string;
  deviceName: string;
  manufacturer: string;
  model: string;
  androidVersion: string;
  securityPatchLevel?: string;
  ownerName: string;
  ownerEmail: string;
  status: DeviceStatus;
  isCompliant: boolean;
  securityPostureScore: number;
  encryptionEnabled: boolean;
  rootDetected: boolean;
  developerModeEnabled: boolean;
  lastSyncAt: string;
  registeredAt: string;
}

export interface AssetInfo {
  id: string;
  name: string;
  type: AssetType;
  target: string;
  ownerName?: string;
  authorizationStatus: AuthorizationStatus;
  authorizationProof?: string;
  scopeDescription?: string;
  riskStatus: SeverityLevel;
  lastAssessmentAt?: string;
  tags: string[];
  createdAt: string;
}

export interface ThreatIndicator {
  id: string;
  indicatorValue: string;
  type: 'IP' | 'DOMAIN' | 'URL' | 'FILE_HASH' | 'EMAIL' | 'CVE';
  severity: SeverityLevel;
  confidenceScore: number;
  threatCategory: string;
  source: string;
  description?: string;
  firstSeenAt: string;
  lastSeenAt: string;
  expiresAt?: string;
}

export interface ForensicCase {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  status: 'ACTIVE' | 'IN_PROGRESS' | 'PENDING_REVIEW' | 'CLOSED' | 'ARCHIVED';
  priority: IncidentPriority;
  leadInvestigatorName: string;
  incidentCode?: string;
  evidenceCount: number;
  findingsSummary?: string;
  openedAt: string;
  closedAt?: string;
}

export interface EvidenceItem {
  id: string;
  evidenceNumber: string;
  caseNumber: string;
  name: string;
  evidenceType: string;
  sha256Hash: string;
  md5Hash?: string;
  fileSizeBytes: number;
  storageLocation: string;
  collectorName: string;
  collectedAt: string;
  notes?: string;
  custodyHistory?: {
    actor: string;
    action: string;
    purpose: string;
    timestamp: string;
  }[];
}

export interface BackupJobInfo {
  id: string;
  name: string;
  targetModule: string;
  scheduleCron: string;
  retentionDays: number;
  storageProvider: string;
  isEnabled: boolean;
  lastRunStatus: 'SCHEDULED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'VERIFYING' | 'VERIFIED';
  lastRunAt?: string;
  nextRunAt?: string;
  lastBackupSizeMb?: number;
  sha256Checksum?: string;
  isIntegrityVerified?: boolean;
}

export interface AuditLogItem {
  id: string;
  actorName: string;
  actorRole: string;
  action: string;
  targetResource: string;
  resourceId?: string;
  ipAddress?: string;
  requestId?: string;
  result: 'SUCCESS' | 'FAILURE' | 'DENIED';
  timestamp: string;
  details?: Record<string, any>;
}

export interface SystemHealthData {
  backendStatus: HealthStatus;
  databaseStatus: HealthStatus;
  databaseType: string;
  databaseConnections: number;
  websocketStatus: HealthStatus;
  notificationStatus: HealthStatus;
  backupServiceStatus: HealthStatus;
  uptimeSeconds: number;
  memoryUsageMb: number;
  cpuUsagePercent: number;
  lastHealthCheck: string;
  activeModulesCount: number;
  totalModulesCount: number;
}
