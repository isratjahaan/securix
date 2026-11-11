'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Shield, Activity, Users, Smartphone, Flame, AlertTriangle, Database, Globe, Command, ArrowRight } from 'lucide-react';
import { api } from '@/lib/api';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [commands, setCommands] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      api.get('/search/command-palette')
        .then((res) => {
          if (Array.isArray(res)) setCommands(res);
        })
        .catch(() => {
          setCommands([
            { id: 'c1', label: 'Overview Command Dashboard', category: 'Navigation', href: '/admin/overview' },
            { id: 'c2', label: '12-in-1 Ecosystem Module Control', category: 'Navigation', href: '/admin/modules' },
            { id: 'c3', label: 'SOC Security Alert Center', category: 'SOC Operations', href: '/admin/alerts' },
            { id: 'c4', label: 'Incident Triage & Management', category: 'SOC Operations', href: '/admin/incidents' },
            { id: 'c5', label: 'Android Endpoint Guardian', category: 'Assets', href: '/admin/devices' },
            { id: 'c6', label: 'Threat Intelligence IOC Repository', category: 'Threat Intel', href: '/admin/threat-intelligence' },
            { id: 'c7', label: 'Digital Forensics & Chain of Custody', category: 'Investigation', href: '/admin/forensics' },
            { id: 'c8', label: 'Zero-Knowledge Vault Telemetry', category: 'Data Protection', href: '/admin/vault' },
            { id: 'c9', label: 'Cloud Backup Integrity & Recovery', category: 'Data Protection', href: '/admin/backups' },
            { id: 'c10', label: 'Immutable Security Audit Logs', category: 'System', href: '/admin/audit-logs' },
          ]);
        });
    }
  }, [isOpen]);

  // Live search debounced
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }
    const timer = setTimeout(() => {
      api.get(`/search/global?q=${encodeURIComponent(query)}`)
        .then((res) => setSearchResults(res))
        .catch(() => {});
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  // Handle keyboard shortcut Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navigateTo = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-navy-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800 bg-navy-950">
          <Search className="w-5 h-5 text-cyan shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, search modules, alerts, assets, devices, users..."
            className="flex-1 bg-transparent text-sm text-text-primary placeholder-slate-500 focus:outline-none"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-navy-800 border border-slate-700 rounded">
            ESC to close
          </kbd>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results list */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-800/60">
          {searchResults && searchResults.resultsCount > 0 ? (
            <div className="py-2 space-y-1">
              <p className="px-3 py-1 text-[11px] font-bold text-teal uppercase tracking-wider">
                Matching Entities ({searchResults.resultsCount})
              </p>
              {searchResults.modules?.map((m: any) => (
                <div
                  key={m.id}
                  onClick={() => navigateTo(m.href)}
                  className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-navy-800 cursor-pointer text-xs text-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Shield className="w-4 h-4 text-teal" />
                    <span className="font-medium text-white">{m.title}</span>
                    <span className="text-[10px] text-teal px-1.5 py-0.5 rounded bg-teal/10 font-mono">MODULE</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </div>
              ))}
              {searchResults.alerts?.map((a: any) => (
                <div
                  key={a.id}
                  onClick={() => navigateTo(a.href)}
                  className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-navy-800 cursor-pointer text-xs text-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span className="font-medium text-white">{a.title}</span>
                    <span className="text-[10px] text-rose-400 px-1.5 py-0.5 rounded bg-rose-950/40 font-mono">ALERT</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </div>
              ))}
              {searchResults.incidents?.map((i: any) => (
                <div
                  key={i.id}
                  onClick={() => navigateTo(i.href)}
                  className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-navy-800 cursor-pointer text-xs text-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Flame className="w-4 h-4 text-orange-400" />
                    <span className="font-medium text-white">{i.title}</span>
                    <span className="text-[10px] text-orange-400 px-1.5 py-0.5 rounded bg-orange-950/40 font-mono">INCIDENT</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </div>
              ))}
              {searchResults.devices?.map((d: any) => (
                <div
                  key={d.id}
                  onClick={() => navigateTo(d.href)}
                  className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-navy-800 cursor-pointer text-xs text-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Smartphone className="w-4 h-4 text-cyan" />
                    <span className="font-medium text-white">{d.title}</span>
                    <span className="text-[10px] text-cyan px-1.5 py-0.5 rounded bg-cyan/10 font-mono">{d.subtitle}</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </div>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No matching cybersecurity records found for &quot;{query}&quot;.
            </div>
          ) : (
            <div className="py-2 space-y-1">
              <p className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Quick Navigation & Actions
              </p>
              {commands.map((cmd) => (
                <div
                  key={cmd.id}
                  onClick={() => navigateTo(cmd.href)}
                  className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-navy-800 cursor-pointer text-xs text-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Command className="w-4 h-4 text-slate-400" />
                    <span>{cmd.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{cmd.category}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 bg-navy-950 border-t border-slate-800 text-[11px] text-slate-400">
          <span>Search 12 modules, devices, threats, and SOC records</span>
          <span className="text-teal font-mono">SOC COMMAND ACCESS</span>
        </div>
      </div>
    </div>
  );
};
