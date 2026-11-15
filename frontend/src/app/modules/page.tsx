'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserLayout } from '@/components/user-layout/UserLayout';
import { api } from '@/lib/api';
import {
  Boxes,
  Shield,
  Smartphone,
  Radio,
  Lock,
  Binary,
  Globe,
  Search,
  KeyRound,
  Eye,
  Cloud,
  Flame,
  CheckCircle2,
  ChevronRight,
  RefreshCw,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';

export default function ModulesHubPage() {
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const moduleRoutesMap: Record<string, string> = {
    'sis-identity': '/modules/identity',
    'sis-phishing': '/modules/phishing',
    'sis-endpoint': '/modules/endpoint',
    'sis-network': '/modules/network',
    'sis-vault': '/modules/vault',
    'sis-ransomware': '/modules/ransomware',
    'sis-webshield': '/modules/webshield',
    'sis-forensics': '/modules/forensics',
    'sis-access': '/modules/access',
    'sis-threat-intel': '/modules/threat-intel',
    'sis-cloud-backup': '/modules/backups',
    'sis-cyber-soc': '/modules/soc',
  };

  const getModuleIcon = (id: string) => {
    switch (id) {
      case 'sis-identity': return Lock;
      case 'sis-phishing': return CheckCircle2;
      case 'sis-endpoint': return Smartphone;
      case 'sis-network': return Radio;
      case 'sis-vault': return KeyRound;
      case 'sis-ransomware': return Binary;
      case 'sis-webshield': return Globe;
      case 'sis-forensics': return Search;
      case 'sis-access': return Shield;
      case 'sis-threat-intel': return Eye;
      case 'sis-cloud-backup': return Cloud;
      case 'sis-cyber-soc': return Flame;
      default: return Boxes;
    }
  };

  const fetchModules = async () => {
    try {
      const data = await api.get('/modules');
      setModules(data || []);
    } catch (e) {
      console.error('Failed to load modules:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  return (
    <UserLayout
      pageTitle="12-in-1 Defense Safeguards Catalog"
      pageSubtitle="Central Registry of all autonomous cybersecurity defense modules with live health telemetry"
      actions={
        <button
          onClick={fetchModules}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-navy-900 hover:bg-navy-800 border border-surface-border rounded-xl text-xs font-mono text-text-secondary hover:text-text-primary transition"
        >
          <RefreshCw className="w-3.5 h-3.5 text-teal" />
          <span>Refresh Registry</span>
        </button>
      }
    >
      {loading ? (
        <div className="flex items-center justify-center py-20 text-text-secondary">
          <div className="w-8 h-8 border-3 border-teal border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((mod, idx) => {
            const Icon = getModuleIcon(mod.id);
            const route = moduleRoutesMap[mod.id] || `/modules/${mod.id}`;

            return (
              <div
                key={mod.id}
                className="p-6 bg-navy-900/90 border border-surface-border hover:border-teal/50 rounded-2xl shadow-xl transition-all flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-teal/10 border border-teal/20 text-teal flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        mod.status === 'ACTIVE'
                          ? 'bg-teal/10 text-teal border border-teal/30'
                          : mod.status === 'MAINTENANCE'
                          ? 'bg-status-maintenance/10 text-status-maintenance'
                          : 'bg-status-disabled/10 text-status-disabled'
                      }`}>
                        {mod.status}
                      </span>
                      {mod.isCore && (
                        <span className="text-[10px] font-mono text-cyan bg-cyan/10 px-1.5 py-0.5 rounded">
                          CORE
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-text-primary group-hover:text-teal transition">
                    {mod.displayName}
                  </h3>
                  <div className="text-[11px] font-mono text-text-muted mt-0.5">
                    ID: {mod.id} &bull; v{mod.version}
                  </div>
                  <p className="text-xs text-text-secondary mt-2.5 leading-relaxed line-clamp-2">
                    {mod.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-surface-border space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-mono text-text-muted">
                    <span>Health: {mod.healthStatus || 'HEALTHY'}</span>
                    <span>Response: {mod.responseTimeMs || 25}ms</span>
                  </div>

                  <Link
                    href={route}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-navy-950 hover:bg-teal hover:text-navy-950 text-teal font-semibold text-xs border border-teal/30 rounded-xl transition"
                  >
                    <span>Launch User Interface</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </UserLayout>
  );
}
