'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Shield,
  Smartphone,
  AlertTriangle,
  FileText,
  UserCheck,
  MailCheck,
  Radio,
  Lock,
  Binary,
  Globe,
  Search,
  KeyRound,
  Eye,
  Cloud,
  Flame,
  LifeBuoy,
  Settings,
  Boxes,
  Activity
} from 'lucide-react';

interface UserSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function UserSidebar({ isOpen, onClose }: UserSidebarProps) {
  const pathname = usePathname();

  const coreNav = [
    { name: 'Security Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'All 12 Modules Hub', href: '/modules', icon: Boxes },
    { name: 'My Protected Devices', href: '/devices', icon: Smartphone },
    { name: 'Security Reports', href: '/reports', icon: FileText },
  ];

  const modulesNav = [
    { id: 'm01', name: 'Identity Guardian', href: '/modules/identity', icon: UserCheck, tag: 'M01' },
    { id: 'm02', name: 'Phishing Shield', href: '/modules/phishing', icon: MailCheck, tag: 'M02' },
    { id: 'm03', name: 'Endpoint Guardian', href: '/modules/endpoint', icon: Smartphone, tag: 'M03' },
    { id: 'm04', name: 'Network Sentinel', href: '/modules/network', icon: Radio, tag: 'M04' },
    { id: 'm05', name: 'Vault Guardian', href: '/modules/vault', icon: Lock, tag: 'M05' },
    { id: 'm06', name: 'Ransomware Guardian', href: '/modules/ransomware', icon: Binary, tag: 'M06' },
    { id: 'm07', name: 'WebShield', href: '/modules/webshield', icon: Globe, tag: 'M07' },
    { id: 'm08', name: 'Digital Forensics', href: '/modules/forensics', icon: Search, tag: 'M08' },
    { id: 'm09', name: 'Access Guardian', href: '/modules/access', icon: KeyRound, tag: 'M09' },
    { id: 'm10', name: 'Threat Intelligence', href: '/modules/threat-intel', icon: Eye, tag: 'M10' },
    { id: 'm11', name: 'Cloud Backup', href: '/modules/backups', icon: Cloud, tag: 'M11' },
    { id: 'm12', name: 'Cyber SOC Center', href: '/modules/soc', icon: Flame, tag: 'M12' },
  ];

  const supportNav = [
    { name: 'Security Settings', href: '/settings', icon: Settings },
    { name: 'SOC Support & Hotline', href: '/support', icon: LifeBuoy },
  ];

  const isCurrent = (href: string) => {
    if (href === '/dashboard' && pathname === '/dashboard') return true;
    if (href !== '/dashboard' && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Aside */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-navy-950/95 border-r border-surface-border flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-surface-border">
          {/* Section: Core Command */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-mono tracking-widest text-text-muted uppercase">
              Core Command
            </div>
            <nav className="space-y-1">
              {coreNav.map((item) => {
                const Icon = item.icon;
                const active = isCurrent(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                      active
                        ? 'bg-teal/15 text-teal border border-teal/30 shadow-sm'
                        : 'text-text-secondary hover:text-text-primary hover:bg-navy-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-teal' : 'text-text-muted'}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Section: 12 Cyber Safeguards */}
          <div>
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[10px] font-mono tracking-widest text-text-muted uppercase">
                12 Cyber Safeguards
              </span>
              <span className="text-[10px] font-mono text-teal bg-teal/10 px-1.5 py-0.5 rounded">
                12 Active
              </span>
            </div>
            <nav className="space-y-0.5">
              {modulesNav.map((mod) => {
                const Icon = mod.icon;
                const active = pathname === mod.href;
                return (
                  <Link
                    key={mod.id}
                    href={mod.href}
                    onClick={onClose}
                    className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      active
                        ? 'bg-navy-800 text-teal border-l-2 border-teal font-semibold'
                        : 'text-text-secondary hover:text-text-primary hover:bg-navy-900/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-teal' : 'text-text-muted'}`} />
                      <span className="truncate">{mod.name}</span>
                    </div>
                    <span className="text-[9px] font-mono text-text-muted">{mod.tag}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Section: Support & Config */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-mono tracking-widest text-text-muted uppercase">
              System & Help
            </div>
            <nav className="space-y-1">
              {supportNav.map((item) => {
                const Icon = item.icon;
                const active = isCurrent(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition ${
                      active
                        ? 'bg-navy-800 text-cyan border border-cyan/30'
                        : 'text-text-secondary hover:text-text-primary hover:bg-navy-900'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-text-muted" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer Hardware Shield Status */}
        <div className="p-3 border-t border-surface-border bg-navy-900/50">
          <div className="flex items-center justify-between px-2 py-2 bg-navy-950/80 border border-teal/20 rounded-xl">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-teal" />
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold text-text-primary">Ecosystem Hardened</span>
                <span className="text-[9px] font-mono text-text-secondary">Zero Trust v2.4</span>
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-teal animate-pulse" />
          </div>
        </div>
      </aside>
    </>
  );
}
