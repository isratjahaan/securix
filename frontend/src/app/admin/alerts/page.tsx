'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StatusBadge } from '@/components/common/StatusBadge';
import { api } from '@/lib/api';
import { AlertTriangle, Search, CheckCircle2, UserPlus, Flame, Check, Shield } from 'lucide-react';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const loadAlerts = async () => {
    try {
      const data = await api.get(
        `/soc/alerts?search=${encodeURIComponent(search)}&severity=${severityFilter}&status=${statusFilter}`,
      );
      setAlerts(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, [search, severityFilter, statusFilter]);

  const handleAcknowledge = async (id: string) => {
    try {
      await api.post(`/soc/alerts/${id}/acknowledge`);
      loadAlerts();
    } catch (err: any) {
      alert(err?.message || 'Acknowledge failed');
    }
  };

  const handleAssign = async (id: string) => {
    const assignee = prompt('Assign to Responder (e.g. Marcus Brooks):', 'Marcus Brooks');
    if (!assignee) return;
    try {
      await api.post(`/soc/alerts/${id}/assign`, { assignedTo: assignee });
      loadAlerts();
    } catch (err: any) {
      alert(err?.message || 'Assignment failed');
    }
  };

  const handleEscalate = async (id: string) => {
    const title = prompt('Escalation Incident Title:', 'P0 Security Breach Escalation from Alert');
    if (!title) return;
    try {
      await api.post(`/soc/alerts/${id}/escalate`, { incidentTitle: title });
      alert('Alert successfully escalated to Incident Command.');
      loadAlerts();
    } catch (err: any) {
      alert(err?.message || 'Escalation failed');
    }
  };

  const handleResolve = async (id: string) => {
    try {
      await api.post(`/soc/alerts/${id}/resolve`);
      loadAlerts();
    } catch (err: any) {
      alert(err?.message || 'Resolution failed');
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-rose-400">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>CENTRAL SECURITY ALERT INGESTION</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">Security Alert Center</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Triage, acknowledge, assign, and escalate security signals detected by the 12 cybersecurity modules.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 rounded-xl bg-navy-800/80 border border-slate-700/80">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search alerts by title, ID, IP address..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-navy-900 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {['', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                severityFilter === sev
                  ? 'bg-navy-950 text-teal border border-teal/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {sev || 'ALL SEVERITIES'}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Table */}
      <div className="rounded-2xl bg-navy-800/90 border border-slate-700/80 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-navy-950 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                <th className="p-3.5">Alert ID & Title</th>
                <th className="p-3.5">Severity</th>
                <th className="p-3.5">Source Module</th>
                <th className="p-3.5">Target / IP</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Assigned To</th>
                <th className="p-3.5 text-right">Triage Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {alerts.map((alt) => (
                <tr key={alt.id} className="hover:bg-navy-900/60 transition-colors">
                  <td className="p-3.5 max-w-[280px]">
                    <span className="font-mono text-[10px] text-teal block">{alt.alertId}</span>
                    <span className="font-semibold text-white block truncate">{alt.title}</span>
                    <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{alt.description}</span>
                  </td>
                  <td className="p-3.5">
                    <StatusBadge status={alt.severity} size="sm" />
                  </td>
                  <td className="p-3.5 text-cyan font-semibold">{alt.moduleName}</td>
                  <td className="p-3.5 font-mono text-[11px] text-slate-300">
                    {alt.sourceIp || alt.targetResource || 'Internal Gateway'}
                  </td>
                  <td className="p-3.5">
                    <StatusBadge status={alt.status} size="sm" />
                  </td>
                  <td className="p-3.5 text-slate-300">
                    {alt.assignedTo || <span className="text-slate-500 italic">Unassigned</span>}
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {alt.status === 'NEW' && (
                        <button
                          onClick={() => handleAcknowledge(alt.id)}
                          className="px-2 py-1 rounded bg-teal/20 hover:bg-teal/30 text-teal border border-teal/30 text-[11px] font-bold"
                          title="Acknowledge Alert"
                        >
                          Ack
                        </button>
                      )}
                      {alt.status !== 'RESOLVED' && (
                        <>
                          <button
                            onClick={() => handleAssign(alt.id)}
                            className="px-2 py-1 rounded bg-navy-900 hover:bg-navy-700 text-slate-300 border border-slate-700 text-[11px]"
                            title="Assign Responder"
                          >
                            Assign
                          </button>
                          <button
                            onClick={() => handleEscalate(alt.id)}
                            className="px-2 py-1 rounded bg-orange-950/60 hover:bg-orange-900 text-orange-300 border border-orange-800 text-[11px] font-bold"
                            title="Escalate to Incident"
                          >
                            Escalate
                          </button>
                          <button
                            onClick={() => handleResolve(alt.id)}
                            className="px-2 py-1 rounded bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-[11px] font-bold"
                            title="Mark Resolved"
                          >
                            Resolve
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
