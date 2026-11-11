import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminsService {
  constructor(private readonly prisma: PrismaService) {}

  getAdministrators() {
    return this.prisma.memDb.users.filter((u) => u.adminRoleType);
  }

  getRoles() {
    return [
      {
        id: 'role-super-admin',
        name: 'SUPER_ADMIN',
        displayName: 'Super Administrator',
        description: 'Full authorized system administration across all modules, settings and infrastructure.',
        permissions: ['*'],
        adminCount: 1,
        isSystemRole: true,
      },
      {
        id: 'role-security-admin',
        name: 'SECURITY_ADMIN',
        displayName: 'Security Operations Admin',
        description: 'Security operations, alerts, incident triage, threat feeds and forensics management.',
        permissions: [
          'dashboard.view',
          'incidents.view',
          'incidents.assign',
          'incidents.resolve',
          'threats.manage',
          'devices.view',
          'forensics.manage',
          'audit.view',
        ],
        adminCount: 1,
        isSystemRole: true,
      },
      {
        id: 'role-module-admin',
        name: 'MODULE_ADMIN',
        displayName: 'Module Administrator',
        description: 'Management and operational configuration of explicitly assigned modules.',
        permissions: [
          'dashboard.view',
          'modules.view',
          'modules.configure',
          'modules.enable',
          'devices.view',
          'assets.view',
        ],
        adminCount: 1,
        isSystemRole: true,
      },
      {
        id: 'role-auditor',
        name: 'AUDITOR',
        displayName: 'Compliance Auditor',
        description: 'Read-only access to authorized audit records, reports and compliance evidence.',
        permissions: ['dashboard.view', 'audit.view', 'reports.export'],
        adminCount: 1,
        isSystemRole: true,
      },
    ];
  }

  getPermissions() {
    return [
      { code: 'dashboard.view', name: 'View Command Dashboard', category: 'General' },
      { code: 'users.view', name: 'View Registered Users', category: 'Identity' },
      { code: 'users.create', name: 'Create Users', category: 'Identity' },
      { code: 'users.update', name: 'Update User Details', category: 'Identity' },
      { code: 'users.suspend', name: 'Suspend/Lock Users', category: 'Identity' },
      { code: 'modules.view', name: 'View Ecosystem Modules', category: 'Modules' },
      { code: 'modules.register', name: 'Register New Module', category: 'Modules' },
      { code: 'modules.enable', name: 'Enable Inactive Module', category: 'Modules' },
      { code: 'modules.disable', name: 'Disable Active Module', category: 'Modules' },
      { code: 'modules.configure', name: 'Change Module Configuration', category: 'Modules' },
      { code: 'incidents.view', name: 'View SOC Incidents', category: 'SOC' },
      { code: 'incidents.assign', name: 'Assign Incident Commanders', category: 'SOC' },
      { code: 'incidents.resolve', name: 'Close & Resolve Incidents', category: 'SOC' },
      { code: 'threats.manage', name: 'Manage IOCs & Threat Feeds', category: 'Threat Intel' },
      { code: 'devices.view', name: 'Inspect Registered Endpoints', category: 'Assets' },
      { code: 'reports.export', name: 'Export Intelligence Reports', category: 'Reports' },
      { code: 'audit.view', name: 'View Security Audit Logs', category: 'Audit' },
      { code: 'settings.manage', name: 'Modify System Security Policies', category: 'Settings' },
      { code: 'admins.manage', name: 'Manage Administrator RBAC', category: 'Settings' },
    ];
  }

  getActiveSessions() {
    return [
      {
        id: 'sess-001',
        adminName: 'Dr. Sarah Vance',
        role: 'SUPER_ADMIN',
        ipAddress: '192.168.10.14',
        userAgent: 'Firefox Enterprise / Linux x86_64',
        location: 'HQ Central Command Facility',
        loginTime: new Date(Date.now() - 3600000 * 2).toISOString(),
        expiresIn: '6 hours',
        isCurrent: true,
      },
      {
        id: 'sess-002',
        adminName: 'Marcus Brooks',
        role: 'SECURITY_ADMIN',
        ipAddress: '192.168.10.28',
        userAgent: 'Chrome 124 / Windows 11 Secure Workstation',
        location: 'SOC Operations Floor A',
        loginTime: new Date(Date.now() - 3600000 * 4).toISOString(),
        expiresIn: '4 hours',
        isCurrent: false,
      },
    ];
  }

  getLoginHistory() {
    return [
      {
        id: 'log-01',
        adminName: 'Dr. Sarah Vance',
        ipAddress: '192.168.10.14',
        status: 'SUCCESS',
        mfaVerified: true,
        timestamp: new Date().toISOString(),
      },
      {
        id: 'log-02',
        adminName: 'Marcus Brooks',
        ipAddress: '192.168.10.28',
        status: 'SUCCESS',
        mfaVerified: true,
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
      {
        id: 'log-03',
        adminName: 'Unknown / Root Probe',
        ipAddress: '185.220.101.5',
        status: 'BLOCKED',
        mfaVerified: false,
        timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
      },
    ];
  }

  toggleAdminMfa(id: string, enforce: boolean, actor: string = 'Super Admin') {
    const admin = this.prisma.memDb.users.find((u) => u.id === id);
    if (!admin) throw new NotFoundException('Administrator not found');

    admin.mfaEnforced = enforce;

    this.prisma.memDb.auditLogs.unshift({
      id: 'aud-' + Date.now(),
      actorName: actor,
      actorRole: 'SUPER_ADMIN',
      action: 'ADMIN_MFA_POLICY_TOGGLED',
      targetResource: `Admin ${admin.email}`,
      result: 'SUCCESS',
      ipAddress: '192.168.10.14',
      timestamp: new Date().toISOString(),
      details: { mfaEnforced: enforce },
    });

    return admin;
  }
}
