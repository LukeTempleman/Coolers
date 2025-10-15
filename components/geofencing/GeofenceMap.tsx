"use client";
import React, { useEffect, useRef, useState } from "react";
// Lazy-load mapbox-gl and draw at runtime to avoid SSR/hydration issues
import * as turf from "@turf/turf";
import type { Feature, Polygon } from "geojson";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Map } from "mapbox-gl";
import type MapboxDraw from "@mapbox/mapbox-gl-draw";

export type CoolerPoint = {
  id: string;
  name: string;
  coordinates: [number, number]; // [lng, lat]
  status?: string;
  city?: string;
  province?: string;
  country?: string;
  radius?: number;
};

export type Geofence = {
  id: string;
  coolerId?: string;
  label: string;
  type: "radius" | "polygon";
  // GeoJSON representation
  feature: Feature<Polygon>;
};

type Props = {
  accessToken: string;
  center?: [number, number];
  zoom?: number;
  coolers?: CoolerPoint[];
  defaultRadiusMeters?: number;
  onChange?: (geofences: Geofence[]) => void;
};

export default function GeofenceMap({
  accessToken,
  center = [-0.1276, 51.5072], // London
  zoom = 10,
  coolers = [],
  defaultRadiusMeters = 300,
  onChange,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const drawRef = useRef<MapboxDraw | null>(null);
  const mapboxModuleRef = useRef<null | (typeof import("mapbox-gl"))>(null);
  const mapLoadedRef = useRef<boolean>(false);
  const popupRef = useRef<any>(null);

  const [radius, setRadius] = useState<number>(defaultRadiusMeters);
  const [geofences, setGeofences] = useState<Geofence[]>([]);
  const [selectedCooler, setSelectedCooler] = useState<string | "">("");
  const [selectedDrawId, setSelectedDrawId] = useState<string | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string>("");

  // Geofences are maintained in local state; integrate with backend in future.

  // Initialize map (lazy load mapbox modules)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (mapRef.current || !containerRef.current) return;
      const mapboxMod = await import("mapbox-gl");
      const mapboxgl = mapboxMod.default;
      const { default: MapboxDrawMod } = await import("@mapbox/mapbox-gl-draw");
      if (cancelled) return;
      mapboxModuleRef.current = mapboxMod;
      mapboxgl.accessToken = accessToken;
      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center,
        zoom,
      } as any);
      mapRef.current = map as unknown as Map;

      const draw = new MapboxDrawMod({
        displayControlsDefault: false,
        controls: { polygon: true, trash: true },
      }) as MapboxDraw;
      (map as any).addControl(draw, "top-left");
      drawRef.current = draw;

  (map as any).addControl(new mapboxgl.NavigationControl(), "top-right");

      // When a polygon is created or updated, add to our state
      const handleCreateOrUpdate = () => {
        const data = draw.getAll();
        const polys: Geofence[] = (data.features || [])
          .filter((f: Feature) => f.geometry?.type === "Polygon")
          .map((f: Feature) => ({
            id: String(f.id ?? crypto.randomUUID()),
            label: f.properties?.label || "Custom Zone",
            type: "polygon",
            feature: f as Feature<Polygon>,
          }));
        // Keep radius geofences and merge
        setGeofences((prev) => {
          const radiusOnes = prev.filter((g) => g.type === "radius");
          const merged = [...radiusOnes, ...polys];
          onChange?.(merged);
          return merged;
        });
      };

      (map as any).on("draw.create", handleCreateOrUpdate);
      (map as any).on("draw.update", handleCreateOrUpdate);
      (map as any).on("draw.delete", handleCreateOrUpdate);

      // Track selection to allow renaming/assigning in future
      (map as any).on("draw.selectionchange", () => {
        const sel = draw.getSelected();
        const first = sel.features?.[0] as Feature | undefined;
        if (first && first.geometry?.type === "Polygon") {
          const id = String(first.id ?? "");
          setSelectedDrawId(id || null);
          setSelectedLabel(first.properties?.label || "");
        } else {
          setSelectedDrawId(null);
          setSelectedLabel("");
        }
      });

      // Wait for style load, then add cooler source + layers
      (map as any).on('load', () => {
        mapLoadedRef.current = true;
        if (!(map as any).getSource('coolers')) {
          (map as any).addSource('coolers', {
            type: 'geojson',
            data: { type: 'FeatureCollection', features: [] },
          });
        }
  if (!(map as any).getLayer('coolers-circle')) {
          (map as any).addLayer({
            id: 'coolers-circle',
            type: 'circle',
            source: 'coolers',
            paint: {
              'circle-radius': 5,
              'circle-color': '#10b981',
              'circle-stroke-color': '#ffffff',
              'circle-stroke-width': 1.25,
            },
          });
        }
        if (!(map as any).getLayer('coolers-circle-selected')) {
          (map as any).addLayer({
            id: 'coolers-circle-selected',
            type: 'circle',
            source: 'coolers',
            filter: ['==', ['get', 'id'], ''],
            paint: {
              'circle-radius': 7,
              'circle-color': '#059669',
              'circle-stroke-color': '#111827',
              'circle-stroke-width': 1.5,
            },
          });
        }

        // Click to select + recenter
        (map as any).on('click', 'coolers-circle', (e: any) => {
          const f = e?.features?.[0];
          const id = f?.properties?.id as string | undefined;
          const coords = f?.geometry?.coordinates as [number, number] | undefined;
          if (id && coords) {
            setSelectedCooler(id);
            (map as any).flyTo({ center: coords, zoom: Math.max(12, (map as any).getZoom()) });
          }
        });

        // Hover popup
        const mapboxgl = mapboxModuleRef.current?.default;
        if (mapboxgl) {
          popupRef.current = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 12 });
        }
        (map as any).on('mouseenter', 'coolers-circle', () => {
          (map as any).getCanvas().style.cursor = 'pointer';
        });
        (map as any).on('mouseleave', 'coolers-circle', () => {
          (map as any).getCanvas().style.cursor = '';
          if (popupRef.current) popupRef.current.remove();
        });
        (map as any).on('mousemove', 'coolers-circle', (e: any) => {
          const f = e?.features?.[0];
          const props = f?.properties || {};
          const coords = f?.geometry?.coordinates as [number, number] | undefined;
          if (!coords || !popupRef.current) return;
          const name = props.name || 'Cooler';
          const status = props.status ? String(props.status) : undefined;
          const city = props.city ? String(props.city) : undefined;
          const province = props.province ? String(props.province) : undefined;
          const country = props.country ? String(props.country) : undefined;
          const loc = [city, province, country].filter(Boolean).join(', ');
          const radius = props.radius ? `Radius: ${props.radius}m` : '';
          const html = `
            <div style="min-width:180px">
              <div style="font-weight:600;font-size:12px;margin-bottom:2px">${name}</div>
              ${status ? `<div style="font-size:11px;color:#6b7280">Status: ${status}</div>` : ''}
              ${loc ? `<div style="font-size:11px;color:#6b7280">${loc}</div>` : ''}
              ${radius ? `<div style="font-size:11px;color:#6b7280">${radius}</div>` : ''}
            </div>`;
          popupRef.current.setLngLat(coords).setHTML(html).addTo(map as any);
        });

        // Seed with current coolers
        const fc = {
          type: 'FeatureCollection',
          features: (coolers || []).map((c) => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: c.coordinates },
            properties: { id: c.id, name: c.name, status: c.status, city: c.city, province: c.province, country: c.country, radius: c.radius },
          })),
        } as any;
        const src = (map as any).getSource('coolers');
        if (src) src.setData(fc);
      });
    })();
    return () => {
      cancelled = true;
      if (mapRef.current) {
        (mapRef.current as any).remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, center[0], center[1], zoom, onChange]);

  // Sync coolers source data when coolers change
  useEffect(() => {
    const map = mapRef.current as any;
    if (!map || !mapLoadedRef.current) return;
    const src = map.getSource('coolers');
    if (!src) return;
    const fc = {
      type: 'FeatureCollection',
      features: (coolers || []).map((c) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: c.coordinates },
        properties: { id: c.id, name: c.name },
      })),
    };
    src.setData(fc);
  }, [coolers]);

  const createRadiusForCooler = () => {
    const map = mapRef.current;
    if (!map) return;
    const targetId = selectedCooler || coolers[0]?.id;
    if (!targetId) return;
    const cooler = coolers.find((c) => c.id === targetId)!;
    const centerPoint = turf.point(cooler.coordinates);
    const circlePoly = turf.circle(centerPoint, radius / 1000, { steps: 64, units: "kilometers" });
    const gf: Geofence = {
      id: `radius-${cooler.id}-${Date.now()}`,
      coolerId: cooler.id,
      label: `${cooler.name} – ${Math.round(radius)}m`,
      type: "radius",
      feature: circlePoly as Feature<Polygon>,
    };
    setGeofences((prev) => {
      const next = [...prev, gf];
      onChange?.(next);
      return next;
    });

    // Fly to
    map.flyTo({ center: cooler.coordinates, zoom: Math.max(12, map.getZoom()) });

    // Render circle as a layer
    const sourceId = gf.id;
    if (map.getSource(sourceId)) {
      map.removeLayer(`${sourceId}-fill`);
      map.removeLayer(`${sourceId}-line`);
      map.removeSource(sourceId);
    }
    map.addSource(sourceId, {
      type: "geojson",
      data: gf.feature,
    });
    map.addLayer({
      id: `${sourceId}-fill`,
      type: "fill",
      source: sourceId,
      paint: { "fill-color": "#10b981", "fill-opacity": 0.15 },
    });
    map.addLayer({
      id: `${sourceId}-line`,
      type: "line",
      source: sourceId,
      paint: { "line-color": "#10b981", "line-width": 2 },
    });
  };

  // Recenter map when a cooler is selected from dropdown
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedCooler) return;
    const target = coolers.find(c => c.id === selectedCooler);
    if (target) {
      (map as any).flyTo({ center: target.coordinates, zoom: Math.max(12, (map as any).getZoom()) });
    }
  }, [selectedCooler, coolers]);

  // Highlight selected cooler point
  useEffect(() => {
    const map = mapRef.current as any;
    if (!map || !mapLoadedRef.current) return;
    if (map.getLayer('coolers-circle-selected')) {
      const filter = selectedCooler ? ['==', ['get', 'id'], selectedCooler] : ['==', ['get', 'id'], ''];
      map.setFilter('coolers-circle-selected', filter);
    }
  }, [selectedCooler]);

  return (
    <div className="w-full h-full flex flex-col gap-3">
      <div className="flex flex-wrap items-end gap-2">
        <div className="space-y-1">
          <label className="text-[11px] uppercase font-medium text-muted-foreground">Cooler</label>
          <select
            className="h-8 rounded-md border bg-background px-2 text-sm"
            value={selectedCooler}
            onChange={(e) => setSelectedCooler(e.target.value)}
          >
            <option value="">Auto-select first</option>
            {coolers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[11px] uppercase font-medium text-muted-foreground">Radius (m)</label>
          <Input
            type="number"
            min={50}
            step={50}
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="h-8 w-32"
          />
        </div>
        <Button className="h-8" variant="default" onClick={createRadiusForCooler}>
          Create Radius Geofence
        </Button>
        <div className="ml-auto text-[11px] text-muted-foreground">
          Tip: Use the Polygon tool on the map to draw custom zones.
        </div>
      </div>
      <div ref={containerRef} className="w-full grow min-h-[480px] rounded-lg border overflow-hidden" />
      <div className="text-xs text-muted-foreground">
        {geofences.length} geofence(s) in view. Custom polygons are stored in this session only.
      </div>
    </div>
  );
}
