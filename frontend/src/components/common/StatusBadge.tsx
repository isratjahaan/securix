import React from 'react';

interface StatusBadgeProps {
  status: string;
  type?: 'severity' | 'health' | 'module' | 'alert' | 'incident' | 'device';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = 'severity', size = 'md' }) => {
  const norm = (status || '').toUpperCase();

  let bgClass = 'bg-slate-800 text-slate-300 border-slate-700';
  let dotClass = 'bg-slate-400';

  if (norm === 'CRITICAL' || norm === 'P0_CRITICAL' || norm === 'UNHEALTHY' || norm === 'BLOCKED' || norm === 'NON_COMPLIANT' || norm === 'FLAGGED') {
    bgClass = 'bg-rose-950/60 text-rose-300 border-rose-800/80';
    dotClass = 'bg-rose-500 animate-pulse';
  } else if (norm === 'HIGH' || norm === 'P1_HIGH' || norm === 'DEGRADED') {
    bgClass = 'bg-orange-950/60 text-orange-300 border-orange-800/80';
    dotClass = 'bg-orange-500';
  } else if (norm === 'MEDIUM' || norm === 'P2_MEDIUM' || norm === 'MAINTENANCE' || norm === 'PENDING_VERIFICATION') {
    bgClass = 'bg-amber-950/60 text-amber-300 border-amber-800/80';
    dotClass = 'bg-amber-500';
  } else if (norm === 'LOW' || norm === 'P3_LOW' || norm === 'NEW' || norm === 'INFORMATIONAL') {
    bgClass = 'bg-cyan-950/60 text-cyan-300 border-cyan-800/80';
    dotClass = 'bg-cyan-400';
  } else if (norm === 'HEALTHY' || norm === 'ACTIVE' || norm === 'ONLINE' || norm === 'COMPLIANT' || norm === 'RESOLVED' || norm === 'CLOSED' || norm === 'VERIFIED') {
    bgClass = 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80';
    dotClass = 'bg-emerald-400';
  } else if (norm === 'DISABLED' || norm === 'ARCHIVED' || norm === 'OFFLINE' || norm === 'DISMISSED') {
    bgClass = 'bg-slate-900/80 text-slate-400 border-slate-700';
    dotClass = 'bg-slate-500';
  }

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${bgClass} ${sizeClass} tracking-wide font-mono uppercase`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
      {status.replace(/_/g, ' ')}
    </span>
  );
};
