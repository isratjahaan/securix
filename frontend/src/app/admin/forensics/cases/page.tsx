'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StatusBadge } from '@/components/common/StatusBadge';
import { api } from '@/lib/api';
import { Briefcase, ArrowLeft, Plus, Search } from 'lucide-react';
import Link from 'next/link';

export default function ForensicCasesPage() {
  const [cases, setCases] = useState<any[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [incidentCode, setIncidentCode] = useState('');

  const loadCases = async () => {
    try {
      const data = await api.get('/forensics/cases');
      setCases(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCases();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/forensics/cases', { title, description, incidentCode });
      setCreateOpen(false);
      setTitle('');
      setDescription('');
      setIncidentCode('');
      alert('Forensic case successfully opened and assigned to lead investigator.');
      loadCases();
    } catch (err: any) {
      alert(err?.message || 'Case creation failed');
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan">
            <Link href="/admin/forensics" className="hover:underline flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Forensics
            </Link>
            <span>/</span>
            <span>CASES</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">Investigation Cases</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Formal digital forensic proceedings bound to security incidents and legal chain-of-custody.
          </p>
        </div>

        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal to-cyan text-navy-950 text-xs font-bold shadow-lg shadow-teal/20"
        >
          <Plus className="w-4 h-4" />
          <span>Open Forensic Case</span>
        </button>
      </div>

      <div className="rounded-2xl bg-navy-800/90 border border-slate-700/80 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-navy-950 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                <th className="p-3.5">Case Number</th>
                <th className="p-3.5">Case Title & Summary</th>
                <th className="p-3.5">Priority</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Lead Investigator</th>
                <th className="p-3.5">Linked Incident</th>
                <th className="p-3.5">Artifacts Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {cases.map((c) => (
                <tr key={c.id} className="hover:bg-navy-900/60 transition-colors">
                  <td className="p-3.5 font-mono text-teal font-bold">{c.caseNumber}</td>
                  <td className="p-3.5 max-w-[280px]">
                    <span className="font-semibold text-white block">{c.title}</span>
                    <span className="text-[11px] text-slate-400 line-clamp-1">{c.description}</span>
                  </td>
                  <td className="p-3.5">
                    <StatusBadge status={c.priority} size="sm" />
                  </td>
                  <td className="p-3.5">
                    <StatusBadge status={c.status} size="sm" />
                  </td>
                  <td className="p-3.5 text-slate-300 font-semibold">{c.leadInvestigatorName}</td>
                  <td className="p-3.5 font-mono text-cyan text-[11px]">{c.incidentCode || 'Independent Case'}</td>
                  <td className="p-3.5 font-mono text-white font-bold">{c.evidenceCount} Items</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-navy-800 border border-slate-700 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Open Forensic Investigation Case</h3>
            <p className="text-xs text-slate-400 mb-4">
              Initialize formal case ledger with legal evidence handling requirements.
            </p>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Case Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Memory Dump Analysis & C2 Extraction"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-navy-900 border border-slate-700 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Related Incident Code</label>
                <input
                  type="text"
                  placeholder="e.g. INC-2026-0043"
                  value={incidentCode}
                  onChange={(e) => setIncidentCode(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-navy-900 border border-slate-700 text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Investigation Scope & Hypotheses</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detail evidence preservation steps and objective..."
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
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-teal hover:bg-teal-400 text-navy-950"
                >
                  Open Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
