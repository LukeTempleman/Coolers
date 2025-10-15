"use client";
import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from '@/components/ui/chart';

interface UtilizationTrendsProps {
  series: { date: string; online: number; offline: number }[];
  loading?: boolean;
  rangeLabel?: string;
}

const config: ChartConfig = {
  online: {
    label: 'Online %',
    theme: {
      light: 'hsl(142 76% 36%)', // emerald-600
      dark: 'hsl(142 70% 45%)'
    }
  },
  offline: {
    label: 'Offline %',
    theme: {
      light: 'hsl(215 16% 47%)', // slate-500
      dark: 'hsl(215 20% 65%)'
    }
  }
};

export const UtilizationTrends: React.FC<UtilizationTrendsProps> = ({ series, loading, rangeLabel }) => {
  const data = useMemo(() => series.map(d => ({
    date: new Date(d.date).toLocaleDateString(undefined,{ month:'short', day:'numeric'}),
    online: Number(d.online.toFixed(2)),
    offline: Number(d.offline.toFixed(2))
  })), [series]);

  const avgUtil = useMemo(() => {
    if (!series.length) return 0;
    const totalOnline = series.reduce((a,b)=>a + b.online,0);
    const totalOffline = series.reduce((a,b)=>a + b.offline,0);
    return (totalOnline / (totalOnline + totalOffline || 1))*100;
  }, [series]);

  return (
    <div className="rounded-lg border bg-background p-4 flex flex-col gap-2 h-full">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Online/Offline Percentage</h3>
        <div className="text-xs text-muted-foreground flex items-center gap-3">
          <span>{rangeLabel || 'Last 14 Days'}</span>
          <span className="font-medium text-foreground">Avg Online: {avgUtil.toFixed(1)}%</span>
        </div>
      </div>
      {loading && <div className="h-48 w-full animate-pulse rounded bg-muted" />}
      {!loading && series.length === 0 && (
        <div className="text-xs text-muted-foreground h-48 flex items-center justify-center">No utilization data</div>
      )}
      {!loading && series.length > 0 && (
        <ChartContainer config={config} className="w-full h-64">
          <AreaChart data={data} margin={{ top: 10, left: 0, right: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickLine={false} axisLine={false} />
            <YAxis width={32} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} domain={[0, 100]} unit="%" />
            <ReferenceLine y={12} stroke="var(--color-idle)" strokeDasharray="4 4" />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend content={<ChartLegendContent />} />
            <Area type="monotone" dataKey="online" stroke="var(--color-online)" fill="var(--color-online)" fillOpacity={0.25} strokeWidth={2} />
            <Area type="monotone" dataKey="offline" stroke="var(--color-idle)" fill="var(--color-idle)" fillOpacity={0.15} strokeWidth={2} />
          </AreaChart>
        </ChartContainer>
      )}
    </div>
  );
};

