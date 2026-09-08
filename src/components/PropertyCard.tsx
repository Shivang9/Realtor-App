import React from 'react';
import { Property } from '../types';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { Heart } from 'lucide-react';
import { CardMiniMap } from './CardMiniMap';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
  isSaved?: boolean;
  onToggleSave?: (propertyId: string, e: React.MouseEvent) => void;
  compact?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelect,
  isSaved = false,
  onToggleSave,
}) => {
  // Format beds: e.g. "3+2 Bed", "4+1 Bed", or "3 Bed"
  const bedsText = property.extraBeds && property.extraBeds > 0
    ? `${property.bedrooms}+${property.extraBeds} Bed`
    : `${property.bedrooms} Bed`;

  const bathsText = property.bathrooms > 0 ? `${property.bathrooms} Bath` : '';
  const sqftText = property.sqft ? `${formatNumber(property.sqft)} Sq. Ft.` : '';

  // Specs string matching format: "3,963 Sq. Ft. / 3+2 Bed / 3.5 Bath"
  const specsString = [sqftText, bedsText, bathsText].filter(Boolean).join(' / ');

  return (
    <div
      id={`property-card-${property.id}`}
      onClick={() => onSelect(property)}
      className="group bg-white rounded-none sm:rounded-xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col border border-stone-200/90"
    >
      {/* 1. Large High-Resolution Property Photo matching Image 1 */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
        <img
          src={property.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80'}
          alt={property.title || property.neighborhood}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
        />

        {/* Subtle favorite heart button */}
        {onToggleSave && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(property.id, e);
            }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 hover:bg-white backdrop-blur-xs text-stone-700 hover:text-[#D95D39] transition flex items-center justify-center shadow-xs z-20 cursor-pointer"
            title={isSaved ? 'Remove from saved' : 'Save residence'}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isSaved ? 'fill-[#D95D39] text-[#D95D39]' : 'text-stone-700'
              }`}
            />
          </button>
        )}
      </div>

      {/* 2. Split Bottom Bar (Left: Mini Map with red pin | Right: Dark Slate details) matching Image 1 */}
      <div className="grid grid-cols-12 w-full h-[125px] sm:h-[135px] border-t border-stone-200">
        
        {/* Left Column: Mini Map with Red Pin Marker */}
        <div className="col-span-5 h-full relative border-r border-stone-300/40">
          <CardMiniMap 
            coordinates={property.coordinates} 
            neighborhood={property.neighborhood} 
          />
        </div>

        {/* Right Column: Slate Blue Details Panel */}
        <div className="col-span-7 h-full bg-[#455869] text-white p-3 sm:p-4 flex flex-col justify-center space-y-1 sm:space-y-1.5 min-w-0">
          
          {/* Neighborhood Name */}
          <h3 className="text-sm sm:text-base font-medium tracking-wide text-white truncate">
            {property.neighborhood}
          </h3>

          {/* Listed Price */}
          <p className="text-xs sm:text-sm font-normal text-white/95 truncate">
            Listed for {formatCurrency(property.price)}
          </p>

          {/* Specs: "3,963 Sq. Ft. / 3+2 Bed / 3.5 Bath" */}
          <p className="text-[11px] sm:text-xs font-normal text-white/80 leading-snug truncate">
            {specsString}
          </p>
        </div>

      </div>
    </div>
  );
};
