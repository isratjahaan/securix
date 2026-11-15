'use client';

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ConfirmationModal } from '@/components/common/ConfirmationModal';
import { api } from '@/lib/api';
import { Smartphone, Search, Shield, CheckCircle2, XCircle, AlertTriangle, User, RefreshCw } from 'lucide-react';

export default function DevicesPage() {
  const [devices, setDevices] = useState<any[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deregisterOpen, setDeregisterOpen] = useState(false);
  const [search, setSearch] = useState('');

  const loadDevices = async () => {
    try {
      const data = await api.get(`/devices?search=${encodeURIComponent(search)}`);
      setDevices(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadDevices();
    const interval = setInterval(loadDevices, 3000);
    return () => clearInterval(interval);
  }, [search]);

  const viewDevice = async (id: string) => {
    try {
      const dev = await api.get(`/devices/${id}`);
      setSelectedDevice(dev);
      setDetailOpen(true);
    } catch (err: any) {
      alert(err?.message || 'Failed to fetch device details');
    }
  };

  const handleDeregister = async () => {
    if (!selectedDevice) return;
    try {
      await api.post(`/devices/${selectedDevice.id}/deregister`);
      setDeregisterOpen(false);
      setDetailOpen(false);
      alert(`Device ${selectedDevice.deviceId} deregistered successfully.`);
      loadDevices();
    } catch (err: any) {
      alert(err?.message || 'Deregistration failed');
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan">
            <Smartphone className="w-3.5 h-3.5" />
            <span>SIS ENDPOINT GUARDIAN TELEMETRY</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">Android Device Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitor registered mobile endpoints, Knox/Google Play integrity, root checks and encryption status.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 rounded-xl bg-navy-800/80 border border-slate-700/80 max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by device ID, model, or owner..."
          className="w-full px-3 py-1.5 text-xs rounded-lg bg-navy-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan"
        />
      </div>

      {/* Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {devices.map((dev) => (
          <div
            key={dev.id}
            onClick={() => viewDevice(dev.id)}
            className="rounded-2xl bg-navy-800/90 border border-slate-700/80 p-5 shadow-lg flex flex-col justify-between hover:border-slate-500 cursor-pointer transition-all"
          >
            <div>
              <div className="flex items-start justify-between mb-2">
                <span className="text-sm font-bold text-white block truncate">{dev.deviceName}</span>
                <StatusBadge status={dev.status} size="sm" />
              </div>
              <span className="text-[11px] font-mono text-cyan block mb-2">{dev.deviceId}</span>

              <div className="space-y-1 text-xs text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Manufacturer:</span>
                  <span>{dev.manufacturer}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Model:</span>
                  <span className="font-mono text-[11px] truncate max-w-[120px]">{dev.model}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">OS Build:</span>
                  <span className="font-mono text-[11px] text-teal">{dev.androidVersion}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Owner:</span>
                  <span className="truncate max-w-[120px]">{dev.ownerName}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                Posture: <strong className="text-teal font-bold">{dev.securityPostureScore}/100</strong>
              </span>
              <span className="text-[10px] text-cyan hover:underline">Inspect Details →</span>
            </div>
          </div>
        ))}
      </div>

      {/* Device Detail Modal */}
      {detailOpen && selectedDevice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-navy-800 border border-slate-700 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white">{selectedDevice.deviceName}</h3>
                <span className="text-xs font-mono text-cyan">{selectedDevice.deviceId}</span>
              </div>
              <StatusBadge status={selectedDevice.status} />
            </div>

            {/* Compliance Checklist */}
            <div className="mb-6">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                Hardware & OS Compliance Checklist:
              </span>
              <div className="space-y-2">
                {selectedDevice.complianceChecks?.map((c: any, idx: number) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-navy-950/70 border border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-200">{c.check}</span>
                    {c.passed ? (
                      <span className="text-teal font-bold flex items-center gap-1 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" /> PASS
                      </span>
                    ) : (
                      <span className="text-rose-400 font-bold flex items-center gap-1 font-mono">
                        <XCircle className="w-3.5 h-3.5" /> NON_COMPLIANT
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Supported Android Permissions */}
            <div className="mb-6">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                Authorized OS Manifest Permissions:
              </span>
              <div className="flex flex-wrap gap-1 font-mono text-[10px] text-slate-300">
                {selectedDevice.supportedPermissions?.map((p: string) => (
                  <span key={p} className="p-1 rounded bg-navy-900 border border-slate-800">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-slate-700/60">
              <div className="flex items-center gap-2">
                {selectedDevice.isLocked || selectedDevice.status === 'STOLEN_LOCKED' ? (
                  <button
                    onClick={async () => {
                      await api.post(`/devices/${selectedDevice.id}/unlock`, {});
                      alert('Device restored and unlocked successfully');
                      loadDevices();
                      setDetailOpen(false);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs"
                  >
                    Unlock & Restore Device
                  </button>
                ) : (
                  <button
                    onClick={async () => {
                      if (!confirm(`Emergency Lock: Report ${selectedDevice.deviceName} as STOLEN?`)) return;
                      await api.post(`/devices/${selectedDevice.id}/lock`, {
                        reason: 'Reported stolen - locked by Super Admin'
                      });
                      alert('Emergency Anti-Theft Lockout dispatched to phone!');
                      loadDevices();
                      setDetailOpen(false);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                  >
                    🚨 Report Stolen & Lock
                  </button>
                )}
                <button
                  onClick={() => setDeregisterOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 text-rose-300 text-xs font-semibold"
                >
                  Deregister
                </button>
              </div>
              <button
                onClick={() => setDetailOpen(false)}
                className="px-4 py-2 rounded-lg bg-navy-900 hover:bg-navy-700 text-slate-300 text-xs font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deregister Confirmation */}
      <ConfirmationModal
        isOpen={deregisterOpen}
        onClose={() => setDeregisterOpen(false)}
        onConfirm={handleDeregister}
        title={`Deregister Device: ${selectedDevice?.deviceId}`}
        description={`Are you sure you want to remove ${selectedDevice?.deviceName} from SIS Endpoint Guardian? The endpoint will no longer receive compliance telemetry updates.`}
        confirmLabel="Confirm Deregistration"
        isDestructive={true}
      />
    </AdminLayout>
  );
}
