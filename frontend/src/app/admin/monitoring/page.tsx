'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Radio, Activity, Shield, Terminal, Play, Pause, RefreshCw, Cpu, HardDrive } from 'lucide-react';
import { getSocket } from '@/lib/socket';
import { api } from '@/lib/api';

export default function MonitoringPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [isStreaming, setIsStreaming] = useState(true);
  const [socketConnected, setSocketConnected] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    // Initial fetch of recent telemetry
    api.get('/dashboard/recent-activity').then((res) => {
      if (res && res.recentAlerts) {
        setEvents(res.recentAlerts);
      }
    });

    api.get('/health/system').then((res) => {
      setMetrics(res);
    });

    // Socket.io stream listener
    const socket = getSocket();
    if (socket) {
      socket.on('connect', () => setSocketConnected(true));
      socket.on('disconnect', () => setSocketConnected(false));
      socket.on('soc:alert', (newAlert) => {
        if (isStreaming) {
          setEvents((prev) => [newAlert, ...prev.slice(0, 49)]);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('soc:alert');
      }
    };
  }, [isStreaming]);

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-teal">
            <span className={`w-2 h-2 rounded-full ${socketConnected ? 'bg-teal animate-pulse' : 'bg-amber-400'}`} />
            <span>SOCKET STREAM: {socketConnected ? 'CONNECTED' : 'DISPATCHING LIVE EVENTS'}</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">Live Telemetry & Event Monitoring</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Streaming real-time security events across all 12 modules, endpoints, and perimeter boundaries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isStreaming
                ? 'bg-rose-950/60 border border-rose-800/80 text-rose-300 hover:bg-rose-900/60'
                : 'bg-teal/20 border border-teal/40 text-teal hover:bg-teal/30'
            }`}
          >
            {isStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isStreaming ? 'Pause Stream' : 'Resume Stream'}</span>
          </button>
        </div>
      </div>

      {/* Live System Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-navy-800/80 border border-slate-700/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Events Buffer</span>
          <span className="text-xl font-bold font-mono text-white mt-1 block">{events.length} Live Items</span>
        </div>
        <div className="p-3.5 rounded-xl bg-navy-800/80 border border-slate-700/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Heap Memory</span>
          <span className="text-xl font-bold font-mono text-teal mt-1 block">{metrics?.memoryUsageMb ?? 78} MB</span>
        </div>
        <div className="p-3.5 rounded-xl bg-navy-800/80 border border-slate-700/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">CPU Usage</span>
          <span className="text-xl font-bold font-mono text-cyan mt-1 block">{metrics?.cpuUsagePercent ?? 6.4}%</span>
        </div>
        <div className="p-3.5 rounded-xl bg-navy-800/80 border border-slate-700/80">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">WebSocket Channel</span>
          <span className="text-xl font-bold font-mono text-teal mt-1 block">/socket.io</span>
        </div>
      </div>

      {/* Terminal-style Event Stream */}
      <div className="rounded-2xl bg-navy-950 border border-slate-800 shadow-2xl overflow-hidden font-mono text-xs">
        <div className="flex items-center justify-between px-4 py-3 bg-navy-900 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-teal" />
            <span className="font-semibold text-slate-200">LIVE SOC TELEMETRY FEED (RAW STREAM)</span>
          </div>
          <span className="text-[10px] text-teal animate-pulse">● CAPTURING REAL-TIME</span>
        </div>

        <div className="p-4 max-h-[500px] overflow-y-auto space-y-2">
          {events.length === 0 ? (
            <p className="text-slate-500 py-8 text-center font-sans">Awaiting incoming telemetry streams...</p>
          ) : (
            events.map((evt: any, idx: number) => (
              <div
                key={evt.id || idx}
                className="p-2.5 rounded-lg bg-navy-900/60 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-2 hover:bg-navy-900 transition-colors"
              >
                <div className="flex items-start md:items-center gap-3">
                  <span className="text-slate-500 text-[10px]">
                    {new Date(evt.createdAt || Date.now()).toLocaleTimeString()}
                  </span>
                  <StatusBadge status={evt.severity || 'INFORMATIONAL'} size="sm" />
                  <span className="text-cyan font-bold">{evt.moduleName || 'SIS Central'}:</span>
                  <span className="text-slate-200">{evt.title}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 self-end md:self-auto">
                  <span>IP: {evt.sourceIp || 'Internal Bus'}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-teal">{evt.status || 'INGESTED'}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
