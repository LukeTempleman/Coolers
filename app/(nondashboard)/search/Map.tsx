"use client";
import React, { useEffect, useRef } from 'react';
import type { Map as LeafletMap } from 'leaflet';
import { useAppSelector } from '@/app/state/redux';
import { useGetCoolersQuery } from '@/app/state/api';
import { useSidebar } from '@/components/ui/sidebar';

export default function Map() {
  const { open } = useSidebar();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const filters = useAppSelector((state) => state.global.filters);
  const { data: coolers, isLoading, isError } = useGetCoolersQuery(filters);

  // Create map only once
  useEffect(() => {
    if (isLoading || isError || !coolers || mapRef.current || !mapContainerRef.current) return;

    const initMap = async () => {
      try {
        // Dynamically import Leaflet
        const L = (await import('leaflet')).default;
        
        // Import CSS dynamically
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

      // Fix default marker icon issue with webpack
      const DefaultIcon = L.Icon.Default.prototype as unknown as {
        _getIconUrl?: string;
        options: { iconUrl: string; iconRetinaUrl: string; shadowUrl: string };
      };
      delete DefaultIcon._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const container = mapContainerRef.current;
      if (!container) return;

      // Force center over Johannesburg (ignoring any persisted coordinates for now)
      const center: [number, number] = [-26.2041, 28.0473]; // [lat, lng] for Johannesburg center - always use this
      const zoom = 10; // Fixed zoom for Johannesburg area
      
      const map = L.map(container).setView(center, zoom);
      mapRef.current = map;

      // Add OpenStreetMap tiles (free, no API key required)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add markers for each cooler
      coolers.forEach((cooler) => {
        if (mapRef.current) {
          const marker = L.marker([
            cooler.location.coordinates[1],
            cooler.location.coordinates[0]
          ]).addTo(mapRef.current);

          marker.bindPopup(`
            <div style="min-width: 200px;">
              <a href="/search/${cooler._id}" target="_blank" style="font-weight: 600; color: #111; text-decoration: none;">
                ${cooler.name}
              </a>
              <p style="margin: 4px 0; color: #555;">
                ${cooler.coolerModel}
              </p>
              <div style="font-size: 0.85em; color: #777;">
                ${cooler.location.city || ''}, ${cooler.location.province || ''}
              </div>
              <div style="font-size: 0.85em; color: ${cooler.status === 'Active' ? '#22c55e' : '#ef4444'};">
                Status: ${cooler.status}
              </div>
            </div>
          `);
        }
      });
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isLoading, isError, coolers, filters.coordinates]);

  // Resize map when sidebar state changes
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [open]);

  if (isLoading) return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    </div>
  );
  
  if (isError || !coolers) return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-center text-muted-foreground">
        <p>Failed to fetch coolers</p>
      </div>
    </div>
  );

  return (
    <div className='basis-5/12 grow relative rounded-xl'>
      <div
        className='map-container rounded-xl'
        ref={mapContainerRef}
        style={{
          height: "1000px",
          width: "100%",
          backgroundColor: "#e5e7eb",
          position: "relative"
        }}
      />
    </div>
  );
}
