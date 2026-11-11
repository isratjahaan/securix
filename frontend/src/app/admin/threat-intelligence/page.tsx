'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StatusBadge } from '@/components/common/StatusBadge';
import { api } from '@/lib/api';
import { Globe, Plus, Download, Search, Shield, Filter, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function ThreatIntelligencePage() {
  const [indicators, setIndicators] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [val, setVal] = useState('');
  const [iocType, setIocType] = useState('IP');
  const [severity, setSeverity] = useState('HIGH');
  const [category, setCategory] = useState('Botnet C2');
  const [confidence, setConfidence] = useState(85);

  const loadIndicators = async () => {
    try {
      const data = await api.get(
        `/threat-intelligence/indicators?search=${encodeURIComponent(search)}&type=${typeFilter}`,
      );
      setIndicators(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadIndicators();
  }, [search, typeFilter]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/threat-intelligence/indicators', {
        indicatorValue: val.trim(),
        type: iocType,
        severity,
        threatCategory: category,
        confidenceScore: Number(confidence),
      });
      setCreateOpen(false);
      setVal('');
      alert('Threat indicator registered and synchronized into SIEM filter rules.');
      loadIndicators();
    } catch (err: any) {
      alert(err?.message || 'Failed to add indicator');
    }
  };

  const handleExport = () => {
    window.open('/api/threat-intelligence/export', '_blank');
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan">
            <Globe className="w-3.5 h-3.5" />
            <span>SIS THREAT INTELLIGENCE & REPUTATION ENGINE</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">Indicators of Compromise (IOC)</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Preserve source attribution, confidence scoring and adversary fingerprint across IPs, domains, hashes, and URLs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/threat-feeds"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-800 border border-slate-700/80 text-xs font-medium text-slate-300 hover:text-white"
          >
            <span>Threat Feed Sources</span>
          </Link>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-800 border border-slate-700/80 text-xs font-medium text-slate-300 hover:text-white"
          >
            <Download className="w-3.5 h-3.5 text-cyan" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal to-cyan text-navy-950 text-xs font-bold shadow-lg shadow-teal/20"
          >
            <Plus className="w-4 h-4" />
            <span>Register IOC</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-navy-800/80 border border-slate-700/80">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search IOC value, category, or feed source..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-navy-900 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['', 'IP', 'DOMAIN', 'URL', 'FILE_HASH'].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                typeFilter === t
                  ? 'bg-navy-950 text-teal border border-teal/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t || 'ALL TYPES'}
            </button>
          ))}
        </div>
      </div>

      {/* IOC Table */}
      <div className="rounded-2xl bg-navy-800/90 border border-slate-700/80 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-navy-950 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                <th className="p-3.5">Indicator Value</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Severity</th>
                <th className="p-3.5">Confidence Score</th>
                <th className="p-3.5">Threat Category</th>
                <th className="p-3.5">Source Attribution</th>
                <th className="p-3.5">Last Seen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200 font-mono">
              {indicators.map((ioc) => (
                <tr key={ioc.id} className="hover:bg-navy-900/60 transition-colors">
                  <td className="p-3.5 font-bold text-white max-w-[280px] truncate" title={ioc.indicatorValue}>
                    {ioc.indicatorValue}
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-navy-950 border border-slate-700 text-cyan">
                      {ioc.type}
                    </span>
                  </td>
                  <td className="p-3.5 font-sans">
                    <StatusBadge status={ioc.severity} size="sm" />
                  </td>
                  <td className="p-3.5 font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-teal font-bold">{ioc.confidenceScore}%</span>
                      <div className="w-16 h-1.5 rounded-full bg-navy-950 overflow-hidden">
                        <div style={{ width: `${ioc.confidenceScore}%` }} className="h-full bg-teal" />
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5 font-sans text-slate-300">{ioc.threatCategory}</td>
                  <td className="p-3.5 font-sans text-[11px] text-slate-400">{ioc.source}</td>
                  <td className="p-3.5 text-[10px] text-slate-500">
                    {new Date(ioc.lastSeenAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register IOC Modal */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-navy-800 border border-slate-700 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Register Threat Indicator (IOC)</h3>
            <p className="text-xs text-slate-400 mb-4">
              Add verified malicious IP, domain, URL or cryptographic file hash.
            </p>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Indicator Value</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 198.51.100.42 or malware-c2.xyz"
                  value={val}
                  onChange={(e) => setVal(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-navy-900 border border-slate-700 text-slate-100 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Type</label>
                  <select
                    value={iocType}
                    onChange={(e) => setIocType(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-navy-900 border border-slate-700 text-slate-100 font-mono"
                  >
                    <option value="IP">IP ADDRESS</option>
                    <option value="DOMAIN">DOMAIN</option>
                    <option value="URL">URL</option>
                    <option value="FILE_HASH">FILE HASH (SHA-256)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Severity</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-navy-900 border border-slate-700 text-slate-100 font-mono"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Threat Category</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ransomware C2 / Malicious APK"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-navy-900 border border-slate-700 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Confidence Score: {confidence}%
                </label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={confidence}
                  onChange={(e) => setConfidence(Number(e.target.value))}
                  className="w-full"
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
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-teal hover:bg-teal-400 text-navy-950"
                >
                  Register Indicator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
