'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StatusBadge } from '@/components/common/StatusBadge';
import { api } from '@/lib/api';
import { HeartPulse, ExternalLink, RefreshCw, Zap, ShieldCheck } from 'lucide-react';

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<any[]>([]);

  useEffect(() => {
    api.get('/integrations').then((res) => setIntegrations(res));
  }, []);

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-teal">
            <HeartPulse className="w-3.5 h-3.5" />
            <span>EXTERNAL CONNECTIONS & DATA BUS HEALTH</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">Integration Health Center</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time status of message buses, push gateways, threat feeds, and database connections.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((item) => (
          <div key={item.id} className="rounded-2xl bg-navy-800/90 border border-slate-700/80 p-5 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-2">
                <span className="text-sm font-bold text-white block">{item.name}</span>
                <StatusBadge status={item.status} size="sm" />
              </div>
              <span className="text-[10px] font-mono text-cyan block mb-2">{item.serviceType}</span>
              <p className="text-xs text-slate-300 mb-3">{item.details}</p>
            </div>

            <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Latency: <strong className="text-teal">{item.latencyMs}ms</strong></span>
              <span>Checked: {new Date(item.lastCheckedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
