'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StatusBadge } from '@/components/common/StatusBadge';
import { api } from '@/lib/api';
import { Bell, CheckCircle2, Sliders, Smartphone, Mail, ShieldAlert } from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [prefs, setPrefs] = useState<any[]>([]);

  useEffect(() => {
    api.get('/notifications/unread').then((res) => setNotifications(res.data || []));
    api.get('/notifications/preferences').then((res) => setPrefs(res || []));
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.post('/notifications/mark-all-read');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err: any) {
      alert(err?.message || 'Failed to mark read');
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan">
            <Bell className="w-3.5 h-3.5" />
            <span>CENTRAL MULTI-CHANNEL DISPATCH</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">Notification Center & Alerts</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure multi-channel routing (In-App, Firebase Cloud Messaging, Email) and dispatch critical notifications.
          </p>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="px-3 py-1.5 rounded-lg bg-navy-800 border border-slate-700/80 text-xs font-medium text-teal hover:bg-navy-700 transition-colors"
        >
          Mark All As Read
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notification Stream */}
        <div className="lg:col-span-2 rounded-2xl bg-navy-800/90 border border-slate-700/80 shadow-xl overflow-hidden p-6 space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Recent Broadcast Alerts</h3>
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-xl border transition-colors ${
                n.isRead ? 'bg-navy-950/40 border-slate-800/80' : 'bg-navy-950/90 border-teal/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-white">{n.title}</span>
                <StatusBadge status={n.severity} size="sm" />
              </div>
              <p className="text-xs text-slate-300 leading-snug">{n.message}</p>
              <span className="text-[10px] font-mono text-slate-500 mt-2 block">{n.createdAt}</span>
            </div>
          ))}
        </div>

        {/* Multi-Channel Preferences */}
        <div className="rounded-2xl bg-navy-800/90 border border-slate-700/80 shadow-xl overflow-hidden p-6 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan" />
            Channel Routing
          </h3>

          <div className="space-y-3 text-xs">
            {prefs.map((p) => (
              <div key={p.channel} className="p-3.5 rounded-xl bg-navy-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white font-mono">{p.channel}</span>
                  <span className="text-[10px] text-teal font-mono">CONNECTED</span>
                </div>
                <div className="text-[11px] text-slate-400 space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Critical Incidents:</span>
                    <span className="text-teal font-bold">YES</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Backup Failure Alerts:</span>
                    <span className="text-teal font-bold">YES</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Health Degradation:</span>
                    <span className="text-slate-300">{p.systemHealthDegraded ? 'YES' : 'NO'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
