"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
        <DialogContent className="w-[99vw] max-h-[95vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Breach Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold text-foreground">Cooler:</span> {selected.cooler}
                </div>
                <div>
                  <span className="font-semibold text-foreground">Type:</span> {selected.type}
                </div>
                <div>
                  <span className="font-semibold text-foreground">Region:</span> {selected.region}
                </div>
                <div>
                  <span className="font-semibold text-foreground">Severity:</span> <span className={selected.severity === 'high' ? 'text-red-600 font-semibold' : selected.severity === 'medium' ? 'text-amber-600' : 'text-slate-500'}>{selected.severity}</span>
                </div>
                <div className="col-span-2">
                  <span className="font-semibold text-foreground">Time:</span> {new Date(selected.time).toLocaleString()}
                </div>
              </div>
              
              {/* Map Legend */}
              <div className="flex items-center gap-6 text-sm bg-muted/30 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
                  <span>Expected Location</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-sm"></div>
                  <span>Current Location (Breach)</span>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <div className="w-full h-[600px]">
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
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
