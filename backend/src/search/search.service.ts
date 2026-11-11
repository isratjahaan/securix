import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  globalSearch(query: string) {
    if (!query || query.trim().length === 0) {
      return { modules: [], users: [], devices: [], alerts: [], incidents: [], assets: [], threatIndicators: [] };
    }

    const q = query.toLowerCase().trim();
    const mem = this.prisma.memDb;

    const modules = mem.modules
      .filter((m) => m.name.toLowerCase().includes(q) || m.displayName.toLowerCase().includes(q) || m.description.toLowerCase().includes(q))
      .map((m) => ({ type: 'Module', id: m.id, title: m.displayName, subtitle: m.status, href: `/admin/modules` }));

    const users = mem.users
      .filter((u) => u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.username.toLowerCase().includes(q))
      .map((u) => ({ type: 'User', id: u.id, title: u.fullName, subtitle: u.email, href: `/admin/users/${u.id}` }));

    const devices = mem.devices
      .filter((d) => d.deviceName.toLowerCase().includes(q) || d.deviceId.toLowerCase().includes(q) || d.model.toLowerCase().includes(q))
      .map((d) => ({ type: 'Device', id: d.id, title: d.deviceName, subtitle: d.deviceId, href: `/admin/devices` }));

    const alerts = mem.alerts
      .filter((a) => a.title.toLowerCase().includes(q) || a.alertId.toLowerCase().includes(q) || a.description.toLowerCase().includes(q))
      .map((a) => ({ type: 'Alert', id: a.id, title: a.title, subtitle: `${a.alertId} • ${a.severity}`, href: `/admin/alerts` }));

    const incidents = mem.incidents
      .filter((i) => i.title.toLowerCase().includes(q) || i.incidentCode.toLowerCase().includes(q))
      .map((i) => ({ type: 'Incident', id: i.id, title: i.title, subtitle: `${i.incidentCode} • ${i.priority}`, href: `/admin/incidents` }));

    const assets = mem.assets
      .filter((a) => a.name.toLowerCase().includes(q) || a.target.toLowerCase().includes(q))
      .map((a) => ({ type: 'Asset', id: a.id, title: a.name, subtitle: `${a.type} • ${a.target}`, href: `/admin/assets` }));

    const threatIndicators = mem.threatIndicators
      .filter((t) => t.indicatorValue.toLowerCase().includes(q) || t.threatCategory.toLowerCase().includes(q))
      .map((t) => ({ type: 'Threat IOC', id: t.id, title: t.indicatorValue, subtitle: `${t.type} • ${t.threatCategory}`, href: `/admin/threat-intelligence` }));

    return {
      query,
      resultsCount:
        modules.length + users.length + devices.length + alerts.length + incidents.length + assets.length + threatIndicators.length,
      modules,
      users,
      devices,
      alerts,
      incidents,
      assets,
      threatIndicators,
    };
  }

  getCommandPaletteCommands() {
    return [
      { id: 'cmd-01', label: 'Go to Command Center Overview', category: 'Navigation', href: '/admin/overview' },
      { id: 'cmd-02', label: 'View Live SOC Monitoring', category: 'Navigation', href: '/admin/monitoring' },
      { id: 'cmd-03', label: 'Open 12-in-1 Module Control Center', category: 'Navigation', href: '/admin/modules' },
      { id: 'cmd-04', label: 'View Module Dependency Graph', category: 'Navigation', href: '/admin/modules/dependencies' },
      { id: 'cmd-05', label: 'Inspect Security Alert Center', category: 'SOC Operations', href: '/admin/alerts' },
      { id: 'cmd-06', label: 'Create New Security Incident', category: 'SOC Operations', href: '/admin/incidents' },
      { id: 'cmd-07', label: 'Inspect Android Endpoints (Endpoint Guardian)', category: 'Assets', href: '/admin/devices' },
      { id: 'cmd-08', label: 'Manage Perimeter Asset Registry', category: 'Assets', href: '/admin/assets' },
      { id: 'cmd-09', label: 'Inspect Threat Intelligence IOCs', category: 'Threat Intel', href: '/admin/threat-intelligence' },
      { id: 'cmd-10', label: 'Digital Forensics & Chain of Custody', category: 'Investigation', href: '/admin/forensics' },
      { id: 'cmd-11', label: 'Zero-Knowledge Vault Telemetry', category: 'Data Protection', href: '/admin/vault' },
      { id: 'cmd-12', label: 'Cloud Backup Integrity & Recovery', category: 'Data Protection', href: '/admin/backups' },
      { id: 'cmd-13', label: 'Search Immutable Audit Logs', category: 'System', href: '/admin/audit-logs' },
      { id: 'cmd-14', label: 'Database & PostgreSQL Health', category: 'System', href: '/admin/database-health' },
      { id: 'cmd-15', label: 'Enterprise Security Settings', category: 'Settings', href: '/admin/settings' },
    ];
  }
}
