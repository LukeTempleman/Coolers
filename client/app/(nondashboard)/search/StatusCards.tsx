"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CoolerStatusEnum, CoolerStatusIcons } from "@/app/lib/constants";
import { Badge } from "@/components/ui/badge";
import { useGetCoolerStatusCountsQuery } from "@/app/state/api";
import { useAppSelector } from "@/app/state/redux";

const StatusCards: React.FC = () => {
  const filters = useAppSelector((state) => state.global.filters);
  
  // Temporarily use empty filters to test basic functionality
  const {
    data: statusData,
    isLoading,
    isError,
    error,
  } = useGetCoolerStatusCountsQuery({});

  console.log('StatusCards - filters:', filters);
  console.log('StatusCards - statusData:', statusData);
  console.log('StatusCards - isLoading:', isLoading);
  console.log('StatusCards - isError:', isError);
  console.log('StatusCards - error:', error);

  const getStatusColor = (status: CoolerStatusEnum) => {
    switch (status) {
      case CoolerStatusEnum.Active:
        return "bg-green-100 text-green-800 border-green-200";
      case CoolerStatusEnum.Alert:
        return "bg-red-100 text-red-800 border-red-200";
      case CoolerStatusEnum.Maintenance:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case CoolerStatusEnum.Idle:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case CoolerStatusEnum.Decommissioned:
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPercentage = (count: number, total: number) => {
    return total > 0 ? ((count / total) * 100).toFixed(1) : "0.0";
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-24 bg-gray-200 animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (isError || !statusData) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="text-red-600 text-sm">Failed to load status counts</div>
      </div>
    );
  }

  const { statusCounts, total } = statusData;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {Object.values(CoolerStatusEnum).map((status) => {
        const count = statusCounts[status] || 0;
        const percentage = getPercentage(count, total);
        const StatusIcon = CoolerStatusIcons[status];
        const colorClass = getStatusColor(status);

        return (
          <Card key={status} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {status}
              </CardTitle>
              <StatusIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{count}</div>
              <div className="flex items-center justify-between mt-2">
                <Badge variant="outline" className={`text-xs ${colorClass}`}>
                  {percentage}%
                </Badge>
                <p className="text-xs text-muted-foreground">
                  of total
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatusCards;
