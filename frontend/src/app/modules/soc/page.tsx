'use client';

import React, { useState, useEffect } from 'react';
import { UserLayout } from '@/components/user-layout/UserLayout';
import { api } from '@/lib/api';
import {
  Flame,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Check,
  RefreshCw,
  Activity,
  Layers
} from 'lucide-react';

export default function CyberSocPage() {
  const [overview, setOverview] = useState<any | null>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [acknowledgingId, setAcknowledgingId] = useState<string | null>(null);

  const fetchSocData = async () => {
    try {
      const [overviewRes, alertsRes, incidentsRes] = await Promise.allSettled([
        api.get('/soc/overview'),
        api.get('/soc/alerts'),
        api.get('/soc/incidents'),
      ]);

      if (overviewRes.status === 'fulfilled') setOverview(overviewRes.value || null);
      if (alertsRes.status === 'fulfilled') setAlerts(alertsRes.value || []);
      if (incidentsRes.status === 'fulfilled') setIncidents(incidentsRes.value || []);
    } catch (e) {
      console.error('Failed to load SOC telemetry:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocData();
  }, []);

  const handleAcknowledge = async (alertId: string) => {
    setAcknowledgingId(alertId);
    try {
      await api.post(`/soc/alerts/${alertId}/acknowledge`, {});
      fetchSocData();
    } catch (err: any) {
      alert(`Acknowledgment error: ${err.message}`);
    } finally {
      setAcknowledgingId(null);
    }
  };

  return (
    <UserLayout
      pageTitle="M12: SIS Central Cyber SOC Command"
      pageSubtitle="Unified security operations center, real-time alert triage, and incident lifecycle management"
    >
      {/* Top SOC Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-navy-900/90 border border-surface-border rounded-xl">
          <div className="text-xs font-mono text-text-secondary uppercase">Total Ingested Alerts</div>
          <div className="text-2xl font-bold font-mono text-teal mt-1">{overview?.totalAlerts || alerts.length}</div>
          <div className="text-[10px] text-text-muted mt-0.5">Cross-module pub/sub</div>
        </div>

        <div className="p-4 bg-navy-900/90 border border-surface-border rounded-xl">
          <div className="text-xs font-mono text-text-secondary uppercase">MTTD (Detection)</div>
          <div className="text-2xl font-bold font-mono text-cyan mt-1">{overview?.mttdMinutes || 3.2} Mins</div>
          <div className="text-[10px] text-text-muted mt-0.5">Autonomous sensors</div>
        </div>

        <div className="p-4 bg-navy-900/90 border border-surface-border rounded-xl">
          <div className="text-xs font-mono text-text-secondary uppercase">MTTC (Containment)</div>
          <div className="text-2xl font-bold font-mono text-status-healthy mt-1">{overview?.mttcMinutes || 8.4} Mins</div>
          <div className="text-[10px] text-text-muted mt-0.5">Automated SOAR</div>
        </div>

        <div className="p-4 bg-navy-900/90 border border-surface-border rounded-xl">
          <div className="text-xs font-mono text-text-secondary uppercase">Escalated Incidents</div>
          <div className="text-2xl font-bold font-mono text-status-high mt-1">{incidents.length} Declared</div>
          <div className="text-[10px] text-text-muted mt-0.5">Active investigation</div>
        </div>
      </div>

      {/* Two Columns: Active Alerts + Formal Incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Alerts Triage */}
        <div className="p-6 bg-navy-900/90 border border-surface-border rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-status-critical" />
              <h3 className="text-sm font-bold text-text-primary">Live Security Alerts</h3>
            </div>
            <span className="text-xs font-mono text-text-muted">{alerts.length} alerts</span>
          </div>

          <div className="space-y-3">
            {alerts.slice(0, 6).map((al) => (
              <div
                key={al.id}
                className="p-3.5 bg-navy-950/70 border border-surface-border rounded-xl flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      al.severity === 'CRITICAL' ? 'bg-status-critical/15 text-status-critical' :
                      al.severity === 'HIGH' ? 'bg-status-high/15 text-status-high' : 'bg-status-medium/15 text-status-medium'
                    }`}>
                      {al.severity}
                    </span>
                    <span className="text-xs font-bold text-text-primary">{al.title}</span>
                  </div>
                  <p className="text-[11px] text-text-secondary leading-snug">{al.description}</p>
                  <div className="text-[10px] font-mono text-text-muted">
                    Target: {al.assetTarget || al.targetResource || 'Endpoint'} &bull; {new Date(al.timestamp || al.createdAt).toLocaleTimeString()}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  {al.status === 'NEW' ? (
                    <button
                      onClick={() => handleAcknowledge(al.id)}
                      disabled={acknowledgingId === al.id}
                      className="px-2.5 py-1 bg-teal/15 hover:bg-teal text-teal hover:text-navy-950 border border-teal/30 rounded-lg text-xs font-mono font-semibold transition"
                    >
                      Acknowledge
                    </button>
                  ) : (
                    <span className="text-[10px] font-mono text-text-muted bg-navy-800 px-2 py-0.5 rounded">
                      ACKNOWLEDGED
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Declared Forensic Incidents */}
        <div className="p-6 bg-navy-900/90 border border-surface-border rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan" />
              <h3 className="text-sm font-bold text-text-primary">Formal Forensic Incidents</h3>
            </div>
            <span className="text-xs font-mono text-text-muted">{incidents.length} cases</span>
          </div>

          <div className="space-y-3">
            {incidents.slice(0, 5).map((inc) => (
              <div
                key={inc.id}
                className="p-3.5 bg-navy-950/70 border border-surface-border rounded-xl space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-teal font-bold">{inc.incidentCode}</span>
                  <span className="text-[10px] font-mono text-cyan bg-cyan/10 px-2 py-0.5 rounded">
                    {inc.status}
                  </span>
                </div>
                <div className="text-xs font-semibold text-text-primary">{inc.title}</div>
                <p className="text-[11px] text-text-secondary">{inc.description}</p>
                <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-text-muted">
                  <span>Priority: {inc.priority}</span>
                  <span>{new Date(inc.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
