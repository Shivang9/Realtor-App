import React, { useEffect, useRef, useState } from 'react';
import { Property } from '../types';
import { formatCompactCurrency, calculateDistanceKm, estimateDriveTime } from '../utils/formatters';
import { PropertyCard } from './PropertyCard';
import { 
  Search, 
  SlidersHorizontal, 
  Navigation, 
  Compass, 
  Layers, 
  Building2, 
  Home, 
  Sparkles,
  MapPin
} from 'lucide-react';
import L from 'leaflet';

interface MapSearchViewProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  savedIds?: string[];
  onToggleSave?: (propertyId: string, e: React.MouseEvent) => void;
}

export const MapSearchView: React.FC<MapSearchViewProps> = ({
  properties,
  onSelectProperty,
  savedIds = [],
  onToggleSave,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const userMarkerRef = useRef<L.Marker | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(25000000);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'split' | 'map' | 'list'>('split');

  // Filter properties
  const filteredProperties = properties.filter((prop) => {
    if (selectedCategory !== 'all' && prop.category !== selectedCategory) return false;
    if (prop.price > maxPrice) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        prop.title.toLowerCase().includes(q) ||
        prop.neighborhood.toLowerCase().includes(q) ||
        prop.street.toLowerCase().includes(q) ||
        prop.city.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default center: Toronto Yorkville
      const map = L.map(mapContainerRef.current, {
        center: [43.6708, -79.3942],
        zoom: 14,
        zoomControl: true,
      });

      // Clean OpenStreetMap tiles with warm organic theme filter
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        className: 'map-tiles-warm',
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear old markers
    Object.values(markersRef.current).forEach((marker: L.Marker) => marker.remove());
    markersRef.current = {};

    // Add property markers
    filteredProperties.forEach((prop) => {
      const isSelected = prop.id === selectedPropertyId;
      const priceLabel = formatCompactCurrency(prop.price);

      // Custom HTML pin icon matching Hearth & Key terracotta & sage palette
      const customIcon = L.divIcon({
        className: 'custom-price-pin',
        html: `
          <div style="
            background: ${isSelected ? '#D95D39' : '#FFFFFF'};
            color: ${isSelected ? '#FFFFFF' : '#1D2421'};
            font-weight: 700;
            font-size: 11px;
            padding: 5px 9px;
            border-radius: 9999px;
            border: 2px solid ${isSelected ? '#1D2421' : '#D95D39'};
            box-shadow: 0 4px 12px rgba(29,36,33,0.18);
            white-space: nowrap;
            display: flex;
            align-items: center;
            gap: 4px;
            cursor: pointer;
            transform: translate(-50%, -50%) ${isSelected ? 'scale(1.15)' : 'scale(1)'};
            transition: all 0.2s ease;
          ">
            <span>${priceLabel}</span>
          </div>
        `,
        iconSize: [60, 30],
        iconAnchor: [30, 15],
      });

      const marker = L.marker([prop.coordinates.lat, prop.coordinates.lng], { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        setSelectedPropertyId(prop.id);
        const el = document.getElementById(`property-card-${prop.id}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });

      markersRef.current[prop.id] = marker;
    });

    // Auto-fit bounds if we have markers
    if (filteredProperties.length > 0) {
      const bounds = L.latLngBounds(filteredProperties.map((p) => [p.coordinates.lat, p.coordinates.lng]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }

    // Leaflet container resize invalidate
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

  }, [filteredProperties.length, selectedCategory, maxPrice, selectedPropertyId, viewMode]);

  // Handle User Geolocation Tracking
  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationStatus('Pinpointing your current location...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(userCoords);
        setIsLocating(false);
        setLocationStatus('Location found! Showing distance to all properties.');

        if (mapInstanceRef.current) {
          const map = mapInstanceRef.current;

          // Remove old user marker
          if (userMarkerRef.current) {
            userMarkerRef.current.remove();
          }

          // Terracotta marker for user location
          const userIcon = L.divIcon({
            className: 'user-location-pin',
            html: `
              <div style="
                width: 22px;
                height: 22px;
                background: #D95D39;
                border: 3px solid #FFFFFF;
                border-radius: 50%;
                box-shadow: 0 0 0 6px rgba(217, 93, 57, 0.35);
              "></div>
            `,
            iconSize: [22, 22],
            iconAnchor: [11, 11],
          });

          userMarkerRef.current = L.marker([userCoords.lat, userCoords.lng], { icon: userIcon })
            .addTo(map)
            .bindPopup('<b style="color:#D95D39">You are here</b><br/>Calculating proximity to estates.')
            .openPopup();

          map.setView([userCoords.lat, userCoords.lng], 13);
        }
      },
      (err) => {
        console.warn('Geolocation failed:', err);
        // Fallback to Toronto Financial Core
        const fallback = { lat: 43.6487, lng: -79.3817 };
        setUserLocation(fallback);
        setIsLocating(false);
        setLocationStatus('Using Downtown Toronto as current reference.');

        if (mapInstanceRef.current) {
          const map = mapInstanceRef.current;
          if (userMarkerRef.current) userMarkerRef.current.remove();

          const userIcon = L.divIcon({
            className: 'user-location-pin',
            html: `
              <div style="
                width: 20px;
                height: 20px;
                background: #D95D39;
                border: 3px solid #FFFFFF;
                border-radius: 50%;
                box-shadow: 0 0 0 6px rgba(217, 93, 57, 0.35);
              "></div>
            `,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          });

          userMarkerRef.current = L.marker([fallback.lat, fallback.lng], { icon: userIcon })
            .addTo(map)
            .bindPopup('<b style="color:#f59e0b">Simulated Location (Financial Core)</b>')
            .openPopup();

          map.setView([fallback.lat, fallback.lng], 13);
        }
      }
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4.5rem)] bg-[#F8F9F5] text-[#1D2421]">
      
      {/* Top Filter Bar */}
      <div className="bg-white border-b border-stone-200/80 px-4 py-3 shrink-0 shadow-xs z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Search Box & Category Filters */}
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <div className="relative min-w-[240px] flex-1 max-w-md">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Northwood, Yorkville, Annex, Bloor, street..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 bg-[#F8F9F5] text-[#1D2421] placeholder-stone-400 focus:bg-white focus:ring-1 focus:ring-[#D95D39] focus:outline-none"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'all', label: 'All Listings' },
                { id: 'luxury_penthouse', label: 'Penthouses' },
                { id: 'residential', label: 'Residential' },
                { id: 'commercial', label: 'Commercial' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    selectedCategory === cat.id
                      ? 'bg-[#1D2421] text-white font-bold shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200/80'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Location Tracking & Price Control */}
          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={handleLocateUser}
              disabled={isLocating}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#D95D39] hover:bg-[#C8522E] text-white text-xs font-bold transition shadow-xs"
              title="Pinpoint your current location on the map"
            >
              <Navigation className={`w-3.5 h-3.5 text-white ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Locating...' : 'Track My Location'}</span>
            </button>

            {/* View Mode Switcher */}
            <div className="hidden sm:flex bg-[#ECEEE8] p-1 rounded-xl border border-stone-200/80 text-xs font-medium">
              <button
                onClick={() => setViewMode('split')}
                className={`px-3 py-1 rounded-lg transition ${viewMode === 'split' ? 'bg-white text-[#1D2421] font-bold shadow-xs' : 'text-stone-600 hover:text-stone-900'}`}
              >
                Split
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-1 rounded-lg transition ${viewMode === 'map' ? 'bg-white text-[#1D2421] font-bold shadow-xs' : 'text-stone-600 hover:text-stone-900'}`}
              >
                Map
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1 rounded-lg transition ${viewMode === 'list' ? 'bg-white text-[#1D2421] font-bold shadow-xs' : 'text-stone-600 hover:text-stone-900'}`}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Location Status Message if tracked */}
        {locationStatus && (
          <div className="max-w-7xl mx-auto mt-2 text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center justify-between">
            <span>📍 {locationStatus}</span>
            <button onClick={() => setLocationStatus(null)} className="text-emerald-900 font-bold hover:underline">
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Main Map & Split View Container */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Map View */}
        <div 
          className={`relative h-full transition-all duration-300 ${
            viewMode === 'map' ? 'w-full' : viewMode === 'list' ? 'hidden' : 'w-full lg:w-3/5'
          }`}
        >
          <div ref={mapContainerRef} className="w-full h-full z-0" />
          
          {/* Map Overlay Summary */}
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md border border-stone-200/80 text-xs text-stone-700 z-10 pointer-events-none">
            <span className="font-bold text-[#D95D39]">{filteredProperties.length}</span> residences mapped
          </div>
        </div>

        {/* Side Listing Column */}
        <div 
          className={`h-full overflow-y-auto p-4 custom-scrollbar bg-[#F8F9F5] border-l border-stone-200/80 transition-all duration-300 ${
            viewMode === 'list' ? 'w-full max-w-5xl mx-auto' : viewMode === 'map' ? 'hidden' : 'w-full lg:w-2/5'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-serif-luxury text-xl font-bold text-[#1D2421]">
                Curated Results ({filteredProperties.length})
              </h3>
              <span className="text-xs text-stone-500">Live Map Sync</span>
            </div>

            {filteredProperties.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-stone-200">
                <Compass className="w-8 h-8 text-stone-400 mx-auto mb-2" />
                <div className="text-sm font-semibold text-[#1D2421]">No matching properties</div>
                <div className="text-xs text-stone-500 mt-1">Try broadening your search query or price filters.</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {filteredProperties.map((prop) => {
                  const dist = userLocation
                    ? calculateDistanceKm(userLocation.lat, userLocation.lng, prop.coordinates.lat, prop.coordinates.lng)
                    : null;

                  return (
                    <div key={prop.id} className="relative">
                      {/* Distance pill if user location tracked */}
                      {dist !== null && (
                        <div className="mb-1 text-[11px] font-semibold text-[#273B30] bg-[#E6EDE8] px-3 py-1 rounded-t-xl border-x border-t border-[#D0DDD3] flex items-center justify-between">
                          <span className="flex items-center space-x-1">
                            <MapPin className="w-3 h-3 text-[#3D5C4B]" />
                            <span>{dist} km from your current location</span>
                          </span>
                          <span>{estimateDriveTime(dist)}</span>
                        </div>
                      )}

                      <PropertyCard
                        property={prop}
                        onSelect={() => onSelectProperty(prop)}
                        isSaved={savedIds.includes(prop.id)}
                        onToggleSave={onToggleSave}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
