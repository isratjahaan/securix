'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Shield,
  Activity,
  BarChart3,
  Boxes,
  Layers,
  GitFork,
  Sliders,
  Radio,
  AlertTriangle,
  Flame,
  Globe,
  Smartphone,
  Server,
  Database,
  Users,
  UserCheck,
  KeyRound,
  Lock,
  History,
  FileSearch,
  Briefcase,
  Fingerprint,
  Archive,
  Cloud,
  RefreshCw,
  ScrollText,
  Bell,
  FileSpreadsheet,
  Cpu,
  HeartPulse,
  Settings,
  ChevronDown,
  ChevronRight,
  Search,
  ExternalLink,
  LifeBuoy
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: any;
  badge?: string;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle, mobileOpen, onCloseMobile }) => {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (title: string) => {
    setCollapsedSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const sections: NavSection[] = [
    {
      title: 'COMMAND CENTER',
      items: [
        { name: 'Overview', href: '/admin/overview', icon: Shield },
        { name: 'Live Monitoring', href: '/admin/monitoring', icon: Activity, badge: 'LIVE', badgeColor: 'bg-teal/20 text-teal border-teal/40' },
        { name: 'Security Analytics', href: '/admin/analytics', icon: BarChart3 },
      ],
    },
    {
      title: 'MODULE CONTROL',
      items: [
        { name: 'All Modules', href: '/admin/modules', icon: Boxes, badge: '12', badgeColor: 'bg-cyan/20 text-cyan border-cyan/40' },
        { name: 'Module Manager', href: '/admin/modules/registry', icon: Layers },
        { name: 'Module Dependencies', href: '/admin/modules/dependencies', icon: GitFork },
        { name: 'Module Configuration', href: '/admin/modules/configuration', icon: Sliders },
        { name: 'Integration Health', href: '/admin/integrations', icon: HeartPulse },
      ],
    },
    {
      title: 'SECURITY OPERATIONS',
      items: [
        { name: 'SOC Dashboard', href: '/admin/soc', icon: Radio },
        { name: 'Security Alerts', href: '/admin/alerts', icon: AlertTriangle, badge: '14', badgeColor: 'bg-rose-950 text-rose-400 border-rose-800' },
        { name: 'Incident Management', href: '/admin/incidents', icon: Flame, badge: '3', badgeColor: 'bg-orange-950 text-orange-400 border-orange-800' },
        { name: 'Threat Intelligence', href: '/admin/threat-intelligence', icon: Globe },
        { name: 'Threat Feed Sources', href: '/admin/threat-feeds', icon: RefreshCw },
      ],
    },
    {
      title: 'ASSET MANAGEMENT',
      items: [
        { name: 'Device Management', href: '/admin/devices', icon: Smartphone, badge: '15', badgeColor: 'bg-slate-800 text-slate-300' },
        { name: 'Website & Domain Inventory', href: '/admin/assets', icon: Server },
        { name: 'Network Inventory', href: '/admin/assets?type=NETWORK', icon: Server },
        { name: 'Asset Registry', href: '/admin/assets', icon: Database },
      ],
    },
    {
      title: 'IDENTITY & ACCESS',
      items: [
        { name: 'User Management', href: '/admin/users', icon: Users },
        { name: 'Admin Management', href: '/admin/administrators', icon: UserCheck },
        { name: 'Role Management', href: '/admin/roles', icon: KeyRound },
        { name: 'Permission Management', href: '/admin/permissions', icon: Lock },
        { name: 'Session Management', href: '/admin/administrators?tab=sessions', icon: Activity },
        { name: 'Login History', href: '/admin/administrators?tab=logins', icon: History },
      ],
    },
    {
      title: 'INVESTIGATION',
      items: [
        { name: 'Digital Forensics', href: '/admin/forensics', icon: FileSearch },
        { name: 'Investigation Cases', href: '/admin/forensics/cases', icon: Briefcase },
        { name: 'Evidence Management', href: '/admin/forensics/evidence', icon: Fingerprint },
        { name: 'Chain of Custody', href: '/admin/forensics/evidence?tab=custody', icon: Archive },
      ],
    },
    {
      title: 'DATA PROTECTION',
      items: [
        { name: 'Vault Management', href: '/admin/vault', icon: Lock, badge: '0-KNOW', badgeColor: 'bg-teal/20 text-teal border-teal/40' },
        { name: 'Cloud Backup', href: '/admin/backups', icon: Cloud },
        { name: 'Recovery Management', href: '/admin/recovery', icon: RefreshCw },
      ],
    },
    {
      title: 'SYSTEM MANAGEMENT',
      items: [
        { name: 'Audit Logs', href: '/admin/audit-logs', icon: ScrollText },
        { name: 'Notifications', href: '/admin/notifications', icon: Bell },
        { name: 'Reports & Analytics', href: '/admin/reports', icon: FileSpreadsheet },
        { name: 'API Management', href: '/admin/api-management', icon: Cpu },
        { name: 'Database Health', href: '/admin/database-health', icon: Database },
        { name: 'System Health', href: '/admin/system-health', icon: HeartPulse },
        { name: 'System Settings', href: '/admin/settings', icon: Settings },
      ],
    },
  ];

  const filteredSections = searchQuery.trim()
    ? sections
        .map((s) => ({
          ...s,
          items: s.items.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase())),
        }))
        .filter((s) => s.items.length > 0)
    : sections;

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-navy-900 border-r border-slate-800 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-72'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800 bg-navy-950/80">
          <Link href="/admin/overview" className="flex items-center gap-3 overflow-hidden">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-teal to-cyan text-navy-950 font-bold shadow-lg shadow-teal/20 shrink-0">
              <Shield className="w-6 h-6 stroke-[2.2]" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-wider text-text-primary whitespace-nowrap">
                  SIS CYBER FORTRESS
                </span>
                <span className="text-[10px] font-mono tracking-widest text-teal uppercase">
                  CENTRAL COMMAND
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Search Quick Filter */}
        {!isCollapsed && (
          <div className="px-3 pt-3 pb-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter 37 admin views..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg bg-navy-800 border border-slate-700/70 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan transition-colors"
              />
            </div>
          </div>
        )}

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
          {filteredSections.map((section) => {
            const isSectionCollapsed = collapsedSections[section.title];

            return (
              <div key={section.title} className="space-y-1">
                {!isCollapsed && (
                  <button
                    onClick={() => toggleSection(section.title)}
                    className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-bold tracking-wider text-slate-400 hover:text-slate-200 uppercase transition-colors"
                  >
                    <span>{section.title}</span>
                    {isSectionCollapsed ? (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                    )}
                  </button>
                )}

                {(!isSectionCollapsed || isCollapsed) && (
                  <div className="space-y-0.5">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname === item.href.split('?')[0];

                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => onCloseMobile()}
                          title={isCollapsed ? item.name : undefined}
                          className={`flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs font-medium transition-all group ${
                            isActive
                              ? 'bg-gradient-to-r from-teal/20 to-cyan/10 text-teal border border-teal/30 shadow-sm'
                              : 'text-slate-300 hover:text-white hover:bg-navy-800/80 border border-transparent'
                          }`}
                        >
                          <Icon
                            className={`w-4 h-4 shrink-0 transition-colors ${
                              isActive ? 'text-teal' : 'text-slate-400 group-hover:text-slate-200'
                            }`}
                          />
                          {!isCollapsed && (
                            <>
                              <span className="flex-1 truncate">{item.name}</span>
                              {item.badge && (
                                <span
                                  className={`px-1.5 py-0.5 text-[10px] font-mono rounded border ${
                                    item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                                  }`}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer with Ecosystem Status */}
        <div className="p-3 border-t border-slate-800 bg-navy-950/60">
          {!isCollapsed ? (
            <div className="flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal"></span>
                </span>
                <span className="font-mono text-[11px] text-teal">12/12 MODULES ACTIVE</span>
              </div>
              <span className="font-mono text-[10px] text-slate-500">v2.4.0-SOC</span>
            </div>
          ) : (
            <div className="flex justify-center">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal"></span>
              </span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
