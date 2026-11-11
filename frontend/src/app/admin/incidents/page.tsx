'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StatusBadge } from '@/components/common/StatusBadge';
import { api } from '@/lib/api';
import { Flame, Plus, Shield, Search, ArrowRight, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('P1_HIGH');
  const [selectedModule, setSelectedModule] = useState('sis-cyber-soc');

  const loadIncidents = async () => {
    try {
      const data = await api.get('/soc/incidents');
      setIncidents(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/soc/incidents', {
        title,
        description,
        priority,
        moduleId: selectedModule,
      });
      setCreateOpen(false);
      setTitle('');
      setDescription('');
      alert('Security incident created and queued for SOC triage.');
      loadIncidents();
    } catch (err: any) {
      alert(err?.message || 'Failed to create incident');
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    let summary: string | undefined;
    if (newStatus === 'RESOLVED') {
      summary = prompt('Enter Incident Resolution Summary:') || 'Resolution confirmed by incident commander.';
    }
    try {
      await api.patch(`/soc/incidents/${id}/status`, { status: newStatus, resolutionSummary: summary });
      loadIncidents();
    } catch (err: any) {
      alert(err?.message || 'Status transition failed');
    }
  };

  const filtered = incidents.filter(
    (i) =>
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.incidentCode.toLowerCase().includes(search.toLowerCase()) ||
      (i.moduleName && i.moduleName.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-orange-400">
            <Flame className="w-3.5 h-3.5" />
            <span>CENTRAL INCIDENT COMMAND & RESOLUTION LIFECYCLE</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">Incident Management Center</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Full incident lifecycle: New → Acknowledged → Investigating → Contained → Resolved → Closed.
          </p>
        </div>

        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-600 to-amber-600 text-white text-xs font-bold shadow-lg shadow-orange-950/40"
        >
          <Plus className="w-4 h-4" />
          <span>Declare Incident</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 rounded-xl bg-navy-800/80 border border-slate-700/80 max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search incidents by code, title, module..."
          className="w-full px-3 py-1.5 text-xs rounded-lg bg-navy-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan"
        />
      </div>

      {/* Incidents Table */}
      <div className="rounded-2xl bg-navy-800/90 border border-slate-700/80 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-navy-950 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                <th className="p-3.5">Incident Code & Title</th>
                <th className="p-3.5">Priority</th>
                <th className="p-3.5">Lifecycle State</th>
                <th className="p-3.5">Module Scope</th>
                <th className="p-3.5">Lead Commander</th>
                <th className="p-3.5">Declared At</th>
                <th className="p-3.5 text-right">State Transition Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {filtered.map((inc) => (
                <tr key={inc.id} className="hover:bg-navy-900/60 transition-colors">
                  <td className="p-3.5 max-w-[280px]">
                    <span className="font-mono text-[10px] text-orange-400 font-bold block">{inc.incidentCode}</span>
                    <span className="font-semibold text-white block truncate">{inc.title}</span>
                    <span className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{inc.description}</span>
                  </td>
                  <td className="p-3.5">
                    <StatusBadge status={inc.priority} size="sm" />
                  </td>
                  <td className="p-3.5">
                    <StatusBadge status={inc.status} size="sm" />
                  </td>
                  <td className="p-3.5 text-cyan font-mono text-[11px]">{inc.moduleName || 'Multi-Module'}</td>
                  <td className="p-3.5 text-slate-300">
                    {inc.assignedInvestigators?.[0]?.name || 'Dr. Sarah Vance'}
                  </td>
                  <td className="p-3.5 font-mono text-[10px] text-slate-400">
                    {new Date(inc.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {inc.status === 'NEW' && (
                        <button
                          onClick={() => handleStatusChange(inc.id, 'INVESTIGATING')}
                          className="px-2.5 py-1 rounded bg-amber-950/60 hover:bg-amber-900 text-amber-300 border border-amber-800 text-[11px] font-bold"
                        >
                          Investigate
                        </button>
                      )}
                      {inc.status === 'INVESTIGATING' && (
                        <button
                          onClick={() => handleStatusChange(inc.id, 'CONTAINED')}
                          className="px-2.5 py-1 rounded bg-cyan-950/60 hover:bg-cyan-900 text-cyan border border-cyan/40 text-[11px] font-bold"
                        >
                          Contain
                        </button>
                      )}
                      {inc.status === 'CONTAINED' && (
                        <button
                          onClick={() => handleStatusChange(inc.id, 'RESOLVED')}
                          className="px-2.5 py-1 rounded bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-[11px] font-bold"
                        >
                          Resolve
                        </button>
                      )}
                      {inc.status === 'RESOLVED' && (
                        <button
                          onClick={() => handleStatusChange(inc.id, 'CLOSED')}
                          className="px-2.5 py-1 rounded bg-navy-900 hover:bg-navy-700 text-slate-400 border border-slate-700 text-[11px] font-mono"
                        >
                          Close Archive
                        </button>
                      )}
                      {inc.status === 'CLOSED' && (
                        <span className="text-[10px] text-slate-500 font-mono">ARCHIVED</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Declare Incident Modal */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-navy-800 border border-slate-700 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Declare Security Incident</h3>
            <p className="text-xs text-slate-400 mb-4">
              Open formal investigation case with incident commander assignment.
            </p>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Incident Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Identity Anomaly & Token Spraying"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-navy-900 border border-slate-700 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-navy-900 border border-slate-700 text-slate-100 font-mono"
                >
                  <option value="P0_CRITICAL">P0 CRITICAL (Immediate Threat)</option>
                  <option value="P1_HIGH">P1 HIGH (Escalated Exposure)</option>
                  <option value="P2_MEDIUM">P2 MEDIUM (Contained Finding)</option>
                  <option value="P3_LOW">P3 LOW (Hygiene / Advisory)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Triage Summary & Scope</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe breach indicators, affected assets and preliminary findings..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-navy-900 border border-slate-700 text-slate-100"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setCreateOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-orange-600 hover:bg-orange-500 text-white"
                >
                  Declare & Escalate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
