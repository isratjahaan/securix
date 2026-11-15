'use client';

import React, { useState } from 'react';
import { UserLayout } from '@/components/user-layout/UserLayout';
import {
  LifeBuoy,
  Shield,
  PhoneCall,
  Mail,
  Send,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

export default function SupportPage() {
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketSeverity, setTicketSeverity] = useState('HIGH');
  const [ticketDetails, setTicketDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does the Phishing Shield protect against zero-hour credential lures?',
      a: 'The SIS Phishing Shield inspects links using heuristic lexical scoring (homoglyphs, Punycode, high-risk TLDs) and brand lookalike classifiers. Malicious links are automatically neutralized into quarantine before browser navigation.',
    },
    {
      q: 'Can administrators or database engineers view my Vault secrets?',
      a: 'No. The SIS Vault Guardian enforces an invariant Zero-Knowledge policy. Encryption keys are derived strictly in your browser using PBKDF2/SHA-512 and AES-256-GCM. The backend only stores encrypted ciphertext blocks without plaintext or recovery backdoors.',
    },
    {
      q: 'What happens if a Ransomware Tripwire canary file is mutated?',
      a: 'If an adversary or ransomware strain alters a canary honeypot or triggers a high-entropy burst, the Decoupled EventBus immediately dispatches a CRITICAL alert to the Cyber SOC, isolates the infected host from the network, and halts lateral spread.',
    },
    {
      q: 'How do I enroll my Samsung Knox-enabled Android phone?',
      a: 'Open the SIS Cyber Fortress Android APK, sign in with your corporate credentials, and complete the Play Integrity attestation challenge. Your device certificate will automatically register in the Endpoint Guardian fleet.',
    },
  ];

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <UserLayout
      pageTitle="SOC Support & Incident Hotline"
      pageSubtitle="24/7 Cybersecurity Operations Center assistance, emergency incident escalation, and documentation"
    >
      {/* Emergency Hotline Header Card */}
      <div className="p-6 bg-gradient-to-r from-navy-900/90 via-navy-900/70 to-navy-900/90 border border-status-critical/30 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-status-critical/15 border border-status-critical/30 text-status-critical flex items-center justify-center shrink-0">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <div className="text-base font-bold text-text-primary flex items-center gap-2">
              <span>Active Breach or Emergency Incident?</span>
              <span className="text-[10px] font-mono text-status-critical bg-status-critical/10 px-2 py-0.5 rounded-full font-bold">
                24/7 STANDBY
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              Contact our on-call SOC Incident Response Commander immediately via dedicated secure hotline.
            </p>
          </div>
        </div>

        <div className="shrink-0 font-mono text-right">
          <div className="text-lg font-bold text-status-critical">+1 (800) 555-FORTRESS</div>
          <div className="text-[11px] text-text-muted">Ext. 911 (Cyber SOC Duty Desk)</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FAQ Accordion */}
        <div className="p-6 bg-navy-900/90 border border-surface-border rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-teal" />
            <h3 className="text-sm font-bold text-text-primary">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-2.5">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="border border-surface-border rounded-xl overflow-hidden bg-navy-950/60">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-3.5 text-left text-xs font-semibold text-text-primary flex items-center justify-between gap-2 hover:bg-navy-900 transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-text-muted transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="p-3.5 pt-0 text-xs text-text-secondary leading-relaxed border-t border-surface-border/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Incident Dispatch Ticket */}
        <div className="p-6 bg-navy-900/90 border border-surface-border rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center gap-2">
            <LifeBuoy className="w-4 h-4 text-cyan" />
            <h3 className="text-sm font-bold text-text-primary">Transmit Escalation to Cyber SOC</h3>
          </div>

          {submitted ? (
            <div className="py-8 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-status-healthy mx-auto" />
              <div className="text-sm font-bold text-text-primary">Incident Ticket #INC-2026-9481 Dispatched</div>
              <p className="text-xs text-text-secondary">
                Our SOC analysts have ingested your telemetry and will initiate containment protocols.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitTicket} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-medium text-text-secondary">Incident Topic / Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Suspicious credential lure received on mobile endpoint"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-surface-border focus:border-cyan rounded-xl text-xs text-text-primary outline-none transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-text-secondary">Severity Priority</label>
                <select
                  value={ticketSeverity}
                  onChange={(e) => setTicketSeverity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-surface-border focus:border-cyan rounded-xl text-xs font-mono text-text-primary outline-none transition"
                >
                  <option value="CRITICAL">P1 - CRITICAL (Active Intrusion / Ransomware)</option>
                  <option value="HIGH">P2 - HIGH (Phishing Credential Compromise)</option>
                  <option value="MEDIUM">P3 - MEDIUM (Suspicious Network Anomaly)</option>
                  <option value="LOW">P4 - LOW (General Security Inquiry)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-text-secondary">Technical Details & Artifacts</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Include IP addresses, suspicious domain, email sender headers, or device ID..."
                  value={ticketDetails}
                  onChange={(e) => setTicketDetails(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-navy-950 border border-surface-border focus:border-cyan rounded-xl text-xs font-mono text-text-primary outline-none transition"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-cyan hover:bg-cyan-400 text-navy-950 font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-cyan/20 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>DISPATCH TO SOC OPERATOR</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </UserLayout>
  );
}
