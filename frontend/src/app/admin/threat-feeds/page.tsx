'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StatusBadge } from '@/components/common/StatusBadge';
import { api } from '@/lib/api';
import { RefreshCw, ArrowLeft, CheckCircle2, Globe, Database, Clock } from 'lucide-react';
import Link from 'next/link';

export default function ThreatFeedsPage() {
  const [feeds, setFeeds] = useState<any[]>([]);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const loadFeeds = async () => {
    try {
      const data = await api.get('/threat-intelligence/feeds');
      setFeeds(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadFeeds();
  }, []);

  const handleSync = async (id: string) => {
    setSyncingId(id);
    try {
      const res = await api.post(`/threat-intelligence/feeds/${id}/sync`);
      alert(res.message || 'Threat feed synchronized successfully.');
      loadFeeds();
    } catch (err: any) {
      alert(err?.message || 'Feed sync failed');
    } finally {
      setSyncingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan">
            <Link href="/admin/threat-intelligence" className="hover:underline flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Threat Intelligence
            </Link>
            <span>/</span>
            <span>EXTERNAL FEED SOURCES</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">Threat Feed Subscriptions</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Synchronize verified external threat data (AlienVault OTX, MISP, AbuseIPDB) with strict confidence attribution.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {feeds.map((feed) => (
          <div key={feed.id} className="rounded-2xl bg-navy-800/90 border border-slate-700/80 p-6 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-2">
                <span className="text-base font-bold text-white block">{feed.name}</span>
                <StatusBadge status={feed.status} size="sm" />
              </div>
              <span className="text-xs font-mono text-slate-400 block mb-3 truncate" title={feed.url}>
                {feed.url}
              </span>

              <div className="space-y-2 py-3 border-y border-slate-700/60 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Data Format:</span>
                  <span className="font-mono text-cyan font-bold">{feed.format}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Sync Cadence:</span>
                  <span className="font-mono text-teal">Every {feed.syncIntervalMinutes}m</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Ingested Indicators:</span>
                  <span className="font-mono text-white font-bold">{feed.totalIndicatorsCount?.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Last Synced:</span>
                  <span className="font-mono text-slate-400">
                    {feed.lastSyncAt ? new Date(feed.lastSyncAt).toLocaleTimeString() : 'Never'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleSync(feed.id)}
              disabled={syncingId === feed.id}
              className="mt-6 w-full py-2.5 rounded-xl bg-navy-900 hover:bg-navy-700 border border-slate-700 text-teal text-xs font-bold font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncingId === feed.id ? 'animate-spin' : ''}`} />
              <span>{syncingId === feed.id ? 'Synchronizing Feed...' : 'Trigger Feed Sync'}</span>
            </button>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
