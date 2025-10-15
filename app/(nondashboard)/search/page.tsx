"use client";

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/app/state/redux';
import React, { useEffect } from 'react';
import FiltersBar from './FiltersBar';
import FiltersFull from './FiltersFull';
import { cleanParams } from '@/app/lib/utils';
import { setFilters } from '@/app/state';
import Map from './Map';
import List from './List';
import { useState } from 'react';
import StatusCards from './StatusCards';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { SiteHeader } from '@/components/site-header';

const REQUIRED_FILTER_KEYS = ["merchant", "status", "coolerModel", "coordinates", "location"];

function SearchPageContent() {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const isFiltersFullOpen = useAppSelector((state) => state.global.isFiltersFullOpen);
  const [tab, setTab] = useState<'map' | 'list'>('map');

  useEffect(() => {
    const initialFilters = Array.from(searchParams.entries())
      .filter(([key]) => REQUIRED_FILTER_KEYS.includes(key))
      .reduce((acc: any, [key, value]) => {
        if (key === "coordinates") {
          acc[key] = value.split(",").map(Number);
        } else {
          acc[key] = value === "any" ? null : value;
        }
        return acc;
      }, {});

    const cleanedFilters = cleanParams(initialFilters);
    dispatch(setFilters(cleanedFilters));
  }, [searchParams, dispatch]);

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className='@container/main flex flex-1 flex-col gap-2'>
            <FiltersBar />
            {/* ...existing code... */}
            {/* Tab Switcher */}
            <div className="flex gap-2 px-4 mb-4">
              <button
                className={`px-4 py-2 rounded border ${tab === 'map' ? 'bg-primary text-white' : 'bg-background text-foreground'}`}
                onClick={() => setTab('map')}
              >
                Map View
              </button>
              <button
                className={`px-4 py-2 rounded border ${tab === 'list' ? 'bg-primary text-white' : 'bg-background text-foreground'}`}
                onClick={() => setTab('list')}
              >
                List View
              </button>
            </div>
            {/* Main content: Map or List */}
            <div className='flex flex-1 overflow-hidden gap-3 mb-5'>
              <div className={`h-full overflow-auto transition-all duration-300 ease-in-out 
                ${isFiltersFullOpen ? "w-3/12 opacity-100 visible" : "w-0 opacity-0 invisible"}`}>
                <FiltersFull />
              </div>
              {tab === 'map' ? (
                <div className='flex-1'><Map /></div>
              ) : (
                <div className='flex-1 overflow-y-auto'><List /></div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading search...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}