"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const BreachMap = dynamic(() => import('@/components/BreachMap'), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-muted rounded">Loading map...</div>
});

interface Breach {
  id: string;
  cooler: string;
  region: string;
  type: string;
  time: string; // ISO
  severity: 'low' | 'medium' | 'high';
}
interface BreachMonitorProps { breaches: Breach[]; loading?: boolean; }


export const BreachMonitor: React.FC<BreachMonitorProps> = ({ breaches, loading }) => {
  const [selected, setSelected] = useState<Breach | null>(null);

  return (
    <div className="rounded-lg border bg-background p-4 flex flex-col gap-3 h-full">
      <h3 className="text-sm font-medium">Geofence Breaches</h3>
      {loading && <div className="space-y-2">{Array.from({length:5}).map((_,i)=>(<div key={i} className="h-6 bg-muted animate-pulse rounded"/>))}</div>}
      {!loading && (
        <ul className="divide-y text-xs">
          {breaches.slice(0,8).map(b => (
            <li key={b.id} className="py-2 flex items-center justify-between gap-2 cursor-pointer hover:bg-muted/50 rounded" onClick={() => setSelected(b)}>
              <div className="flex flex-col">
                <span className="font-medium">{b.cooler}</span>
                <span className="text-muted-foreground">{b.type} • {b.region}</span>
              </div>
              <span className={
                b.severity === 'high' ? 'text-red-600 font-semibold' : b.severity === 'medium' ? 'text-amber-600' : 'text-slate-500'
              }>
                {new Date(b.time).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
              </span>
            </li>
          ))}
          {breaches.length===0 && <li className="py-4 text-center text-muted-foreground">No recent breaches</li>}
        </ul>
      )}
      <Dialog open={!!selected} onOpenChange={open => !open && setSelected(null)}>
  <DialogContent className="w-screen max-w-none min-h-[700px] flex flex-col items-center justify-center overflow-hidden">
          <DialogHeader>
            <DialogTitle>Breach Details</DialogTitle>
            <DialogDescription>
              {selected && (
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold">Cooler: {selected.cooler}</span>
                    <span>Type: {selected.type}</span>
                    <span>Region: {selected.region}</span>
                    <span>Severity: <span className={selected.severity === 'high' ? 'text-red-600 font-semibold' : selected.severity === 'medium' ? 'text-amber-600' : 'text-slate-500'}>{selected.severity}</span></span>
                    <span>Time: {new Date(selected.time).toLocaleString()}</span>
                  </div>
                  <div className="border rounded bg-muted p-2">
                    {selected && (
                      <div className="w-full h-[700px]">
                        <BreachMap
                          center={[28.0473, -26.2041]} // Johannesburg (mock expected location)
                          zoom={12}
                          coolers={[
                            {
                              id: selected.id + '-expected',
                              name: selected.cooler + ' (Expected)',
                              coordinates: [28.0473, -26.2041], // Johannesburg
                              status: 'expected',
                              city: selected.region,
                            },
                            {
                              id: selected.id + '-current',
                              name: selected.cooler + ' (Current)',
                              coordinates: [28.1888, -25.7479], // Pretoria (mock current location)
                              status: 'breach',
                              city: selected.region,
                            }
                          ]}
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};
