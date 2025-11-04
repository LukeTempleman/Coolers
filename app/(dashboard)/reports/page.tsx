"use client";
import React, { useMemo } from "react";
import { mockCoolers } from "@/app/lib/mockCoolers";
import { CoolerStatusEnum } from '@/app/lib/constants';
import { 
  User, 
  Cpu, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  MapPin,
  DollarSign,
  Activity,
  Building,
  BarChart3,
  Info
} from 'lucide-react';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { SiteHeader } from '@/components/site-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { ScrollArea } from '@/components/ui/scroll-area';

// Custom KPI Card with Tooltip
const KpiCardWithTooltip = ({ title, value, icon, subtitle, className, tooltip }: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle: string;
  className?: string;
  tooltip: string;
}) => (
  <Card className={className}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="flex items-center gap-2">
        {icon}
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="w-4 h-4 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </CardContent>
  </Card>
);

export default function ReportsPage() {
  // AI Assistant temporarily disabled (UI and state removed)
  // Calculate comprehensive KPIs from mock data
  const kpis = useMemo(() => {
    const totalCoolers = mockCoolers.length;
    const activeCoolers = mockCoolers.filter(c => c.status === CoolerStatusEnum.Active).length;
    const assignedCoolers = mockCoolers.filter(c => c.status === CoolerStatusEnum.Assigned).length;
    const alertCoolers = mockCoolers.filter(c => c.status === CoolerStatusEnum.Alert).length;
    const maintenanceCoolers = mockCoolers.filter(c => c.status === CoolerStatusEnum.Maintenance).length;
    const idleCoolers = mockCoolers.filter(c => c.status === CoolerStatusEnum.Idle).length;
    
    // Calculate deployment by provinces
    const provinceDistribution = mockCoolers.reduce((acc, cooler) => {
      acc[cooler.location.province] = (acc[cooler.location.province] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Calculate cooler types distribution
    const typeDistribution = mockCoolers.reduce((acc, cooler) => {
      const type = cooler.coolerModel.toLowerCase().includes('double') ? 'Double Door' : 
                   cooler.coolerModel.toLowerCase().includes('single') ? 'Single Door' : 
                   cooler.coolerModel.toLowerCase().includes('compact') ? 'Compact' : 'Standard';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalCoolers,
      activeCoolers,
      assignedCoolers,
      alertCoolers,
      maintenanceCoolers,
      idleCoolers,
      provinceDistribution,
      typeDistribution
    };
  }, []);

  // Generate performance metrics (simulated data based on real cooler count)
  const performanceMetrics = useMemo(() => {
    const baseRevenue = kpis.activeCoolers * 1500; // R1500 per active cooler per month
    const monthlyGrowth = 12.5;
    const roiPercentage = 23.4;
    const avgServiceTime = 2.3;
    
    return {
      monthlyRevenue: baseRevenue,
      monthlyGrowth,
      roiPercentage,
      avgServiceTime,
      totalRevenue: baseRevenue * 12, // Yearly
      costSavings: baseRevenue * 0.15 // 15% cost savings
    };
  }, [kpis.activeCoolers]);

  // Generate ROI over time data (growth over previous year baseline)
  const roiChartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const averageSales = 45000; // Average expected sales per cooler per month in Rands
    
    return months.map((month, index) => {
      // Previous year baseline (2024): varied performance, some below average
      const previousYearBase = averageSales * (0.85 + Math.sin(index * 0.6) * 0.1);
      
      // Current year (2025): improved performance with growth trend
      const currentYearBase = averageSales * (1.0 + (index * 0.02));
      const currentYearVariance = Math.sin(index * 0.5) * 2000;
      
      return {
        month,
        averageLine: averageSales,
        previousYear: Math.round(previousYearBase),
        currentYear: Math.round(currentYearBase + currentYearVariance),
      };
    });
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="flex flex-col gap-6 p-6">
            <TooltipProvider>
              {/* Header */}
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Reports & Analytics</h1>
                <p className="text-muted-foreground text-lg">
                  Comprehensive overview of cooler performance, deployment statistics, and business metrics
                </p>
              </div>

              {/* Primary KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <KpiCardWithTooltip
                  title="Total Coolers"
                  value={kpis.totalCoolers}
                  icon={<Cpu size={20} />}
                  subtitle="All coolers in system"
                  className="border-blue-200 bg-blue-50"
                  tooltip="Total number of coolers registered in the system, including all status types"
                />
                <KpiCardWithTooltip
                  title="Active Coolers"
                  value={kpis.activeCoolers}
                  icon={<CheckCircle size={20} />}
                  subtitle={`${((kpis.activeCoolers / kpis.totalCoolers) * 100).toFixed(1)}% of total`}
                  className="border-green-200 bg-green-50"
                  tooltip="Coolers that are currently deployed and operational in the field"
                />
                <KpiCardWithTooltip
                  title="Alert Status"
                  value={kpis.alertCoolers}
                  icon={<AlertTriangle size={20} />}
                  subtitle="Requiring attention"
                  className="border-red-200 bg-red-50"
                  tooltip="Coolers that are experiencing issues and require immediate attention or maintenance"
                />
                <KpiCardWithTooltip
                  title="Assigned Coolers"
                  value={kpis.assignedCoolers}
                  icon={<User size={20} />}
                  subtitle="Awaiting activation"
                  className="border-amber-200 bg-amber-50"
                  tooltip="Coolers that have been assigned to customers but are not yet activated or deployed"
                />
              </div>

              {/* Financial & Performance KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <KpiCardWithTooltip
                  title="Monthly Revenue"
                  value={`R${(performanceMetrics.monthlyRevenue / 1000).toFixed(0)}K`}
                  icon={<DollarSign size={20} />}
                  subtitle={`+${performanceMetrics.monthlyGrowth}% growth`}
                  className="border-emerald-200 bg-emerald-50"
                  tooltip="Total monthly revenue generated from all active cooler deployments"
                />
                <KpiCardWithTooltip
                  title="Average ROI"
                  value={`${performanceMetrics.roiPercentage}%`}
                  icon={<TrendingUp size={20} />}
                  subtitle="Return on investment"
                  className="border-orange-200 bg-orange-50"
                  tooltip="Average return on investment calculated across all cooler deployments"
                />
                <KpiCardWithTooltip
                  title="Idle Coolers"
                  value={kpis.idleCoolers}
                  icon={<Activity size={20} />}
                  subtitle="Not currently deployed"
                  className="border-gray-200 bg-gray-50"
                  tooltip="Coolers that are available but not currently assigned or in active use"
                />
              </div>
            {/* Detailed Analytics Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              
              {/* Geographic Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Geographic Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(kpis.provinceDistribution)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 6)
                      .map(([province, count]) => (
                        <div key={province} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{province}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-muted rounded-full">
                              <div 
                                className="h-full bg-blue-500 rounded-full" 
                                style={{ width: `${(count / kpis.totalCoolers * 100)}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground w-8">{count}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Total deployment across {Object.keys(kpis.provinceDistribution).length} provinces
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cooler Type Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5" />
                    Cooler Type Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(kpis.typeDistribution)
                      .sort(([,a], [,b]) => b - a)
                      .map(([type, count]) => (
                        <div key={type} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{type}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {((count / kpis.totalCoolers) * 100).toFixed(1)}%
                            </Badge>
                            <span className="text-sm text-muted-foreground w-8">{count}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Optimal mix for different deployment scenarios
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Status Overview (temporarily removed) */}

              {/* Financial Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Financial Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Monthly Revenue</span>
                      <span className="text-lg font-semibold text-green-600">
                        R{(performanceMetrics.monthlyRevenue / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Annual Revenue</span>
                      <span className="text-lg font-semibold">
                        R{(performanceMetrics.totalRevenue / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Cost Savings</span>
                      <span className="text-lg font-semibold text-blue-600">
                        R{(performanceMetrics.costSavings / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">ROI</span>
                      <Badge variant="default" className="text-sm">
                        {performanceMetrics.roiPercentage}%
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <TrendingUp className="w-4 h-4" />
                      +{performanceMetrics.monthlyGrowth}% growth this month
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ROI Over Time Chart - Full Width */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Sales Performance: Year-over-Year Growth
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Comparing current year (2025) vs. previous year (2024) baseline against average sales target
                </p>
              </CardHeader>
              <CardContent className="pl-2 pr-2">
                <ChartContainer
                  config={{
                    averageLine: {
                      label: "Average Target",
                      color: "hsl(var(--muted-foreground))",
                    },
                    previousYear: {
                      label: "2024 Baseline",
                      color: "hsl(var(--destructive))",
                    },
                    currentYear: {
                      label: "2025 Performance",
                      color: "hsl(var(--primary))",
                    },
                  }}
                  className="h-[500px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={roiChartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="month" 
                        className="text-xs"
                      />
                      <YAxis 
                        className="text-xs"
                        tickFormatter={(value) => `R${(value / 1000).toFixed(0)}K`}
                      />
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                        formatter={(value: number) => [`R${value.toLocaleString()}`, '']}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="averageLine" 
                        stroke="hsl(var(--muted-foreground))" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                        name="Average Target"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="previousYear" 
                        stroke="hsl(var(--destructive))" 
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--destructive))' }}
                        name="2024 Baseline"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="currentYear" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--primary))' }}
                        name="2025 Performance"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="mt-4 pt-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">2024 Average</div>
                      <div className="font-semibold text-destructive">R39.8K</div>
                      <div className="text-xs text-muted-foreground">11.6% below target</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">2025 Average</div>
                      <div className="font-semibold text-primary">R49.5K</div>
                      <div className="text-xs text-green-600">10.0% above target</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">YoY Growth</div>
                      <div className="font-semibold text-green-600">+24.4%</div>
                      <div className="text-xs text-muted-foreground">R9.7K increase</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Coolers Below Avg</div>
                      <div className="font-semibold text-amber-600">~10K units</div>
                      <div className="text-xs text-muted-foreground">Opportunity area</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Summary Insights */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-green-800">High Operational Efficiency</h4>
                        <p className="text-sm text-green-700 mt-1">
                          {((kpis.activeCoolers / kpis.totalCoolers) * 100).toFixed(1)}% active deployment rate with {kpis.activeCoolers} operational units
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="w-5 h-5 text-blue-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-blue-800">Strong Financial Performance</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          R{(performanceMetrics.monthlyRevenue / 1000).toFixed(0)}K monthly revenue with {performanceMetrics.roiPercentage}% ROI
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-purple-600 mt-1" />
                      <div>
                        <h4 className="font-semibold text-purple-800">Wide Geographic Coverage</h4>
                        <p className="text-sm text-purple-700 mt-1">
                          Deployed across {Object.keys(kpis.provinceDistribution).length} provinces with optimal distribution
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Analytics Assistant (temporarily disabled) */}
            {/**
            <Card className="mt-6">
              ... AI section commented out ...
            </Card>
            **/}
            </TooltipProvider>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}