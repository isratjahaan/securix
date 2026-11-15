'use client';

import React from 'react';
import Link from 'next/link';
import {
  Shield,
  Smartphone,
  Terminal,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Radio,
  Binary,
  Globe,
  Search,
  KeyRound,
  Eye,
  Cloud,
  Boxes,
  Zap,
  Server,
  Layers,
  ChevronRight,
  Activity,
  ExternalLink
} from 'lucide-react';

export default function LandingPage() {
  const modules = [
    { id: 'm01', name: 'Identity Guardian', desc: 'Zero-trust authentication, credential stuffing defense & MFA', icon: Lock, href: '/modules/identity', status: 'ACTIVE' },
    { id: 'm02', name: 'Phishing Shield', desc: 'Real-time AI & heuristic inspection for malicious links & lures', icon: CheckCircle2, href: '/modules/phishing', status: 'ACTIVE' },
    { id: 'm03', name: 'Endpoint Guardian', desc: 'Knox & Play Integrity attestation for Android & workstations', icon: Smartphone, href: '/modules/endpoint', status: 'ACTIVE' },
    { id: 'm04', name: 'Network Sentinel', desc: 'Rogue AP, ARP spoofing & DNS perimeter anomaly detection', icon: Radio, href: '/modules/network', status: 'ACTIVE' },
    { id: 'm05', name: 'Vault Guardian', desc: 'Client-side AES-256-GCM zero-knowledge encrypted secret vault', icon: KeyRound, href: '/modules/vault', status: 'ACTIVE' },
    { id: 'm06', name: 'Ransomware Guardian', desc: 'Canary honeypots, Shannon entropy sensors & automated host isolation', icon: Binary, href: '/modules/ransomware', status: 'ACTIVE' },
    { id: 'm07', name: 'WebShield', desc: 'OWASP Top 10 inspection, SSL/TLS validation & header hardening', icon: Globe, href: '/modules/webshield', status: 'ACTIVE' },
    { id: 'm08', name: 'Digital Forensics', desc: 'Cryptographic evidence chain of custody & investigation timeline', icon: Search, href: '/modules/forensics', status: 'ACTIVE' },
    { id: 'm09', name: 'Access Guardian', desc: 'PAM role-based controls & ephemeral just-in-time privilege grants', icon: Layers, href: '/modules/access', status: 'ACTIVE' },
    { id: 'm10', name: 'Threat Intelligence', desc: 'STIX/TAXII threat feeds, C2 IP reputation & malware hash lookup', icon: Eye, href: '/modules/threat-intel', status: 'ACTIVE' },
    { id: 'm11', name: 'Cloud Backup', desc: 'Air-gapped disaster recovery snapshots & SHA-256 checksum checks', icon: Cloud, href: '/modules/backups', status: 'ACTIVE' },
    { id: 'm12', name: 'Cyber SOC Center', desc: 'Centralized telemetry, MTTC/MTTD metrics & automated playbooks', icon: Flame, href: '/modules/soc', status: 'ACTIVE' },
  ];

  return (
    <div className="min-h-screen bg-navy-950 text-text-primary selection:bg-teal selection:text-navy-950 overflow-x-hidden">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full bg-navy-900/80 backdrop-blur-lg border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal via-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-teal/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-teal" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-text-primary text-lg leading-none">
                SIS <span className="text-teal">CYBER FORTRESS</span>
              </span>
              <span className="text-[10px] text-text-secondary tracking-widest uppercase font-mono mt-0.5">
                Enterprise 12-in-1 Ecosystem
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-text-secondary">
            <a href="#ecosystem" className="hover:text-text-primary transition">12 Modules</a>
            <a href="#architecture" className="hover:text-text-primary transition">Architecture</a>
            <a href="#platforms" className="hover:text-text-primary transition">Platforms</a>
            <Link href="/support" className="hover:text-text-primary transition">SOC Support</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/login"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono bg-navy-800 hover:bg-navy-700 text-cyan border border-cyan/30 rounded-lg transition"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </Link>

            <Link
              href="/login"
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-text-primary hover:text-teal transition"
            >
              Sign In
            </Link>

            <Link
              href="/dashboard"
              className="px-4 py-2 bg-gradient-to-r from-teal to-teal-600 hover:from-teal-400 hover:to-teal text-navy-950 text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-teal/20 transition-all"
            >
              Launch Shield
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 lg:pt-32 lg:pb-36 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal/15 via-navy-950/80 to-navy-950 pointer-events-none" />
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-teal/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-navy-900 border border-teal/30 shadow-inner">
            <span className="flex h-2 w-2 rounded-full bg-teal animate-pulse" />
            <span className="text-xs font-mono text-teal uppercase tracking-wider font-semibold">
              Zero-Trust Architecture &bull; 12-in-1 Defense In Depth
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-text-primary max-w-5xl mx-auto leading-[1.1]">
            Next-Generation <span className="bg-gradient-to-r from-teal via-teal-400 to-cyan bg-clip-text text-transparent">Cyber Defense</span> for Modern Endpoints
          </h1>

          <p className="text-base sm:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            SIS Cyber Fortress unifies 12 specialized cybersecurity modules into one cohesive, event-driven command ecosystem. Protecting web applications, Android mobile devices, and enterprise infrastructure with zero data loss.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-teal to-teal-600 hover:from-teal-400 hover:to-teal text-navy-950 font-bold text-base rounded-xl shadow-xl shadow-teal/25 transition-all hover:scale-[1.02]"
            >
              <span>ENTER PERSONAL COMMAND CENTER</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/register"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-navy-900 hover:bg-navy-800 text-text-primary border border-surface-border font-semibold text-base rounded-xl transition"
            >
              <span>Create Protected Identity</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 bg-navy-900/60 border border-surface-border rounded-2xl">
              <div className="text-2xl sm:text-3xl font-extrabold text-teal font-mono">12 / 12</div>
              <div className="text-xs text-text-secondary mt-1">Autonomous Modules</div>
            </div>
            <div className="p-4 bg-navy-900/60 border border-surface-border rounded-2xl">
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan font-mono">AES-256</div>
              <div className="text-xs text-text-secondary mt-1">Zero-Knowledge Vault</div>
            </div>
            <div className="p-4 bg-navy-900/60 border border-surface-border rounded-2xl">
              <div className="text-2xl sm:text-3xl font-extrabold text-teal font-mono">&lt; 150ms</div>
              <div className="text-xs text-text-secondary mt-1">Event Bus Latency</div>
            </div>
            <div className="p-4 bg-navy-900/60 border border-surface-border rounded-2xl">
              <div className="text-2xl sm:text-3xl font-extrabold text-status-healthy font-mono">100%</div>
              <div className="text-xs text-text-secondary mt-1">Data Preservation</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: 12 Cyber Modules Grid */}
      <section id="ecosystem" className="py-20 bg-navy-900/50 border-t border-b border-surface-border relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-mono text-teal uppercase tracking-widest">Autonomous Ecosystem</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary">
              12 Specialized Defense Safeguards
            </h2>
            <p className="text-sm sm:text-base text-text-secondary">
              Every module is an independent defense pillar connected via our decoupled event bus and runtime lifecycle manager.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {modules.map((m) => {
              const Icon = m.icon;
              return (
                <Link
                  key={m.id}
                  href={m.href}
                  className="group p-6 bg-navy-900/90 hover:bg-navy-800/90 border border-surface-border hover:border-teal/50 rounded-2xl shadow-lg transition-all hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-teal/10 border border-teal/20 text-teal flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono text-teal bg-teal/10 px-2 py-0.5 rounded-full">
                      {m.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-text-primary group-hover:text-teal transition">
                    {m.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-text-secondary mt-2 leading-relaxed">
                    {m.desc}
                  </p>
                  <div className="mt-4 flex items-center gap-1.5 text-xs text-teal font-semibold">
                    <span>Open Module Interface</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section: 3-Platform Ecosystem */}
      <section id="platforms" className="py-20 lg:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-mono text-cyan uppercase tracking-widest">Tri-Platform Architecture</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-text-primary">
              One Unified Cyber Fortress
            </h2>
            <p className="text-sm sm:text-base text-text-secondary">
              Seamless synchronization across mobile endpoints, web clients, and the SOC Super Admin console.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Platform 1: Web App */}
            <div className="p-8 bg-navy-900/80 border border-teal/30 rounded-3xl relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-teal/10 text-teal flex items-center justify-center mb-6">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-text-primary">1. User Web Application</h3>
              <p className="text-xs sm:text-sm text-text-secondary mt-2 leading-relaxed">
                Personal cybersecurity command center. Live phishing URL scanner, zero-knowledge vault, device management, and SOC notifications.
              </p>
              <div className="mt-6 pt-4 border-t border-surface-border">
                <Link href="/dashboard" className="text-xs font-mono text-teal hover:underline flex items-center gap-1">
                  <span>Explore Web Interface</span> &rarr;
                </Link>
              </div>
            </div>

            {/* Platform 2: Android APK */}
            <div className="p-8 bg-navy-900/80 border border-surface-border rounded-3xl relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-cyan/10 text-cyan flex items-center justify-center mb-6">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-text-primary">2. Android Application (APK)</h3>
              <p className="text-xs sm:text-sm text-text-secondary mt-2 leading-relaxed">
                Native Kotlin application with Samsung Knox hardware attestation, Play Integrity, root violation traps, and local VPN protection.
              </p>
              <div className="mt-6 pt-4 border-t border-surface-border">
                <span className="text-xs font-mono text-cyan">Package: com.sis.cyberfortress</span>
              </div>
            </div>

            {/* Platform 3: Super Admin */}
            <div className="p-8 bg-navy-900/80 border border-surface-border rounded-3xl relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-6">
                <Terminal className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-text-primary">3. Super Admin Command</h3>
              <p className="text-xs sm:text-sm text-text-secondary mt-2 leading-relaxed">
                God-level SOC control center. 12-module lifecycle manager, real-time alert triage, dependency DAG graphs, and forensics.
              </p>
              <div className="mt-6 pt-4 border-t border-surface-border">
                <Link href="/admin/overview" className="text-xs font-mono text-purple-400 hover:underline flex items-center gap-1">
                  <span>Open Admin Console</span> &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-border bg-navy-950 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-teal font-bold mb-4">Ecosystem</div>
              <ul className="space-y-2 text-xs text-text-secondary">
                <li><Link href="/dashboard" className="hover:text-text-primary transition">User Dashboard</Link></li>
                <li><Link href="/modules" className="hover:text-text-primary transition">All 12 Modules</Link></li>
                <li><Link href="/devices" className="hover:text-text-primary transition">Device Inventory</Link></li>
                <li><Link href="/reports" className="hover:text-text-primary transition">Compliance Reports</Link></li>
              </ul>
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-cyan font-bold mb-4">Core Safeguards</div>
              <ul className="space-y-2 text-xs text-text-secondary">
                <li><Link href="/modules/phishing" className="hover:text-text-primary transition">Phishing Shield</Link></li>
                <li><Link href="/modules/vault" className="hover:text-text-primary transition">Zero-Knowledge Vault</Link></li>
                <li><Link href="/modules/ransomware" className="hover:text-text-primary transition">Ransomware Guardian</Link></li>
                <li><Link href="/modules/soc" className="hover:text-text-primary transition">Cyber SOC Center</Link></li>
              </ul>
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-text-muted font-bold mb-4">Portals</div>
              <ul className="space-y-2 text-xs text-text-secondary">
                <li><Link href="/login" className="hover:text-text-primary transition">User Login</Link></li>
                <li><Link href="/register" className="hover:text-text-primary transition">Create Account</Link></li>
                <li><Link href="/admin/login" className="hover:text-text-primary transition">Super Admin Console</Link></li>
                <li><Link href="/support" className="hover:text-text-primary transition">24/7 SOC Emergency</Link></li>
              </ul>
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-text-muted font-bold mb-4">Legal & Privacy</div>
              <ul className="space-y-2 text-xs text-text-secondary">
                <li><Link href="/privacy" className="hover:text-text-primary transition">Zero-Knowledge Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-text-primary transition">Terms of Service</Link></li>
                <li><a href="http://localhost:4000/api/docs" target="_blank" className="hover:text-text-primary transition flex items-center gap-1">OpenAPI Swagger <ExternalLink className="w-3 h-3" /></a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-teal" />
              <span>&copy; 2026 SIS CYBER FORTRESS. All rights reserved. Defense-in-depth certified.</span>
            </div>
            <div className="font-mono text-[11px] text-teal">
              PROTECTED BY ZERO TRUST v2.4
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
