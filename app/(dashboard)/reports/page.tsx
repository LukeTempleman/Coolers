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
  Clock,
  Building,
  BarChart3,
  Info,
  MessageCircle,
  Send,
  Bot,
  HelpCircle
} from 'lucide-react';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { SiteHeader } from '@/components/site-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const [chatMessages, setChatMessages] = React.useState<Array<{
    id: number;
    type: 'user' | 'bot';
    content: string;
    timestamp: Date;
  }>>([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your AI assistant for cooler analytics. I can help you understand your reports and provide insights about your cooler fleet. Ask me anything!',
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = React.useState('');
  const [isTyping, setIsTyping] = React.useState(false);

  // Predefined questions and answers
  const predefinedQA = {
    "What's our current deployment rate?": `Your current deployment rate is ${((mockCoolers.filter(c => c.status === CoolerStatusEnum.Active).length / mockCoolers.length) * 100).toFixed(1)}%. You have ${mockCoolers.filter(c => c.status === CoolerStatusEnum.Active).length} active coolers out of ${mockCoolers.length} total units.`,
    
    "Which provinces have the most coolers?": () => {
      const provinces = mockCoolers.reduce((acc, cooler) => {
        acc[cooler.location.province] = (acc[cooler.location.province] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const sorted = Object.entries(provinces).sort(([,a], [,b]) => b - a);
      const top3 = sorted.slice(0, 3);
      return `The top 3 provinces by cooler count are: ${top3.map(([province, count]) => `${province} (${count} coolers)`).join(', ')}.`;
    },
    
    "How many coolers need maintenance?": `Currently, ${mockCoolers.filter(c => c.status === CoolerStatusEnum.Maintenance).length} coolers are under maintenance, and ${mockCoolers.filter(c => c.status === CoolerStatusEnum.Alert).length} coolers have alerts that may require attention.`,
    
    "What's our monthly revenue estimate?": () => {
      const activeContracts = mockCoolers.filter(c => c.customerContract?.contractStatus === 'Active');
      const monthlyRevenue = activeContracts.reduce((sum, cooler) => sum + (cooler.customerContract?.monthlyFee || 0), 0);
      return `Based on active contracts, your estimated monthly revenue is R${monthlyRevenue.toLocaleString()}. This comes from ${activeContracts.length} active contracts.`;
    },
    
    "What's the average temperature across all coolers?": () => {
      const coolersWithTemp = mockCoolers.filter(c => c.temperature !== undefined);
      const avgTemp = coolersWithTemp.reduce((sum, cooler) => sum + (cooler.temperature || 0), 0) / coolersWithTemp.length;
      return `The average temperature across all coolers is ${avgTemp.toFixed(1)}°C. The recommended range is 2-8°C for optimal performance.`;
    },
    
    "How are our coolers distributed geographically?": () => {
      const cities = mockCoolers.reduce((acc, cooler) => {
        acc[cooler.location.city] = (acc[cooler.location.city] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const cityCount = Object.keys(cities).length;
      const provinceCount = new Set(mockCoolers.map(c => c.location.province)).size;
      return `Your coolers are deployed across ${cityCount} cities in ${provinceCount} provinces, providing excellent geographic coverage across South Africa.`;
    }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user' as const,
      content: chatInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Generate bot response
    setTimeout(() => {
      let botResponse = '';
      
      // Check for predefined questions
      const matchedQuestion = Object.keys(predefinedQA).find(q => 
        chatInput.toLowerCase().includes(q.toLowerCase().replace(/[?]/g, '').substring(0, 10))
      );

      if (matchedQuestion) {
        const answer = predefinedQA[matchedQuestion as keyof typeof predefinedQA];
        botResponse = typeof answer === 'function' ? answer() : answer;
      } else if (chatInput.toLowerCase().includes('help') || chatInput.toLowerCase().includes('what can you do')) {
        botResponse = 'I can help you with cooler analytics! Try asking about deployment rates, geographical distribution, maintenance status, revenue estimates, or temperature monitoring. Use the quick questions below for instant insights.';
      } else if (chatInput.toLowerCase().includes('revenue') || chatInput.toLowerCase().includes('money') || chatInput.toLowerCase().includes('profit')) {
        const activeContracts = mockCoolers.filter(c => c.customerContract?.contractStatus === 'Active');
        const monthlyRevenue = activeContracts.reduce((sum, cooler) => sum + (cooler.customerContract?.monthlyFee || 0), 0);
        botResponse = `Your financial performance looks strong! Monthly revenue: R${monthlyRevenue.toLocaleString()}, active contracts: ${activeContracts.length}, and an estimated annual revenue of R${(monthlyRevenue * 12).toLocaleString()}.`;
      } else if (chatInput.toLowerCase().includes('temperature') || chatInput.toLowerCase().includes('temp')) {
        const coolersWithTemp = mockCoolers.filter(c => c.temperature !== undefined);
        const avgTemp = coolersWithTemp.reduce((sum, cooler) => sum + (cooler.temperature || 0), 0) / coolersWithTemp.length;
        const alertCoolers = mockCoolers.filter(c => c.temperature && (c.temperature > 8 || c.temperature < 2));
        botResponse = `Temperature analysis: Average ${avgTemp.toFixed(1)}°C across all coolers. ${alertCoolers.length} coolers are outside the optimal 2-8°C range and may need attention.`;
      } else if (chatInput.toLowerCase().includes('maintenance') || chatInput.toLowerCase().includes('service')) {
        const maintenanceCoolers = mockCoolers.filter(c => c.status === CoolerStatusEnum.Maintenance);
        const alertCoolers = mockCoolers.filter(c => c.status === CoolerStatusEnum.Alert);
        botResponse = `Maintenance overview: ${maintenanceCoolers.length} coolers currently under maintenance, ${alertCoolers.length} with alerts. Consider scheduling preventive maintenance for optimal performance.`;
      } else if (chatInput.toLowerCase().includes('location') || chatInput.toLowerCase().includes('province') || chatInput.toLowerCase().includes('city')) {
        const provinces = new Set(mockCoolers.map(c => c.location.province)).size;
        const cities = new Set(mockCoolers.map(c => c.location.city)).size;
        botResponse = `Geographic distribution: ${cities} cities across ${provinces} provinces. Your largest deployments are in major metropolitan areas with strong market presence.`;
      } else {
        botResponse = 'I understand you\'re asking about cooler analytics. Could you be more specific? I can help with deployment rates, maintenance status, revenue analysis, temperature monitoring, or geographic distribution. Try one of the quick questions below!';
      }

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot' as const,
        content: botResponse,
        timestamp: new Date()
      };

      setIsTyping(false);
      setChatMessages(prev => [...prev, botMessage]);
    }, 1000);

    setChatInput('');
  };

  const quickQuestions = Object.keys(predefinedQA);

  // Auto-scroll to bottom when new messages are added
  React.useEffect(() => {
    const scrollToBottom = () => {
      // Method 1: Scroll using the messagesEndRef
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
      
      // Method 2: Fallback to ScrollArea approach
      if (scrollAreaRef.current) {
        const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollContainer) {
          setTimeout(() => {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
          }, 100);
        }
      }
    };
    
    scrollToBottom();
  }, [chatMessages, isTyping]);
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
                  title="Avg Service Time"
                  value={`${performanceMetrics.avgServiceTime}h`}
                  icon={<Clock size={20} />}
                  subtitle="Maintenance efficiency"
                  className="border-cyan-200 bg-cyan-50"
                  tooltip="Average time required to complete maintenance and service tasks"
                />
              </div>

              {/* Operational Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                <KpiCardWithTooltip
                  title="Under Maintenance"
                  value={kpis.maintenanceCoolers}
                  icon={<BarChart3 size={20} />}
                  subtitle="Service in progress"
                  className="border-violet-200 bg-violet-50"
                  tooltip="Number of coolers currently undergoing maintenance or repair work"
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

              {/* Status Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Cooler Status Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        Active
                      </span>
                      <span className="text-sm">{kpis.activeCoolers} units</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        Assigned
                      </span>
                      <span className="text-sm">{kpis.assignedCoolers} units</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        Alert
                      </span>
                      <span className="text-sm">{kpis.alertCoolers} units</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        Maintenance
                      </span>
                      <span className="text-sm">{kpis.maintenanceCoolers} units</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                        Idle
                      </span>
                      <span className="text-sm">{kpis.idleCoolers} units</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

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

            {/* AI Analytics Assistant */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  AI Analytics Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-[calc(100vh-300px)] overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                  {/* Quick Questions */}
                  <div className="lg:col-span-1">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <HelpCircle className="w-4 h-4" />
                      Quick Questions
                    </h4>
                    <div className="space-y-2 max-h-[500px] overflow-y-auto">
                      {quickQuestions.map((question, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="w-full text-left justify-start h-auto p-3 whitespace-normal"
                          onClick={() => {
                            setChatInput(question);
                            setTimeout(handleSendMessage, 100);
                          }}
                        >
                          {question}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Chat Interface */}
                  <div className="lg:col-span-2">
                    <div className="border rounded-lg flex flex-col h-[600px] max-h-[calc(100vh-200px)]">
                      {/* Chat Header */}
                      <div className="p-4 border-b bg-muted/50 flex items-center gap-2 shrink-0">
                        <MessageCircle className="w-4 h-4" />
                        <span className="font-medium">Chat with AI Assistant</span>
                      </div>

                      {/* Messages */}
                      <div className="flex-1 overflow-hidden">
                        <ScrollArea ref={scrollAreaRef} className="h-full p-4">
                          <div className="space-y-4 pb-4">
                            {chatMessages.map((message) => (
                              <div
                                key={message.id}
                                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                              >
                                <div
                                  className={`max-w-[80%] rounded-lg p-3 break-words ${
                                    message.type === 'user'
                                      ? 'bg-primary text-primary-foreground'
                                      : 'bg-muted'
                                  }`}
                                >
                                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                  <p className="text-xs opacity-70 mt-1">
                                    {message.timestamp.toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                            {isTyping && (
                              <div className="flex justify-start">
                                <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                                  <div className="flex items-center space-x-1">
                                    <div className="flex space-x-1">
                                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                    </div>
                                    <span className="text-xs text-muted-foreground ml-2">AI is thinking...</span>
                                  </div>
                                </div>
                              </div>
                            )}
                            {/* Invisible element to scroll to */}
                            <div ref={messagesEndRef} />
                          </div>
                        </ScrollArea>
                      </div>

                      {/* Input Area */}
                      <div className="p-4 border-t shrink-0">
                        <div className="flex gap-2">
                          <Input
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Ask about your cooler analytics..."
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            className="flex-1"
                            disabled={isTyping}
                          />
                          <Button onClick={handleSendMessage} size="sm" disabled={isTyping || !chatInput.trim()}>
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            </TooltipProvider>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}