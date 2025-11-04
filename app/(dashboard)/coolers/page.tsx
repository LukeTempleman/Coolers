"use client";
import React, { useState, useMemo, useRef } from "react";
import { mockCoolers } from "@/app/lib/mockCoolers";
import dynamic from 'next/dynamic';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { KpiCard } from '@/components/dashboard/kpi/KpiCard';
import { CoolerStatusEnum } from '@/app/lib/constants';
import { User, Cpu, AlertTriangle, CheckCircle, Filter, Search, Upload, X, FileText } from 'lucide-react';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
  
  // PDF upload state
  const [uploadedPdf, setUploadedPdf] = useState<{ file: File; url: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
                    <TabsList className="grid w-full grid-cols-2 shrink-0">
                      <TabsTrigger value="location">Location & Details</TabsTrigger>
                      <TabsTrigger value="contract">
                        Customer Contract
                      </TabsTrigger>
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
                          <div>
                            <span className="font-semibold">Last Service Date:</span> 
                            <p className="text-sm">{selectedCooler.lastServiceDate ? new Date(selectedCooler.lastServiceDate).toLocaleDateString() : 'N/A'}</p>
                          </div>
                          <div>
                            <span className="font-semibold">Next Service Due:</span> 
                            <p className="text-sm text-amber-600 font-medium">
                              {selectedCooler.lastServiceDate 
                                ? new Date(new Date(selectedCooler.lastServiceDate).getTime() + 90 * 24 * 60 * 60 * 1000).toLocaleDateString()
                                : 'Not scheduled'
                              }
                            </p>
                          </div>
                        </div>
                        <div className="border rounded bg-muted p-2 flex-1 min-h-[500px] overflow-hidden">
                          <DynamicCoolerLocationMap coolers={[selectedCooler]} />
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="contract" className="flex-1 mt-4 overflow-auto">
                      <div className="h-full flex flex-col p-2">
                        <Card className="flex-1">
                          <CardHeader>
                            <CardTitle className="text-lg">Customer Contract PDF</CardTitle>
                            <CardDescription>
                              Upload and view the customer contract document
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="flex-1">
                            {!uploadedPdf ? (
                              <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg bg-muted/10 h-full min-h-[400px]">
                                <input
                                  ref={fileInputRef}
                                  type="file"
                                  accept="application/pdf"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file && file.type === 'application/pdf') {
                                      const url = URL.createObjectURL(file);
                                      setUploadedPdf({ file, url });
                                    } else if (file) {
                                      alert('Please upload a PDF file');
                                    }
                                  }}
                                  className="hidden"
                                />
                                <div className="text-center">
                                  <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                                  <h3 className="text-lg font-semibold mb-2">Upload Contract PDF</h3>
                                  <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                                    Click the button below to select a PDF file from your device
                                  </p>
                                  <Button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="gap-2"
                                  >
                                    <Upload className="w-4 h-4" />
                                    Choose PDF File
                                  </Button>
                                  <p className="text-xs text-muted-foreground mt-4">
                                    Supported format: PDF • Max size: 10MB
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col h-full min-h-[600px]">
                                <div className="flex items-center justify-between mb-4 p-3 bg-muted rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-primary" />
                                    <div>
                                      <p className="font-medium text-sm">{uploadedPdf.file.name}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {(uploadedPdf.file.size / 1024 / 1024).toFixed(2)} MB
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => fileInputRef.current?.click()}
                                      className="gap-2"
                                    >
                                      <Upload className="w-4 h-4" />
                                      Replace
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        URL.revokeObjectURL(uploadedPdf.url);
                                        setUploadedPdf(null);
                                      }}
                                      className="gap-2"
                                    >
                                      <X className="w-4 h-4" />
                                      Remove
                                    </Button>
                                  </div>
                                </div>
                                <div className="flex-1 border rounded-lg overflow-hidden bg-muted/20">
                                  <iframe
                                    src={uploadedPdf.url}
                                    className="w-full h-full min-h-[500px]"
                                    title="Contract PDF"
                                  />
                                </div>
                                <input
                                  ref={fileInputRef}
                                  type="file"
                                  accept="application/pdf"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file && file.type === 'application/pdf') {
                                      if (uploadedPdf) {
                                        URL.revokeObjectURL(uploadedPdf.url);
                                      }
                                      const url = URL.createObjectURL(file);
                                      setUploadedPdf({ file, url });
                                    } else if (file) {
                                      alert('Please upload a PDF file');
                                    }
                                  }}
                                  className="hidden"
                                />
                              </div>
                            )}
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
