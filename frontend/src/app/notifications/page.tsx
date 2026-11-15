'use client';

import React, { useState, useEffect } from 'react';
import { UserLayout } from '@/components/user-layout/UserLayout';
import { api } from '@/lib/api';
import {
  Bell,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Check,
  Flame,
  Clock,
  Trash2
} from 'lucide-react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const alerts = await api.get('/soc/alerts');
        setNotifications(alerts || []);
      } catch (e) {
        console.error('Failed to load notifications:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, status: 'ACKNOWLEDGED' })));
  };

  const filtered = notifications.filter((n) => {
    if (filter === 'ALL') return true;
    return n.severity === filter;
  });

  return (
    <UserLayout
      pageTitle="Security Notifications & Threat Telemetry"
      pageSubtitle="Aggregated real-time alert feed from all 12 autonomous cybersecurity safeguards"
      actions={
        <button
          onClick={handleMarkAllRead}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-navy-900 hover:bg-navy-800 border border-surface-border text-teal rounded-xl text-xs font-mono transition"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Mark All Acknowledged</span>
        </button>
      }
    >
      <div className="p-6 bg-navy-900/90 border border-surface-border rounded-2xl shadow-xl space-y-5">
        {/* Severity Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-surface-border">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition ${
                filter === tab
                  ? 'bg-teal text-navy-950 shadow-md'
                  : 'bg-navy-950 text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Notification Stream */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-text-muted">
              Zero notifications matching selected filter.
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-navy-950/70 border border-surface-border hover:border-teal/30 rounded-xl flex items-start justify-between gap-4 transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      item.severity === 'CRITICAL' ? 'bg-status-critical/15 text-status-critical' :
                      item.severity === 'HIGH' ? 'bg-status-high/15 text-status-high' : 'bg-status-medium/15 text-status-medium'
                    }`}>
                      {item.severity}
                    </span>
                    <h3 className="text-sm font-bold text-text-primary">{item.title}</h3>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">{item.description}</p>
                  <div className="text-[10px] font-mono text-text-muted flex items-center gap-2 pt-1">
                    <span>Source: {item.source || 'Cyber SOC'}</span>
                    <span>&bull;</span>
                    <span>{new Date(item.timestamp || item.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-teal bg-teal/10 px-2.5 py-1 rounded-full shrink-0">
                  {item.status || 'NEW'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </UserLayout>
  );
}
