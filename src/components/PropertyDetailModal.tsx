import React, { useState, useEffect } from 'react';
import { Property, CustomFieldDefinition } from '../types';
import { formatCurrency, formatNumber, calculateDistanceKm, estimateDriveTime } from '../utils/formatters';
import { 
  X, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Calendar, 
  GraduationCap, 
  Compass, 
  Calculator, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Navigation, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Shield,
  Layers,
  Send
} from 'lucide-react';
import { apiService } from '../services/apiService';
import { PropertyMiniMap } from './PropertyMiniMap';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
  customFieldDefs: CustomFieldDefinition[];
  onOpenMortgageCalculator?: (property: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  customFieldDefs,
  onOpenMortgageCalculator,
}) => {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [distanceFromUser, setDistanceFromUser] = useState<number | null>(null);
  
  // Inquiry Form State
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryEmail, setInquiryEmail] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryDate, setInquiryDate] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('I am interested in scheduling a private VIP viewing of this property.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Mortgage Quick Tab
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [interestRate, setInterestRate] = useState(5.75);
  const [loanYears, setLoanYears] = useState(30);

  useEffect(() => {
    setSelectedImageIdx(0);
    setSubmitSuccess(false);
  }, [property?.id]);

  if (!property) return null;

  // Handle Geolocation Tracking
  const handleTrackLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(userCoords);
        const dist = calculateDistanceKm(userCoords.lat, userCoords.lng, property.coordinates.lat, property.coordinates.lng);
        setDistanceFromUser(dist);
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        // Fallback default coordinates (e.g. Toronto Financial District)
        const fallback = { lat: 43.6487, lng: -79.3817 };
        setUserLocation(fallback);
        const dist = calculateDistanceKm(fallback.lat, fallback.lng, property.coordinates.lat, property.coordinates.lng);
        setDistanceFromUser(dist);
        setIsLocating(false);
      }
    );
  };

  // Quick calculate monthly payment
  const loanAmt = property.price * (1 - downPaymentPct / 100);
  const r = interestRate / 100 / 12;
  const n = loanYears * 12;
  const monthlyPI = r > 0 ? (loanAmt * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1) : loanAmt / n;
  const monthlyTax = (property.taxAnnual || 0) / 12;
  const monthlyHoa = property.hoaFeesMonthly || 0;
  const monthlyTotal = Math.round(monthlyPI + monthlyTax + monthlyHoa);

  // Filter custom fields applicable for this category
  const relevantFields = customFieldDefs.filter(
    (f) => f.categoryId === property.category || f.categoryId === 'all'
  );

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryEmail) return;

    setIsSubmitting(true);
    try {
      await apiService.submitContact({
        propertyId: property.id,
        propertyTitle: property.title,
        name: inquiryName,
        email: inquiryEmail,
        phone: inquiryPhone,
        inquiryType: 'Showing Request',
        preferredDate: inquiryDate,
        message: inquiryMessage,
      });
      setSubmitSuccess(true);
      setInquiryName('');
      setInquiryEmail('');
      setInquiryPhone('');
    } catch (err: any) {
      alert(err.message || 'Failed to submit inquiry');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div 
        className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col border border-stone-200 text-[#1D2421]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-stone-200/80 flex items-center justify-between bg-white sticky top-0 z-20">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase tracking-widest font-bold text-[#D95D39] bg-[#FBEAE5] border border-[#F5D2C8] px-2.5 py-0.5 rounded-full">
                {property.category.replace('_', ' ')}
              </span>
              <span className="text-xs font-semibold text-[#273B30] bg-[#E6EDE8] border border-[#D3DDD5] px-2.5 py-0.5 rounded-full">
                {property.status}
              </span>
            </div>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#1D2421] mt-1">
              {property.street} {property.unitNumber ? `#${property.unitNumber}` : ''}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* Main Gallery Hero */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-stone-100 shadow-sm border border-stone-200">
              <img
                src={property.images[selectedImageIdx] || property.images[0]}
                alt={property.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImageIdx((prev) => (prev > 0 ? prev - 1 : property.images.length - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-stone-800 hover:bg-white transition backdrop-blur-xs border border-black/5 shadow-sm"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedImageIdx((prev) => (prev < property.images.length - 1 ? prev + 1 : 0))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-stone-800 hover:bg-white transition backdrop-blur-xs border border-black/5 shadow-sm"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Price Banner overlay */}
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md border border-stone-200/80 px-4 py-2 rounded-xl text-[#1D2421] shadow-sm">
                <div className="text-xs text-stone-500 font-medium">Offered at</div>
                <div className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-tight text-[#1D2421]">
                  {formatCurrency(property.price)}
                </div>
              </div>
            </div>

            {/* Thumbnails */}
            {property.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-1">
                {property.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                      selectedImageIdx === idx ? 'border-[#D95D39] scale-95 shadow-xs' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Key Metric Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F8F9F5] p-4 rounded-2xl border border-stone-200">
            <div className="flex items-center space-x-3 p-2">
              <Square className="w-6 h-6 text-[#D95D39]" />
              <div>
                <div className="text-xs text-stone-500 font-medium">Interior Area</div>
                <div className="text-base font-bold text-[#1D2421]">{formatNumber(property.sqft)} Sq. Ft.</div>
              </div>
            </div>

            {property.bedrooms > 0 && (
              <div className="flex items-center space-x-3 p-2">
                <Bed className="w-6 h-6 text-[#D95D39]" />
                <div>
                  <div className="text-xs text-stone-500 font-medium">Bedrooms</div>
                  <div className="text-base font-bold text-[#1D2421]">
                    {property.bedrooms}{property.extraBeds ? `+${property.extraBeds}` : ''} Beds
                  </div>
                </div>
              </div>
            )}

            {property.bathrooms > 0 && (
              <div className="flex items-center space-x-3 p-2">
                <Bath className="w-6 h-6 text-[#D95D39]" />
                <div>
                  <div className="text-xs text-stone-500 font-medium">Bathrooms</div>
                  <div className="text-base font-bold text-[#1D2421]">{property.bathrooms} Baths</div>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3 p-2">
              <Calendar className="w-6 h-6 text-[#D95D39]" />
              <div>
                <div className="text-xs text-stone-500 font-medium">Year Built</div>
                <div className="text-base font-bold text-[#1D2421]">{property.yearBuilt || 'Contemporary'}</div>
              </div>
            </div>
          </div>

          {/* Overview & Description */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-[#1D2421] flex items-center space-x-2 font-serif-luxury">
              <Sparkles className="w-5 h-5 text-[#D95D39]" />
              <span>Architectural Overview & Highlights</span>
            </h3>
            <p className="text-stone-600 leading-relaxed text-sm sm:text-base">
              {property.description}
            </p>

            {property.features && property.features.length > 0 && (
              <div className="pt-3">
                <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Key Features</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {property.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-sm text-stone-700">
                      <CheckCircle2 className="w-4 h-4 text-[#476755] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dynamic Custom Fields Section */}
          {relevantFields.length > 0 && (
            <div className="bg-[#F8F9F5] border border-stone-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#1D2421] flex items-center space-x-2">
                  <Layers className="w-5 h-5 text-[#D95D39]" />
                  <span>Category-Specific Specifications ({property.category.replace('_', ' ')})</span>
                </h3>
                <span className="text-xs text-stone-500 font-medium">Dynamic Custom Fields</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {relevantFields.map((field) => {
                  const val = property.customFields?.[field.id] ?? property.customFields?.[field.name];
                  return (
                    <div key={field.id} className="bg-white p-3.5 rounded-xl border border-stone-200/90 shadow-xs">
                      <div className="text-xs text-stone-500 font-medium">{field.label}</div>
                      <div className="text-sm font-semibold text-[#1D2421] mt-1">
                        {val === true
                          ? 'Yes / Included'
                          : val === false
                          ? 'No'
                          : val !== undefined && val !== null && val !== ''
                          ? `${field.type === 'currency' ? formatCurrency(Number(val)) : val} ${field.unit || ''}`
                          : 'Not Specified'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Location Tracking & Map Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-[#1D2421] flex items-center space-x-2 font-serif-luxury">
                  <MapPin className="w-5 h-5 text-[#D95D39]" />
                  <span>Location & Distance Tracking</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {property.street}, {property.neighborhood}, {property.city} {property.postalCode}
                </p>
              </div>

              <button
                onClick={handleTrackLocation}
                disabled={isLocating}
                className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-[#D95D39] hover:bg-[#C8522E] text-white text-xs font-bold transition shrink-0 shadow-xs cursor-pointer"
              >
                <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? 'Locating...' : 'Track Distance from Me'}</span>
              </button>
            </div>

            {distanceFromUser !== null && (
              <div className="bg-[#E6EDE8] border border-[#CDE0D1] p-3.5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-[#3D5C4B] text-white flex items-center justify-center font-bold text-xs">
                    {distanceFromUser} km
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#273B30]">Direct Distance from Your Current Location</div>
                    <div className="text-xs text-[#3D5C4B]">Estimated Commute: {estimateDriveTime(distanceFromUser)}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Interactive property mini-map (No API Key Required) */}
            <PropertyMiniMap
              coordinates={property.coordinates}
              title={property.title}
              priceFormatted={formatCurrency(property.price)}
              address={`${property.street}, ${property.city}`}
            />
          </div>

          {/* Nearby Schools & Amenities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Schools */}
            <div className="bg-[#F8F9F5] border border-stone-200 p-5 rounded-2xl space-y-3">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-[#3D5C4B]" />
                <h4 className="text-base font-bold text-[#1D2421]">Top Nearby Schools</h4>
              </div>

              {property.schools && property.schools.length > 0 ? (
                <div className="space-y-2.5">
                  {property.schools.map((sch, i) => (
                    <div key={i} className="bg-white p-3 rounded-xl border border-stone-200/90 flex items-center justify-between shadow-xs">
                      <div>
                        <div className="text-sm font-semibold text-[#1D2421]">{sch.name}</div>
                        <div className="text-xs text-stone-500">
                          {sch.type} • Grades {sch.grades} • {sch.distance} {sch.walkTime ? `(${sch.walkTime})` : ''}
                        </div>
                      </div>
                      <div className="bg-[#E6EDE8] text-[#273B30] border border-[#CDE0D1] font-bold text-xs px-2.5 py-1 rounded-lg">
                        ★ {sch.rating}/10
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-stone-500">Commercial / Downtown Zone - Inquire for customized catchment reports.</p>
              )}
            </div>

            {/* Amenities */}
            <div className="bg-[#F8F9F5] border border-stone-200 p-5 rounded-2xl space-y-3">
              <div className="flex items-center space-x-2">
                <Compass className="w-5 h-5 text-[#D95D39]" />
                <h4 className="text-base font-bold text-[#1D2421]">Neighborhood Amenities</h4>
              </div>

              {property.amenities && property.amenities.length > 0 ? (
                <div className="space-y-2.5">
                  {property.amenities.map((am, i) => (
                    <div key={i} className="bg-white p-3 rounded-xl border border-stone-200/90 flex items-center justify-between shadow-xs">
                      <div>
                        <div className="text-sm font-semibold text-[#1D2421]">{am.name}</div>
                        <div className="text-xs text-stone-500">
                          {am.category} • {am.distance} {am.walkTime ? `(${am.walkTime})` : ''}
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md">
                        {am.category}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-stone-500">Curated amenities available upon request.</p>
              )}
            </div>

          </div>

          {/* Integrated Mortgage Estimator */}
          <div className="bg-[#F8F9F5] border border-stone-200 text-[#1D2421] p-6 rounded-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <Calculator className="w-5 h-5 text-[#3D5C4B]" />
                <h3 className="text-lg font-bold text-[#1D2421] font-serif-luxury">Mortgage Payment Estimator</h3>
              </div>
              <div className="text-sm text-stone-500">
                Est. <span className="text-2xl font-bold text-[#1D2421]">{formatCurrency(monthlyTotal)}</span> / month
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="text-xs text-stone-600">Down Payment ({downPaymentPct}%)</label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={downPaymentPct}
                  onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                  className="w-full accent-[#D95D39] mt-1"
                />
                <div className="text-xs font-semibold text-[#1D2421] mt-1">
                  {formatCurrency((property.price * downPaymentPct) / 100)}
                </div>
              </div>

              <div>
                <label className="text-xs text-stone-600">Interest Rate ({interestRate}%)</label>
                <input
                  type="range"
                  min="3.0"
                  max="9.0"
                  step="0.25"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full accent-[#D95D39] mt-1"
                />
                <div className="text-xs font-semibold text-[#1D2421] mt-1">{interestRate}% Fixed</div>
              </div>

              <div>
                <label className="text-xs text-stone-600">Loan Term</label>
                <div className="flex space-x-2 mt-1">
                  {[15, 20, 30].map((term) => (
                    <button
                      key={term}
                      onClick={() => setLoanYears(term)}
                      className={`flex-1 py-1 rounded-xl text-xs font-semibold transition cursor-pointer ${
                        loanYears === term ? 'bg-[#1D2421] text-white' : 'bg-white text-stone-600 border border-stone-200'
                      }`}
                    >
                      {term} Yrs
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 text-xs text-stone-500 border-t border-stone-200">
              <span>Includes P&I, est. annual tax ({formatCurrency(property.taxAnnual)}) & HOA</span>
              {onOpenMortgageCalculator && (
                <button
                  onClick={() => onOpenMortgageCalculator(property)}
                  className="text-[#D95D39] hover:underline font-semibold cursor-pointer"
                >
                  Full Calculator & Amortization →
                </button>
              )}
            </div>
          </div>

          {/* Agent Contact & Private Tour Request */}
          <div className="bg-[#F8F9F5] border border-stone-200 rounded-2xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Agent Profile */}
              <div className="flex flex-col items-center text-center p-5 bg-white rounded-2xl border border-stone-200 shadow-xs">
                <img
                  src={property.agent.photo}
                  alt={property.agent.name}
                  referrerPolicy="no-referrer"
                  className="w-24 h-24 rounded-full object-cover border-2 border-[#D95D39] shadow-sm mb-3"
                />
                <h4 className="font-serif-luxury text-xl font-bold text-[#1D2421]">{property.agent.name}</h4>
                <div className="text-xs text-stone-500 font-medium mt-0.5">{property.agent.title}</div>
                <div className="text-[11px] text-stone-400 mt-1">License: {property.agent.licenseNumber}</div>

                <div className="w-full space-y-2 mt-4 pt-3 border-t border-stone-100 text-xs">
                  <a href={`tel:${property.agent.phone}`} className="flex items-center justify-center space-x-2 text-stone-700 hover:text-[#D95D39] font-medium">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{property.agent.phone}</span>
                  </a>
                  <a href={`mailto:${property.agent.email}`} className="flex items-center justify-center space-x-2 text-stone-700 hover:text-[#D95D39] font-medium">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{property.agent.email}</span>
                  </a>
                </div>
              </div>

              {/* Private Showing Request Form */}
              <div className="md:col-span-2 space-y-4">
                <div>
                  <h4 className="text-base font-bold text-[#1D2421]">Schedule Private Showing or Inquire</h4>
                  <p className="text-xs text-stone-500">
                    Connect directly with {property.agent.name} for an exclusive confidential viewing.
                  </p>
                </div>

                {submitSuccess ? (
                  <div className="bg-[#E6EDE8] border border-[#CDE0D1] text-[#273B30] p-4 rounded-xl flex items-center space-x-3">
                    <CheckCircle2 className="w-6 h-6 text-[#3D5C4B] shrink-0" />
                    <div>
                      <div className="font-bold text-sm">Viewing Request Received</div>
                      <div className="text-xs text-[#3D5C4B] mt-0.5">
                        {property.agent.name} will contact you at your preferred time to confirm details.
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-stone-700">Your Full Name *</label>
                        <input
                          type="text"
                          required
                          value={inquiryName}
                          onChange={(e) => setInquiryName(e.target.value)}
                          placeholder="e.g. Eleanor Vance"
                          className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-white text-[#1D2421] placeholder-stone-400 focus:ring-1 focus:ring-[#D95D39] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-stone-700">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={inquiryEmail}
                          onChange={(e) => setInquiryEmail(e.target.value)}
                          placeholder="e.g. eleanor@example.com"
                          className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-white text-[#1D2421] placeholder-stone-400 focus:ring-1 focus:ring-[#D95D39] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-stone-700">Phone Number</label>
                        <input
                          type="tel"
                          value={inquiryPhone}
                          onChange={(e) => setInquiryPhone(e.target.value)}
                          placeholder="+1 (416) 555-0100"
                          className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-white text-[#1D2421] placeholder-stone-400 focus:ring-1 focus:ring-[#D95D39] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-stone-700">Preferred Tour Date</label>
                        <input
                          type="date"
                          value={inquiryDate}
                          onChange={(e) => setInquiryDate(e.target.value)}
                          className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-white text-[#1D2421] placeholder-stone-400 focus:ring-1 focus:ring-[#D95D39] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-stone-700">Message / Confidential Note</label>
                      <textarea
                        rows={2}
                        value={inquiryMessage}
                        onChange={(e) => setInquiryMessage(e.target.value)}
                        className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-white text-[#1D2421] placeholder-stone-400 focus:ring-1 focus:ring-[#D95D39] focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#D95D39] hover:bg-[#C8522E] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center justify-center space-x-2 shadow-xs cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>{isSubmitting ? 'Sending Request...' : 'Confirm Private Tour Request'}</span>
                    </button>
                  </form>
                )}
              </div>

            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#F8F9F5] border-t border-stone-200/80 flex items-center justify-between text-xs text-stone-500">
          <span>Property Reference ID: <strong className="text-stone-800">{property.id}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 font-semibold border border-stone-200 transition shadow-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
