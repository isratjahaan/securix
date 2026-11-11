'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { api } from '@/lib/api';
import { Sliders, ArrowLeft, Save, CheckCircle2, Shield } from 'lucide-react';
import Link from 'next/link';

export default function ModuleConfigurationPage() {
  const [modules, setModules] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState('sis-webshield');
  const [configs, setConfigs] = useState<Record<string, string>>({
    rate_limit_per_min: '600',
    waf_strict_mode: 'ENABLED',
    ddos_threshold_pps: '15000',
    ip_reputation_feed: 'AUTOMATIC_BLOCK',
    session_validation_level: 'STRICT_ARGON2',
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    api.get('/modules').then((res) => {
      setModules(res);
      if (res && res.length > 0 && !selectedId) {
        setSelectedId(res[0].id);
      }
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.patch(`/modules/${selectedId}/configuration`, configs);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err?.message || 'Configuration update failed');
    }
  };

  const currentMod = modules.find((m) => m.id === selectedId);

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan">
            <Link href="/admin/modules" className="hover:underline flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Module Control
            </Link>
            <span>/</span>
            <span>RUNTIME CONFIGURATION</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">Module Parameter Tuning</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure defensive thresholds, telemetry rates, and security enforcement policies per module.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Module Picker */}
        <div className="rounded-2xl bg-navy-800/90 border border-slate-700/80 p-4 shadow-lg space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-2 mb-2">
            Select Module
          </span>
          {modules.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedId(m.id)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                selectedId === m.id
                  ? 'bg-navy-950 text-teal border border-teal/40 font-bold shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-navy-900/60'
              }`}
            >
              {m.displayName}
            </button>
          ))}
        </div>

        {/* Configuration Form */}
        <div className="lg:col-span-3 rounded-2xl bg-navy-800/90 border border-slate-700/80 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700/60">
            <div>
              <h2 className="text-lg font-bold text-white">{currentMod?.displayName || selectedId}</h2>
              <span className="text-xs font-mono text-slate-400">ID: {selectedId} • Status: {currentMod?.status}</span>
            </div>
            {savedSuccess && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-teal bg-teal/10 border border-teal/30 rounded-lg">
                <CheckCircle2 className="w-4 h-4" /> Parameters Applied & Audited
              </span>
            )}
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            {Object.entries(configs).map(([key, val]) => (
              <div key={key} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                <label className="text-xs font-mono text-slate-300 uppercase">{key.replace(/_/g, ' ')}</label>
                <div className="md:col-span-2">
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => setConfigs({ ...configs, [key]: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-navy-900 border border-slate-700 text-slate-100 font-mono focus:outline-none focus:border-cyan"
                  />
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-slate-700/60 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal to-cyan text-navy-950 font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-lg shadow-teal/20"
              >
                <Save className="w-4 h-4" />
                <span>Save Runtime Parameters</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
