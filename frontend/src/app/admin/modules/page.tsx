'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ConfirmationModal } from '@/components/common/ConfirmationModal';
import { api } from '@/lib/api';
import {
  Boxes,
  Power,
  RotateCcw,
  Wrench,
  Sliders,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  GitFork,
  BookOpen
} from 'lucide-react';
import Link from 'next/link';

export default function ModulesPage() {
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Disable Modal state
  const [disableModalOpen, setDisableModalOpen] = useState(false);
  const [targetModule, setTargetModule] = useState<any>(null);
  const [impactInfo, setImpactInfo] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Config Modal state
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [configKey, setConfigKey] = useState('');
  const [configVal, setConfigVal] = useState('');

  const loadModules = async () => {
    try {
      const data = await api.get('/modules');
      setModules(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModules();
  }, []);

  const handleEnable = async (id: string) => {
    try {
      await api.post(`/modules/${id}/enable`);
      loadModules();
    } catch (err: any) {
      alert(err?.message || 'Failed to enable module');
    }
  };

  const openDisablePrompt = async (mod: any) => {
    setTargetModule(mod);
    try {
      const impact = await api.get(`/modules/${mod.id}/disable-impact`);
      setImpactInfo(impact);
      setDisableModalOpen(true);
    } catch (err) {
      setDisableModalOpen(true);
    }
  };

  const confirmDisable = async () => {
    if (!targetModule) return;
    setActionLoading(true);
    try {
      await api.post(`/modules/${targetModule.id}/disable`, { force: true });
      setDisableModalOpen(false);
      loadModules();
    } catch (err: any) {
      alert(err?.message || 'Failed to disable module');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRestart = async (id: string) => {
    try {
      const res = await api.post(`/modules/${id}/restart`);
      alert(res.message || 'Module restarted successfully.');
      loadModules();
    } catch (err: any) {
      alert(err?.message || 'Restart failed');
    }
  };

  const handleMaintenanceToggle = async (mod: any) => {
    const isMaint = mod.status === 'MAINTENANCE';
    try {
      await api.post(`/modules/${mod.id}/maintenance`, { enabled: !isMaint });
      loadModules();
    } catch (err: any) {
      alert(err?.message || 'Failed to toggle maintenance mode');
    }
  };

  const openConfig = (mod: any) => {
    setTargetModule(mod);
    setConfigKey('log_level');
    setConfigVal('DEBUG_STRICT');
    setConfigModalOpen(true);
  };

  const saveConfig = async () => {
    if (!targetModule) return;
    try {
      await api.patch(`/modules/${targetModule.id}/configuration`, { [configKey]: configVal });
      setConfigModalOpen(false);
      alert(`Configuration updated for ${targetModule.displayName}.`);
    } catch (err: any) {
      alert(err?.message || 'Configuration update failed');
    }
  };

  const filtered = modules.filter((m) => {
    const matchesSearch =
      m.displayName.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase()) ||
      m.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-teal">
            <Boxes className="w-3.5 h-3.5" />
            <span>12-IN-1 ECOSYSTEM CENTRAL MANAGEMENT</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">Cybersecurity Module Control</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Full lifecycle control, dependency enforcement, and telemetry inspection for all 12 SIS modules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/modules/dependencies"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-800 border border-slate-700/80 text-xs font-medium text-slate-300 hover:text-white hover:border-cyan transition-colors"
          >
            <GitFork className="w-3.5 h-3.5 text-cyan" />
            <span>Dependency Engine</span>
          </Link>
          <Link
            href="/admin/modules/registry"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal to-cyan text-navy-950 text-xs font-bold shadow-lg shadow-teal/20"
          >
            <span>Register Module</span>
          </Link>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-navy-800/80 border border-slate-700/80">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search 12 ecosystem modules..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg bg-navy-900 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['ALL', 'ACTIVE', 'DISABLED', 'MAINTENANCE'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                statusFilter === st
                  ? 'bg-navy-950 text-teal border border-teal/40 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((mod) => (
          <div
            key={mod.id}
            className="rounded-2xl bg-navy-800/90 border border-slate-700/80 p-5 shadow-lg flex flex-col justify-between hover:border-slate-600 transition-all group"
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white group-hover:text-teal transition-colors">
                      {mod.displayName}
                    </span>
                    {mod.isCore && (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-teal/10 text-teal border border-teal/30">
                        CORE
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 block">{mod.id} • v{mod.version}</span>
                </div>
                <StatusBadge status={mod.status} size="sm" />
              </div>

              <p className="text-xs text-slate-300 line-clamp-2 mb-4 leading-relaxed">
                {mod.description}
              </p>

              {/* Telemetry pill row */}
              <div className="grid grid-cols-3 gap-2 py-2 px-3 rounded-lg bg-navy-950/70 border border-slate-800 text-[11px] font-mono mb-4">
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">Latency</span>
                  <span className="text-teal font-bold">{mod.responseTimeMs ?? 35}ms</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">CPU</span>
                  <span className="text-cyan font-bold">{mod.cpuUsage ?? 15}%</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9px] uppercase">Memory</span>
                  <span className="text-slate-300 font-bold">{mod.memoryUsageMb ?? 250}MB</span>
                </div>
              </div>

              {/* Dependencies badge summary */}
              {mod.dependencies && mod.dependencies.length > 0 && (
                <div className="mb-4">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                    Dependencies ({mod.dependencies.length}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {mod.dependencies.map((dep: string) => (
                      <span key={dep} className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-navy-900 border border-slate-700 text-slate-300">
                        {dep}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Lifecycle Action Buttons */}
            <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                {mod.status === 'ACTIVE' ? (
                  <button
                    onClick={() => openDisablePrompt(mod)}
                    className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 text-xs transition-colors"
                    title="Safely Disable Module (with Dependency Check)"
                  >
                    <Power className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleEnable(mod.id)}
                    className="p-1.5 rounded-lg bg-teal/20 hover:bg-teal/30 text-teal border border-teal/40 text-xs transition-colors"
                    title="Enable Module"
                  >
                    <Power className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => handleRestart(mod.id)}
                  className="p-1.5 rounded-lg bg-navy-900 hover:bg-navy-700 text-slate-300 border border-slate-700 text-xs transition-colors"
                  title="Restart Module Service"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleMaintenanceToggle(mod)}
                  className={`p-1.5 rounded-lg border text-xs transition-colors ${
                    mod.status === 'MAINTENANCE'
                      ? 'bg-amber-950 text-amber-300 border-amber-800'
                      : 'bg-navy-900 hover:bg-navy-700 text-slate-300 border-slate-700'
                  }`}
                  title="Toggle Maintenance Mode"
                >
                  <Wrench className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openConfig(mod)}
                  className="p-1.5 rounded-lg bg-navy-900 hover:bg-navy-700 text-slate-300 border border-slate-700 text-xs transition-colors"
                  title="Configure Parameters"
                >
                  <Sliders className="w-4 h-4" />
                </button>
                <a
                  href={mod.documentationUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-navy-900 hover:bg-navy-700 text-slate-300 border border-slate-700 text-xs transition-colors"
                  title="View Module Docs"
                >
                  <BookOpen className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dependency Safety Disable Confirmation Modal */}
      <ConfirmationModal
        isOpen={disableModalOpen}
        onClose={() => setDisableModalOpen(false)}
        onConfirm={confirmDisable}
        title={`Disable Module: ${targetModule?.displayName}`}
        description={`You are requesting to transition ${targetModule?.displayName} into DISABLED state. Disabling does NOT delete stored logs or historical records.`}
        warningText={impactInfo?.consequences}
        affectedItems={impactInfo?.activeDependents?.map((d: any) => `${d.name} (v${d.version})`)}
        confirmLabel="Confirm Safe Disable"
        isDestructive={true}
        isLoading={actionLoading}
      />

      {/* Module Configuration Modal */}
      {configModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-navy-800 border border-slate-700 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-1">
              Configure {targetModule?.displayName}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Update runtime parameters and threshold policies.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Parameter Key</label>
                <input
                  type="text"
                  value={configKey}
                  onChange={(e) => setConfigKey(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-navy-900 border border-slate-700 text-slate-100 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Parameter Value</label>
                <input
                  type="text"
                  value={configVal}
                  onChange={(e) => setConfigVal(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-navy-900 border border-slate-700 text-slate-100 font-mono"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-slate-700/60">
              <button
                onClick={() => setConfigModalOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={saveConfig}
                className="px-4 py-2 rounded-lg text-xs font-bold bg-teal hover:bg-teal-400 text-navy-950"
              >
                Apply Parameters
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
