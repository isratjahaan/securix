'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { api } from '@/lib/api';
import { Settings, Save, Shield, Lock, Bell, Boxes, Cpu, Database, UserCheck, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('SECURITY');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const loadSettings = async () => {
    try {
      const data = await api.get('/settings');
      setSettings(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleUpdate = async (key: string, value: string) => {
    try {
      await api.patch(`/settings/${key}`, { value });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
      loadSettings();
    } catch (err: any) {
      alert(err?.message || 'Setting update failed');
    }
  };

  const categories = [
    { id: 'SECURITY', label: 'Security & MFA', icon: Shield },
    { id: 'GENERAL', label: 'General System', icon: Settings },
    { id: 'NOTIFICATION', label: 'Notification Dispatch', icon: Bell },
    { id: 'API', label: 'API & Rate Limits', icon: Cpu },
    { id: 'DATA', label: 'Data & Privacy', icon: Database },
  ];

  const filtered = settings.filter((s) => s.category === activeCategory);

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-teal">
            <Settings className="w-3.5 h-3.5" />
            <span>CENTRAL SYSTEM GOVERNANCE & POLICIES</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">System Settings & Security Policies</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure enterprise security thresholds, administrative MFA rules, and ecosystem parameters.
          </p>
        </div>

        {savedSuccess && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal bg-teal/10 border border-teal/30 rounded-lg">
            <CheckCircle2 className="w-4 h-4" /> Policy Saved & Audited
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Category Selector */}
        <div className="rounded-2xl bg-navy-800/90 border border-slate-700/80 p-4 shadow-lg space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-2 mb-2">
            Policy Categories
          </span>
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-navy-950 text-teal border border-teal/40 font-bold shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-navy-900/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Settings Form */}
        <div className="lg:col-span-3 rounded-2xl bg-navy-800/90 border border-slate-700/80 p-6 shadow-lg space-y-5">
          <h2 className="text-base font-bold text-white uppercase tracking-wider">
            {categories.find((c) => c.id === activeCategory)?.label} Settings
          </h2>

          <div className="space-y-4">
            {filtered.map((s) => (
              <div key={s.key} className="p-4 rounded-xl bg-navy-950/70 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-mono text-teal font-bold uppercase block">{s.key.replace(/_/g, ' ')}</span>
                  <span className="text-[11px] font-mono text-slate-500">{s.key}</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    defaultValue={s.value}
                    onBlur={(e) => {
                      if (e.target.value !== s.value) {
                        handleUpdate(s.key, e.target.value);
                      }
                    }}
                    className="px-3 py-1.5 text-xs rounded-lg bg-navy-900 border border-slate-700 text-slate-100 font-mono w-48 sm:w-64 focus:outline-none focus:border-cyan"
                  />
                  <button
                    onClick={(e) => {
                      const input = (e.currentTarget.previousSibling as HTMLInputElement).value;
                      handleUpdate(s.key, input);
                    }}
                    className="p-1.5 rounded-lg bg-navy-900 hover:bg-navy-700 border border-slate-700 text-teal"
                    title="Save"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
