'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StatusBadge } from '@/components/common/StatusBadge';
import { api } from '@/lib/api';
import { UserCheck, Shield, KeyRound, Activity, History, Lock, CheckCircle2, XCircle } from 'lucide-react';

export default function AdministratorsPage() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [logins, setLogins] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'admins' | 'sessions' | 'logins'>('admins');

  useEffect(() => {
    api.get('/admins').then((res) => setAdmins(res));
    api.get('/admins/sessions').then((res) => setSessions(res));
    api.get('/admins/logins').then((res) => setLogins(res));
  }, []);

  const handleToggleMfa = async (id: string, current: boolean) => {
    try {
      await api.patch(`/admins/${id}/mfa`, { enforce: !current });
      setAdmins((prev) =>
        prev.map((a) => (a.id === id ? { ...a, mfaEnforced: !current } : a)),
      );
    } catch (err: any) {
      alert(err?.message || 'MFA update failed');
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-teal">
            <UserCheck className="w-3.5 h-3.5" />
            <span>PRIVILEGED ACCESS & GOVERNANCE</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">Administrator Management & Sessions</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage high-privilege administrative accounts, enforce MFA policies, and monitor real-time command sessions.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-navy-800 border border-slate-700/80">
          <button
            onClick={() => setActiveTab('admins')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'admins' ? 'bg-gradient-to-r from-teal to-cyan text-navy-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Administrators
          </button>
          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'sessions' ? 'bg-gradient-to-r from-teal to-cyan text-navy-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Active Sessions ({sessions.length})
          </button>
          <button
            onClick={() => setActiveTab('logins')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'logins' ? 'bg-gradient-to-r from-teal to-cyan text-navy-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Login Audit
          </button>
        </div>
      </div>

      {activeTab === 'admins' && (
        <div className="rounded-2xl bg-navy-800/90 border border-slate-700/80 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-navy-950 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                  <th className="p-3.5">Administrator</th>
                  <th className="p-3.5">Assigned Role</th>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5">Security Badge</th>
                  <th className="p-3.5">MFA Policy</th>
                  <th className="p-3.5">Last Login IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {admins.map((a) => (
                  <tr key={a.id} className="hover:bg-navy-900/60 transition-colors">
                    <td className="p-3.5">
                      <div className="font-semibold text-white">{a.fullName}</div>
                      <div className="text-[11px] text-slate-400">{a.email}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-teal/10 text-teal border border-teal/30 font-bold">
                        {a.adminRoleType?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-300">{a.department || 'Central Command'}</td>
                    <td className="p-3.5 font-mono text-cyan">{a.securityBadgeNumber || 'SIS-SEC-01'}</td>
                    <td className="p-3.5">
                      <button
                        onClick={() => handleToggleMfa(a.id, a.mfaEnforced)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                          a.mfaEnforced
                            ? 'bg-teal/20 text-teal border border-teal/40'
                            : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}
                      >
                        {a.mfaEnforced ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {a.mfaEnforced ? 'MANDATORY' : 'OPTIONAL'}
                      </button>
                    </td>
                    <td className="p-3.5 font-mono text-slate-400">{a.lastLoginIp || '192.168.10.14'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'sessions' && (
        <div className="rounded-2xl bg-navy-800/90 border border-slate-700/80 shadow-xl overflow-hidden p-5 space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Live Privileged Command Sessions</h3>
          {sessions.map((s) => (
            <div key={s.id} className="p-4 rounded-xl bg-navy-950/70 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{s.adminName}</span>
                  <span className="text-[10px] font-mono text-teal px-1.5 py-0.5 rounded bg-teal/10">
                    {s.role}
                  </span>
                  {s.isCurrent && (
                    <span className="text-[10px] font-mono text-cyan bg-cyan/10 px-1.5 py-0.5 rounded border border-cyan/30">
                      CURRENT SESSION
                    </span>
                  )}
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-1">
                  IP: {s.ipAddress} • Client: {s.userAgent} • Location: {s.location}
                </div>
              </div>
              <span className="text-xs font-mono text-slate-400">Expires: {s.expiresIn}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'logins' && (
        <div className="rounded-2xl bg-navy-800/90 border border-slate-700/80 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-navy-950 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5">Administrator</th>
                  <th className="p-3.5">Source IP</th>
                  <th className="p-3.5">MFA Verification</th>
                  <th className="p-3.5">Outcome</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200 font-mono">
                {logins.map((l) => (
                  <tr key={l.id} className="hover:bg-navy-900/60 transition-colors">
                    <td className="p-3.5 text-slate-400">{new Date(l.timestamp).toLocaleTimeString()}</td>
                    <td className="p-3.5 font-sans font-semibold text-white">{l.adminName}</td>
                    <td className="p-3.5 text-slate-300">{l.ipAddress}</td>
                    <td className="p-3.5">{l.mfaVerified ? 'TOTP_VERIFIED' : 'BYPASS_OR_NA'}</td>
                    <td className="p-3.5">
                      <StatusBadge status={l.status === 'SUCCESS' ? 'HEALTHY' : 'CRITICAL'} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
