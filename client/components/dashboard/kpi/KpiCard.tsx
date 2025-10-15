import React from 'react';
import { cn } from '@/app/lib/utils';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  delta?: { value: number; positiveIsGood?: boolean };
  icon?: React.ReactNode;
  loading?: boolean;
  className?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({ title, value, subtitle, delta, icon, loading, className }) => {
  return (
    <div className={cn("relative overflow-hidden rounded-lg border bg-background p-4 flex flex-col gap-2 min-h-28", className)}>
      <div className="flex items-start justify-between">
        <h3 className="text-xs font-medium text-muted-foreground tracking-wide uppercase">{title}</h3>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>
      {loading ? (
        <div className="h-6 w-24 bg-muted animate-pulse rounded" />
      ) : (
        <div className="text-2xl font-semibold tabular-nums">{value}</div>
      )}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {subtitle && <span>{subtitle}</span>}
        {delta && (
          <span className={cn(
            'font-medium',
            delta.value > 0 ? (delta.positiveIsGood !== false ? 'text-emerald-600' : 'text-red-600') : delta.value < 0 ? (delta.positiveIsGood !== false ? 'text-red-600' : 'text-emerald-600') : 'text-muted-foreground'
          )}>
            {delta.value > 0 ? '+' : ''}{delta.value}%
          </span>
        )}
      </div>
    </div>
  );
};
