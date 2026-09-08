import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Coordinates } from '../types';

interface CardMiniMapProps {
  coordinates: Coordinates;
  neighborhood: string;
}

export const CardMiniMap: React.FC<CardMiniMapProps> = ({ coordinates, neighborhood }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    try {
      const map = L.map(containerRef.current, {
        center: [coordinates.lat, coordinates.lng],
        zoom: 14,
        zoomControl: false,
        scrollWheelZoom: false,
        dragging: false,
        touchZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Red Google-style teardrop pin marker matching user's screenshot
      const redPinIcon = L.divIcon({
        className: 'mini-card-pin',
        html: `
          <div style="transform: translate(-50%, -100%); filter: drop-shadow(0 2px 4px rgba(0,0,0,0.35)); cursor: pointer;">
            <svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0C5.37258 0 0 5.37258 0 12C0 21 12 32 12 32C12 32 24 21 24 12C24 5.37258 18.6274 0 12 0Z" fill="#EA4335"/>
              <circle cx="12" cy="11" r="5" fill="#B31412"/>
              <circle cx="12" cy="11" r="3" fill="#FFFFFF"/>
            </svg>
          </div>
        `,
        iconSize: [24, 32],
        iconAnchor: [12, 32],
      });

      L.marker([coordinates.lat, coordinates.lng], { icon: redPinIcon }).addTo(map);

      mapRef.current = map;

      const timer = setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
        }
      }, 150);

      return () => {
        clearTimeout(timer);
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    } catch {
      // Gracefully handle any tile init issues
    }
  }, [coordinates.lat, coordinates.lng]);

  return (
    <div className="relative w-full h-full min-h-[135px] bg-[#E5E9EC] overflow-hidden pointer-events-none isolate">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};
