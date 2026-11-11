import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SocGateway } from './soc.gateway';

@Injectable()
export class SocService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly socGateway: SocGateway,
  ) {}

  getOverview() {
    const alerts = this.prisma.memDb.alerts;
    const incidents = this.prisma.memDb.incidents;

    const criticalAlerts = alerts.filter((a) => a.severity === 'CRITICAL' && a.status !== 'RESOLVED').length;
    const highAlerts = alerts.filter((a) => a.severity === 'HIGH' && a.status !== 'RESOLVED').length;
    const activeIncidents = incidents.filter((i) => i.status !== 'CLOSED' && i.status !== 'RESOLVED').length;

    return {
      totalAlerts: alerts.length,
      criticalAlerts,
      highAlerts,
      mediumAlerts: alerts.filter((a) => a.severity === 'MEDIUM').length,
      lowAlerts: alerts.filter((a) => a.severity === 'LOW').length,
      openIncidents: activeIncidents,
      totalIncidents: incidents.length,
      mttdMinutes: 4.2, // Mean Time To Detect
      mttcMinutes: 18.5, // Mean Time To Contain
      socStatus: criticalAlerts > 0 ? 'HEIGHTENED_ALERT' : 'NORMAL_WATCH',
      lastUpdated: new Date().toISOString(),
    };
  }

  getAlerts(query?: { severity?: string; status?: string; moduleId?: string; search?: string }) {
    let list = [...this.prisma.memDb.alerts];

    if (query?.severity) {
      list = list.filter((a) => a.severity.toUpperCase() === query.severity.toUpperCase());
    }
    if (query?.status) {
      list = list.filter((a) => a.status.toUpperCase() === query.status.toUpperCase());
    }
    if (query?.moduleId) {
      list = list.filter((a) => a.moduleId === query.moduleId);
    }
    if (query?.search) {
      const q = query.search.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.alertId.toLowerCase().includes(q) ||
          (a.sourceIp && a.sourceIp.includes(q)),
      );
    }

    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  acknowledgeAlert(id: string, actor: string = 'Security Analyst') {
    const alert = this.prisma.memDb.alerts.find((a) => a.id === id || a.alertId === id);
    if (!alert) throw new NotFoundException('Alert not found');

    alert.status = 'ACKNOWLEDGED';
    alert.updatedAt = new Date().toISOString();

    this.recordAudit('ALERT_ACKNOWLEDGED', `Alert ${alert.alertId}`, 'SUCCESS', { actor });
    this.socGateway.broadcastNewAlert(alert);
    return alert;
  }

  assignAlert(id: string, assignedTo: string, actor: string = 'Security Analyst') {
    const alert = this.prisma.memDb.alerts.find((a) => a.id === id || a.alertId === id);
    if (!alert) throw new NotFoundException('Alert not found');

    alert.status = 'ASSIGNED';
    alert.assignedTo = assignedTo;
    alert.updatedAt = new Date().toISOString();

    this.recordAudit('ALERT_ASSIGNED', `Alert ${alert.alertId}`, 'SUCCESS', { assignedTo, actor });
    this.socGateway.broadcastNewAlert(alert);
    return alert;
  }

  escalateAlert(id: string, incidentTitle: string, actor: string = 'Security Commander') {
    const alert = this.prisma.memDb.alerts.find((a) => a.id === id || a.alertId === id);
    if (!alert) throw new NotFoundException('Alert not found');

    // Create a new incident directly linked to this escalated alert
    const newIncCode = `INC-2026-${String(this.prisma.memDb.incidents.length + 43).padStart(4, '0')}`;
    const newInc = {
      id: 'inc-' + Date.now(),
      incidentCode: newIncCode,
      title: incidentTitle || `Escalated from ${alert.alertId}: ${alert.title}`,
      description: alert.description,
      moduleId: alert.moduleId,
      moduleName: alert.moduleName,
      priority: alert.severity === 'CRITICAL' ? 'P0_CRITICAL' : 'P1_HIGH',
      status: 'INVESTIGATING',
      assetId: alert.assetId,
      assignedInvestigators: [{ id: 'usr-admin-1', name: actor, role: 'Lead Responder' }],
      alertsCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.prisma.memDb.incidents.unshift(newInc);

    alert.status = 'ESCALATED';
    alert.incidentId = newInc.id;
    alert.updatedAt = new Date().toISOString();

    this.recordAudit('ALERT_ESCALATED_TO_INCIDENT', `Alert ${alert.alertId} -> ${newIncCode}`, 'SUCCESS', {
      actor,
      incidentId: newInc.id,
    });

    this.socGateway.broadcastNewAlert(alert);
    this.socGateway.broadcastIncidentUpdate(newInc);
    return { alert, incident: newInc };
  }

  resolveAlert(id: string, actor: string = 'Security Analyst') {
    const alert = this.prisma.memDb.alerts.find((a) => a.id === id || a.alertId === id);
    if (!alert) throw new NotFoundException('Alert not found');

    alert.status = 'RESOLVED';
    alert.updatedAt = new Date().toISOString();

    this.recordAudit('ALERT_RESOLVED', `Alert ${alert.alertId}`, 'SUCCESS', { actor });
    this.socGateway.broadcastNewAlert(alert);
    return alert;
  }

  getIncidents() {
    return [...this.prisma.memDb.incidents].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  getIncidentById(id: string) {
    const inc = this.prisma.memDb.incidents.find((i) => i.id === id || i.incidentCode === id);
    if (!inc) throw new NotFoundException('Incident not found');
    const relatedAlerts = this.prisma.memDb.alerts.filter((a) => a.incidentId === inc.id);
    return { ...inc, alerts: relatedAlerts };
  }

  createIncident(data: any, actor: string = 'Security Officer') {
    if (!data.title) throw new BadRequestException('Incident title is required');

    const newIncCode = `INC-2026-${String(this.prisma.memDb.incidents.length + 45).padStart(4, '0')}`;
    const newInc = {
      id: 'inc-' + Date.now(),
      incidentCode: newIncCode,
      title: data.title,
      description: data.description || 'Enterprise security incident recorded by command center.',
      moduleId: data.moduleId || 'sis-cyber-soc',
      moduleName: data.moduleName || 'SIS Cyber SOC',
      priority: data.priority || 'P2_MEDIUM',
      status: 'NEW',
      assetId: data.assetId || null,
      assignedInvestigators: data.assignedTo
        ? [{ id: 'usr-assigned', name: data.assignedTo, role: 'Investigator' }]
        : [{ id: 'usr-admin-1', name: actor, role: 'Lead Commander' }],
      alertsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.prisma.memDb.incidents.unshift(newInc);
    this.recordAudit('INCIDENT_CREATED', `Incident ${newIncCode}`, 'SUCCESS', { actor, title: data.title });
    this.socGateway.broadcastIncidentUpdate(newInc);
    return newInc;
  }

  updateIncidentStatus(id: string, status: string, resolutionSummary?: string, actor: string = 'Incident Lead') {
    const inc = this.prisma.memDb.incidents.find((i) => i.id === id || i.incidentCode === id);
    if (!inc) throw new NotFoundException('Incident not found');

    const validStatuses = ['NEW', 'ACKNOWLEDGED', 'INVESTIGATING', 'CONTAINED', 'RESOLVED', 'CLOSED'];
    if (!validStatuses.includes(status.toUpperCase())) {
      throw new BadRequestException('Invalid incident status: ' + status);
    }

    inc.status = status.toUpperCase();
    inc.updatedAt = new Date().toISOString();

    if (status.toUpperCase() === 'CONTAINED') inc.containedAt = new Date().toISOString();
    if (status.toUpperCase() === 'RESOLVED') {
      inc.resolvedAt = new Date().toISOString();
      if (resolutionSummary) inc.resolutionSummary = resolutionSummary;
    }
    if (status.toUpperCase() === 'CLOSED') inc.closedAt = new Date().toISOString();

    this.recordAudit('INCIDENT_STATUS_CHANGED', `Incident ${inc.incidentCode} -> ${status}`, 'SUCCESS', {
      actor,
      resolutionSummary,
    });
    this.socGateway.broadcastIncidentUpdate(inc);
    return inc;
  }

  private recordAudit(action: string, targetResource: string, result: string, details?: any) {
    this.prisma.memDb.auditLogs.unshift({
      id: 'aud-' + Date.now(),
      actorName: details?.actor || 'SOC Operator',
      actorRole: 'SECURITY_ADMIN',
      action,
      targetResource,
      result,
      ipAddress: '192.168.10.14',
      timestamp: new Date().toISOString(),
      details,
    });
  }
}
