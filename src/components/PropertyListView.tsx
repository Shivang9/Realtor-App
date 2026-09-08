import React, { useState } from 'react';
import { Property } from '../types';
import { PropertyCard } from './PropertyCard';
import { 
  MapPin, 
  Home as HomeIcon, 
  DollarSign, 
  ArrowRight, 
  Compass, 
  Sparkles, 
  Plus, 
  Minus, 
  Layers,
  ChevronDown,
  Maximize2
} from 'lucide-react';

interface PropertyListViewProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onNavigateToMap: () => void;
  savedIds: string[];
  onToggleSave: (propertyId: string, e: React.MouseEvent) => void;
  onSelectGuide?: () => void;
}

export const PropertyListView: React.FC<PropertyListViewProps> = ({
  properties,
  onSelectProperty,
  onNavigateToMap,
  savedIds,
  onToggleSave,
  onSelectGuide,
}) => {
  const [activeTab, setActiveTab] = useState<'buy' | 'rent' | 'sell'>('buy');
  const [locationQuery, setLocationQuery] = useState('');
  const [propertyType, setPropertyType] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Popular tag filter chips
  const popularTags = [
    { label: 'Garden', filter: 'Garden' },
    { label: 'Light-filled', filter: 'Light' },
    { label: 'Walkable', filter: 'Yorkville' },
    { label: 'New listing', filter: 'new' },
    { label: 'Penthouse', filter: 'luxury_penthouse' },
  ];

  // Filtering properties
  const filtered = properties.filter((p) => {
    // Tab filter
    if (activeTab === 'rent' && p.status !== 'For Lease') return true; // keep resilient
    // Type filter
    if (propertyType !== 'all') {
      if (propertyType === 'luxury_penthouse' && p.category !== 'luxury_penthouse') return false;
      if (propertyType === 'residential' && p.category !== 'residential') return false;
      if (propertyType === 'commercial' && p.category !== 'commercial') return false;
    }
    // Price range filter
    if (priceRange === 'under2m' && p.price > 2000000) return false;
    if (priceRange === '2m-5m' && (p.price < 2000000 || p.price > 5000000)) return false;
    if (priceRange === 'over5m' && p.price < 5000000) return false;

    // Tag filter
    if (selectedTag === 'luxury_penthouse' && p.category !== 'luxury_penthouse') return false;
    if (selectedTag === 'new' && !p.featured) return false;
    if (selectedTag && selectedTag !== 'luxury_penthouse' && selectedTag !== 'new') {
      const q = selectedTag.toLowerCase();
      const match =
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.neighborhood.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Location query
    if (locationQuery.trim()) {
      const q = locationQuery.toLowerCase();
      const match =
        p.title.toLowerCase().includes(q) ||
        p.street.toLowerCase().includes(q) ||
        p.neighborhood.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  return (
    <div className="space-y-10 pb-16">
      {/* HERO SECTION matching Hearth & Key */}
      <section className="pt-8 sm:pt-12 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
          
          {/* Left: Greeting & Editorial Heading */}
          <div className="space-y-4 max-w-2xl">
            <div className="text-xs sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#C85A32] flex items-center space-x-2">
              <span>GOOD MORNING, MAYA</span>
              <span>☀️</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-normal tracking-tight text-[#1D2421] leading-[1.08]">
              <span className="font-serif-luxury block">Find a place</span>
              <span className="font-serif-luxury italic text-[#D95D39] block mt-1">that feels like you.</span>
            </h1>

            <p className="text-stone-600 text-sm sm:text-base font-light max-w-lg leading-relaxed pt-1">
              Curated homes, local insight, and a smoother way to move.
            </p>
          </div>

          {/* Right: THE LOCAL EDIT Card matching screenshot */}
          <div 
            onClick={onSelectGuide}
            className="group lg:w-72 bg-[#E6EDE8] rounded-2xl p-5 border border-[#D3DED6] shadow-xs cursor-pointer hover:shadow-md hover:border-[#BFCEC3] transition-all shrink-0 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between">
              {/* Abstract icon badge */}
              <div className="w-14 h-14 rounded-2xl bg-[#D6E3D9] flex items-center justify-center text-[#3D5C4B] relative overflow-hidden border border-[#C5D6CA]">
                <div className="w-6 h-6 rounded-full bg-[#3D5C4B]/20 absolute -top-1 -right-1" />
                <div className="w-5 h-5 rounded-full bg-[#3D5C4B] flex items-center justify-center text-white text-[10px] font-bold">
                  ✦
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#476755]">
                THE LOCAL EDIT
              </span>
            </div>

            <div className="pt-4 space-y-1">
              <h3 className="font-serif-luxury text-xl font-bold text-[#1D2421] group-hover:text-[#D95D39] transition-colors">
                September in Northwood
              </h3>
              <div className="text-xs font-semibold text-[#3D5C4B] flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform">
                <span>Explore guide</span>
                <span>↗</span>
              </div>
            </div>
          </div>

        </div>

        {/* FLOATING MASTER SEARCH CONTAINER matching screenshot */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-stone-200/80 p-5 sm:p-6 space-y-5">
          {/* Search Tabs: Buy / Rent / Sell */}
          <div className="flex items-center space-x-6 border-b border-stone-100 pb-3 text-sm font-semibold">
            <button
              onClick={() => setActiveTab('buy')}
              className={`pb-1 transition-colors relative ${
                activeTab === 'buy'
                  ? 'text-[#1D2421] font-bold'
                  : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              Buy
              {activeTab === 'buy' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D95D39] rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('rent')}
              className={`pb-1 transition-colors relative ${
                activeTab === 'rent'
                  ? 'text-[#1D2421] font-bold'
                  : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              Rent
              {activeTab === 'rent' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D95D39] rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('sell')}
              className={`pb-1 transition-colors relative ${
                activeTab === 'sell'
                  ? 'text-[#1D2421] font-bold'
                  : 'text-stone-400 hover:text-stone-700'
              }`}
            >
              Sell
              {activeTab === 'sell' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D95D39] rounded-full" />
              )}
            </button>
          </div>

          {/* Search Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            
            {/* 1. Location */}
            <div className="md:col-span-4 flex items-center space-x-3 p-3 rounded-xl border border-stone-200 bg-[#FBFBF9] focus-within:bg-white focus-within:border-[#D95D39] transition">
              <MapPin className="w-4 h-4 text-[#D95D39] shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] uppercase font-bold text-stone-600 tracking-wider">
                  Location
                </label>
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="Northwood, Yorkville, Annex..."
                  className="w-full bg-transparent text-xs sm:text-sm text-[#1D2421] placeholder-stone-400 focus:outline-none"
                />
              </div>
            </div>

            {/* 2. Property Type */}
            <div className="md:col-span-3 flex items-center space-x-3 p-3 rounded-xl border border-stone-200 bg-[#FBFBF9] focus-within:bg-white focus-within:border-[#D95D39] transition">
              <HomeIcon className="w-4 h-4 text-stone-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] uppercase font-bold text-stone-600 tracking-wider">
                  Property type
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm text-[#1D2421] focus:outline-none cursor-pointer"
                >
                  <option value="all">Any type</option>
                  <option value="luxury_penthouse">Luxury Penthouse</option>
                  <option value="residential">Single Family / Residence</option>
                  <option value="commercial">Commercial Estate</option>
                </select>
              </div>
            </div>

            {/* 3. Price Range */}
            <div className="md:col-span-3 flex items-center space-x-3 p-3 rounded-xl border border-stone-200 bg-[#FBFBF9] focus-within:bg-white focus-within:border-[#D95D39] transition">
              <DollarSign className="w-4 h-4 text-stone-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <label className="block text-[10px] uppercase font-bold text-stone-600 tracking-wider">
                  Price range
                </label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm text-[#1D2421] focus:outline-none cursor-pointer"
                >
                  <option value="all">Any price</option>
                  <option value="under2m">Under $2,000,000</option>
                  <option value="2m-5m">$2M – $5M</option>
                  <option value="over5m">$5,000,000+</option>
                </select>
              </div>
            </div>

            {/* 4. Search Button */}
            <div className="md:col-span-2">
              <button
                onClick={onNavigateToMap}
                className="w-full h-full py-3.5 px-4 rounded-xl bg-[#D95D39] hover:bg-[#C8522E] text-white font-bold text-xs sm:text-sm tracking-wide shadow-xs transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Search homes</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Popular Tag Pills below search */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-stone-600 font-medium">Popular:</span>
            {popularTags.map((tag) => {
              const isSelected = selectedTag === tag.filter;
              return (
                <button
                  key={tag.label}
                  onClick={() => setSelectedTag(isSelected ? null : tag.filter)}
                  className={`px-3 py-1 rounded-full text-xs transition ${
                    isSelected
                      ? 'bg-[#1D2421] text-white font-bold'
                      : 'bg-stone-100 hover:bg-stone-200/80 text-stone-700'
                  }`}
                >
                  {tag.label}
                </button>
              );
            })}
            {selectedTag && (
              <button
                onClick={() => setSelectedTag(null)}
                className="text-stone-600 hover:text-[#D95D39] text-xs font-semibold underline ml-1"
              >
                Clear tag
              </button>
            )}
          </div>

        </div>
      </section>

      {/* CURATED HOMES: 3-COLUMN GRID MATCHING IMAGE 1 */}
      <section className="px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-stone-200/80 pb-4 gap-4">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D95D39]">
                CURATED RESIDENCES
              </div>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1D2421] mt-0.5 flex items-baseline space-x-2">
                <span>Featured Trophy Properties</span>
                <span className="text-xs font-sans text-stone-500 font-normal">
                  ({filtered.length} available)
                </span>
              </h2>
            </div>

            {/* Quick Actions: View on map & reset */}
            <div className="flex items-center space-x-3">
              <button
                onClick={onNavigateToMap}
                className="text-xs font-bold text-stone-700 hover:text-[#D95D39] flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-stone-200 hover:border-stone-300 bg-white shadow-2xs transition cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-[#D95D39]" />
                <span>Interactive Map Search</span>
              </button>

              <button
                onClick={() => {
                  setLocationQuery('');
                  setPropertyType('all');
                  setPriceRange('all');
                  setSelectedTag(null);
                }}
                className="text-xs font-bold text-stone-600 hover:text-[#D95D39] flex items-center space-x-1 transition cursor-pointer"
              >
                <span>Reset filters</span>
                <span>↺</span>
              </button>
            </div>
          </div>

          {/* 3-Column Property Grid matching Image 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filtered.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onSelect={onSelectProperty}
                isSaved={savedIds.includes(property.id)}
                onToggleSave={onToggleSave}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
              <Compass className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="font-serif-luxury text-xl font-bold text-[#1D2421]">No residences match criteria</h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Try adjusting your location or price range filters to view more available curated homes.
              </p>
              <button
                onClick={() => {
                  setLocationQuery('');
                  setPropertyType('all');
                  setPriceRange('all');
                  setSelectedTag(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#1D2421] text-white text-xs font-bold hover:bg-[#D95D39] transition cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
