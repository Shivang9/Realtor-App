import React, { useState } from 'react';
import { PropertyCategory, ValuationRequest } from '../types';
import { formatCurrency } from '../utils/formatters';
import { apiService } from '../services/apiService';
import { 
  TrendingUp, 
  Sparkles, 
  Camera, 
  Globe2, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  BarChart3,
  Award,
  Building
} from 'lucide-react';

export const SellersSection: React.FC<{ onNavigateToContact: () => void }> = ({ onNavigateToContact }) => {
  const [ownerName, setOwnerName] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyCategory>('residential');
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(3);
  const [sqft, setSqft] = useState(3000);
  const [renovationsNotes, setRenovationsNotes] = useState('');
  const [timeline, setTimeline] = useState<'Immediately' | '1-3 months' | '3-6 months' | 'Just curious'>('1-3 months');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [valuationResult, setValuationResult] = useState<ValuationRequest | null>(null);

  const handleValuationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName || !ownerEmail || !propertyAddress) return;

    setIsSubmitting(true);
    try {
      const res = await apiService.submitValuation({
        ownerName,
        ownerEmail,
        ownerPhone,
        propertyAddress,
        propertyType,
        bedrooms,
        bathrooms,
        sqft,
        renovationsNotes,
        timeline,
      });
      setValuationResult(res.valuation);
    } catch (err: any) {
      alert(err.message || 'Failed to generate valuation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-[#1D2421]">
      
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 bg-[#FBEAE5] text-[#D95D39] border border-[#F5D2C8] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          <TrendingUp className="w-3.5 h-3.5 text-[#D95D39]" />
          <span>Seller Advisory & Asset Disposition</span>
        </div>
        <h1 className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#1D2421] tracking-tight">
          Maximize the Value of Your Property
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          From historic Annex estates to trophy Yorkville commercial floorplates, we deploy global private syndication, architectural videography, and targeted high-net-worth outreach.
        </p>
      </div>

      {/* Valuation Request Builder */}
      <div className="bg-white rounded-2xl p-6 sm:p-10 border border-stone-200 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-5 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#D95D39]">Market Appraisal Dossier</span>
            <h2 className="font-serif-luxury text-2xl sm:text-4xl text-[#1D2421] font-bold leading-tight">
              Instant Confidential Property Valuation
            </h2>
            <p className="text-stone-600 text-sm leading-relaxed">
              Our algorithmic model benchmarks current comparable transactions, neighborhood price-per-square-foot dynamics, and recent capital appreciation in your postal district.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-3 text-xs text-stone-700">
                <CheckCircle2 className="w-4 h-4 text-[#3D5C4B] shrink-0" />
                <span>Zero obligation, strictly confidential report</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-stone-700">
                <CheckCircle2 className="w-4 h-4 text-[#3D5C4B] shrink-0" />
                <span>Tailored comparable sales analysis within 500m</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-stone-700">
                <CheckCircle2 className="w-4 h-4 text-[#3D5C4B] shrink-0" />
                <span>Reviewed by Senior Managing Partners</span>
              </div>
            </div>
          </div>

          {/* Form / Result Box */}
          <div className="lg:col-span-7 bg-[#F8F9F5] p-6 sm:p-8 rounded-2xl border border-stone-200/90">
            {valuationResult ? (
              <div className="space-y-6 text-center">
                <div className="w-14 h-14 rounded-full bg-[#FBEAE5] text-[#D95D39] border border-[#F5D2C8] flex items-center justify-center mx-auto">
                  <Award className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs uppercase font-bold text-stone-500">Estimated Market Range</span>
                  <div className="font-serif-luxury text-3xl sm:text-5xl font-bold text-[#1D2421] mt-1">
                    {formatCurrency(valuationResult.estimatedValue || 4500000)}
                  </div>
                  <div className="text-xs text-[#D95D39] font-semibold mt-1">
                    ± 3.5% Confidence Interval for {valuationResult.propertyAddress}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-stone-200 text-xs text-stone-700 text-left space-y-2">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Property Classification:</span>
                    <strong className="text-[#1D2421] uppercase">{valuationResult.propertyType}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Size / Footprint:</span>
                    <strong className="text-[#1D2421]">{valuationResult.sqft} Sq. Ft.</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Target Timeline:</span>
                    <strong className="text-[#1D2421]">{valuationResult.timeline}</strong>
                  </div>
                </div>

                <p className="text-xs text-stone-500">
                  Our Managing Director will contact {valuationResult.ownerEmail} to provide the comprehensive 18-page comparative market analysis.
                </p>

                <button
                  onClick={() => setValuationResult(null)}
                  className="px-6 py-2.5 rounded-xl bg-[#1D2421] hover:bg-stone-800 text-white text-xs font-bold uppercase transition shadow-xs cursor-pointer"
                >
                  Estimate Another Property
                </button>
              </div>
            ) : (
              <form onSubmit={handleValuationSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">Owner / Representative Name *</label>
                    <input
                      type="text"
                      required
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="e.g. Katherine Sterling"
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-white text-[#1D2421] focus:outline-none focus:ring-2 focus:ring-[#D95D39]/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={ownerEmail}
                      onChange={(e) => setOwnerEmail(e.target.value)}
                      placeholder="e.g. katherine@example.com"
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-white text-[#1D2421] focus:outline-none focus:ring-2 focus:ring-[#D95D39]/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">Property Street Address *</label>
                    <input
                      type="text"
                      required
                      value={propertyAddress}
                      onChange={(e) => setPropertyAddress(e.target.value)}
                      placeholder="e.g. 140 Hazelton Ave, Yorkville"
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-white text-[#1D2421] focus:outline-none focus:ring-2 focus:ring-[#D95D39]/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">Property Category</label>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value as PropertyCategory)}
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-white text-[#1D2421] focus:outline-none focus:ring-2 focus:ring-[#D95D39]/30"
                    >
                      <option value="residential">Residential Estate / Home</option>
                      <option value="luxury_penthouse">Luxury Penthouse / Condo</option>
                      <option value="commercial">Commercial / Retail Flagship</option>
                      <option value="land">Development Land / Parcel</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">Bedrooms</label>
                    <input
                      type="number"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(Number(e.target.value))}
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-white text-[#1D2421] focus:outline-none focus:ring-2 focus:ring-[#D95D39]/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">Bathrooms</label>
                    <input
                      type="number"
                      value={bathrooms}
                      onChange={(e) => setBathrooms(Number(e.target.value))}
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-white text-[#1D2421] focus:outline-none focus:ring-2 focus:ring-[#D95D39]/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">Approx. Sq Ft</label>
                    <input
                      type="number"
                      value={sqft}
                      onChange={(e) => setSqft(Number(e.target.value))}
                      step="100"
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-white text-[#1D2421] focus:outline-none focus:ring-2 focus:ring-[#D95D39]/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">Notable Upgrades & Architectural Features</label>
                  <textarea
                    rows={2}
                    value={renovationsNotes}
                    onChange={(e) => setRenovationsNotes(e.target.value)}
                    placeholder="e.g. Poliform kitchen, private elevator, pool, wine cellar, recent roof replacement..."
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-white text-[#1D2421] focus:outline-none focus:ring-2 focus:ring-[#D95D39]/30"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#D95D39] hover:bg-[#C8522E] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isSubmitting ? 'Calculating...' : 'Generate Instant Property Valuation'}</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </div>

      {/* Seller Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#F8F9F5] border border-stone-200 text-[#D95D39] flex items-center justify-center">
            <Globe2 className="w-5 h-5" />
          </div>
          <h3 className="font-serif-luxury text-xl font-bold text-[#1D2421]">Global Private Syndication</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Direct syndication to our confidential directory of international family offices, institutional capital, and vetted VIP purchasers.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#F8F9F5] border border-stone-200 text-[#3D5C4B] flex items-center justify-center">
            <Camera className="w-5 h-5" />
          </div>
          <h3 className="font-serif-luxury text-xl font-bold text-[#1D2421]">Cinematic Production</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Bespoke 4K drone cinematography, architectural twilight staging, and Matterport laser scans to accentuate every millimeter.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#F8F9F5] border border-stone-200 text-[#1D2421] flex items-center justify-center">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h3 className="font-serif-luxury text-xl font-bold text-[#1D2421]">Precision Negotiation</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Consistently achieving top 1% benchmark pricing with minimal days-on-market through discreet competitive bidding structures.
          </p>
        </div>
      </div>

    </div>
  );
};
