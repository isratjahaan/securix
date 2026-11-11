'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StatusBadge } from '@/components/common/StatusBadge';
import { api } from '@/lib/api';
import { Server, Globe, Plus, ShieldCheck, AlertCircle, Search, ExternalLink, CheckCircle2 } from 'lucide-react';

export default function AssetsPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [type, setType] = useState('WEBSITE');
  const [authProof, setAuthProof] = useState('');

  const loadAssets = async () => {
    try {
      const data = await api.get(`/assets?type=${typeFilter}&search=${encodeURIComponent(search)}`);
      setAssets(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadAssets();
  }, [search, typeFilter]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/assets', {
        name,
        target,
        type,
        authorizationProof: authProof || null,
      });
      setCreateOpen(false);
      setName('');
      setTarget('');
      setAuthProof('');
      alert('Perimeter asset registered successfully.');
      loadAssets();
    } catch (err: any) {
      alert(err?.message || 'Registration failed');
    }
  };

  const handleAuthorize = async (id: string) => {
    const proof = prompt('Enter Authorization Document Certificate ID (e.g. AUTH-CERT-SIS-2026-992):');
    if (!proof) return;
    try {
      await api.patch(`/assets/${id}/authorize`, { proofDocumentId: proof });
      loadAssets();
    } catch (err: any) {
      alert(err?.message || 'Authorization verification failed');
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-teal">
            <Server className="w-3.5 h-3.5" />
            <span>PERIMETER & ASSET INVENTORY</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">Authorized Asset Registry</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Strict scope enforcement: only explicitly authorized websites, domains, and IP subnets can be monitored or assessed.
          </p>
        </div>

        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal to-cyan text-navy-950 text-xs font-bold shadow-lg shadow-teal/20"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Asset</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-navy-800/80 border border-slate-700/80">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assets by name or target domain/IP..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-navy-900 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['', 'WEBSITE', 'DOMAIN', 'NETWORK'].map((t) => (
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

      {/* Assets Table */}
      <div className="rounded-2xl bg-navy-800/90 border border-slate-700/80 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-navy-950 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                <th className="p-3.5">Asset Name</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Target Location</th>
                <th className="p-3.5">Authorization Proof</th>
                <th className="p-3.5">Scope Status</th>
                <th className="p-3.5">Risk Rating</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200 font-mono">
              {assets.map((ast) => (
                <tr key={ast.id} className="hover:bg-navy-900/60 transition-colors">
                  <td className="p-3.5 font-sans font-semibold text-white">{ast.name}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-navy-950 border border-slate-700 text-cyan">
                      {ast.type}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-300 font-bold">{ast.target}</td>
                  <td className="p-3.5 text-[11px] text-teal">
                    {ast.authorizationProof || 'UNVERIFIED_PENDING'}
                  </td>
                  <td className="p-3.5 font-sans">
                    <StatusBadge status={ast.authorizationStatus} size="sm" />
                  </td>
                  <td className="p-3.5 font-sans">
                    <StatusBadge status={ast.riskStatus} size="sm" />
                  </td>
                  <td className="p-3.5 text-right font-sans">
                    {ast.authorizationStatus !== 'AUTHORIZED' ? (
                      <button
                        onClick={() => handleAuthorize(ast.id)}
                        className="px-2.5 py-1 rounded bg-teal/20 hover:bg-teal/30 border border-teal/40 text-teal text-[11px] font-bold"
                      >
                        Verify Proof
                      </button>
                    ) : (
                      <span className="text-teal font-mono text-[11px] flex items-center justify-end gap-1 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> AUTHORIZED
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration Modal */}
      {createOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-navy-800 border border-slate-700 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Register Perimeter Asset</h3>
            <p className="text-xs text-slate-400 mb-4">
              Add domain, website or IP subnet. Authorization proof is strictly required before scanning.
            </p>

            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Asset Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fortress Core API Subnet"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-navy-900 border border-slate-700 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Target (Domain / IP / URL)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. https://api.fortress.sis.enterprise or 198.51.100.0/24"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-navy-900 border border-slate-700 text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Asset Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-navy-900 border border-slate-700 text-slate-100 font-mono"
                >
                  <option value="WEBSITE">WEBSITE</option>
                  <option value="DOMAIN">DOMAIN</option>
                  <option value="NETWORK">NETWORK / IP SUBNET</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                  Authorization Proof Reference
                </label>
                <input
                  type="text"
                  placeholder="e.g. AUTH-CERT-SIS-2026-0045"
                  value={authProof}
                  onChange={(e) => setAuthProof(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-navy-900 border border-slate-700 text-slate-100 font-mono"
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
                  Register Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
