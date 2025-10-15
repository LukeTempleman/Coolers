"use client";
import React from "react";
import { QrCode, MapPin, TrendingUp, ArrowRight, CheckCircle2 } from "lucide-react";

export default function OverviewPage() {
  const steps = [
    {
      number: 1,
      title: "Manufacturing & Pairing",
      icon: QrCode,
      description: "Coolers are manufactured and paired to the tracking system via QR code scanning.",
      status: "Unallocated Status",
      details: [
        "Manufactured coolers arrive at the facility",
        "QR code is scanned to register the cooler",
        "Cooler is assigned a unique Serial Number (SN-XXXXXX)",
        "System creates cooler record with Unallocated status",
        "Cooler is ready for deployment"
      ],
      color: "blue"
    },
    {
      number: 2,
      title: "Location Assignment via SAP",
      icon: MapPin,
      description: "Coolers are assigned to specific locations through SAP's system integration.",
      status: "Active Status",
      details: [
        "Location details are entered in SAP's system",
        "SAP API automatically syncs with our platform",
        "Cooler location is updated in real-time",
        "Address, coordinates, and merchant details are captured",
        "Cooler status changes from Unallocated to Active"
      ],
      color: "green"
    },
    {
      number: 3,
      title: "ROI Analytics & Sales Tracking",
      icon: TrendingUp,
      description: "Real-time analytics on return on investment based on sales data from SAP.",
      status: "Ongoing Monitoring",
      details: [
        "Sales data continuously synced from SAP",
        "Sales performance before and after installation",
        "ROI calculations based on sales growth",
        "Performance trends and insights generated",
        "Predictive analytics for inventory optimization"
      ],
      color: "purple"
    }
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Cooler Tracker Overview</h1>
        <p className="text-muted-foreground text-lg">
          Understanding the complete lifecycle of cooler tracking from manufacturing to analytics
        </p>
      </div>

      {/* Process Flow */}
      <div className="grid gap-8 mt-6">
        {steps.map((step, index) => {
          const IconComponent = step.icon;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.number} className="relative">
              {/* Step Card */}
              <div className="bg-background border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  {/* Step Number & Icon */}
                  <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center ${
                    step.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                    step.color === 'green' ? 'bg-green-100 text-green-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    <IconComponent className="w-8 h-8" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                        step.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                        step.color === 'green' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        Step {step.number}
                      </span>
                      <h2 className="text-2xl font-semibold">{step.title}</h2>
                    </div>

                    <p className="text-muted-foreground mb-4 text-lg">
                      {step.description}
                    </p>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle2 className={`w-5 h-5 ${
                        step.color === 'blue' ? 'text-blue-600' :
                        step.color === 'green' ? 'text-green-600' :
                        'text-purple-600'
                      }`} />
                      <span className="font-semibold">Status: </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        step.color === 'blue' ? 'bg-blue-100 text-blue-800' :
                        step.color === 'green' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {step.status}
                      </span>
                    </div>

                    {/* Details List */}
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                        Process Details
                      </h3>
                      <ul className="space-y-2">
                        {step.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <ArrowRight className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                              step.color === 'blue' ? 'text-blue-600' :
                              step.color === 'green' ? 'text-green-600' :
                              'text-purple-600'
                            }`} />
                            <span className="text-sm">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connector Arrow */}
              {!isLast && (
                <div className="flex justify-center my-4">
                  <div className="w-1 h-8 bg-gradient-to-b from-muted to-transparent"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Integration Note */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mt-4">
        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          SAP Integration
        </h3>
        <p className="text-muted-foreground">
          Our platform seamlessly integrates with SAP&apos;s system through a secure API connection. 
          All location assignments and sales data are automatically synchronized in real-time, 
          ensuring accurate tracking and analytics without manual data entry. This integration 
          enables automated ROI calculations and provides merchants with actionable insights to 
          optimize their cooler deployment strategy.
        </p>
      </div>

      {/* Expected KPIs & Analytics Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-2">Expected Analytics & KPIs</h2>
        <p className="text-muted-foreground mb-6">
          Preview of the key performance indicators and metrics you&apos;ll receive once coolers are deployed
        </p>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Coolers */}
          <div className="bg-background border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Total Coolers</span>
              <QrCode className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-3xl font-bold">156</div>
            <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
              <TrendingUp className="w-3 h-3" />
              <span>+12% vs last month</span>
            </div>
          </div>

          {/* Active Coolers */}
          <div className="bg-background border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Active Coolers</span>
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-3xl font-bold">142</div>
            <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
              <TrendingUp className="w-3 h-3" />
              <span>91% uptime</span>
            </div>
          </div>

          {/* Avg ROI */}
          <div className="bg-background border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Avg ROI</span>
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-3xl font-bold">23.4%</div>
            <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
              <TrendingUp className="w-3 h-3" />
              <span>+5.2% vs target</span>
            </div>
          </div>

          {/* Revenue Impact */}
          <div className="bg-background border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Revenue Impact</span>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-3xl font-bold">R 1.2M</div>
            <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
              <TrendingUp className="w-3 h-3" />
              <span>+18% vs last month</span>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Performance Chart */}
          <div className="bg-background border rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-4">Sales Performance Over Time</h3>
            <div className="h-64 relative">
              {/* Y-axis labels */}
              <div className="absolute -left-2 top-0 bottom-12 flex flex-col justify-between text-xs text-muted-foreground">
                <span>R100K</span>
                <span>R75K</span>
                <span>R50K</span>
                <span>R25K</span>
                <span>R0</span>
              </div>
              
              {/* Chart area with border */}
              <div className="ml-12 mr-4 h-[calc(100%-3rem)] border-b-2 border-l-2 border-muted relative">
                {/* Horizontal grid lines */}
                <div className="absolute inset-0">
                  <div className="absolute top-0 left-0 right-0 border-t border-muted/30"></div>
                  <div className="absolute top-1/4 left-0 right-0 border-t border-muted/30"></div>
                  <div className="absolute top-1/2 left-0 right-0 border-t border-muted/30"></div>
                  <div className="absolute top-3/4 left-0 right-0 border-t border-muted/30"></div>
                </div>

                {/* Installation marker line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-blue-400 opacity-30"></div>
                <div className="absolute left-1/2 -top-6 text-xs text-blue-600 font-medium bg-background px-2" style={{ transform: 'translateX(-50%)' }}>
                  ↓ Installation
                </div>

                {/* Line chart */}
                <svg className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
                  {/* Before Installation Line (Red/Orange - relatively flat) */}
                  <polyline
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3"
                    vectorEffect="non-scaling-stroke"
                    points="0,160 8.33,155 16.66,158 25,152 33.33,150 41.66,148 50,145"
                  />
                  {/* Before Installation Dots */}
                  {[[0,160], [8.33,155], [16.66,158], [25,152], [33.33,150], [41.66,148], [50,145]].map(([x, y], i) => (
                    <circle key={`before-${i}`} cx={`${x}%`} cy={y} r="4" fill="#f59e0b" stroke="#fff" strokeWidth="2" />
                  ))}

                  {/* After Installation Line (Green - upward trend) */}
                  <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    vectorEffect="non-scaling-stroke"
                    points="50,145 58.33,120 66.66,100 75,75 83.33,55 91.66,35 100,20"
                  />
                  {/* After Installation Dots */}
                  {[[50,145], [58.33,120], [66.66,100], [75,75], [83.33,55], [91.66,35], [100,20]].map(([x, y], i) => (
                    <circle key={`after-${i}`} cx={`${x}%`} cy={y} r="4" fill="#10b981" stroke="#fff" strokeWidth="2" />
                  ))}
                </svg>
              </div>
              
              {/* X-axis labels */}
              <div className="ml-12 mr-4 flex justify-between mt-2">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, index) => (
                  <span key={index} className="text-xs text-muted-foreground">{month}</span>
                ))}
              </div>
            </div>
            
            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-amber-500"></div>
                <span className="text-sm">Before Installation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-green-500"></div>
                <span className="text-sm">After Installation</span>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mt-4">
              Sales revenue comparison showing ~150% increase after cooler installation (Jun onwards)
            </p>
          </div>

          {/* Cooler Status Distribution */}
          <div className="bg-background border rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-4">Cooler Status Distribution</h3>
            <div className="flex items-center justify-center h-64">
              <div className="relative w-48 h-48">
                {/* Donut Chart - simplified representation */}
                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" strokeWidth="20"/>
                  <circle 
                    cx="50" cy="50" r="40" 
                    fill="none" 
                    stroke="#10b981" 
                    strokeWidth="20"
                    strokeDasharray="226 251"
                    className="transition-all"
                  />
                  <circle 
                    cx="50" cy="50" r="40" 
                    fill="none" 
                    stroke="#ef4444" 
                    strokeWidth="20"
                    strokeDasharray="25 251"
                    strokeDashoffset="-226"
                    className="transition-all"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">91%</span>
                  <span className="text-xs text-muted-foreground">Active</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm">Active (142)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm">Alert (14)</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Real-time status monitoring across all deployed coolers
            </p>
          </div>

          {/* Deployment Timeline */}
          <div className="bg-background border rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold text-lg mb-4">Deployment Timeline</h3>
            <div className="space-y-4 h-64 overflow-y-auto">
              {[
                { phase: 'Phase 1', coolers: 50, status: 'Completed', date: 'Q1 2025', color: 'text-green-600' },
                { phase: 'Phase 2', coolers: 75, status: 'Completed', date: 'Q2 2025', color: 'text-green-600' },
                { phase: 'Phase 3', coolers: 100, status: 'In Progress', date: 'Q3 2025', color: 'text-blue-600' },
                { phase: 'Phase 4', coolers: 150, status: 'Planned', date: 'Q4 2025', color: 'text-muted-foreground' },
                { phase: 'Phase 5', coolers: 200, status: 'Planned', date: 'Q1 2026', color: 'text-muted-foreground' },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className={`flex-shrink-0 w-24 text-sm font-medium ${item.color}`}>
                    {item.phase}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium">{item.coolers} coolers</span>
                      <span className="text-muted-foreground">{item.date}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${
                          item.status === 'Completed' ? 'bg-green-500' :
                          item.status === 'In Progress' ? 'bg-blue-500' :
                          'bg-gray-300'
                        }`}
                        style={{ 
                          width: item.status === 'Completed' ? '100%' : 
                                 item.status === 'In Progress' ? '60%' : '0%' 
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Strategic rollout plan for cooler deployment across regions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
