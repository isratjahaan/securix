'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StatusBadge } from '@/components/common/StatusBadge';
import { api } from '@/lib/api';
import { Layers, Plus, ExternalLink, ShieldCheck, CheckCircle2, AlertTriangle, Code, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ModuleRegistryPage() {
  const [modules, setModules] = useState<any[]>([]);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [pkgId, setPkgId] = useState('');
  const [pkgName, setPkgName] = useState('');
  const [pkgVersion, setPkgVersion] = useState('1.0.0');
  const [pkgDesc, setPkgDesc] = useState('');

  const loadRegistry = async () => {
    try {
      const data = await api.get('/modules');
      setModules(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadRegistry();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/modules/register', {
        id: pkgId.trim().toLowerCase(),
        name: pkgId.trim().toLowerCase(),
        displayName: pkgName.trim(),
        version: pkgVersion.trim(),
        description: pkgDesc.trim(),
      });
      setRegisterOpen(false);
      setPkgId('');
      setPkgName('');
      setPkgDesc('');
      alert('Approved module package successfully registered into ecosystem registry.');
      loadRegistry();
    } catch (err: any) {
      alert(err?.message || 'Registration failed');
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan">
            <Link href="/admin/modules" className="hover:underline flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Module Control
            </Link>
            <span>/</span>
            <span>CENTRAL REGISTRY</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">Ecosystem Module Registry</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Authoritative package registry, API contracts, version declarations and security manifests.
          </p>
        </div>

        <button
          onClick={() => setRegisterOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal to-cyan text-navy-950 text-xs font-bold shadow-lg shadow-teal/20"
        >
          <Plus className="w-4 h-4" />
          <span>Register Approved Module</span>
        </button>
      </div>

      {/* Registry Table */}
      <div className="rounded-2xl bg-navy-800/90 border border-slate-700/80 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-navy-950 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                <th className="p-3.5">Module Name & ID</th>
                <th className="p-3.5">Version</th>
                <th className="p-3.5">Lifecycle Status</th>
                <th className="p-3.5">Health</th>
                <th className="p-3.5">API Endpoint</th>
                <th className="p-3.5">Dependencies</th>
                <th className="p-3.5">Last Health Check</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200">
              {modules.map((m) => (
                <tr key={m.id} className="hover:bg-navy-900/60 transition-colors">
                  <td className="p-3.5">
                    <div className="font-semibold text-white">{m.displayName}</div>
                    <div className="text-[10px] font-mono text-slate-400">{m.id}</div>
                  </td>
                  <td className="p-3.5 font-mono text-teal">v{m.version}</td>
                  <td className="p-3.5">
                    <StatusBadge status={m.status} size="sm" />
                  </td>
                  <td className="p-3.5">
                    <StatusBadge status={m.healthStatus} size="sm" />
                  </td>
                  <td className="p-3.5 font-mono text-[11px] text-cyan truncate max-w-[200px]" title={m.apiEndpoint}>
                    {m.apiEndpoint}
                  </td>
                  <td className="p-3.5">
                    {m.dependencies && m.dependencies.length > 0 ? (
                      <span className="font-mono text-[10px] text-slate-300">
                        {m.dependencies.join(', ')}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-mono">None (Independent)</span>
                    )}
                  </td>
                  <td className="p-3.5 font-mono text-[10px] text-slate-400">
                    {new Date(m.lastHealthCheckAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration Modal */}
      {registerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-navy-800 border border-slate-700 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">Register Enterprise Module Package</h3>
            <p className="text-xs text-slate-400 mb-4">
              Deploy an approved cybersecurity extension manifest into the central registry.
            </p>

            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Unique Module ID</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. sis-cloud-audit"
                  value={pkgId}
                  onChange={(e) => setPkgId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-navy-900 border border-slate-700 text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Display Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SIS Cloud Security Auditor"
                  value={pkgName}
                  onChange={(e) => setPkgName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-navy-900 border border-slate-700 text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Version (SemVer)</label>
                <input
                  type="text"
                  required
                  value={pkgVersion}
                  onChange={(e) => setPkgVersion(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-navy-900 border border-slate-700 text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe module role, security boundaries and telemetry..."
                  value={pkgDesc}
                  onChange={(e) => setPkgDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-navy-900 border border-slate-700 text-slate-100"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-700/60">
                <button
                  type="button"
                  onClick={() => setRegisterOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-teal hover:bg-teal-400 text-navy-950"
                >
                  Complete Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
