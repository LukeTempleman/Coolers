import React from 'react';
import { KpiCard } from './KpiCard';
import { Activity, Power, AlertTriangle, WifiOff, MapPin } from 'lucide-react';

interface KpiRowProps {
  data?: {
    total: number;
    active: number;
    idle: number;
    breaches24h: number;
    powerCuts24h: number;
    offline: number;
    offlinePct: number;
    activeDeltaPct: number;
  };
  loading?: boolean;
}

export const KpiRow: React.FC<KpiRowProps> = ({ data, loading }) => {
  const total = data?.total ?? 0;
  const active = data?.active ?? 0;
  const idle = data?.idle ?? 0;
  const activePct = total ? Math.round((active / (active + idle || 1)) * 100) : 0;
  const offlinePct = data?.offlinePct ?? 0;
  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <KpiCard title="Total Coolers" value={loading ? '—' : total} subtitle={loading ? undefined : `${data?.active} active`} icon={<MapPin className="h-4 w-4" />} loading={loading} />
      <KpiCard title="Active vs Idle" value={loading ? '—' : `${activePct}%`} subtitle={!loading ? `${active} / ${idle}` : undefined} delta={{ value: data?.activeDeltaPct ?? 0 }} icon={<Activity className="h-4 w-4" />} loading={loading} />
      <KpiCard title="Breaches (24h)" value={loading ? '—' : data?.breaches24h ?? 0} icon={<AlertTriangle className="h-4 w-4" />} loading={loading} />
      <KpiCard title="Power Cuts (24h)" value={loading ? '—' : data?.powerCuts24h ?? 0} icon={<Power className="h-4 w-4" />} loading={loading} />
      <KpiCard title="Offline" value={loading ? '—' : data?.offline ?? 0} subtitle={!loading ? `${offlinePct}%` : undefined} icon={<WifiOff className="h-4 w-4" />} loading={loading} />
    </div>
  );
};
