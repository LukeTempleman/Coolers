"use client";
import React, { useState } from 'react';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { KpiCard } from '@/components/dashboard/kpi/KpiCard';
import { Power, MapPinned, WifiOff, Activity, CheckCircle2 } from 'lucide-react';

interface AlertItem {
  id: string;
  type: string;
  cooler: string;
  zone?: string;
  location?: string;
  timeMinutesAgo: number;
  severity: 'critical' | 'warning' | 'info' | 'resolved';
  status: 'OPEN' | 'ACK' | 'RESOLVED';
  meta?: Record<string, any>;
}

const mockAlerts: AlertItem[] = [
  { id: 'a1', type: 'Geofence Breach', cooler: 'C-2041', zone: 'Downtown A', timeMinutesAgo: 5, severity: 'critical', status: 'OPEN', meta: { distanceOutsideM: 420 } },
  { id: 'a2', type: 'Power Cutoff', cooler: 'C-1182', zone: 'Retail Hub', timeMinutesAgo: 12, severity: 'warning', status: 'ACK' },
  { id: 'a3', type: 'Offline Cooler', cooler: 'C-3320', location: 'Berlin', timeMinutesAgo: 48, severity: 'warning', status: 'OPEN', meta: { lastSignal: '48m' } },
  { id: 'a4', type: 'Moved Without Power', cooler: 'C-2041', zone: 'Path Drift', timeMinutesAgo: 82, severity: 'critical', status: 'OPEN', meta: { distanceKm: 1.8 } },
  { id: 'a5', type: 'Misplaced Asset', cooler: 'C-5177', zone: 'Depot 3', timeMinutesAgo: 125, severity: 'info', status: 'RESOLVED' },
  { id: 'a6', type: 'Idle > 7 Days', cooler: 'C-1490', zone: 'Warehouse West', timeMinutesAgo: 191, severity: 'info', status: 'OPEN', meta: { idleDays: 7 } },
];

const severityOrder = { critical: 0, warning: 1, info: 2, resolved: 3 } as const;

