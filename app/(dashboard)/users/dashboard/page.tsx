import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";
import { KpiRow } from "@/components/dashboard/kpi/KpiRow";
import { DeploymentOverview } from "@/components/dashboard/deployment/DeploymentOverview";
import { BreachMonitor } from "@/components/dashboard/breaches/BreachMonitor";
import { ExceptionsTabs } from "@/components/dashboard/exceptions/ExceptionsTabs";
import { FooterBar } from "@/components/dashboard/FooterBar";
import { CoolerModelEnum } from '@/app/lib/constants';
import { KpiCard } from '@/components/dashboard/kpi/KpiCard';
import { mockCoolers } from '@/app/lib/mockCoolers';
import { UtilizationTrends } from '@/components/dashboard/utilization/UtilizationTrends';

// Temporary mock data until APIs wired
const mockKpis = { total: 128, active: 72, idle: 40, breaches24h: 6, powerCuts24h: 3, offline: 16, offlinePct: 12.5, activeDeltaPct: 3 };
const mockRegions = [
  { region: 'Gauteng', active: 18, idle: 7, offline: 2 },
  { region: 'Western Cape', active: 14, idle: 5, offline: 1 },
  { region: 'KwaZulu-Natal', active: 11, idle: 4, offline: 2 },
  { region: 'Eastern Cape', active: 8, idle: 3, offline: 1 },
  { region: 'Free State', active: 6, idle: 2, offline: 1 },
];
const mockUtil = Array.from({length: 14}).map((_,i)=>({ date: new Date(Date.now()- i*86400000).toISOString(), movement: Math.random()*6+2, idle: Math.random()*10+4 })).reverse();
const saProvinces = [
  'Gauteng',
  'Western Cape',
  'KwaZulu-Natal',
  'Eastern Cape',
  'Free State',
  'Limpopo',
  'Mpumalanga',
  'North West',
  'Northern Cape'
];
const mockBreaches = Array.from({length:5}).map((_,i)=>({
  id: `b${i}`,
  cooler: `Cooler-${i+2}`,
  region: saProvinces[i % saProvinces.length],
  type: ['EXIT','RADIUS','ENTER'][i%3],
  time: new Date(Date.now()-i*3600000).toISOString(),
  severity: (i%3===0?'high': i%3===1?'medium':'low') as 'low' | 'medium' | 'high'
}));
const mockExceptions = {
  offline: Array.from({length:6}).map((_,i)=>({ id:`o${i}`, cooler:`Cooler-${i+10}`, region:'NA', detail:'No signal 3h', severity: i%2?'warn':'crit'})),
  power: Array.from({length:3}).map((_,i)=>({ id:`p${i}`, cooler:`Cooler-${i+20}`, region:'EMEA', detail:'2 cutoffs 24h', severity:'warn'})),
  movement: [],
  noMovement: Array.from({length:2}).map((_,i)=>({ id:`n${i}`, cooler:`Cooler-${i+30}`, region:'LATAM', detail:'No movement 5d', severity:'info'})),
  misplaced: []
};

export default function Page() {
  // Simulate more realistic numbers
  const total = mockCoolers.length + Math.floor(Math.random() * 30); // 50-80
  const active = Math.floor(total * (0.6 + Math.random() * 0.2)); // 60-80% active
  const maintenance = Math.floor(total * (0.08 + Math.random() * 0.04)); // 8-12% maintenance
  const alert = Math.floor(total * (0.06 + Math.random() * 0.04)); // 6-10% alert
  const offline = total - active - maintenance - alert;
  const breaches24h = 0; // 3-12
  const powerCuts24h = Math.floor(Math.random() * 5 + 1); // 1-6
  const unallocated = Math.floor(total * 0.08); // 8% unallocated (mock)

  // Generate mock online/offline percentage series for new graph
  const mockOnlineOfflinePct = Array.from({ length: 14 }).map((_, i) => {
    const date = new Date(Date.now() - i * 86400000).toISOString();
    const onlinePct = Math.round(70 + Math.random() * 25); // 70-95% online
    const offlinePct = 100 - onlinePct;
    return { date, onlinePct, offlinePct };
  }).reverse();

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-col gap-3 p-4 md:p-4">
          {/* Main KPI Grid (compact) */}
          <div className="grid gap-2 grid-cols-2 sm:grid-cols-6 lg:grid-cols-6">
            <KpiCard title="Total Coolers" value={total} subtitle={`${active} online`} />
            <KpiCard title="Online" value={active} />
            <KpiCard title="Offline" value={offline} />
            <KpiCard title="Alerts/Breach" value={alert} />
            <KpiCard title="Power Cuts (24h)" value={powerCuts24h} />
            <KpiCard title="Unallocated Coolers" value={unallocated} />
          </div>
          {/* Secondary KPIs (compact) */}
          <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          </div>
          {/* Online/Offline Percentage Graph */}
          <div className="mt-2">
            <UtilizationTrends series={mockOnlineOfflinePct.map(d => ({ date: d.date, online: d.onlinePct, offline: d.offlinePct }))} />
          </div>
          {/* Existing dashboard sections (no duplicate KPIs) */}
          <div className="grid gap-3 grid-cols-1 xl:grid-cols-12">
            <div className="xl:col-span-6">
              <BreachMonitor breaches={mockBreaches} />
            </div>
            <div className="xl:col-span-6 flex flex-col gap-3">
              <DeploymentOverview regions={mockRegions} unassigned={9} />
            </div>
          </div>
          <FooterBar lastRefresh={new Date()} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

