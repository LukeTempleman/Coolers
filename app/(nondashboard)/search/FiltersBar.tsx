/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAppSelector } from '@/app/state/redux';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState, useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { FiltersState, setFilters, setViewMode, toggleFiltersFullOpen } from '@/app/state';
// import { debounce } from 'lodash';
import { cleanParams, cn } from '@/app/lib/utils';
import { Button } from '@/components/ui/button';
import { Filter, Grid, List, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CoolerModelIcons } from '@/app/lib/constants';

const FiltersBar = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname();
    const filters = useAppSelector((state) => state.global.filters);
    const isFiltersFullOpen = useAppSelector((state) => state.global.isFiltersFullOpen);
    const viewMode = useAppSelector((state) => state.global.viewMode);

    // State for search input
    const [searchInput, setSearchInput] = useState(filters.location);

    // State for merchants and merchant-specific cooler models
    const [merchants, setMerchants] = useState<{ _id: string; name: string }[]>([]);
    const [coolerModels, setCoolerModels] = useState<string[]>([]);

    // Fetch all merchants on mount
    useEffect(() => {
    fetch('/api/merchants/list?status=active')
      .then(res => {
        console.log('Merchants response status:', res.status);
        if (!res.ok) {
          // Log error and return empty array
          console.error(`HTTP error! status: ${res.status}`);
          return { data: [] };
        }
        return res.json();
      })
      .then(data => {
        console.log('Merchants response:', data);
        setMerchants(data.data || []);
      })
      .catch(err => {
        console.error('Error fetching merchants:', err);
        setMerchants([]);
      });
    }, []);

    // Fetch cooler models for selected merchant
    useEffect(() => {
      const fetchCoolerModels = async () => {
        try {
          let url = '/api/coolers';
          
          // If a specific merchant is selected, filter by merchant
          if (filters.merchant && filters.merchant !== 'any') {
            url += `?merchant=${filters.merchant}`;
            console.log('Fetching coolers for merchant:', filters.merchant);
          } else {
            console.log('Fetching all coolers for model extraction');
          }
          
          const res = await fetch(url);
          
          console.log('Coolers response status:', res.status);
          
          if (!res.ok) {
            throw new Error(`Failed to fetch coolers: ${res.status}`);
          }
          
          const data = await res.json();
          console.log('Coolers response:', data);
          
          // Get unique cooler models
          const coolersArray = data.data || data || [];
          const models = Array.from(new Set(coolersArray.map((c: any) => c.coolerModel))) as string[];
          console.log('Extracted cooler models:', models);
          setCoolerModels(models);
        } catch (error) {
          console.error('Error fetching coolers:', error);
          setCoolerModels([]);
        }
      };
      
      fetchCoolerModels();
    }, [filters.merchant]);

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
    useEffect(() => {
      console.log('filters.merchant changed:', filters.merchant);
    }, [filters.merchant]);
    console.log('Merchant filter value:', filters.merchant);
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
          {/* Merchant Filter */}
          <Select
            value={filters.merchant ?? "any"}
            onValueChange={(value) => handleFilterChange("merchant", value)}
          >
            <SelectTrigger className="w-34 rounded-xl border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 hover:border-blue-500 dark:hover:border-blue-400 focus:border-blue-500 dark:focus:border-blue-400">
              <SelectValue placeholder="Merchant" />
            </SelectTrigger>
            <SelectContent className="text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
              <SelectItem value="any">Any Merchant</SelectItem>
              {merchants.map(merchant => (
                <SelectItem key={merchant._id} value={merchant._id}>
                  {merchant.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          {/* Cooler Type Filter (filtered by merchant) */}
          <Select
            value={filters.coolerModel || "any"}
            onValueChange={(value) => handleFilterChange("coolerModel", value)}
          >
            <SelectTrigger className="w-34 rounded-xl border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 hover:border-blue-500 dark:hover:border-blue-400 focus:border-blue-500 dark:focus:border-blue-400">
              <SelectValue placeholder="Cooler Type" />
            </SelectTrigger>
            <SelectContent className="text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
              <SelectItem value="any">Any Cooler Model</SelectItem>
              {coolerModels.length > 0
                ? coolerModels.map((type) => {
                    const Icon = (CoolerModelIcons as Record<string, React.ComponentType<any>>)[type] || (() => <span className="w-4 h-4 mr-2" />);
                    return (
                      <SelectItem key={type} value={type}>
                        <div className="flex items-center">
                          <Icon className="w-4 h-4 mr-2" />
                          <span>{type}</span>
                        </div>
                      </SelectItem>
                    );
                  })
                : Object.entries(CoolerModelIcons).map(([type, Icon]) => (
                    <SelectItem key={type} value={type}>
                      <div className="flex items-center">
                        <Icon className="w-4 h-4 mr-2" />
                        <span>{type}</span>
                      </div>
                    </SelectItem>
                  ))}
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