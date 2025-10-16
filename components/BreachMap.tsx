"use client";
import React, { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";

export type CoolerPoint = {
  id: string;
  name: string;
  coordinates: [number, number]; // [lng, lat]
  status?: string;
  city?: string;
};

type Props = {
  center?: [number, number];
  zoom?: number;
  coolers?: CoolerPoint[];
};

export default function BreachMap({
  center = [28.0473, -26.2041], // Johannesburg
  zoom = 12,
  coolers = [],
}: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    if (mapRef.current) return; // Initialize map only once
    if (!mapContainerRef.current) return;

    const initMap = async () => {
      // Dynamically import Leaflet
      const L = (await import("leaflet")).default;
      
      // Check if CSS is already loaded
      const existingLink = document.querySelector('link[href*="leaflet.css"]');
      if (!existingLink) {
        // Import CSS dynamically
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
        
        // Wait for CSS to load
        await new Promise((resolve) => {
          link.onload = resolve;
          setTimeout(resolve, 1000); // fallback timeout
        });
      }

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

      // Create map
      const container = mapContainerRef.current;
      if (!container) return;
      
      mapRef.current = L.map(container).setView([center[1], center[0]], zoom);

      // Add OpenStreetMap tiles (free, no API key required)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);

      // Create custom icons for expected and breach locations
      const expectedIcon = L.divIcon({
        html: '<div style="background-color: #10b981; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>',
        className: '',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      const breachIcon = L.divIcon({
        html: '<div style="background-color: #ef4444; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>',
        className: '',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      // Add markers for each cooler
      coolers.forEach((cooler) => {
        if (mapRef.current) {
          const icon = cooler.status === 'expected' ? expectedIcon : breachIcon;
          const marker = L.marker([cooler.coordinates[1], cooler.coordinates[0]], { icon }).addTo(
            mapRef.current
          );
          const statusText = cooler.status === 'expected' ? 'Expected Location' : 'Current Location (Breach)';
          marker.bindPopup(`<strong>${cooler.name}</strong><br/>${statusText}<br/>${cooler.city || ''}`);
        }
      });

      // If we have multiple coolers, fit bounds to show all
      if (coolers.length > 1 && mapRef.current) {
        const bounds = L.latLngBounds(coolers.map(c => [c.coordinates[1], c.coordinates[0]] as [number, number]));
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
      
      // Force map to resize after a short delay to ensure proper rendering
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
        }
      }, 100);
    };

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [center, zoom, coolers]);

  return <div ref={mapContainerRef} className="w-full h-full rounded-lg" style={{ minHeight: "400px" }} />;
}
