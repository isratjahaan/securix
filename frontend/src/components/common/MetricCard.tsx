import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  variant?: 'default' | 'critical' | 'teal' | 'amber' | 'cyan';
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  change,
  trend,
  icon: Icon,
  variant = 'default',
  onClick,
}) => {
  const borderVariants = {
    default: 'border-slate-800/80 hover:border-slate-700',
    critical: 'border-rose-900/40 hover:border-rose-700/60 bg-gradient-to-b from-rose-950/20 to-navy-800',
    teal: 'border-teal/30 hover:border-teal/60 bg-gradient-to-b from-teal/10 to-navy-800',
    amber: 'border-amber-900/40 hover:border-amber-700/60 bg-gradient-to-b from-amber-950/20 to-navy-800',
    cyan: 'border-cyan/30 hover:border-cyan/60 bg-gradient-to-b from-cyan/10 to-navy-800',
  };

  const iconVariants = {
    default: 'text-slate-400 bg-slate-800/50',
    critical: 'text-rose-400 bg-rose-950/40 border border-rose-800/30',
    teal: 'text-teal bg-teal/10 border border-teal/20',
    amber: 'text-amber-400 bg-amber-950/40 border border-amber-800/30',
    cyan: 'text-cyan bg-cyan/10 border border-cyan/20',
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-xl bg-navy-800/80 backdrop-blur-md p-5 border transition-all duration-200 shadow-lg ${borderVariants[variant]} ${
        onClick ? 'cursor-pointer transform hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tracking-tight text-text-primary">{value}</span>
            {change && (
              <span
                className={`text-xs font-medium ${
                  trend === 'up' ? 'text-teal' : trend === 'down' ? 'text-rose-400' : 'text-slate-400'
                }`}
              >
                {change}
              </span>
            )}
          </div>
          {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${iconVariants[variant]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
