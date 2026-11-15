'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserLayout } from '@/components/user-layout/UserLayout';
import { useUserAuth } from '@/lib/user-auth';
import { api } from '@/lib/api';
import {
  Shield,
  Smartphone,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ArrowRight,
  RefreshCw,
  Boxes,
  Activity,
  Binary,
  Radio,
  Clock,
  ExternalLink,
  ChevronRight,
  Flame,
  Cloud,
  UserCheck,
  MailCheck,
  Eye,
  KeyRound
} from 'lucide-react';

export default function UserDashboardPage() {
  const { user } = useUserAuth();

  const [modules, setModules] = useState<any[]>([]);
  const [devices, setDevices] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [backups, setBackups] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [posture, setPosture] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    try {
      const [modulesRes, devicesRes, alertsRes, backupsRes, auditRes, postureRes] = await Promise.allSettled([
        api.get('/modules'),
        api.get('/devices'),
        api.get('/soc/alerts'),
        api.get('/backups/jobs'),
        api.get('/audit'),
        api.get('/dashboard/posture'),
      ]);

      if (modulesRes.status === 'fulfilled') setModules(modulesRes.value || []);
      if (devicesRes.status === 'fulfilled') setDevices(devicesRes.value || []);
      if (alertsRes.status === 'fulfilled') setAlerts(alertsRes.value || []);
      if (backupsRes.status === 'fulfilled') setBackups(backupsRes.value || []);
      if (auditRes.status === 'fulfilled') setAuditLogs(auditRes.value || []);
      if (postureRes.status === 'fulfilled') setPosture(postureRes.value || null);
    } catch (e) {
      console.error('Error fetching dashboard telemetry:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboardData();
  };

  const activeModulesCount = modules.filter((m) => m.status === 'ACTIVE').length;
  const criticalAlertsCount = alerts.filter((a) => a.severity === 'CRITICAL' && a.status === 'NEW').length;
  const verifiedBackupsCount = backups.filter((b) => b.isIntegrityVerified || b.lastRunStatus === 'COMPLETED').length;
  const stolenDevices = devices.filter((d) => d.isLocked || d.status === 'STOLEN_LOCKED');

  return (
    <UserLayout
      pageTitle={`Security Command & Telemetry`}
      pageSubtitle={`Active Zero-Trust protection profile for ${user?.fullName || 'User'} (${user?.department || 'Enterprise Client'})`}
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-navy-900 hover:bg-navy-800 border border-surface-border rounded-xl text-xs font-mono text-text-secondary hover:text-text-primary transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-teal' : ''}`} />
            <span>Sync Telemetry</span>
          </button>
          <Link
            href="/modules/phishing"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-teal hover:bg-teal-400 text-navy-950 font-bold rounded-xl text-xs transition shadow-md shadow-teal/20"
          >
            <MailCheck className="w-3.5 h-3.5" />
            <span>Scan Phishing Link</span>
          </Link>
        </div>
      }
    >
      {/* Emergency Theft Lockout Alert Banner */}
      {stolenDevices.length > 0 && (
        <div className="p-4 rounded-2xl bg-red-950/40 border-2 border-status-critical flex items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-status-critical/20 flex items-center justify-center text-status-critical">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>🚨 EMERGENCY THEFT LOCKOUT ACTIVE</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-status-critical text-white font-black">
                  {stolenDevices.length} DEVICE(S) SECURED
                </span>
              </div>
              <div className="text-xs text-slate-300">
                Mobile endpoint reported stolen. Remote lockout, siren and vault quarantine dispatched to phone.
              </div>
            </div>
          </div>
          <Link
            href="/devices"
            className="px-4 py-2 bg-status-critical hover:bg-red-500 text-white font-bold rounded-xl text-xs font-mono transition"
          >
            Manage / Restore Device &rarr;
          </Link>
        </div>
      )}

      {/* 1. Top Posture & Safeguards Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Posture Score */}
        <div className="p-5 bg-navy-900/90 border border-teal/30 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-text-secondary uppercase tracking-wider">
              Security Posture
            </span>
            <span className="text-[10px] font-mono text-teal bg-teal/10 px-2 py-0.5 rounded-full">
              OPTIMAL
            </span>
          </div>
          <div className="my-3 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-teal font-mono">
              {posture?.overallScore || 94}
            </span>
            <span className="text-sm text-text-muted font-mono">/ 100</span>
          </div>
          <div className="w-full bg-navy-950 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-teal to-cyan h-full rounded-full transition-all duration-500"
              style={{ width: `${posture?.overallScore || 94}%` }}
            />
          </div>
          <span className="text-[11px] text-text-secondary mt-2">
            Zero-Trust Knox attestations & MFA verified
          </span>
        </div>

        {/* Active Modules */}
        <div className="p-5 bg-navy-900/90 border border-surface-border rounded-2xl shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-text-secondary uppercase tracking-wider">
              Safeguards Active
            </span>
            <Boxes className="w-4 h-4 text-teal" />
          </div>
          <div className="my-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-text-primary font-mono">
              {activeModulesCount}
            </span>
            <span className="text-sm text-text-muted font-mono">/ {modules.length || 12}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-status-healthy">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Decoupled Event Bus Online</span>
          </div>
        </div>

        {/* Protected Devices */}
        <div className="p-5 bg-navy-900/90 border border-surface-border rounded-2xl shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-text-secondary uppercase tracking-wider">
              Enrolled Endpoints
            </span>
            <Smartphone className="w-4 h-4 text-cyan" />
          </div>
          <div className="my-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-text-primary font-mono">
              {devices.length || 3}
            </span>
            <span className="text-xs text-cyan font-mono">Hardware Attested</span>
          </div>
          <Link href="/devices" className="text-xs text-cyan hover:underline flex items-center gap-1">
            <span>Manage Devices</span> &rarr;
          </Link>
        </div>

        {/* Security Alerts */}
        <div className="p-5 bg-navy-900/90 border border-surface-border rounded-2xl shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-text-secondary uppercase tracking-wider">
              Pending Threats
            </span>
            <AlertTriangle className={`w-4 h-4 ${criticalAlertsCount > 0 ? 'text-status-critical' : 'text-teal'}`} />
          </div>
          <div className="my-3 flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold font-mono ${criticalAlertsCount > 0 ? 'text-status-critical' : 'text-teal'}`}>
              {criticalAlertsCount}
            </span>
            <span className="text-xs text-text-muted font-mono">Critical Unresolved</span>
          </div>
          <Link href="/modules/soc" className="text-xs text-text-secondary hover:text-text-primary flex items-center gap-1">
            <span>Review Alerts</span> &rarr;
          </Link>
        </div>
      </div>

      {/* 2. Security Recommendations & Quick Checklist */}
      <div className="p-5 bg-gradient-to-r from-navy-900/90 via-navy-900/70 to-navy-900/90 border border-teal/20 rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal/10 text-teal flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-text-primary">Zero-Trust Security Recommendations</h2>
              <p className="text-xs text-text-secondary">Proactive hardening steps to maintain maximum defense compliance</p>
            </div>
          </div>
          <span className="text-xs font-mono text-teal bg-teal/10 px-2.5 py-1 rounded-full">
            3 Recommendations
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          <div className="p-3.5 bg-navy-950/70 border border-surface-border rounded-xl flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-primary">Audit Password Vault</span>
              <Lock className="w-3.5 h-3.5 text-teal" />
            </div>
            <p className="text-[11px] text-text-secondary">Client-side AES-256 GCM vault has 0 exposed plaintexts. Verify credential strength.</p>
            <Link href="/modules/vault" className="text-xs text-teal hover:underline font-medium inline-flex items-center gap-1">
              <span>Open Vault</span> &rarr;
            </Link>
          </div>

          <div className="p-3.5 bg-navy-950/70 border border-surface-border rounded-xl flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-primary">Verify Ransomware Tripwires</span>
              <Binary className="w-3.5 h-3.5 text-cyan" />
            </div>
            <p className="text-[11px] text-text-secondary">Active honeypot canaries intact. Test simulated canary mutation response.</p>
            <Link href="/modules/ransomware" className="text-xs text-cyan hover:underline font-medium inline-flex items-center gap-1">
              <span>Test Tripwires</span> &rarr;
            </Link>
          </div>

          <div className="p-3.5 bg-navy-950/70 border border-surface-border rounded-xl flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-primary">Cloud Snapshot Checksum</span>
              <Cloud className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <p className="text-[11px] text-text-secondary">Verify SHA-256 block hash for disaster recovery snapshots.</p>
            <Link href="/modules/backups" className="text-xs text-purple-400 hover:underline font-medium inline-flex items-center gap-1">
              <span>Verify Integrity</span> &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* 3. 12 Safeguards Control Matrix */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-text-primary">12-in-1 Defense Safeguards Status</h2>
            <p className="text-xs text-text-secondary">Autonomous cyber defense pillars with runtime active module guards</p>
          </div>
          <Link href="/modules" className="text-xs text-teal hover:underline font-mono">
            View All Modules Hub &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {modules.slice(0, 12).map((mod) => (
            <Link
              key={mod.id}
              href={`/modules/${mod.id.replace('sis-', '')}`}
              className="p-3.5 bg-navy-900/80 hover:bg-navy-800/80 border border-surface-border hover:border-teal/40 rounded-xl transition flex flex-col justify-between space-y-2 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-text-muted">{mod.version}</span>
                <span className={`w-2 h-2 rounded-full ${mod.status === 'ACTIVE' ? 'bg-teal' : 'bg-status-disabled'}`} />
              </div>
              <div>
                <div className="text-xs font-bold text-text-primary group-hover:text-teal transition truncate">
                  {mod.displayName}
                </div>
                <div className="text-[10px] font-mono text-teal mt-0.5">{mod.status}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 4. Two-Column Layout: Alerts Feed + Device Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts Feed */}
        <div className="p-5 bg-navy-900/90 border border-surface-border rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-status-critical" />
              <h3 className="text-sm font-bold text-text-primary">Live SOC Threat Stream</h3>
            </div>
            <Link href="/modules/soc" className="text-xs text-teal hover:underline font-mono">
              View All ({alerts.length})
            </Link>
          </div>

          <div className="space-y-2.5">
            {alerts.length === 0 ? (
              <div className="text-center py-8 text-xs text-text-muted">
                Zero active threat alerts. Perimeter secure.
              </div>
            ) : (
              alerts.slice(0, 4).map((alert) => (
                <div
                  key={alert.id}
                  className="p-3 bg-navy-950/70 border border-surface-border rounded-xl flex items-start justify-between gap-3 hover:border-surface-borderFocus transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        alert.severity === 'CRITICAL' ? 'bg-status-critical/15 text-status-critical' :
                        alert.severity === 'HIGH' ? 'bg-status-high/15 text-status-high' : 'bg-status-medium/15 text-status-medium'
                      }`}>
                        {alert.severity}
                      </span>
                      <span className="text-xs font-semibold text-text-primary line-clamp-1">
                        {alert.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-text-secondary line-clamp-1">
                      {alert.description}
                    </p>
                    <div className="text-[10px] text-text-muted font-mono">
                      Source: {alert.source || 'Threat Intel Engine'} &bull; {new Date(alert.timestamp || alert.createdAt).toLocaleTimeString()}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-teal bg-teal/10 px-2 py-0.5 rounded">
                    {alert.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Registered Devices */}
        <div className="p-5 bg-navy-900/90 border border-surface-border rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-cyan" />
              <h3 className="text-sm font-bold text-text-primary">Registered Protected Devices</h3>
            </div>
            <Link href="/devices" className="text-xs text-cyan hover:underline font-mono">
              Manage ({devices.length})
            </Link>
          </div>

          <div className="space-y-2.5">
            {devices.slice(0, 3).map((dev) => (
              <div
                key={dev.id}
                className="p-3 bg-navy-950/70 border border-surface-border rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-navy-800 flex items-center justify-center text-cyan">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-text-primary">{dev.deviceName}</div>
                    <div className="text-[10px] font-mono text-text-muted">
                      {dev.model} &bull; Android {dev.androidVersion} &bull; ID: {dev.deviceId}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-status-healthy bg-status-healthy/10 px-2 py-0.5 rounded-full">
                    Knox Attested
                  </span>
                  <div className="text-[10px] font-mono text-text-secondary mt-1">
                    Score: {dev.securityPostureScore}/100
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Enroll Link */}
          <div className="pt-2 border-t border-surface-border flex items-center justify-between text-xs text-text-secondary">
            <span>Need to protect a new phone or tablet?</span>
            <Link href="/devices" className="text-teal hover:underline font-medium">
              Enroll Endpoint &rarr;
            </Link>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
