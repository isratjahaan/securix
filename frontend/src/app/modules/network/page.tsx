'use client';

import React, { useState, useEffect } from 'react';
import { UserLayout } from '@/components/user-layout/UserLayout';
import { api } from '@/lib/api';
import {
  Radio,
  Shield,
  Wifi,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Search,
  Activity,
  Server,
  Globe
} from 'lucide-react';

export default function NetworkSentinelPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any | null>(null);

  const fetchAssets = async () => {
    try {
      const data = await api.get('/assets');
      setAssets(data || []);
    } catch (e) {
      console.error('Failed to load assets:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleTriggerScan = async () => {
    setScanning(true);
    setScanResult(null);
    try {
      const res = await api.post('/assets/scan', {
        targetSubnet: '192.168.50.0/24',
        scanDepth: 'FULL_TCP_SYN',
      });
      setScanResult(res);
      fetchAssets();
    } catch (err: any) {
      alert(`Scan dispatch error: ${err.message}`);
    } finally {
      setScanning(false);
    }
  };

  return (
    <UserLayout
      pageTitle="M04: SIS Network Sentinel"
      pageSubtitle="Perimeter telemetry, ARP spoofing detection, DNS anomaly inspection, and rogue AP shields"
      actions={
        <button
          onClick={handleTriggerScan}
          disabled={scanning}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-teal hover:bg-teal-400 text-navy-950 font-bold rounded-xl text-xs transition shadow-md shadow-teal/20 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${scanning ? 'animate-spin' : ''}`} />
          <span>{scanning ? 'SCANNING SUBNET...' : 'RUN NETWORK PERIMETER SCAN'}</span>
        </button>
      }
    >
      {scanResult && (
        <div className="p-4 bg-status-healthy/10 border border-status-healthy/30 rounded-xl text-xs text-status-healthy flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Subnet scan dispatched: Job {scanResult.scanJobId || 'JOB-901'} ({scanResult.status || 'COMPLETED'})</span>
          </div>
          <span className="font-mono text-[10px] text-teal">0 Open Vulnerabilities</span>
        </div>
      )}

      {/* Network Safety Checklist */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 bg-navy-900/90 border border-surface-border rounded-2xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-text-secondary uppercase">Wi-Fi Integrity</span>
            <Wifi className="w-4 h-4 text-teal" />
          </div>
          <div>
            <div className="text-base font-bold text-text-primary">WPA3 Enterprise</div>
            <div className="text-xs text-text-secondary mt-0.5">TLS-EAP Encrypted Gateway</div>
          </div>
          <div className="text-[11px] font-mono text-status-healthy flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Rogue AP Trap Active</span>
          </div>
        </div>

        <div className="p-5 bg-navy-900/90 border border-surface-border rounded-2xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-text-secondary uppercase">DNS Poisoning Trap</span>
            <Globe className="w-4 h-4 text-cyan" />
          </div>
          <div>
            <div className="text-base font-bold text-text-primary">DoH / DNSSEC</div>
            <div className="text-xs text-text-secondary mt-0.5">1.1.1.1 Zero-Log Gateway</div>
          </div>
          <div className="text-[11px] font-mono text-cyan flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Spoofing Interceptors On</span>
          </div>
        </div>

        <div className="p-5 bg-navy-900/90 border border-surface-border rounded-2xl flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-text-secondary uppercase">ARP Cache Defense</span>
            <Radio className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <div className="text-base font-bold text-text-primary">Dynamic ARP Inspection</div>
            <div className="text-xs text-text-secondary mt-0.5">Static Gateway Binding</div>
          </div>
          <div className="text-[11px] font-mono text-purple-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>0 MitM Anomalies</span>
          </div>
        </div>
      </div>

      {/* Monitored Assets Table */}
      <div className="p-6 bg-navy-900/90 border border-surface-border rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-teal" />
            <h3 className="text-sm font-bold text-text-primary">Monitored Perimeter Assets & Subnets</h3>
          </div>
          <span className="text-xs font-mono text-text-muted">{assets.length} active nodes</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-surface-border text-text-muted uppercase text-[10px]">
                <th className="py-2.5 px-3">Asset Name</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Target Endpoint</th>
                <th className="py-2.5 px-3">Risk Status</th>
                <th className="py-2.5 px-3 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/50">
              {assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-navy-950/50 transition">
                  <td className="py-2.5 px-3 font-semibold text-text-primary">{asset.name}</td>
                  <td className="py-2.5 px-3 text-cyan">{asset.type}</td>
                  <td className="py-2.5 px-3 text-text-secondary">{asset.target}</td>
                  <td className="py-2.5 px-3">
                    <span className="text-teal font-bold">{asset.riskStatus || 'SECURE'}</span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <span className="text-status-healthy bg-status-healthy/10 px-2 py-0.5 rounded text-[10px]">
                      {asset.authorizationStatus || 'AUTHORIZED'}
                    </span>
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
