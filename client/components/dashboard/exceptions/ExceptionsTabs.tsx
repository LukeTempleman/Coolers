"use client";
import React, { useState } from 'react';

interface ExceptionItem { id: string; cooler: string; region: string; detail: string; severity: 'info'|'warn'|'crit'; }
interface ExceptionsTabsProps {
  offline: ExceptionItem[];
  power: ExceptionItem[];
  movement: ExceptionItem[];
  noMovement: ExceptionItem[];
  misplaced: ExceptionItem[];
  loading?: boolean;
}

const tabs = [
  { key: 'offline', label: 'Offline' },
  { key: 'power', label: 'Power Cut' },
  { key: 'movement', label: 'Moved w/out Power' },
  { key: 'misplaced', label: 'Misplaced' },
  { key: 'noMovement', label: 'No Movement' },
];

export const ExceptionsTabs: React.FC<ExceptionsTabsProps> = ({ offline, power, movement, noMovement, misplaced, loading }) => {
  const [active, setActive] = useState('offline');
  const dataMap: Record<string, ExceptionItem[]> = { offline, power, movement, noMovement, misplaced } as any;
  const current = dataMap[active] || [];
  return (
    <div className="rounded-lg border bg-background p-4 flex flex-col gap-4">
      <div className="flex flex-wrap gap-2 text-xs">
        {tabs.map(t => (
          <button key={t.key} onClick={()=>setActive(t.key)} className={`px-3 py-1 rounded-md border ${active===t.key ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/70'}`}>{t.label}</button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <button className="text-xs underline text-muted-foreground hover:text-foreground">Export</button>
          <button className="text-xs underline text-muted-foreground hover:text-foreground">Send to Metabase</button>
        </div>
      </div>
      {loading && <div className="space-y-2">{Array.from({length:8}).map((_,i)=>(<div key={i} className="h-7 bg-muted animate-pulse rounded"/>))}</div>}
      {!loading && (
        <div className="overflow-auto max-h-80">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-background border-b">
              <tr className="text-left">
                <th className="py-2 pr-2 font-medium">Cooler</th>
                <th className="py-2 pr-2 font-medium">Region</th>
                <th className="py-2 pr-2 font-medium">Detail</th>
                <th className="py-2 pr-2 font-medium">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {current.slice(0,30).map(item => (
                <tr key={item.id} className="hover:bg-muted/50">
                  <td className="py-1 pr-2 font-medium">{item.cooler}</td>
                  <td className="py-1 pr-2">{item.region}</td>
                  <td className="py-1 pr-2 text-muted-foreground">{item.detail}</td>
                  <td className="py-1 pr-2">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-medium ${item.severity==='crit'?'bg-red-600 text-white': item.severity==='warn'?'bg-amber-500 text-black':'bg-slate-500 text-white'}`}>{item.severity.toUpperCase()}</span>
                  </td>
                </tr>
              ))}
              {current.length===0 && (
                <tr><td colSpan={4} className="py-6 text-center text-muted-foreground">No exceptions in this category</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
