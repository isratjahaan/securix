'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StatusBadge } from '@/components/common/StatusBadge';
import { api } from '@/lib/api';
import { Cpu, ExternalLink, RefreshCw, Zap, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function ApiManagementPage() {
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [testingId, setTestingId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const data = await api.get('/integrations');
      setIntegrations(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTest = async (id: string) => {
    setTestingId(id);
    try {
      const res = await api.post(`/integrations/${id}/test`);
      alert(`Ping Successful: ${res.message} (Latency: ${res.latencyMs}ms)`);
      loadData();
    } catch (err: any) {
      alert(err?.message || 'API probe failed');
    } finally {
      setTestingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan">
            <Cpu className="w-3.5 h-3.5" />
            <span>CENTRAL API GATEWAY & MICROSERVICES</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">API & Integration Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor API endpoints, REST latency, and OpenAPI Swagger documentation across all 12 modules.
          </p>
        </div>

        <a
          href="/api/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-800 border border-slate-700/80 text-xs font-medium text-teal hover:bg-navy-700 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Interactive Swagger UI</span>
        </a>
      </div>

      <div className="rounded-2xl bg-navy-800/90 border border-slate-700/80 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-navy-950 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                <th className="p-3.5">API Service Name</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Endpoint URI</th>
                <th className="p-3.5">Latency</th>
                <th className="p-3.5">Service Status</th>
                <th className="p-3.5 text-right">Health Probe</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-200 font-mono">
              {integrations.map((item) => (
                <tr key={item.id} className="hover:bg-navy-900/60 transition-colors">
                  <td className="p-3.5 font-sans font-semibold text-white">{item.name}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-navy-950 border border-slate-700 text-cyan">
                      {item.serviceType}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-300 truncate max-w-[220px]" title={item.endpoint}>
                    {item.endpoint}
                  </td>
                  <td className="p-3.5 text-teal font-bold">{item.latencyMs} ms</td>
                  <td className="p-3.5 font-sans">
                    <StatusBadge status={item.status} size="sm" />
                  </td>
                  <td className="p-3.5 text-right font-sans">
                    <button
                      onClick={() => handleTest(item.id)}
                      disabled={testingId === item.id}
                      className="px-2.5 py-1 rounded bg-navy-900 hover:bg-navy-700 border border-slate-700 text-slate-300 text-[11px] font-mono transition-colors"
                    >
                      {testingId === item.id ? 'Pinging...' : 'Test Ping'}
                    </button>
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
