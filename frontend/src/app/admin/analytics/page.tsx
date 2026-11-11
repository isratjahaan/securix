'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { BarChart3, TrendingUp, Shield, Activity, Clock, PieChart, Layers } from 'lucide-react';
import { api } from '@/lib/api';

export default function AnalyticsPage() {
  const [charts, setCharts] = useState<any>(null);
  const [timeframe, setTimeframe] = useState('30d');

  useEffect(() => {
    api.get(`/dashboard/charts?timeframe=${timeframe}`).then((res) => {
      setCharts(res);
    });
  }, [timeframe]);

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>CYBERSECURITY ANALYTICS & TELEMETRY ENGINE</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">Security Analytics & Insights</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Aggregated intelligence patterns, attack vector trends, and defensive operational metrics.
          </p>
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-navy-800 border border-slate-700/80">
          {['7d', '30d', '90d'].map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                timeframe === t ? 'bg-gradient-to-r from-teal to-cyan text-navy-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-navy-800/80 border border-slate-700/80">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Mean Time To Detect (MTTD)</span>
          <span className="text-2xl font-bold font-mono text-teal mt-2 block">4.2 Minutes</span>
          <span className="text-[11px] text-teal mt-1 block">↓ 18% improvement vs previous period</span>
        </div>
        <div className="p-4 rounded-xl bg-navy-800/80 border border-slate-700/80">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Mean Time To Contain (MTTC)</span>
          <span className="text-2xl font-bold font-mono text-cyan mt-2 block">18.5 Minutes</span>
          <span className="text-[11px] text-cyan mt-1 block">Within enterprise SLA (&lt; 30 mins)</span>
        </div>
        <div className="p-4 rounded-xl bg-navy-800/80 border border-slate-700/80">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Automated Interceptions</span>
          <span className="text-2xl font-bold font-mono text-white mt-2 block">99.4%</span>
          <span className="text-[11px] text-slate-400 mt-1 block">Zero manual delay on blocked critical IOCs</span>
        </div>
      </div>

      {/* Module Incident Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-navy-800/90 border border-slate-700/80 p-5 shadow-lg">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-2">
            <Layers className="w-4 h-4 text-teal" />
            Incidents by Source Module
          </h3>
          <p className="text-xs text-slate-400 mb-4">Correlation of incident origin across 12 ecosystem modules</p>

          <div className="space-y-3">
            {charts?.incidentsByModule?.map((mod: any) => (
              <div key={mod.module} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">{mod.module}</span>
                  <span className="font-mono text-teal">{mod.count} Incidents</span>
                </div>
                <div className="w-full h-2 rounded-full bg-navy-950 overflow-hidden">
                  <div style={{ width: `${mod.count * 16}%` }} className="h-full bg-teal rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-navy-800/90 border border-slate-700/80 p-5 shadow-lg">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-cyan" />
            Top Threat Categories
          </h3>
          <p className="text-xs text-slate-400 mb-4">Vector classification of blocked probes and attacks</p>

          <div className="space-y-3">
            {charts?.threatCategories?.map((cat: any) => (
              <div key={cat.category} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">{cat.category}</span>
                  <span className="font-mono text-cyan">{cat.count} Blocked</span>
                </div>
                <div className="w-full h-2 rounded-full bg-navy-950 overflow-hidden">
                  <div style={{ width: `${Math.min(100, cat.count * 2)}%` }} className="h-full bg-cyan rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
