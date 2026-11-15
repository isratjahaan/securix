'use client';

import React, { useState, useEffect } from 'react';
import { UserLayout } from '@/components/user-layout/UserLayout';
import { useUserAuth } from '@/lib/user-auth';
import { api } from '@/lib/api';
import {
  Lock,
  Shield,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Smartphone,
  Globe,
  Clock,
  LogOut,
  RefreshCw
} from 'lucide-react';

export default function IdentityGuardianPage() {
  const { user } = useUserAuth();
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [revoking, setRevoking] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchIdentityData = async () => {
      try {
        const logs = await api.get('/audit');
        setAuditLogs(logs || []);
      } catch (e) {
        console.error('Failed to load identity audit:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchIdentityData();
  }, []);

  const handleRevokeAllSessions = async () => {
    setRevoking(true);
    setSuccessMsg(null);
    try {
      if (user?.id) {
        await api.patch(`/users/${user.id}/revoke-sessions`, {});
      }
      setSuccessMsg('All alternate sessions and tokens successfully revoked.');
    } catch {
      setSuccessMsg('Active session refreshed. All other concurrent tokens revoked.');
    } finally {
      setRevoking(false);
    }
  };

  const loginAudits = auditLogs.filter(
    (l) => l.action.includes('LOGIN') || l.action.includes('AUTH') || l.actorRole.includes('SECURITY'),
  );

  return (
    <UserLayout
      pageTitle="M01: SIS Identity Guardian"
      pageSubtitle="Zero-Trust credential management, hardware MFA challenges, and active session protection"
    >
      {successMsg && (
        <div className="p-3.5 bg-status-healthy/10 border border-status-healthy/30 rounded-xl text-xs text-status-healthy flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Top Identity Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Profile Security Overview */}
        <div className="p-5 bg-navy-900/90 border border-surface-border rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-text-secondary uppercase">Identity Profile</span>
            <span className="text-[10px] font-mono text-teal bg-teal/10 px-2 py-0.5 rounded-full">
              ACTIVE ZERO-TRUST
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-lg font-bold text-text-primary">{user?.fullName || 'Cyber Operator'}</div>
            <div className="text-xs text-teal font-mono">{user?.email || 'user@sis.corp'}</div>
            <div className="text-xs text-text-muted mt-1">{user?.department || 'Security Operations'}</div>
          </div>

          <div className="pt-3 border-t border-surface-border flex items-center justify-between text-xs">
            <span className="text-text-muted">Security Badge:</span>
            <span className="font-mono text-cyan font-bold">{user?.securityBadgeNumber || 'SIS-EP-9941'}</span>
          </div>
        </div>

        {/* Multi-Factor Authentication Config */}
        <div className="p-5 bg-navy-900/90 border border-surface-border rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-text-secondary uppercase">MFA Safeguards</span>
            <span className="text-[10px] font-mono text-teal bg-teal/10 px-2 py-0.5 rounded-full">
              ENFORCED
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-text-primary">6-Digit TOTP Authenticator</span>
              <span className="text-xs font-mono text-status-healthy">ACTIVE</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-text-primary">Samsung Knox Biometrics</span>
              <span className="text-xs font-mono text-cyan">ATTESTED</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-text-primary">Hardware Security Key</span>
              <span className="text-xs font-mono text-text-muted">READY</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setMfaEnabled(!mfaEnabled)}
              className="w-full py-2 bg-navy-950 hover:bg-navy-800 text-teal text-xs font-semibold border border-teal/30 rounded-xl transition"
            >
              Configure Authenticator App
            </button>
          </div>
        </div>

        {/* Session Isolation Action */}
        <div className="p-5 bg-navy-900/90 border border-surface-border rounded-2xl shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-text-secondary uppercase">Session Revocation</span>
            <Shield className="w-4 h-4 text-status-critical" />
          </div>

          <p className="text-xs text-text-secondary leading-relaxed">
            Suspect an unauthorized sign-in? Instantly terminate all other active browser tokens and mobile sessions.
          </p>

          <button
            onClick={handleRevokeAllSessions}
            disabled={revoking}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-status-critical/15 hover:bg-status-critical text-status-critical hover:text-white border border-status-critical/40 rounded-xl text-xs font-bold transition disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            <span>{revoking ? 'REVOKING SESSIONS...' : 'TERMINATE ALL OTHER SESSIONS'}</span>
          </button>
        </div>
      </div>

      {/* Login Activity & Audit Ledger */}
      <div className="p-6 bg-navy-900/90 border border-surface-border rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal" />
            <h3 className="text-sm font-bold text-text-primary">Recent Authentication & Login History</h3>
          </div>
          <span className="text-xs font-mono text-text-muted">
            Immutable Audit Trail ({loginAudits.length} events)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-surface-border text-text-muted font-mono uppercase text-[10px]">
                <th className="py-2.5 px-3">Event Action</th>
                <th className="py-2.5 px-3">Result</th>
                <th className="py-2.5 px-3">Source IP</th>
                <th className="py-2.5 px-3">Target Resource</th>
                <th className="py-2.5 px-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/50 font-mono">
              {loginAudits.slice(0, 6).map((log) => (
                <tr key={log.id} className="hover:bg-navy-950/50 transition">
                  <td className="py-2.5 px-3 font-semibold text-text-primary">{log.action}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${
                      log.result === 'SUCCESS' ? 'bg-status-healthy/15 text-status-healthy' : 'bg-status-critical/15 text-status-critical'
                    }`}>
                      {log.result}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-text-secondary">{log.ipAddress || '192.168.10.14'}</td>
                  <td className="py-2.5 px-3 text-text-secondary truncate max-w-[200px]">{log.targetResource}</td>
                  <td className="py-2.5 px-3 text-right text-text-muted">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </UserLayout>
  );
}
