/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppSelector } from '@/app/state/redux';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FiltersState, setFilters, setViewMode, toggleFiltersFullOpen } from '@/app/state';
// import { debounce } from 'lodash';
import { cleanParams, cn } from '@/app/lib/utils';
import { Button } from '@/components/ui/button';
import { Filter, Grid, List, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const FiltersBar = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname();
    const filters = useAppSelector((state) => state.global.filters);
    const isFiltersFullOpen = useAppSelector((state) => state.global.isFiltersFullOpen);
    const viewMode = useAppSelector((state) => state.global.viewMode);

    // State for search input
    const [searchInput, setSearchInput] = useState(filters.location);

  const updateURL = (newFilters: FiltersState) => {
    const cleanFilters = cleanParams(newFilters);
    const updatedSearchParams = new URLSearchParams();

    Object.entries(cleanFilters).forEach(([key, value]) => {
      updatedSearchParams.set(
        key,
        Array.isArray(value) ? value.join(",") : value.toString()
      );
    });

    console.log('Updating URL with:', newFilters);
    console.log('Cleaned filters:', cleanFilters);
    console.log('URL:', `${pathname}?${updatedSearchParams.toString()}`);

    router.push(`${pathname}?${updatedSearchParams.toString()}`);
  };
    // Handles all filter changes, coordinates, and "any" values
 const handleFilterChange = (
    key: string,
    value: any,
  ) => {
    let newValue = value;

    if (key === "coordinates") {
      newValue = value === "any" ? [0, 0] : value.map(Number);
    } else {
      newValue = value === "any" ? "any" : value;
    }

    const newFilters = { ...filters, [key]: newValue };
    
    // If merchant changes to "any", also reset cooler model to "any"
    if (key === "merchant" && value === "any") {
      newFilters.coolerModel = "any";
    }

    dispatch(setFilters(newFilters));
    updateURL(newFilters);
  };
    // Handle location search
      const handleLocationSearch = async () => {
        try {
          const response = await fetch(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
              searchInput
            )}.json?access_token=${
              process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
            }&fuzzyMatch=true`
          );
          const data = await response.json();
          if (data.features && data.features.length > 0) {
            const [lng, lat] = data.features[0].center;
            const newFilters = {
                ...filters,
                
                location: searchInput,
                coordinates: [lng as number, lat as number] as [number, number],
            }
            dispatch(setFilters(newFilters));
            updateURL(newFilters);
          }
        } catch (err) {
          console.error("Error search location:", err);
        }
      };
    return (
      <div className='flex justify-between items-center w-full py-5 transition-colors'>
        <div className='flex flex-wrap justify-between items-center gap-4 p-2'>
          {/* Toggle All Filters */}
          <Button 
            className={cn(
              "gap-2 rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-colors",
              isFiltersFullOpen && "bg-blue-600 text-white dark:bg-blue-600 dark:text-white"
            )}
            onClick={() => dispatch(toggleFiltersFullOpen())}
          >
            <Filter className='w-4 h-4' />
            <span>All Filters</span>
          </Button>
          {/* Search Location */}
          <div className="flex items-center">
            <Input
              placeholder="Search location"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-40 rounded-l-xl rounded-r-none border-gray-300 dark:border-gray-600 border-r-0 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 bg-white dark:bg-gray-800 focus:border-blue-500 dark:focus:border-blue-400"
            />
            <Button
              onClick={handleLocationSearch}
              className="rounded-r-xl rounded-l-none border-l-none border-gray-300 dark:border-gray-600 shadow-none border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-colors"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
          {/* Status Filter */}
          <Select
            value={filters.status || ""}
            onValueChange={(value) => handleFilterChange("status", value)}
          >
            <SelectTrigger className="w-34 rounded-xl border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 hover:border-blue-500 dark:hover:border-blue-400 focus:border-blue-500 dark:focus:border-blue-400">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
              <SelectItem value="any">Any Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
          {/* View Mode */}
          <div className="flex justify-between items-center gap-4 p-2">
            <div className="flex border rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
              <Button
                variant="ghost"
                className={cn(
                  "px-3 py-1 rounded-none rounded-l-xl text-gray-900 dark:text-gray-100 transition-colors",
                  viewMode === "list"
                    ? "bg-blue-600 text-white dark:bg-blue-600 dark:text-white"
                    : "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                )}
                onClick={() => dispatch(setViewMode("list"))}
              >
                <List className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                className={cn(
                  "px-3 py-1 rounded-none rounded-r-xl text-gray-900 dark:text-gray-100 transition-colors",
                  viewMode === "grid"
                    ? "bg-blue-600 text-white dark:bg-blue-600 dark:text-white"
                    : "hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                )}
                onClick={() => dispatch(setViewMode("grid"))}
              >
                <Grid className="w-5 h-5" />
              </Button>
            </div>
            
          </div>
        </div>
      </div>
    )
}
export default FiltersBar