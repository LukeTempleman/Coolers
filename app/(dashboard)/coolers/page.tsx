"use client";
import React, { useState, useMemo } from "react";
import { mockCoolers } from "@/app/lib/mockCoolers";
import dynamic from 'next/dynamic';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { KpiCard } from '@/components/dashboard/kpi/KpiCard';
import { CoolerStatusEnum } from '@/app/lib/constants';
import { User, Cpu, AlertTriangle, CheckCircle, Filter, Search } from 'lucide-react';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const TABS = ["Map View", "List View"];

const DynamicCoolersMap = dynamic(() => import('@/components/CoolersMap'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] flex items-center justify-center bg-muted rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    </div>
  )
});

const DynamicCoolerLocationMap = dynamic(() => import('@/components/CoolersMap'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    </div>
  )
});

export default function CoolersPage() {
  const [tab, setTab] = useState(0);
  const [selectedCooler, setSelectedCooler] = useState<typeof mockCoolers[0] | null>(null);
  
  // Filter states
  const [locationFilter, setLocationFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [coolerTypeFilter, setCoolerTypeFilter] = useState<string>("all");
  const [searchInput, setSearchInput] = useState("");

  console.log('CoolersPage - tab:', tab);
  console.log('CoolersPage - mockCoolers count:', mockCoolers.length);

  // Filter coolers based on current filters
  const filteredCoolers = useMemo(() => {
    return mockCoolers.filter(cooler => {
      // Status filter
      if (statusFilter !== "all" && cooler.status !== statusFilter) {
        return false;
      }
      
      // Cooler type filter
      if (coolerTypeFilter !== "all") {
        const coolerType = cooler.coolerModel.toLowerCase().includes('double') ? 'double-door' : 
                          cooler.coolerModel.toLowerCase().includes('single') ? 'single-door' : 
                          cooler.coolerModel.toLowerCase().includes('compact') ? 'compact' : 'standard';
        
        if (coolerType !== coolerTypeFilter) {
          return false;
        }
      }
      
      // Location filter (search in city, province, or country)
      if (locationFilter.trim() !== "") {
        const searchTerm = locationFilter.toLowerCase();
        const locationMatch = 
          cooler.location.city.toLowerCase().includes(searchTerm) ||
          cooler.location.province.toLowerCase().includes(searchTerm) ||
          cooler.location.country.toLowerCase().includes(searchTerm) ||
          cooler.name.toLowerCase().includes(searchTerm) ||
          (cooler._id && cooler._id.toLowerCase().includes(searchTerm));
        
        if (!locationMatch) {
          return false;
        }
      }
      
      return true;
    });
  }, [statusFilter, coolerTypeFilter, locationFilter]);

  // Calculate cooler status counts from filtered data
  const activeCount = filteredCoolers.filter(cooler => cooler.status === CoolerStatusEnum.Active).length;
  const assignedCount = filteredCoolers.filter(cooler => cooler.status === CoolerStatusEnum.Assigned).length;
  const alertCount = filteredCoolers.filter(cooler => cooler.status === CoolerStatusEnum.Alert).length;
  const totalCount = filteredCoolers.length;

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="flex flex-col gap-4 p-4">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-4 p-4 bg-background border rounded-lg">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters:</span>
              </div>
              
              {/* Search Input */}
              <div className="flex items-center">
                <Input
                  placeholder="Search coolers, locations..."
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value);
                    setLocationFilter(e.target.value);
                  }}
                  className="w-64 rounded-l-lg rounded-r-none border-r-0"
                />
                <Button
                  variant="outline"
                  className="rounded-r-lg rounded-l-none border-l-0"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>

              {/* Status Filter */}
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value={CoolerStatusEnum.Active}>Active</SelectItem>
                  <SelectItem value={CoolerStatusEnum.Assigned}>Assigned</SelectItem>
                  <SelectItem value={CoolerStatusEnum.Alert}>Alert</SelectItem>
                  <SelectItem value={CoolerStatusEnum.Maintenance}>Maintenance</SelectItem>
                  <SelectItem value={CoolerStatusEnum.Idle}>Idle</SelectItem>
                  <SelectItem value={CoolerStatusEnum.Decommissioned}>Decommissioned</SelectItem>
                </SelectContent>
              </Select>

              {/* Cooler Type Filter */}
              <Select
                value={coolerTypeFilter}
                onValueChange={(value) => setCoolerTypeFilter(value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by cooler type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="single-door">Single Door</SelectItem>
                  <SelectItem value="double-door">Double Door</SelectItem>
                  <SelectItem value="compact">Compact</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              {(statusFilter !== "all" || coolerTypeFilter !== "all" || locationFilter !== "") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setStatusFilter("all");
                    setCoolerTypeFilter("all");
                    setLocationFilter("");
                    setSearchInput("");
                  }}
                >
                  Clear Filters
                </Button>
              )}

              {/* Results Count */}
              <div className="text-sm text-muted-foreground ml-auto">
                Showing {totalCount} of {mockCoolers.length} coolers
              </div>
            </div>

            {/* Dashboard KPI Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <KpiCard
                title="Total Coolers"
                value={totalCount}
                icon={<Cpu size={20} />}
                subtitle="All coolers in system"
              />
              <KpiCard
                title="Active Coolers"
                value={activeCount}
                icon={<CheckCircle size={20} />}
                subtitle="Deployed and operational"
              />
              <KpiCard
                title="Assigned but Not Activated"
                value={assignedCount}
                icon={<User size={20} />}
                subtitle="Allocated but not delivered"
                className="border-amber-200 bg-amber-50"
              />
              <KpiCard
                title="Alert Coolers"
                value={alertCount}
                icon={<AlertTriangle size={20} />}
                subtitle="Requiring attention"
                className="border-red-200 bg-red-50"
              />
            </div>
      {/* Tabs for view switching */}
      <div className="flex gap-2 mb-4">
        {TABS.map((label, idx) => (
          <button
            key={label}
            className={`px-4 py-2 rounded border ${tab === idx ? 'bg-primary text-white' : 'bg-background text-foreground'}`}
            onClick={() => setTab(idx)}
          >
            {label}
          </button>
        ))}
      </div>
      {/* Main content: Map or List */}
      {tab === 0 ? (
        <DynamicCoolersMap coolers={filteredCoolers} />
      ) : (
        <div className="w-full overflow-x-auto bg-background rounded-lg border p-4">
          <h2 className="text-lg font-semibold mb-4">Coolers List ({filteredCoolers.length} total)</h2>
          <table className="w-full text-sm border rounded">
            <thead>
              <tr className="bg-muted">
                <th className="p-3 text-left font-semibold">Serial Number</th>
                <th className="p-3 text-left font-semibold">Name</th>
                <th className="p-3 text-left font-semibold">Type</th>
                <th className="p-3 text-left font-semibold">Status</th>
                <th className="p-3 text-left font-semibold">City</th>
                <th className="p-3 text-left font-semibold">Province</th>
                <th className="p-3 text-left font-semibold">Country</th>
                <th className="p-3 text-left font-semibold">Coordinates</th>
                <th className="p-3 text-left font-semibold">Installed</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoolers.map(cooler => {
                // Determine cooler type
                const coolerType = cooler.coolerModel.toLowerCase().includes('double') ? 'Double Door' : 
                                 cooler.coolerModel.toLowerCase().includes('single') ? 'Single Door' : 
                                 cooler.coolerModel.toLowerCase().includes('compact') ? 'Compact' : 'Standard';
                
                return (
                  <tr 
                    key={cooler._id || cooler.name} 
                    className="border-b hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedCooler(cooler)}
                  >
                    <td className="p-3 font-mono text-xs font-semibold">{cooler._id}</td>
                    <td className="p-3 font-medium">{cooler.name}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800 font-medium">
                        {coolerType}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        cooler.status === CoolerStatusEnum.Active ? 'bg-green-100 text-green-800' :
                        cooler.status === CoolerStatusEnum.Assigned ? 'bg-amber-100 text-amber-800' :
                        cooler.status === CoolerStatusEnum.Alert ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {cooler.status}
                      </span>
                    </td>
                    <td className="p-3">{cooler.location.city}</td>
                    <td className="p-3">{cooler.location.province}</td>
                    <td className="p-3">{cooler.location.country}</td>
                    <td className="p-3 font-mono text-xs">
                      {cooler.location.coordinates[1].toFixed(4)}, {cooler.location.coordinates[0].toFixed(4)}
                    </td>
                    <td className="p-3 text-xs text-muted-foreground">
                      {cooler.createdAt ? new Date(cooler.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

            {/* Cooler Details Modal */}
            <Dialog open={!!selectedCooler} onOpenChange={(open) => !open && setSelectedCooler(null)}>
              <DialogContent className="!max-w-[98vw] !w-[98vw] h-[92vh] max-h-[950px] p-4">
                <DialogHeader className="pb-4">
                  <DialogTitle>Cooler Details - {selectedCooler?.name}</DialogTitle>
                  <DialogDescription>
                    Complete information and customer contract for this cooler
                  </DialogDescription>
                </DialogHeader>
                {selectedCooler && (
                  <Tabs defaultValue="location" className="w-full flex-1 flex flex-col overflow-hidden">
                    <TabsList className="grid w-full grid-cols-3 shrink-0">
                      <TabsTrigger value="location">Location & Details</TabsTrigger>
                      <TabsTrigger value="contract" disabled={!selectedCooler.customerContract}>
                        Customer Contract
                        {!selectedCooler.customerContract && <span className="ml-1 text-xs">(N/A)</span>}
                      </TabsTrigger>
                      <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="location" className="flex-1 mt-4 overflow-hidden">
                      <div className="flex flex-col gap-4 h-full">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm shrink-0">
                          <div>
                            <span className="font-semibold">Serial Number:</span> 
                            <p className="font-mono text-xs">{selectedCooler._id}</p>
                          </div>
                          <div>
                            <span className="font-semibold">Status:</span>{' '}
                            <div className="mt-1">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                selectedCooler.status === CoolerStatusEnum.Active ? 'bg-green-100 text-green-800' :
                                selectedCooler.status === CoolerStatusEnum.Assigned ? 'bg-amber-100 text-amber-800' :
                                selectedCooler.status === CoolerStatusEnum.Alert ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {selectedCooler.status}
                              </span>
                            </div>
                          </div>
                          <div>
                            <span className="font-semibold">Model:</span> 
                            <p className="text-sm">{selectedCooler.coolerModel}</p>
                          </div>
                          <div>
                            <span className="font-semibold">Temperature:</span> 
                            <p className="text-sm">{selectedCooler.temperature}°C</p>
                          </div>
                          <div>
                            <span className="font-semibold">City:</span> 
                            <p className="text-sm">{selectedCooler.location.city}</p>
                          </div>
                          <div>
                            <span className="font-semibold">Province:</span> 
                            <p className="text-sm">{selectedCooler.location.province}</p>
                          </div>
                          <div>
                            <span className="font-semibold">Country:</span> 
                            <p className="text-sm">{selectedCooler.location.country}</p>
                          </div>
                          <div>
                            <span className="font-semibold">Coordinates:</span> 
                            <p className="text-xs font-mono">
                              {selectedCooler.location.coordinates[1].toFixed(4)}, {selectedCooler.location.coordinates[0].toFixed(4)}
                            </p>
                          </div>
                        </div>
                        <div className="border rounded bg-muted p-2 flex-1 min-h-[500px] overflow-hidden">
                          <DynamicCoolerLocationMap coolers={[selectedCooler]} />
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="contract" className="flex-1 mt-4 overflow-auto">
                      {selectedCooler.customerContract ? (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full p-2">
                          {/* Customer Information */}
                          <Card className="flex flex-col">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg">Customer Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 flex-1">
                              <div>
                                <span className="font-semibold text-sm">Name:</span>
                                <p className="text-sm mt-1">{selectedCooler.customerContract.customerName}</p>
                              </div>
                              <div>
                                <span className="font-semibold text-sm">Email:</span>
                                <p className="text-sm mt-1 break-all">{selectedCooler.customerContract.customerEmail}</p>
                              </div>
                              <div>
                                <span className="font-semibold text-sm">Phone:</span>
                                <p className="text-sm mt-1">{selectedCooler.customerContract.customerPhone}</p>
                              </div>
                              <div>
                                <span className="font-semibold text-sm">Billing Address:</span>
                                <p className="text-sm mt-1 leading-relaxed">
                                  {selectedCooler.customerContract.billingAddress.street}<br />
                                  {selectedCooler.customerContract.billingAddress.city}, {selectedCooler.customerContract.billingAddress.province}<br />
                                  {selectedCooler.customerContract.billingAddress.postalCode}<br />
                                  {selectedCooler.customerContract.billingAddress.country}
                                </p>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Contract Details */}
                          <Card className="flex flex-col">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg">Contract Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 flex-1">
                              <div>
                                <span className="font-semibold text-sm">Contract Number:</span>
                                <p className="text-sm font-mono mt-1">{selectedCooler.customerContract.contractNumber}</p>
                              </div>
                              <div>
                                <span className="font-semibold text-sm">Status:</span>
                                <div className="mt-1">
                                  <Badge variant={selectedCooler.customerContract.contractStatus === 'Active' ? 'default' : 'secondary'}>
                                    {selectedCooler.customerContract.contractStatus}
                                  </Badge>
                                </div>
                              </div>
                              <div>
                                <span className="font-semibold text-sm">Service Level:</span>
                                <div className="mt-1">
                                  <Badge variant="outline">
                                    {selectedCooler.customerContract.serviceLevel}
                                  </Badge>
                                </div>
                              </div>
                              <div>
                                <span className="font-semibold text-sm">Contract Period:</span>
                                <p className="text-sm mt-1">
                                  {new Date(selectedCooler.customerContract.contractStartDate).toLocaleDateString()} - {new Date(selectedCooler.customerContract.contractEndDate).toLocaleDateString()}
                                </p>
                              </div>
                              <div>
                                <span className="font-semibold text-sm">Monthly Fee:</span>
                                <p className="text-sm font-semibold text-green-600 mt-1">R{selectedCooler.customerContract.monthlyFee.toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="font-semibold text-sm">Deposit Amount:</span>
                                <p className="text-sm mt-1">R{selectedCooler.customerContract.depositAmount.toLocaleString()}</p>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Payment Information */}
                          <Card className="flex flex-col">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg">Payment Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 flex-1">
                              <div>
                                <span className="font-semibold text-sm">Payment Method:</span>
                                <p className="text-sm mt-1">{selectedCooler.customerContract.paymentMethod}</p>
                              </div>
                              {selectedCooler.customerContract.lastPaymentDate && (
                                <div>
                                  <span className="font-semibold text-sm">Last Payment:</span>
                                  <p className="text-sm mt-1">{new Date(selectedCooler.customerContract.lastPaymentDate).toLocaleDateString()}</p>
                                </div>
                              )}
                              {selectedCooler.customerContract.nextPaymentDate && (
                                <div>
                                  <span className="font-semibold text-sm">Next Payment Due:</span>
                                  <p className="text-sm mt-1 font-medium text-amber-600">{new Date(selectedCooler.customerContract.nextPaymentDate).toLocaleDateString()}</p>
                                </div>
                              )}
                            </CardContent>
                          </Card>

                          {/* Contract Actions */}
                          <Card className="flex flex-col">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-lg">Contract Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1">
                              <div className="grid grid-cols-1 gap-3">
                                <Button variant="outline" size="sm" className="h-10">
                                  Download Contract PDF
                                </Button>
                                <Button variant="outline" size="sm" className="h-10">
                                  Send Contract Copy
                                </Button>
                                <Button variant="outline" size="sm" className="h-10">
                                  Payment History
                                </Button>
                                <Button variant="outline" size="sm" className="h-10">
                                  Modify Contract
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <p className="text-muted-foreground">No customer contract available for this cooler.</p>
                            <p className="text-sm text-muted-foreground mt-2">
                              This cooler may be unassigned or awaiting contract setup.
                            </p>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="maintenance" className="flex-1 mt-4 overflow-auto">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full p-2">
                        <Card className="flex flex-col">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Maintenance History</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3 flex-1">
                            <div>
                              <span className="font-semibold text-sm">Last Service:</span> 
                              <p className="text-sm mt-1">{selectedCooler.lastServiceDate ? new Date(selectedCooler.lastServiceDate).toLocaleDateString() : 'N/A'}</p>
                            </div>
                            <div>
                              <span className="font-semibold text-sm">Humidity:</span> 
                              <p className="text-sm mt-1">{selectedCooler.humidity}%</p>
                            </div>
                            <div>
                              <span className="font-semibold text-sm">Current Temperature:</span> 
                              <p className="text-sm mt-1">{selectedCooler.temperature}°C</p>
                            </div>
                            <div>
                              <span className="font-semibold text-sm">Service Status:</span> 
                              <div className="mt-1">
                                <Badge variant={selectedCooler.status === CoolerStatusEnum.Maintenance ? 'destructive' : 'default'}>
                                  {selectedCooler.status === CoolerStatusEnum.Maintenance ? 'Needs Maintenance' : 'Operational'}
                                </Badge>
                              </div>
                            </div>
                            <div>
                              <span className="font-semibold text-sm">Next Scheduled Service:</span> 
                              <p className="text-sm mt-1 text-amber-600 font-medium">
                                {selectedCooler.lastServiceDate 
                                  ? new Date(new Date(selectedCooler.lastServiceDate).getTime() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString()
                                  : 'Not scheduled'
                                }
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card className="flex flex-col">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Schedule Maintenance</CardTitle>
                          </CardHeader>
                          <CardContent className="flex-1">
                            <div className="space-y-3">
                              <Button variant="outline" size="sm" className="w-full h-10">
                                Schedule Routine Service
                              </Button>
                              <Button variant="outline" size="sm" className="w-full h-10">
                                Request Emergency Service
                              </Button>
                              <Button variant="outline" size="sm" className="w-full h-10">
                                View Service Reports
                              </Button>
                              <Button variant="outline" size="sm" className="w-full h-10">
                                Download Maintenance Log
                              </Button>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Service History */}
                        <Card className="flex flex-col lg:col-span-2">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Recent Service History</CardTitle>
                          </CardHeader>
                          <CardContent className="flex-1">
                            <div className="space-y-3">
                              <div className="border rounded p-3 bg-muted/30">
                                <div className="flex justify-between items-start mb-2">
                                  <span className="font-semibold text-sm">Routine Maintenance</span>
                                  <Badge variant="outline">Completed</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Date: {selectedCooler.lastServiceDate ? new Date(selectedCooler.lastServiceDate).toLocaleDateString() : 'N/A'}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Technician: John Smith | Duration: 2.5 hours
                                </p>
                                <p className="text-sm mt-2">
                                  Standard cleaning, temperature calibration, and component inspection completed successfully.
                                </p>
                              </div>
                              
                              <div className="border rounded p-3 bg-muted/30">
                                <div className="flex justify-between items-start mb-2">
                                  <span className="font-semibold text-sm">Component Replacement</span>
                                  <Badge variant="outline">Completed</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Date: {selectedCooler.lastServiceDate 
                                    ? new Date(new Date(selectedCooler.lastServiceDate).getTime() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
                                    : 'N/A'
                                  }
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Technician: Sarah Johnson | Duration: 1.5 hours
                                </p>
                                <p className="text-sm mt-2">
                                  Replaced faulty temperature sensor. System now operating within normal parameters.
                                </p>
                              </div>

                              <div className="border rounded p-3 bg-muted/30">
                                <div className="flex justify-between items-start mb-2">
                                  <span className="font-semibold text-sm">Installation Check</span>
                                  <Badge variant="outline">Completed</Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  Date: {selectedCooler.createdAt ? new Date(selectedCooler.createdAt).toLocaleDateString() : 'N/A'}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Technician: Mike Wilson | Duration: 3 hours
                                </p>
                                <p className="text-sm mt-2">
                                  Initial installation and setup completed. All systems tested and operational.
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                  </Tabs>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
