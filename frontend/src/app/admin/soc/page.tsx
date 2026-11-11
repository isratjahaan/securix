'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StatusBadge } from '@/components/common/StatusBadge';
import { api } from '@/lib/api';
import { Radio, AlertTriangle, Flame, Shield, Activity, Users, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SocPage() {
  const [overview, setOverview] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);

  useEffect(() => {
    api.get('/soc/overview').then((res) => setOverview(res));
    api.get('/soc/alerts?status=NEW').then((res) => setAlerts(res));
    api.get('/soc/incidents').then((res) => setIncidents(res));
  }, []);

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-teal">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>CENTRAL CYBER SOC DASHBOARD (TIER-1 / TIER-2 / TIER-3 TRIAGE)</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">Security Operations Center</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            SIEM event aggregation, correlated incident timelines, adversary hunting, and containment playbooks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/incidents"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-950 border border-orange-800/80 text-orange-300 text-xs font-semibold"
          >
            <Flame className="w-4 h-4 text-orange-400" />
            <span>Incident Command ({overview?.openIncidents ?? 3})</span>
          </Link>
          <Link
            href="/admin/alerts"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal to-cyan text-navy-950 text-xs font-bold shadow-lg shadow-teal/20"
          >
            <span>Triage All Alerts ({overview?.totalAlerts ?? 5})</span>
          </Link>
        </div>
      </div>

      {/* SOC Triage Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-navy-800/80 border border-rose-900/40">
          <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">P0 Critical Alerts</span>
          <span className="text-2xl font-bold font-mono text-rose-400 mt-1 block">{overview?.criticalAlerts ?? 2}</span>
          <span className="text-[11px] text-slate-400 mt-1 block">Immediate Analyst Escalation</span>
        </div>
        <div className="p-4 rounded-xl bg-navy-800/80 border border-orange-900/40">
          <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider block">Active Incidents</span>
          <span className="text-2xl font-bold font-mono text-orange-400 mt-1 block">{overview?.openIncidents ?? 3}</span>
          <span className="text-[11px] text-slate-400 mt-1 block">Under Active Containment</span>
        </div>
        <div className="p-4 rounded-xl bg-navy-800/80 border border-slate-700/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mean Time To Detect</span>
          <span className="text-2xl font-bold font-mono text-teal mt-1 block">{overview?.mttdMinutes ?? 4.2}m</span>
          <span className="text-[11px] text-teal mt-1 block">Autonomous IOC Match</span>
        </div>
        <div className="p-4 rounded-xl bg-navy-800/80 border border-slate-700/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mean Time To Contain</span>
          <span className="text-2xl font-bold font-mono text-cyan mt-1 block">{overview?.mttcMinutes ?? 18.5}m</span>
          <span className="text-[11px] text-cyan mt-1 block">Within Enterprise Target</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Urgent Unacknowledged Alerts */}
        <div className="rounded-2xl bg-navy-800/90 border border-slate-700/80 p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                Unacknowledged Threat Alerts
              </h3>
              <Link href="/admin/alerts" className="text-xs text-cyan hover:underline">
                View All →
              </Link>
            </div>

            <div className="space-y-2.5">
              {alerts.slice(0, 4).map((alt) => (
                <div key={alt.id} className="p-3 rounded-xl bg-navy-950/70 border border-slate-800 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{alt.title}</span>
                      <StatusBadge status={alt.severity} size="sm" />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">{alt.description}</p>
                    <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                      {alt.moduleName} • IP: {alt.sourceIp || 'Internal'}
                    </span>
                  </div>
                  <Link
                    href="/admin/alerts"
                    className="p-1.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-slate-300 hover:text-white transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Incident Triage */}
        <div className="rounded-2xl bg-navy-800/90 border border-slate-700/80 p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                Underway Incident Investigations
              </h3>
              <Link href="/admin/incidents" className="text-xs text-orange-400 hover:underline">
                All Incidents →
              </Link>
            </div>

            <div className="space-y-2.5">
              {incidents.slice(0, 4).map((inc) => (
                <div key={inc.id} className="p-3 rounded-xl bg-navy-950/70 border border-slate-800 flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{inc.title}</span>
                      <StatusBadge status={inc.priority} size="sm" />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">{inc.description}</p>
                    <span className="text-[10px] font-mono text-cyan mt-1 block">
                      Code: {inc.incidentCode} • Status: {inc.status}
                    </span>
                  </div>
                  <Link
                    href={`/admin/incidents`}
                    className="p-1.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-slate-300 hover:text-white transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
