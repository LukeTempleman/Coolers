import React from 'react';

interface DeploymentOverviewProps {
  regions: Array<{ region: string; active: number; idle: number; offline: number }>;
  unassigned: number;
  loading?: boolean;
}

export const DeploymentOverview: React.FC<DeploymentOverviewProps> = ({ regions, unassigned, loading }) => {
  return (
    <div className="rounded-lg border bg-background p-4 flex flex-col gap-4 h-full">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Deployment Overview</h3>
      </div>
      {loading && <div className="h-32 w-full animate-pulse rounded bg-muted" />}
      {!loading && (
        <div className="space-y-3">
          <div className="grid gap-2 text-xs">
            {regions.map(r => {
              const total = r.active + r.idle + r.offline;
              return (
                <div key={r.region} className="flex flex-col gap-1">
                  <div className="flex justify-between"><span className="font-medium">{r.region}</span><span>{total}</span></div>
                  <div className="flex h-2 rounded overflow-hidden bg-muted">
                    <div className="bg-emerald-500" style={{ width: total ? `${(r.active/total)*100}%` : 0 }} />
                    <div className="bg-slate-500" style={{ width: total ? `${(r.idle/total)*100}%` : 0 }} />
                    <div className="bg-gray-400" style={{ width: total ? `${(r.offline/total)*100}%` : 0 }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-xs text-muted-foreground pt-2">Unassigned: {unassigned}</div>
        </div>
      )}
    </div>
  );
};