export default function AlertsPage() {
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<AlertItem | null>(null);

  const filtered = mockAlerts
    .filter(a => typeFilter === 'all' || a.type === typeFilter)
    .filter(a => !search || a.cooler.toLowerCase().includes(search.toLowerCase()) || a.type.toLowerCase().includes(search.toLowerCase()));

  const sorted = [...filtered].sort((a,b)=> {
    const sev = severityOrder[a.severity] - severityOrder[b.severity];
    if (sev !== 0) return sev;
    return a.timeMinutesAgo - b.timeMinutesAgo; // newest first
  });

  const kpis = {
    critical: mockAlerts.filter(a=>a.severity==='critical' && a.status!=='RESOLVED').length,
    warnings: mockAlerts.filter(a=>a.severity==='warning' && a.status!=='RESOLVED').length,
    open: mockAlerts.filter(a=>a.status==='OPEN').length,
    resolved24h: mockAlerts.filter(a=>a.status==='RESOLVED').length,
    breaches24h: mockAlerts.filter(a=>a.type==='Geofence Breach').length,
    power24h: mockAlerts.filter(a=>a.type==='Power Cutoff').length,
    offline: mockAlerts.filter(a=>a.type==='Offline Cooler').length,
    idle: mockAlerts.filter(a=>a.type.startsWith('Idle')).length,
  };

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="p-4 md:p-6 flex flex-col gap-8">
          {/* Title + Actions */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">Stay Ahead with Real-Time Alerts</h1>
              <p className="text-sm text-muted-foreground max-w-2xl">Monitor and resolve critical cooler events before they become losses. Prioritize breaches, power issues, offline risks, and utilization anomalies from one command center.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" size="sm">Export Alerts</Button>
              <Button variant="outline" size="sm">Configure Notifications</Button>
              <Button variant="outline" size="sm">Refresh Now</Button>
            </div>
          </div>
          <Separator />

          {/* Filters */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-3 items-end">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Alert Type</label>
                  <Select value={typeFilter} onValueChange={v=>setTypeFilter(v)}>
                    <SelectTrigger className="h-8 w-48">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {Array.from(new Set(mockAlerts.map(a=>a.type))).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Search</label>
                  <Input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Cooler / type" className="h-8 w-48" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Time Range</label>
                  <Select defaultValue="24h">
                    <SelectTrigger className="h-8 w-32"><SelectValue placeholder="24h" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">Last 24h</SelectItem>
                      <SelectItem value="7d">Last 7d</SelectItem>
                      <SelectItem value="30d">Last 30d</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="ml-auto flex gap-2">
                  <Button variant="ghost" size="sm" onClick={()=>{setTypeFilter('all'); setSearch('');}}>Clear Filters</Button>
                </div>
              </div>
            </div>

          {/* KPI Row */}
          <div className="grid gap-4 md:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6">
            <KpiCard title="Open Alerts" value={kpis.open} icon={<Activity className="h-4 w-4" />} />
            <KpiCard title="Resolved 24h" value={kpis.resolved24h} icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />} />
            <KpiCard title="Breaches 24h" value={kpis.breaches24h} icon={<MapPinned className="h-4 w-4" />} />
            <KpiCard title="Power Cuts" value={kpis.power24h} icon={<Power className="h-4 w-4" />} />
            <KpiCard title="Offline" value={kpis.offline} icon={<WifiOff className="h-4 w-4" />} />
            <KpiCard title="Idle > Threshold" value={kpis.idle} icon={<Activity className="h-4 w-4" />} />
          </div>

          {/* Location Mismatch Section */}
          <div className="rounded-lg border bg-background p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold">Location Mismatch Alerts</h2>
                <p className="text-sm text-muted-foreground">Coolers where actual location doesn&apos;t match SAP-allocated location</p>
              </div>
              <Button size="sm" variant="outline">View All Mismatches</Button>
            </div>

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
              {/* Mismatch Table */}
              <div className="rounded-lg border overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-muted/50 text-muted-foreground">
                    <tr className="text-left">
                      <th className="py-2 px-3 font-medium">Cooler</th>
                      <th className="py-2 px-3 font-medium">Expected Location</th>
                      <th className="py-2 px-3 font-medium">Actual Location</th>
                      <th className="py-2 px-3 font-medium">Distance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[
                      { id: 'SN-000042', expected: 'Sandton Mall', expectedCoords: [28.0436, -26.1076], actual: 'Johannesburg CBD', actualCoords: [28.0473, -26.2041], distance: '12.3 km' },
                      { id: 'SN-000078', expected: 'Cape Town Waterfront', expectedCoords: [18.4241, -33.9249], actual: 'Stellenbosch', actualCoords: [18.8667, -33.9321], distance: '45.2 km' },
                      { id: 'SN-000134', expected: 'Durban Marina', expectedCoords: [31.0218, -29.8587], actual: 'Pietermaritzburg', actualCoords: [30.3753, -29.6009], distance: '68.5 km' },
                      { id: 'SN-000201', expected: 'Pretoria Central', expectedCoords: [28.1881, -25.7479], actual: 'Soweto', actualCoords: [27.8546, -26.2678], distance: '61.4 km' },
                      { id: 'SN-000089', expected: 'Port Elizabeth Baywest', expectedCoords: [25.6022, -33.9608], actual: 'East London', actualCoords: [27.9116, -33.0153], distance: '284.7 km' },
                      { id: 'SN-000156', expected: 'Bloemfontein Central', expectedCoords: [26.2023, -29.0852], actual: 'Kimberley', actualCoords: [24.7631, -28.7282], distance: '152.3 km' },
                      { id: 'SN-000187', expected: 'Polokwane Mall', expectedCoords: [29.4487, -23.9045], actual: 'Nelspruit', actualCoords: [30.9702, -25.4753], distance: '201.4 km' },
                      { id: 'SN-000213', expected: 'Mahikeng City Centre', expectedCoords: [25.6447, -25.8601], actual: 'Johannesburg', actualCoords: [28.0473, -26.2041], distance: '247.8 km' },
                    ].map((mismatch) => (
                      <tr key={mismatch.id} className="hover:bg-muted/50 cursor-pointer">
                        <td className="py-2 px-3 font-mono font-medium">{mismatch.id}</td>
                        <td className="py-2 px-3 text-green-700 dark:text-green-400">{mismatch.expected}</td>
                        <td className="py-2 px-3 text-red-700 dark:text-red-400">{mismatch.actual}</td>
                        <td className="py-2 px-3 text-muted-foreground">{mismatch.distance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Drill-down Map Preview */}
              <div className="rounded-lg border overflow-hidden">
                <div className="bg-muted/30 p-3 border-b">
                  <h3 className="text-sm font-medium">Location Comparison Map</h3>
                  <p className="text-xs text-muted-foreground">Green = Expected, Red = Actual</p>
                </div>
                <div className="relative h-80 bg-muted/10">
                  {/* Map placeholder with visual representation */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 320">
                    {/* Background grid */}
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1"/>
                      </pattern>
                    </defs>
                    <rect width="400" height="320" fill="url(#grid)" />
                    
                    {/* Example 1: Sandton Mall vs JHB CBD */}
                    <g>
                      {/* Expected location marker (Green) */}
                      <circle cx="180" cy="140" r="8" fill="#10b981" opacity="0.3" />
                      <circle cx="180" cy="140" r="4" fill="#10b981" stroke="#fff" strokeWidth="2" />
                      <text x="180" y="130" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.7">Sandton Mall</text>
                      
                      {/* Actual location marker (Red) */}
                      <circle cx="220" cy="180" r="8" fill="#ef4444" opacity="0.3" />
                      <circle cx="220" cy="180" r="4" fill="#ef4444" stroke="#fff" strokeWidth="2" />
                      <text x="220" y="195" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.7">JHB CBD</text>
                      
                      {/* Connection line */}
                      <line x1="180" y1="140" x2="220" y2="180" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4,4" opacity="0.6" />
                      <text x="200" y="165" textAnchor="middle" fontSize="9" fill="#fbbf24" fontWeight="bold">12.3 km</text>
                    </g>

                    {/* Example 2: Cape Town */}
                    <g>
                      <circle cx="80" cy="240" r="6" fill="#10b981" opacity="0.3" />
                      <circle cx="80" cy="240" r="3" fill="#10b981" stroke="#fff" strokeWidth="1.5" />
                      <circle cx="140" cy="250" r="6" fill="#ef4444" opacity="0.3" />
                      <circle cx="140" cy="250" r="3" fill="#ef4444" stroke="#fff" strokeWidth="1.5" />
                      <line x1="80" y1="240" x2="140" y2="250" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.5" />
                    </g>

                    {/* Example 3: Durban */}
                    <g>
                      <circle cx="320" cy="200" r="6" fill="#10b981" opacity="0.3" />
                      <circle cx="320" cy="200" r="3" fill="#10b981" stroke="#fff" strokeWidth="1.5" />
                      <circle cx="280" cy="160" r="6" fill="#ef4444" opacity="0.3" />
                      <circle cx="280" cy="160" r="3" fill="#ef4444" stroke="#fff" strokeWidth="1.5" />
                      <line x1="320" y1="200" x2="280" y2="160" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.5" />
                    </g>
                  </svg>

                  {/* Legend */}
                  <div className="absolute bottom-3 left-3 bg-background/95 border rounded p-2 text-xs space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span>Expected (SAP)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span>Actual (GPS)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-0.5 bg-amber-500" style={{ borderTop: '2px dashed' }}></div>
                      <span>Distance</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded text-xs">
              <strong className="text-amber-900 dark:text-amber-100">⚠️ Action Required:</strong>
              <span className="text-amber-800 dark:text-amber-200 ml-2">
                8 coolers detected at incorrect locations. Verify with merchants or dispatch field team for relocation.
              </span>
            </div>
          </div>

          {/* Main Content Split */}
          <div className="grid gap-6 grid-cols-1 xl:grid-cols-12">
            {/* Alerts Feed */}
            <div className="xl:col-span-8 flex flex-col gap-4">
              <div className="rounded-lg border bg-background overflow-hidden">
                <table className="w-full text-xs">
                  <thead className="bg-muted/50 text-muted-foreground">
                    <tr className="text-left">
                      <th className="py-2 px-3 font-medium">Type</th>
                      <th className="py-2 px-3 font-medium">Cooler</th>
                      <th className="py-2 px-3 font-medium">Zone / Location</th>
                      <th className="py-2 px-3 font-medium">Time</th>
                      <th className="py-2 px-3 font-medium">Severity</th>
                      <th className="py-2 px-3 font-medium">Status</th>
                      <th className="py-2 px-3 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {sorted.map(a => (
                      <tr key={a.id} className="hover:bg-muted/50 cursor-pointer" onClick={()=> setSelected(a)}>
                        <td className="py-2 px-3 font-medium">{a.type}</td>
                        <td className="py-2 px-3">{a.cooler}</td>
                        <td className="py-2 px-3 text-muted-foreground">{a.zone || a.location || '—'}</td>
                        <td className="py-2 px-3">{a.timeMinutesAgo}m ago</td>
                        <td className="py-2 px-3">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-medium ${a.severity==='critical'?'bg-red-600 text-white': a.severity==='warning'?'bg-amber-500 text-black': a.severity==='info'?'bg-slate-500 text-white':'bg-emerald-600 text-white'}`}>{a.severity.toUpperCase()}</span>
                        </td>
                        <td className="py-2 px-3 text-[11px] text-muted-foreground">{a.status}</td>
                        <td className="py-2 px-3">
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" className="h-6 px-2 text-[10px]" onClick={(e)=>{e.stopPropagation(); setSelected(a);}}>View</Button>
                            {a.status==='OPEN' && <Button size="sm" variant="ghost" className="h-6 px-2 text-[10px]" onClick={(e)=>{e.stopPropagation(); /* ack logic */}}>Ack</Button>}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {sorted.length===0 && (
                      <tr><td colSpan={7} className="py-10 text-center text-muted-foreground">No alerts match current filters.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Detail + Map */}
            <div className="xl:col-span-4 flex flex-col gap-4">
              <div className="rounded-lg border bg-background p-4 h-56 flex items-center justify-center text-xs text-muted-foreground">
                Map / visualization placeholder (selected alert context)
              </div>
              <div className="rounded-lg border bg-background p-4 flex flex-col gap-3 min-h-64">
                <h2 className="text-sm font-medium">{selected ? `${selected.type} – ${selected.cooler}` : 'Alert Details'}</h2>
                {!selected && <p className="text-xs text-muted-foreground">Select an alert to view details, investigate context, and take action.</p>}
                {selected && (
                  <div className="space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">Status</span><span className="font-medium">{selected.status}</span>
                      <span className="text-muted-foreground">Elapsed</span><span>{selected.timeMinutesAgo} minutes</span>
                      <span className="text-muted-foreground">Zone / Loc</span><span>{selected.zone || selected.location || '—'}</span>
                      {selected.meta?.distanceOutsideM && <><span className="text-muted-foreground">Distance Outside</span><span>{selected.meta.distanceOutsideM} m</span></>}
                      {selected.meta?.distanceKm && <><span className="text-muted-foreground">Movement</span><span>{selected.meta.distanceKm} km</span></>}
                      {selected.meta?.idleDays && <><span className="text-muted-foreground">Idle Days</span><span>{selected.meta.idleDays}</span></>}
                    </div>
                    <Separator />
                    <div className="flex flex-wrap gap-2">
                      {selected.status==='OPEN' && <Button size="sm" className="h-7 px-3 text-[11px]" variant="default">Resolve Alert</Button>}
                      {selected.status==='OPEN' && <Button size="sm" className="h-7 px-3 text-[11px]" variant="secondary">Acknowledge</Button>}
                      <Button size="sm" className="h-7 px-3 text-[11px]" variant="outline">Escalate</Button>
                      <Button size="sm" className="h-7 px-3 text-[11px]" variant="ghost">Export</Button>
                    </div>
                    <div className="pt-1 text-[11px] text-muted-foreground">Add resolution notes and escalation workflow in future iterations.</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
