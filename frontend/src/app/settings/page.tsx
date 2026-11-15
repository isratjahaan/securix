'use client';

import React, { useState } from 'react';
import { UserLayout } from '@/components/user-layout/UserLayout';
import {
  Settings,
  Shield,
  Lock,
  Bell,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Save,
  KeyRound
} from 'lucide-react';

export default function SettingsPage() {
  const [mfaEnforced, setMfaEnforced] = useState(true);
  const [notifyCritical, setNotifyCritical] = useState(true);
  const [notifyPhish, setNotifyPhish] = useState(true);
  const [knoxEnforced, setKnoxEnforced] = useState(true);
  const [timeoutMinutes, setTimeoutMinutes] = useState('30');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <UserLayout
      pageTitle="Account Security & Safeguard Settings"
      pageSubtitle="Configure hardware keystore parameters, notification thresholds, and Zero-Trust policies"
    >
      {saved && (
        <div className="p-3.5 bg-status-healthy/10 border border-status-healthy/30 rounded-xl text-xs text-status-healthy flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Security policy preferences applied and re-synchronized.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Card 1: Authentication & Zero-Trust Policies */}
        <div className="p-6 bg-navy-900/90 border border-surface-border rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-teal" />
            <h3 className="text-sm font-bold text-text-primary">Authentication & Keystore Safeguards</h3>
          </div>

          <div className="space-y-4 divide-y divide-surface-border/50">
            <div className="pt-2 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-text-primary">Mandatory Multi-Factor Authentication</div>
                <div className="text-[11px] text-text-secondary">Enforce 6-digit TOTP challenge on every new device login</div>
              </div>
              <input
                type="checkbox"
                checked={mfaEnforced}
                onChange={(e) => setMfaEnforced(e.target.checked)}
                className="w-4 h-4 rounded border-surface-border bg-navy-950 text-teal focus:ring-teal"
              />
            </div>

            <div className="pt-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-text-primary">Samsung Knox Hardware Attestation</div>
                <div className="text-[11px] text-text-secondary">Block non-compliant or rooted Android devices from session tokens</div>
              </div>
              <input
                type="checkbox"
                checked={knoxEnforced}
                onChange={(e) => setKnoxEnforced(e.target.checked)}
                className="w-4 h-4 rounded border-surface-border bg-navy-950 text-teal focus:ring-teal"
              />
            </div>

            <div className="pt-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-text-primary">Inactivity Session Timeout</div>
                <div className="text-[11px] text-text-secondary">Automatically lock client vault and terminate token after idle period</div>
              </div>
              <select
                value={timeoutMinutes}
                onChange={(e) => setTimeoutMinutes(e.target.value)}
                className="px-3 py-1.5 bg-navy-950 border border-surface-border rounded-xl text-xs font-mono text-text-primary outline-none"
              >
                <option value="15">15 Minutes</option>
                <option value="30">30 Minutes (Recommended)</option>
                <option value="60">60 Minutes</option>
                <option value="120">2 Hours</option>
              </select>
            </div>
          </div>
        </div>

        {/* Card 2: Threat Notification Alerts */}
        <div className="p-6 bg-navy-900/90 border border-surface-border rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-cyan" />
            <h3 className="text-sm font-bold text-text-primary">Real-Time Threat Notifications</h3>
          </div>

          <div className="space-y-4 divide-y divide-surface-border/50">
            <div className="pt-2 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-text-primary">Immediate Critical Alert Pushes</div>
                <div className="text-[11px] text-text-secondary">Dispatch high-priority push banners for ransomware and C2 alerts</div>
              </div>
              <input
                type="checkbox"
                checked={notifyCritical}
                onChange={(e) => setNotifyCritical(e.target.checked)}
                className="w-4 h-4 rounded border-surface-border bg-navy-950 text-cyan focus:ring-cyan"
              />
            </div>

            <div className="pt-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-text-primary">Phishing Interception Digest</div>
                <div className="text-[11px] text-text-secondary">Notify whenever a user link is automatically quarantined by Phishing Shield</div>
              </div>
              <input
                type="checkbox"
                checked={notifyPhish}
                onChange={(e) => setNotifyPhish(e.target.checked)}
                className="w-4 h-4 rounded border-surface-border bg-navy-950 text-cyan focus:ring-cyan"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-3 bg-teal hover:bg-teal-400 text-navy-950 font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-teal/20"
        >
          <Save className="w-4 h-4" />
          <span>SAVE SECURITY CONFIGURATION</span>
        </button>
      </form>
    </UserLayout>
  );
}
