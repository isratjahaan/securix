'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StatusBadge } from '@/components/common/StatusBadge';
import { api } from '@/lib/api';
import { ScrollText, Search, Download, Filter, ShieldCheck, User } from 'lucide-react';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  const loadLogs = async () => {
    try {
      const data = await api.get(`/audit-logs?search=${encodeURIComponent(search)}&action=${actionFilter}`);
      setLogs(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [search, actionFilter]);

  const handleExport = () => {
    window.open('/api/audit-logs/export', '_blank');
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-teal">
            <ScrollText className="w-3.5 h-3.5" />
            <span>CENTRAL IMMUTABLE AUDIT TRAIL</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">Audit Log Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Tamper-proof chronological trail recording every login, privilege modification, module lifecycle change and forensic event.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-800 border border-slate-700/80 text-xs font-medium text-slate-300 hover:text-white"
        >
          <Download className="w-3.5 h-3.5 text-cyan" />
          <span>Export Compliance CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 rounded-xl bg-navy-800/80 border border-slate-700/80 max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by action, actor name, or target resource..."
          className="w-full px-3 py-1.5 text-xs rounded-lg bg-navy-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan"
        />
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl bg-navy-800/90 border border-slate-700/80 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-navy-950 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Actor & Role</th>
                <th className="p-3.5">Action Code</th>
                <th className="p-3.5">Target Resource</th>
                <th className="p-3.5">IP Address</th>
                <th className="p-3.5">Outcome</th>
                <th className="p-3.5">Audit Metadata Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200 font-mono">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-navy-900/60 transition-colors">
                  <td className="p-3.5 text-slate-400 text-[10px] whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="p-3.5 font-sans">
                    <span className="font-semibold text-white block">{log.actorName}</span>
                    <span className="text-[10px] font-mono text-teal">{log.actorRole}</span>
                  </td>
                  <td className="p-3.5 text-cyan font-bold">{log.action}</td>
                  <td className="p-3.5 text-slate-300 font-sans">{log.targetResource}</td>
                  <td className="p-3.5 text-slate-400">{log.ipAddress || '192.168.10.14'}</td>
                  <td className="p-3.5 font-sans">
                    <StatusBadge status={log.result === 'SUCCESS' ? 'HEALTHY' : 'CRITICAL'} size="sm" />
                  </td>
                  <td className="p-3.5 text-[11px] text-slate-400 max-w-[200px] truncate" title={JSON.stringify(log.details)}>
                    {log.details ? JSON.stringify(log.details) : '—'}
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
