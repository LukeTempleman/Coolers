import { useParams } from 'next/navigation';
import { useGetCoolerQuery } from '@/app/state/api';
import { MapPin, Thermometer, Droplets, Activity, Calendar, Zap } from 'lucide-react';
import React from 'react';

const CoolerOverview = () => {
  const params = useParams();
  const coolerId = params?.id as string;

  const {
    data: cooler,
    isError,
    isLoading,
    error,
  } = useGetCoolerQuery(coolerId);

  if (!coolerId || typeof coolerId !== "string" || coolerId.length !== 24) {
    return <div>Invalid cooler ID</div>;
  }

  if (isLoading) return <div>Loading...</div>;
  if (isError) {
    console.error('API error:', error);
    return <div>
      Cooler not Found
      <pre>{JSON.stringify(error, null, 2)}</pre>
    </div>;
  }
  if (!cooler || typeof cooler !== "object" || !cooler.location) {
    return <div>Cooler not Found</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <div className="text-sm text-gray-500 mb-1">
          {cooler.location?.country} / {cooler.location?.province} /{" "}
          <span className="font-semibold text-gray-600">
            {cooler.location?.city}
          </span>
        </div>
        <h1 className="text-3xl font-bold my-5">{cooler.name}</h1>
        <div className="flex justify-between items-center">
          <span className="flex items-center text-gray-500">
            <MapPin className="w-4 h-4 mr-1 text-gray-700" />
            {cooler.location?.city}, {cooler.location?.province},{" "}
            {cooler.location?.country}
          </span>
        </div>
      </div>

      {/* Analytics Panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Status */}
        <div className="bg-white dark:bg-primary-700 rounded-lg shadow p-4 flex items-center gap-4">
          <Activity className="w-8 h-8 text-blue-500" />
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-300">Status</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">{cooler.status || "Unknown"}</div>
          </div>
        </div>
        {/* Cooler Type */}
        <div className="bg-white dark:bg-primary-700 rounded-lg shadow p-4 flex items-center gap-4">
          <Zap className="w-8 h-8 text-yellow-500" />
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-300">Cooler Type</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">{cooler.coolerModel || "Unknown"}</div>
          </div>
        </div>
        {/* Temperature */}
        <div className="bg-white dark:bg-primary-700 rounded-lg shadow p-4 flex items-center gap-4">
          <Thermometer className="w-8 h-8 text-red-500" />
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-300">Temperature</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {cooler.temperature != null ? `${cooler.temperature}°C` : "N/A"}
            </div>
          </div>
        </div>
        {/* Humidity */}
        <div className="bg-white dark:bg-primary-700 rounded-lg shadow p-4 flex items-center gap-4">
          <Droplets className="w-8 h-8 text-cyan-500" />
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-300">Humidity</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {cooler.humidity != null ? `${cooler.humidity}%` : "N/A"}
            </div>
          </div>
        </div>
        {/* Last Service Date */}
        <div className="bg-white dark:bg-primary-700 rounded-lg shadow p-4 flex items-center gap-4">
          <Calendar className="w-8 h-8 text-green-500" />
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-300">Last Serviced</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {cooler.lastServiceDate
                ? new Date(cooler.lastServiceDate).toLocaleDateString()
                : "N/A"}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoolerOverview;