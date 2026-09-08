import React from 'react';
import { 
  Compass, 
  Search, 
  GraduationCap, 
  ShieldCheck, 
  MapPin, 
  KeyRound, 
  FileText, 
  Award,
  ArrowRight
} from 'lucide-react';

interface BuyersSectionProps {
  onNavigateToMap: () => void;
  onNavigateToProperties: () => void;
  onNavigateToMortgage: () => void;
}

export const BuyersSection: React.FC<BuyersSectionProps> = ({
  onNavigateToMap,
  onNavigateToProperties,
  onNavigateToMortgage,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-[#1D2421]">
      
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 bg-[#FBEAE5] text-[#D95D39] border border-[#F5D2C8] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          <Compass className="w-3.5 h-3.5 text-[#D95D39]" />
          <span>Buyer Advisory & Private Acquisition</span>
        </div>
        <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#1D2421] tracking-tight">
          Curated Acquisition for Discriminating Buyers
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          Gain privileged access to unlisted pocket listings, premier architectural landmarks, and comprehensive school catchment intelligence.
        </p>
      </div>

      {/* 4-Step Acquisition Roadmap */}
      <div className="bg-white rounded-2xl p-6 sm:p-10 border border-stone-200 shadow-xs space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
          <div>
            <h2 className="font-serif-luxury text-2xl font-bold text-[#1D2421]">
              The Shah & Co. Buyer Roadmap
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">End-to-end bespoke fiduciary guidance</p>
          </div>

          <button
            onClick={onNavigateToProperties}
            className="inline-flex items-center space-x-1 text-xs font-bold text-[#D95D39] hover:underline transition cursor-pointer"
          >
            <span>Browse Active Portfolio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="p-5 bg-[#F8F9F5] rounded-2xl border border-stone-200/90 space-y-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1D2421] text-white font-bold text-xs flex items-center justify-center shadow-xs">
              01
            </div>
            <h3 className="font-bold text-sm text-[#1D2421]">Confidential Discovery</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Defining architectural taste, square footage, school priorities, and custom dynamic field requirements.
            </p>
          </div>

          <div className="p-5 bg-[#F8F9F5] rounded-2xl border border-stone-200/90 space-y-2.5">
            <div className="w-8 h-8 rounded-full bg-[#D95D39] text-white font-bold text-xs flex items-center justify-center shadow-xs">
              02
            </div>
            <h3 className="font-bold text-sm text-[#1D2421]">Off-Market Sourcing</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Tapping private broker networks to preview unlisted trophy penthouses and commercial assets.
            </p>
          </div>

          <div className="p-5 bg-[#F8F9F5] rounded-2xl border border-stone-200/90 space-y-2.5">
            <div className="w-8 h-8 rounded-full bg-[#3D5C4B] text-white font-bold text-xs flex items-center justify-center shadow-xs">
              03
            </div>
            <h3 className="font-bold text-sm text-[#1D2421]">Diligence & Financing</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Conducting structural evaluations, HOA review, zoning checks, and mortgage optimization.
            </p>
          </div>

          <div className="p-5 bg-[#F8F9F5] rounded-2xl border border-stone-200/90 space-y-2.5">
            <div className="w-8 h-8 rounded-full bg-[#1D2421] text-white font-bold text-xs flex items-center justify-center shadow-xs">
              04
            </div>
            <h3 className="font-bold text-sm text-[#1D2421]">Seamless Closing</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Fiduciary negotiation, private legal structuring, and white-glove key handover.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-white border border-stone-200 text-[#1D2421] p-8 rounded-2xl space-y-4 flex flex-col justify-between shadow-xs">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F8F9F5] border border-stone-200 flex items-center justify-center text-[#D95D39]">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-serif-luxury text-2xl font-bold text-[#1D2421]">Interactive Geographic Map Search</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Explore listings mapped with precise GPS coordinates, school boundary proximity ratings, and live transit walk scores.
            </p>
          </div>
          <button
            onClick={onNavigateToMap}
            className="w-full bg-[#D95D39] hover:bg-[#C8522E] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition text-center shadow-xs cursor-pointer"
          >
            Launch Map Explorer →
          </button>
        </div>

        <div className="bg-white border border-stone-200 text-[#1D2421] p-8 rounded-2xl space-y-4 flex flex-col justify-between shadow-xs">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F8F9F5] border border-stone-200 flex items-center justify-center text-[#3D5C4B]">
              <KeyRound className="w-5 h-5" />
            </div>
            <h3 className="font-serif-luxury text-2xl font-bold text-[#1D2421]">Financing & Mortgage Modeler</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Model real-time interest rates, custom down payments, property taxes, and monthly carrying costs for any listing.
            </p>
          </div>
          <button
            onClick={onNavigateToMortgage}
            className="w-full bg-[#1D2421] hover:bg-stone-800 text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition text-center shadow-xs cursor-pointer"
          >
            Open Mortgage Calculator →
          </button>
        </div>

      </div>

    </div>
  );
};
