'use client';

import React, { useState, useEffect } from 'react';
import { UserLayout } from '@/components/user-layout/UserLayout';
import { api } from '@/lib/api';
import {
  Smartphone,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  Volume2,
  Trash2,
  Radio,
  RefreshCw,
  BellRing
} from 'lucide-react';

export default function DevicesPage() {
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchDevices = async () => {
    try {
      const data = await api.get('/devices');
      setDevices(data || []);
    } catch (e) {
      console.error('Failed to load devices:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
    // Live bi-directional auto-sync every 2.5 seconds
    const interval = setInterval(fetchDevices, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleLockDevice = async (id: string, name: string) => {
    if (!confirm(`🚨 REPORT STOLEN: Are you sure you want to LOCK ${name}?\n\nThis will trigger an emergency full-screen lockdown on the phone, sound the alarm siren, and block all unauthorized access.`)) {
      return;
    }

    setActiveActionId(id);
    try {
      const res = await api.post(`/devices/${id}/lock`, {
        reason: 'Mobile terminal reported STOLEN. Emergency lock executed by Enterprise Security Admin.'
      });
      setActionMessage(`🚨 Device ${name} locked! Emergency Anti-Theft mode dispatched to phone.`);
      fetchDevices();
    } catch (err: any) {
      alert(err.message || 'Failed to lock device');
    } finally {
      setActiveActionId(null);
    }
  };

  const handleUnlockDevice = async (id: string, name: string) => {
    if (!confirm(`RESTORE: Unlock ${name} and return it to normal active status?`)) return;

    setActiveActionId(id);
    try {
      await api.post(`/devices/${id}/unlock`, {});
      setActionMessage(`✅ Device ${name} restored & unlocked successfully!`);
      fetchDevices();
    } catch (err: any) {
      alert(err.message || 'Failed to unlock device');
    } finally {
      setActiveActionId(null);
    }
  };

  const handleTriggerSiren = async (id: string, currentSiren: boolean) => {
    setActiveActionId(id);
    try {
      await api.post(`/devices/${id}/siren`, { active: !currentSiren });
      setActionMessage(!currentSiren ? '🔊 Alarm Siren Triggered on Device!' : 'Alarm Siren Silenced.');
      fetchDevices();
    } catch (err: any) {
      alert(err.message || 'Failed to toggle siren');
    } finally {
      setActiveActionId(null);
    }
  };

  const handleRemoteWipe = async (id: string, name: string) => {
    if (!confirm(`⚠️ CAUTION: Wipe Zero-Knowledge Vault and credentials on ${name}?\n\nThis cannot be undone locally.`)) return;

    setActiveActionId(id);
    try {
      await api.post(`/devices/${id}/wipe`, {});
      setActionMessage(`🗑️ Remote Vault wipe command dispatched to ${name}.`);
      fetchDevices();
    } catch (err: any) {
      alert(err.message || 'Failed to wipe device');
    } finally {
      setActiveActionId(null);
    }
  };

  const handleIsolateDevice = async (id: string, name: string) => {
    if (!confirm(`Confirm isolation for ${name}? Device will be severed from corporate VPN.`)) return;

    setActiveActionId(id);
    try {
      await api.post(`/devices/${id}/isolate`, {});
      setActionMessage(`Quarantine active for ${name}.`);
      fetchDevices();
    } catch (err: any) {
      alert(err.message || 'Failed to isolate device');
    } finally {
      setActiveActionId(null);
    }
  };

  const stolenCount = devices.filter((d) => d.isLocked || d.status === 'STOLEN_LOCKED').length;

  return (
    <UserLayout
      pageTitle="Endpoint & Device Fleet Inventory"
      pageSubtitle="Mobile Device Management (MDM), Knox hardware attestation, and client integrity telemetry"
    >
      {/* Live Sync Banner */}
      <div className="flex flex-col md:flex-row items-center justify-between p-4 bg-navy-900/80 border border-surface-border rounded-2xl mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-status-healthy animate-ping" />
          <div>
            <div className="text-sm font-bold text-text-primary flex items-center gap-2">
              <span>Live Bi-Directional Device Telemetry</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan/10 text-cyan border border-cyan/20">
                ACTIVE SYNC (2.5s)
              </span>
            </div>
            <div className="text-xs text-text-muted">
              Changes made here immediately command the Android APK. Phone integrity scans reflect here automatically.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {stolenCount > 0 && (
            <span className="text-xs font-mono font-bold px-3 py-1 bg-status-critical/20 text-status-critical border border-status-critical/40 rounded-full animate-pulse">
              🚨 {stolenCount} DEVICE(S) REPORTED STOLEN
            </span>
          )}
          <button
            onClick={fetchDevices}
            className="p-2 rounded-xl bg-navy-950 border border-surface-border hover:border-cyan text-text-muted hover:text-cyan transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-4 mb-6 rounded-xl bg-teal/10 border border-teal/30 text-teal text-sm font-mono flex items-center justify-between">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="text-xs text-text-muted hover:text-white">✕</button>
        </div>
      )}

      {/* Fleet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.map((dev) => {
          const isLocked = dev.isLocked || dev.status === 'STOLEN_LOCKED';
          const isBusy = activeActionId === dev.id || activeActionId === dev.deviceId;

          return (
            <div
              key={dev.id}
              className={`p-6 rounded-2xl shadow-xl flex flex-col justify-between space-y-4 transition border ${
                isLocked
                  ? 'bg-red-950/20 border-status-critical shadow-red-950/50'
                  : 'bg-navy-900/90 border-surface-border hover:border-cyan/40'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                    isLocked
                      ? 'bg-status-critical/20 border-status-critical text-status-critical'
                      : 'bg-cyan/10 border-cyan/20 text-cyan'
                  }`}>
                    {isLocked ? <Lock className="w-6 h-6 animate-pulse" /> : <Smartphone className="w-6 h-6" />}
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                    isLocked
                      ? 'bg-status-critical text-white font-black animate-pulse'
                      : dev.status === 'COMPLIANT' || dev.status === 'ONLINE'
                      ? 'bg-status-healthy/15 text-status-healthy'
                      : 'bg-status-warning/15 text-status-warning'
                  }`}>
                    {dev.status || 'COMPLIANT'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-text-primary mt-4">{dev.deviceName}</h3>
                <div className="text-xs font-mono text-cyan mt-0.5">ID: {dev.deviceId}</div>
                <div className="text-xs text-text-muted mt-1">
                  {dev.manufacturer} {dev.model} &bull; Android {dev.androidVersion}
                </div>
              </div>

              {/* Status & Attributes */}
              <div className="space-y-2 pt-3 border-t border-surface-border text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Posture Score:</span>
                  <span className="text-teal font-bold">{dev.securityPostureScore || 98}/100</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Anti-Theft Protocol:</span>
                  <span className={isLocked ? 'text-status-critical font-bold' : 'text-status-healthy'}>
                    {isLocked ? 'LOCKOUT ENGAGED' : 'ARMED & ACTIVE'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-muted">Last Device Sync:</span>
                  <span className="text-text-primary">
                    {dev.lastSyncAt ? new Date(dev.lastSyncAt).toLocaleTimeString() : 'Active'}
                  </span>
                </div>
              </div>

              {/* Anti-Theft Remote Control Suite */}
              <div className="pt-2 border-t border-surface-border space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-wider text-text-muted">
                  Anti-Theft Remote Control
                </div>

                {isLocked ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleUnlockDevice(dev.id || dev.deviceId, dev.deviceName)}
                      disabled={isBusy}
                      className="w-full py-2.5 bg-status-healthy hover:bg-emerald-400 text-deep-navy font-bold rounded-xl text-xs font-mono transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50"
                    >
                      <Unlock className="w-4 h-4" />
                      {isBusy ? 'UNLOCKING...' : 'UNLOCK & RESTORE DEVICE'}
                    </button>

                    <button
                      onClick={() => handleTriggerSiren(dev.id || dev.deviceId, dev.sirenActive)}
                      disabled={isBusy}
                      className="w-full py-2 bg-navy-950 hover:bg-navy-800 text-text-primary border border-surface-border rounded-xl text-xs font-mono transition flex items-center justify-center gap-2"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-yellow-400" />
                      {dev.sirenActive ? 'Mute Siren Tone' : 'Sound Alarm Siren'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => handleLockDevice(dev.id || dev.deviceId, dev.deviceName)}
                      disabled={isBusy}
                      className="w-full py-2.5 bg-status-critical hover:bg-red-500 text-white font-bold rounded-xl text-xs font-mono transition flex items-center justify-center gap-2 shadow-lg shadow-red-950/50"
                    >
                      <Lock className="w-4 h-4" />
                      {isBusy ? 'DISPATCHING LOCK...' : 'REPORT STOLEN & LOCK (মোবাইল লক)'}
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleTriggerSiren(dev.id || dev.deviceId, false)}
                        disabled={isBusy}
                        className="py-2 bg-navy-950 hover:bg-navy-800 text-text-muted hover:text-white border border-surface-border rounded-xl text-xs font-mono transition flex items-center justify-center gap-1.5"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-yellow-400" />
                        Siren
                      </button>

                      <button
                        onClick={() => handleRemoteWipe(dev.id || dev.deviceId, dev.deviceName)}
                        disabled={isBusy}
                        className="py-2 bg-navy-950 hover:bg-status-critical/20 text-text-muted hover:text-status-critical border border-surface-border rounded-xl text-xs font-mono transition flex items-center justify-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Wipe Vault
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </UserLayout>
  );
}
