import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { ExternalLink, Navigation } from 'lucide-react';
import { Coordinates } from '../types';

interface PropertyMiniMapProps {
  coordinates: Coordinates;
  title: string;
  priceFormatted?: string;
  address: string;
}

export const PropertyMiniMap: React.FC<PropertyMiniMapProps> = ({
  coordinates,
  title,
  priceFormatted,
  address,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up previous map if it exists
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    // Initialize Leaflet map
    const map = L.map(containerRef.current, {
      center: [coordinates.lat, coordinates.lng],
      zoom: 15,
      zoomControl: true,
      scrollWheelZoom: false,
    });

    // High quality OpenStreetMap tiles - NO API KEY REQUIRED
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Custom terracotta pin matching Hearth & Key aesthetic
    const customPin = L.divIcon({
      className: 'custom-detail-pin',
      html: `
        <div style="
          background: #D95D39;
          color: #FFFFFF;
          font-weight: 700;
          font-size: 11px;
          padding: 6px 12px;
          border-radius: 9999px;
          border: 2px solid #FFFFFF;
          box-shadow: 0 4px 14px rgba(0,0,0,0.25);
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 5px;
          transform: translate(-50%, -50%);
        ">
          <span>${priceFormatted || 'Location'}</span>
        </div>
      `,
      iconSize: [80, 32],
      iconAnchor: [40, 16],
    });

    L.marker([coordinates.lat, coordinates.lng], { icon: customPin })
      .addTo(map)
      .bindPopup(`<strong>${title}</strong><br/>${address}`);

    mapRef.current = map;

    // Invalidate size to handle modal layout transitions
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      clearTimeout(timer);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [coordinates.lat, coordinates.lng, title, priceFormatted, address]);

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}`;
  const appleMapsUrl = `https://maps.apple.com/?q=${coordinates.lat},${coordinates.lng}`;

  return (
    <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shadow-xs">
      <div ref={containerRef} className="w-full h-full z-0" />
      
      {/* Floating external navigation actions */}
      <div className="absolute top-3 right-3 z-[400] flex items-center space-x-2">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1 text-[11px] font-semibold bg-white/95 text-stone-800 hover:text-[#D95D39] px-3 py-1.5 rounded-lg shadow-sm border border-stone-200/80 backdrop-blur-xs transition"
          title="Open in Google Maps"
        >
          <Navigation className="w-3.5 h-3.5 text-[#D95D39]" />
          <span>Google Maps</span>
          <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
        </a>
        <a
          href={appleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1 text-[11px] font-semibold bg-white/95 text-stone-800 hover:text-[#273B30] px-3 py-1.5 rounded-lg shadow-sm border border-stone-200/80 backdrop-blur-xs transition"
          title="Open in Apple Maps"
        >
          <span>Apple Maps</span>
          <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
        </a>
      </div>
    </div>
  );
};
