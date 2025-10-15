"use client";
import React, { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";

interface Cooler {
  name: string;
  location: { coordinates: [number, number]; city?: string; province?: string };
}

interface Props {
  coolers: Cooler[];
}

const CoolersMap: React.FC<Props> = ({ coolers }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    if (mapRef.current) return; // Initialize map only once
    if (!mapContainerRef.current) return;

    const initMap = async () => {
      try {
        // Dynamically import Leaflet
        const L = (await import("leaflet")).default;
      
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

      // If single cooler, center on it, otherwise show all of South Africa
      const container = mapContainerRef.current;
      if (!container) return;
      
      if (coolers.length === 1) {
        // Single cooler - zoom to its location
        const cooler = coolers[0];
        mapRef.current = L.map(container).setView([cooler.location.coordinates[1], cooler.location.coordinates[0]], 13);
      } else {
        // Multiple coolers - show all of South Africa
        mapRef.current = L.map(container).setView([-28.5, 24.5], 5);
      }

      // Add OpenStreetMap tiles (free, no API key required)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);

      // Add markers for each cooler
        coolers.forEach((cooler) => {
          if (mapRef.current) {
            const marker = L.marker([cooler.location.coordinates[1], cooler.location.coordinates[0]]).addTo(
              mapRef.current
            );
            marker.bindPopup(`<strong>${cooler.name}</strong><br/>${cooler.location.city || ''}, ${cooler.location.province || ''}`);
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
  }, [coolers]);

  return (
    <div 
      ref={mapContainerRef} 
      style={{ 
        width: "100%", 
        height: "500px", 
        borderRadius: "8px", 
        backgroundColor: "#e5e7eb",
        position: "relative"
      }} 
    />
  );
};

export default CoolersMap;
