'use client';

import React, { useState } from 'react';
import { UserLayout } from '@/components/user-layout/UserLayout';
import { useUserAuth } from '@/lib/user-auth';
import {
  Shield,
  KeyRound,
  CheckCircle2,
  Lock,
  Clock,
  Smartphone,
  Globe,
  AlertTriangle,
  Zap
} from 'lucide-react';

export default function AccessGuardianPage() {
  const { user } = useUserAuth();
  const [jitRequested, setJitRequested] = useState(false);
  const [jitReason, setJitReason] = useState('Emergency production hotfix investigation');

  const activeSessions = [
    { id: 'sess-1', device: 'Current Web Browser (Chrome on Windows 11)', ip: '192.168.10.14', location: 'Corporate Headquarters', current: true, lastActive: 'Now' },
    { id: 'sess-2', device: 'Samsung Galaxy A55 (Android 15)', ip: '10.0.2.16', location: 'Enterprise Mobile Gateway', current: false, lastActive: '12m ago' },
  ];

  const handleRequestJIT = (e: React.FormEvent) => {
    e.preventDefault();
    setJitRequested(true);
  };

  return (
    <UserLayout
      pageTitle="M09: SIS Access Guardian"
      pageSubtitle="Privileged access controls, ephemeral Just-In-Time (JIT) role grants, and active session boundaries"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Role & Permissions Overview */}
        <div className="space-y-5">
          <div className="p-5 bg-navy-900/90 border border-surface-border rounded-2xl shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-text-secondary uppercase">Assigned Clearance</span>
              <span className="text-[10px] font-mono text-teal bg-teal/10 px-2 py-0.5 rounded-full">
                ROLE-BASED RBAC
              </span>
            </div>

            <div>
              <div className="text-base font-bold text-text-primary">{user?.fullName || 'User Profile'}</div>
              <div className="text-xs text-teal font-mono mt-0.5">{user?.role || 'SECURITY_OPERATOR'}</div>
            </div>

            <div className="space-y-2 pt-2 border-t border-surface-border text-xs">
              <div className="text-[10px] font-mono text-text-muted uppercase">Active RBAC Permissions:</div>
              <ul className="space-y-1.5 font-mono text-[11px] text-text-secondary">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal" />
                  <span>endpoint.read &bull; endpoint.quarantine</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal" />
                  <span>phishing.scan &bull; phishing.quarantine</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal" />
                  <span>vault.client_decrypt (Self)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal" />
                  <span>soc.alerts.read &bull; soc.alerts.ack</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Ephemeral JIT Request Card */}
          <div className="p-5 bg-navy-900/90 border border-teal/30 rounded-2xl shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-teal">
              <Zap className="w-4 h-4" />
              <h3 className="text-sm font-bold text-text-primary">Just-In-Time (JIT) Escalation</h3>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">
              Request temporary elevated administrative access for 60 minutes with automated audit logging.
            </p>

            {jitRequested ? (
              <div className="p-3 bg-status-healthy/10 border border-status-healthy/30 rounded-xl text-xs text-status-healthy space-y-1">
                <div className="font-bold">JIT Elevation Ticket #JIT-2026-902 Dispatched</div>
                <div className="text-[11px]">Approved via automated Zero-Trust policy. Expires in 59:45.</div>
              </div>
            ) : (
              <form onSubmit={handleRequestJIT} className="space-y-3 pt-1">
                <input
                  type="text"
                  required
                  placeholder="Justification for temporary elevation"
                  value={jitReason}
                  onChange={(e) => setJitReason(e.target.value)}
                  className="w-full px-3 py-2 bg-navy-950 border border-surface-border focus:border-teal rounded-xl text-xs text-text-primary outline-none transition"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-teal hover:bg-teal-400 text-navy-950 font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-md shadow-teal/20"
                >
                  REQUEST 60-MIN JIT ELEVATION
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Active Session Inventory */}
        <div className="lg:col-span-2 p-6 bg-navy-900/90 border border-surface-border rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan" />
              <h3 className="text-sm font-bold text-text-primary">Active Verified Sessions</h3>
            </div>
            <span className="text-xs font-mono text-text-muted">{activeSessions.length} active tokens</span>
          </div>

          <div className="space-y-3">
            {activeSessions.map((s) => (
              <div
                key={s.id}
                className="p-4 bg-navy-950/70 border border-surface-border rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-navy-800 flex items-center justify-center text-teal">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-text-primary flex items-center gap-2">
                      <span>{s.device}</span>
                      {s.current && (
                        <span className="text-[9px] font-mono text-teal bg-teal/10 px-1.5 py-0.5 rounded">
                          CURRENT
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-mono text-text-muted mt-0.5">
                      IP: {s.ip} &bull; {s.location}
                    </div>
                  </div>
                </div>
                <div className="text-right text-xs font-mono text-text-secondary">
                  <span>Last active: {s.lastActive}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
