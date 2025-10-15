"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { KpiCard } from '@/components/dashboard/kpi/KpiCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, MapPinned, Bell, PencilRuler, Activity, WifiOff } from 'lucide-react';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import dynamic from 'next/dynamic';
import type { CoolerPoint, Geofence } from '@/components/geofencing/GeofenceMap';
import { useGetCoolersQuery } from '@/app/state/api';

const GeofenceMap = dynamic(() => import('@/components/geofencing/GeofenceMap').then(m => m.default), { ssr: false });

// Temporary mock data – replace with real hooks later
const mockStats = {
  zones: 12,
  activeBreaches: 3,
  unassigned: 120,
  lastBreachMins: 14,
};

export default function GeofencingPage() {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
  // Load coolers from backend
  const { data: coolersData, isLoading: coolersLoading, isError: coolersError } = useGetCoolersQuery({});
  const coolers: CoolerPoint[] = useMemo(() => (
    (coolersData || [])
      .map((c, idx) => {
        const coords = (c as any).location?.coordinates as [number, number] | undefined;
        const lng = coords?.[0];
        const lat = coords?.[1];
        if (typeof lng !== 'number' || typeof lat !== 'number') return null;
        return {
          id: String((c as any)._id ?? `cooler-${idx}`),
          name: (c as any).name || 'Unnamed Cooler',
          coordinates: [lng, lat] as [number, number],
          status: (c as any).status,
          city: (c as any).location?.city,
          province: (c as any).location?.province,
          country: (c as any).location?.country,
          radius: (c as any).radius,
        };
      })
      .filter(Boolean) as CoolerPoint[]
  ), [coolersData]);
  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
     <SidebarProvider>
          <AppSidebar variant="inset" />
          <SidebarInset>
            <SiteHeader />
    <div className="flex flex-col gap-8 p-4 md:p-6">
      {/* Header / Intro */}
      <div className="space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-end gap-4 justify-between">
          <div className="space-y-2 max-w-2xl">
            <h1 className="text-2xl font-semibold tracking-tight">Stay in Control with Smart Geofencing</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Define virtual boundaries for every deployed cooler. Get alerted the moment a unit leaves its authorized zone, moves without power,
              or stays offline beyond tolerance. Reduce loss, enforce deployment integrity, and accelerate recovery.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" className="gap-1"><PencilRuler className="h-4 w-4" /> Create Geofence</Button>
            <Button variant="outline" size="sm" className="gap-1"><Bell className="h-4 w-4" /> Alert Rules</Button>
          </div>
        </div>
        <Separator />
      </div>

      {/* KPI Strip */}
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        <KpiCard title="Geofence Zones" value={mockStats.zones} subtitle="Total defined" icon={<MapPinned className="h-4 w-4" />} />
        <KpiCard title="Active Breaches" value={mockStats.activeBreaches} subtitle="Open alerts" icon={<AlertTriangle className="h-4 w-4" />} delta={{ value: 4, positiveIsGood: false }} />
        <KpiCard title="Unassigned Coolers" value={mockStats.unassigned} subtitle="Need zones" icon={<Activity className="h-4 w-4" />} />
        <KpiCard title="Last Breach" value={`${mockStats.lastBreachMins}m`} subtitle="Minutes ago" icon={<Bell className="h-4 w-4" />} />
        <KpiCard title="Offline w/ Zone" value={2} subtitle="Monitoring" icon={<WifiOff className="h-4 w-4" />} />
      </div>

      {/* Map / Canvas with Mapbox & Draw */}
      <div className="rounded-lg border bg-background p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium">Geofence Canvas</h2>
          <span className="text-xs text-muted-foreground">{geofences.length} zone(s)</span>
        </div>
  {mapboxToken && mounted ? (
          <div className="min-h-[480px] w-full">
            {coolersError ? (
              <div className="h-80 w-full rounded bg-muted flex items-center justify-center text-xs text-red-600">
                Failed to load coolers.
              </div>
            ) : coolersLoading ? (
              <div className="h-80 w-full rounded bg-muted flex items-center justify-center text-xs">
                Loading coolers…
              </div>
            ) : (
              <GeofenceMap
                accessToken={mapboxToken}
                center={coolers[0]?.coordinates || [28.074, -26.210]}
                zoom={11}
                coolers={coolers}
                defaultRadiusMeters={300}
                onChange={setGeofences}
              />
            )}
          </div>
        ) : (
          <div className="h-80 w-full rounded bg-muted flex items-center justify-center text-xs text-red-600">
            Missing NEXT_PUBLIC_MAPBOX_TOKEN. Add it to .env.local and restart the dev server.
          </div>
        )}
        <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Inside</span>
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-slate-500" /> Idle</span>
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" /> Breach</span>
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-gray-400" /> Offline</span>
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> Power Move</span>
        </div>
      </div>

      {/* Unassigned Coolers Section */}
  <Tabs defaultValue="unassigned" className="space-y-6">
        <TabsList>
          <TabsTrigger value="unassigned">Unassigned Coolers</TabsTrigger>
        </TabsList>
        <TabsContent value="unassigned" className="space-y-4">
          <div className="rounded-lg border bg-background overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr className="text-left">
                  <th className="py-2 px-3 font-medium">Serial Number</th>
                  <th className="py-2 px-3 font-medium">Name</th>
                  <th className="py-2 px-3 font-medium">Model</th>
                  <th className="py-2 px-3 font-medium">City</th>
                  <th className="py-2 px-3 font-medium">Province</th>
                  <th className="py-2 px-3 font-medium">Country</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {(coolersData || [])
                  .filter(cooler => cooler.status !== 'Active')
                  .map((cooler) => (
                  <tr key={cooler._id || cooler.name} className="hover:bg-muted/50">
                    <td className="py-2 px-3 font-mono text-[11px] font-medium">{cooler._id}</td>
                    <td className="py-2 px-3">{cooler.name}</td>
                    <td className="py-2 px-3 text-muted-foreground">{cooler.coolerModel}</td>
                    <td className="py-2 px-3">{cooler.location.city}</td>
                    <td className="py-2 px-3">{cooler.location.province}</td>
                    <td className="py-2 px-3">{cooler.location.country}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
    </SidebarInset>
    </SidebarProvider>
  );
}