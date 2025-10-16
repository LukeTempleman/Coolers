"use client";
import React, { useEffect, useRef } from 'react';
import type { Map as LeafletMap } from 'leaflet';

interface MismatchMapProps {
  expectedLocation: string;
  expectedCoords: [number, number]; // [lng, lat]
  actualLocation: string;
  actualCoords: [number, number]; // [lng, lat]
  coolerId: string;
  distance: string;
}

export default function MismatchMap({
  expectedLocation,
  expectedCoords,
  actualLocation,
  actualCoords,
  coolerId,
  distance
}: MismatchMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    const initMap = async () => {
      try {
        // Dynamically import Leaflet
        const L = (await import('leaflet')).default;
        
        // Import CSS dynamically if not already loaded
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
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

        const container = mapContainerRef.current;
        if (!container) return;

        // Calculate center point between expected and actual locations
        const centerLat = (expectedCoords[1] + actualCoords[1]) / 2;
        const centerLng = (expectedCoords[0] + actualCoords[0]) / 2;

        // Create map
        const map = L.map(container).setView([centerLat, centerLng], 10);
        mapRef.current = map;

        // Add OpenStreetMap tiles
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18,
        }).addTo(map);

        // Create custom green icon for expected location
        const greenIcon = L.icon({
          iconUrl: 'data:image/svg+xml;base64,' + btoa(`
            <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 9.4 12.5 28.5 12.5 28.5S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0z" fill="#10b981" stroke="#fff" stroke-width="2"/>
              <circle cx="12.5" cy="12.5" r="4" fill="#fff"/>
            </svg>
          `),
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34]
        });

        // Create custom red icon for actual location
        const redIcon = L.icon({
          iconUrl: 'data:image/svg+xml;base64,' + btoa(`
            <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 9.4 12.5 28.5 12.5 28.5S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0z" fill="#ef4444" stroke="#fff" stroke-width="2"/>
              <circle cx="12.5" cy="12.5" r="4" fill="#fff"/>
            </svg>
          `),
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34]
        });

        // Add expected location marker (green)
        const expectedMarker = L.marker([expectedCoords[1], expectedCoords[0]], {
          icon: greenIcon
        }).addTo(map);
        expectedMarker.bindPopup(`
          <div style="text-align: center; font-family: system-ui;">
            <strong style="color: #10b981; font-size: 14px;">Expected Location</strong><br/>
            <strong style="font-size: 16px;">${expectedLocation}</strong><br/>
            <small style="color: #666;">Cooler: ${coolerId}</small>
          </div>
        `);

        // Add actual location marker (red)
        const actualMarker = L.marker([actualCoords[1], actualCoords[0]], {
          icon: redIcon
        }).addTo(map);
        actualMarker.bindPopup(`
          <div style="text-align: center; font-family: system-ui;">
            <strong style="color: #ef4444; font-size: 14px;">Actual Location</strong><br/>
            <strong style="font-size: 16px;">${actualLocation}</strong><br/>
            <small style="color: #666;">Distance: ${distance}</small>
          </div>
        `);

        // Add a line connecting the two points
        L.polyline([
          [expectedCoords[1], expectedCoords[0]],
          [actualCoords[1], actualCoords[0]]
        ], {
          color: '#fbbf24',
          weight: 3,
          opacity: 0.8,
          dashArray: '10, 10'
        }).addTo(map);

        // Fit the map to show both markers with padding
        const group = L.featureGroup([expectedMarker, actualMarker]);
        map.fitBounds(group.getBounds(), { 
          padding: [50, 50],
          maxZoom: 15
        });

        // Force resize after a short delay
        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.invalidateSize();
          }
        }, 200);

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
  }, [expectedCoords, actualCoords, expectedLocation, actualLocation, coolerId, distance]);

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-full border rounded-lg"
      style={{ minHeight: '400px' }}
    />
  );
}
