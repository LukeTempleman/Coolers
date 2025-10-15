import { FiltersState, initialState, setFilters } from '@/app/state';
import { useAppSelector } from '@/app/state/redux';
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { debounce } from "lodash";
import { cleanParams, cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { CoolerModelEnum, CoolerModelIcons } from "@/lib/constants";

const FiltersFull = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [localFilters, setLocalFilters] = useState(initialState.filters);
  const isFiltersFullOpen = useAppSelector(
    (state) => state.global.isFiltersFullOpen
  );

  const updateURL = debounce((newFilters: FiltersState) => {
    const cleanFilters = cleanParams(newFilters);
    const updatedSearchParams = new URLSearchParams();

    Object.entries(cleanFilters).forEach(([key, value]) => {
      updatedSearchParams.set(
        key,
        Array.isArray(value) ? value.join(",") : value.toString()
      );
    });

    router.push(`${pathname}?${updatedSearchParams.toString()}`);
  });

  const handleSubmit = () => {
    dispatch(setFilters(localFilters));
    updateURL(localFilters);
  };

  const handleReset = () => {
    setLocalFilters(initialState.filters);
    dispatch(setFilters(initialState.filters));
    updateURL(initialState.filters);
  };


  const handleLocationSearch = async () => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          localFilters.location
        )}.json?access_token=${
          process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
        }&fuzzyMatch=true`
      );
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        setLocalFilters((prev: FiltersState) => ({
          ...prev,
          coordinates: [lng, lat],
        }));
      }
    } catch (err) {
      console.error("Error search location:", err);
    }
  };

  if (!isFiltersFullOpen) return null;

  return (
    <div className="rounded-lg px-4 h-full overflow-auto pb-10 transition-colors">
      <div className="flex flex-col space-y-6">
        {/* Location */}
        <div>
          <h4 className="font-bold mb-2 text-gray-900 dark:text-white">Location</h4>
          <div className="flex items-center">
            <Input
              placeholder="Enter location"
              value={localFilters.location}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  location: e.target.value,
                }))
              }
              className="rounded-l-xl rounded-r-none border border-gray-300 dark:border-white border-r-0 bg-white dark:bg-primary-800 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/70"
            />
            <Button
              onClick={handleLocationSearch}
              className="rounded-r-xl rounded-l-none border-l-none border-gray-300 dark:border-white shadow-none border hover:bg-primary-800 hover:text-white dark:hover:bg-white dark:hover:text-primary-800 transition-colors"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Cooler Type */}
        <div>
          <h4 className="font-bold mb-2 text-gray-900 dark:text-white">Cooler Type</h4>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(CoolerModelIcons).map(([type, Icon]) => (
              <div
                key={type}
                className={cn(
                  "flex flex-col items-center justify-center p-4 border rounded-xl cursor-pointer transition-colors",
                  localFilters.coolerModel === type
                    ? "border-gray-900 dark:border-white bg-gray-100 dark:bg-white/10"
                    : "border-gray-300 dark:border-white/50 bg-white dark:bg-primary-800"
                )}
                onClick={() =>
                  setLocalFilters((prev: any) => ({
                    ...prev,
                    coolerModel: type as CoolerModelEnum,
                  }))
                }
              >
                <Icon className="w-6 h-6 mb-2 text-gray-900 dark:text-white" />
                <span className="text-gray-900 dark:text-white">{type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cooler Status */}
        <div>
          <h4 className="font-bold mb-2 text-gray-900 dark:text-white">Status</h4>
          <div className="flex gap-2">
            {["active", "maintenance", "inactive"].map((status) => (
              <Button
                key={status}
                variant={localFilters.status === status ? "default" : "outline"}
                className={cn(
                  "rounded-xl transition-colors border border-gray-300 dark:border-white",
                  localFilters.status === status
                    ? "bg-primary-800 text-white dark:bg-white dark:text-primary-800"
                    : "bg-white text-gray-900 dark:bg-primary-800 dark:text-white"
                )}
                onClick={() =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    status,
                  }))
                }
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
            <Button
              variant={localFilters.status === "" ? "default" : "outline"}
              className={cn(
                "rounded-xl transition-colors border border-gray-300 dark:border-white",
                localFilters.status === ""
                  ? "bg-primary-800 text-white dark:bg-white dark:text-primary-800"
                  : "bg-white text-gray-900 dark:bg-primary-800 dark:text-white"
              )}
              onClick={() =>
                setLocalFilters((prev) => ({
                  ...prev,
                  status: "",
                }))}
            >
              Any
            </Button>
          </div>
        </div>

        {/* Apply and Reset buttons */}
        <div className="flex gap-4 mt-6">
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-primary-800 text-white dark:bg-white dark:text-primary-800 hover:text-black rounded-xl"
          >
            APPLY
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="flex-1 rounded-xl border-gray-300 dark:border-white bg-white dark:bg-primary-800 text-gray-900 dark:text-white hover:bg-primary-800 hover:text-white dark:hover:bg-white dark:hover:text-primary-800"
          >
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FiltersFull;