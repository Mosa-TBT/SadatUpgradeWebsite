"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import { MapPin } from "lucide-react";

const KABUL_LAT = 34.5553;
const KABUL_LNG = 69.2075;

export function KabulMap() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mapInstance: LeafletMap | null = null;
    let markerInstance: LeafletMarker | null = null;

    (async () => {
      try {
        const L = await import("leaflet");
        await import("leaflet/dist/leaflet.css");

        if (!containerRef.current) return;

        mapInstance = L.map(containerRef.current, {
          center: [KABUL_LAT, KABUL_LNG],
          zoom: 12,
          scrollWheelZoom: true,
          attributionControl: true,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapInstance);

        const pin = L.divIcon({
          className: "sadat-map-pin",
          html:
            '<div class="sadat-map-pin-body"><span class="sadat-map-pin-dot"></span></div>',
          iconSize: [42, 54],
          iconAnchor: [21, 52],
          popupAnchor: [0, -46],
        });

        markerInstance = L.marker([KABUL_LAT, KABUL_LNG], { icon: pin }).addTo(mapInstance);
        markerInstance.bindPopup(
          '<div style="text-align:center;font-weight:600;">SadaatUpgrade</div><div style="text-align:center;">Kabul, Afghanistan</div>',
        );
        markerInstance.openPopup();
      } catch {
        // Map is progressive enhancement; never break the page if tiles fail.
      }
    })();

    return () => {
      mapInstance?.remove();
      markerInstance = null;
    };
  }, []);

  return (
    <div className="relative w-full">
      <div className="pointer-events-none absolute left-3 top-3 z-[1000] flex items-center gap-2 rounded-lg bg-white/95 px-3 py-1.5 shadow-sm">
        <MapPin className="h-4 w-4 text-blue-600" />
        <span className="text-xs font-semibold text-gray-800">Kabul, Afghanistan</span>
      </div>
      <div
        ref={containerRef}
        aria-label="Interactive map showing SadaatUpgrade location in Kabul, Afghanistan"
        className="h-[380px] w-full overflow-hidden rounded-xl border border-gray-200 shadow-sm"
      />
    </div>
  );
}

export default KabulMap;