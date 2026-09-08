import React, { useState, useEffect } from 'react';
import { Property, CustomFieldDefinition, AgentInfo } from './types';
import { apiService } from './services/apiService';
import { INITIAL_PROPERTIES, INITIAL_CUSTOM_FIELDS, INITIAL_AGENTS } from './data/mockData';

// Layout Components
import { Navbar } from './components/Navbar';

// Section Views
import { PropertyListView } from './components/PropertyListView';
import { MapSearchView } from './components/MapSearchView';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { MortgageCalculatorSection } from './components/MortgageCalculatorSection';
import { ContactUsSection } from './components/ContactUsSection';
import { SellersSection } from './components/SellersSection';
import { BuyersSection } from './components/BuyersSection';
import { AdminPortal } from './components/AdminPortal';

// Icons
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Heart, 
  Shield, 
  Sparkles, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  X
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('properties');
  const [adminInitialTab, setAdminInitialTab] = useState<'properties' | 'agents' | 'fields' | 'leads'>('properties');
  const [userRole, setUserRole] = useState<'buyer' | 'seller'>('buyer');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [customFields, setCustomFields] = useState<CustomFieldDefinition[]>(INITIAL_CUSTOM_FIELDS);
  const [agents, setAgents] = useState<AgentInfo[]>(INITIAL_AGENTS);
  
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [calculatorProperty, setCalculatorProperty] = useState<Property | null>(null);
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>([
    'prop-200-cumberland',
    'prop-155-cumberland'
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Scheduled tours mock state
  const [scheduledTours, setScheduledTours] = useState<Array<{ id: string; property: Property; date: string; time: string; status: string }>>([
    {
      id: 'tour-1',
      property: INITIAL_PROPERTIES[0],
      date: 'Tomorrow, 2:00 PM',
      time: '45 mins private walkthrough',
      status: 'Confirmed with Senior Partner'
    }
  ]);

  // Load properties, custom fields, and agents from backend API
  const loadData = async () => {
    try {
      const [propsData, fieldsData, agentsData] = await Promise.all([
        apiService.getProperties(),
        apiService.getCustomFields(),
        apiService.getAgents(),
      ]);
      if (Array.isArray(propsData) && propsData.length > 0) {
        setProperties(propsData);
      }
      if (Array.isArray(fieldsData) && fieldsData.length > 0) {
        setCustomFields(fieldsData);
      }
      if (Array.isArray(agentsData) && agentsData.length > 0) {
        setAgents(agentsData);
      }
    } catch (err) {
      console.warn('Backend API connection fallback to seed state:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleSave = (propId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedPropertyIds((prev) =>
      prev.includes(propId) ? prev.filter((id) => id !== propId) : [...prev, propId]
    );
  };

  const handleOpenMortgageFromDetail = (prop: Property) => {
    setSelectedProperty(null);
    setCalculatorProperty(prop);
    setCurrentTab('mortgage');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTabSelect = (tab: string) => {
    if (tab === 'admin-agents') {
      setAdminInitialTab('agents');
      setCurrentTab('admin');
    } else if (tab === 'admin') {
      setAdminInitialTab('properties');
      setCurrentTab('admin');
    } else {
      setCurrentTab(tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRoleChange = (role: 'buyer' | 'seller') => {
    setUserRole(role);
    if (role === 'buyer') {
      setCurrentTab('buyers');
    } else {
      setCurrentTab('sellers');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtered properties when saved tab is selected
  const savedProperties = properties.filter((p) => savedPropertyIds.includes(p.id));

  return (
    <div className="min-h-screen bg-[#F8F9F5] text-[#1D2421] flex flex-col font-sans selection:bg-[#D95D39]/20">
      
      {/* Top Editorial Navigation Menu */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleTabSelect}
        savedCount={savedPropertyIds.length}
        toursCount={scheduledTours.length}
        userRole={userRole}
        onRoleChange={handleRoleChange}
      />

      {/* Main Content Area */}
      <main className="flex-1">
          {/* TAB: PROPERTIES / EXPLORE */}
          {currentTab === 'properties' && (
            <PropertyListView
              properties={properties}
              onSelectProperty={(prop) => setSelectedProperty(prop)}
              onNavigateToMap={() => handleTabSelect('map-search')}
              savedIds={savedPropertyIds}
              onToggleSave={handleToggleSave}
            />
          )}

          {/* TAB: SAVED HOMES */}
          {currentTab === 'saved' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
                <div>
                  <div className="inline-flex items-center space-x-2 bg-[#FAF6F4] text-[#D95D39] border border-[#F0D5CC] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                    <Heart className="w-3.5 h-3.5 fill-[#D95D39]" />
                    <span>Curated Shortlist</span>
                  </div>
                  <h1 className="font-serif-luxury text-3xl sm:text-4xl font-normal text-[#1D2421]">
                    Your Saved Residences
                  </h1>
                  <p className="text-stone-600 text-sm mt-1">
                    Privately shortlisted trophy properties available for discreet viewings and private consultations.
                  </p>
                </div>
                <button
                  onClick={() => handleTabSelect('properties')}
                  className="px-5 py-2.5 rounded-xl bg-white border border-stone-200 hover:border-stone-300 text-xs font-bold text-[#1D2421] transition shadow-xs self-start sm:self-auto cursor-pointer"
                >
                  Browse Full Portfolio
                </button>
              </div>

              {savedProperties.length > 0 ? (
                <PropertyListView
                  properties={savedProperties}
                  onSelectProperty={(prop) => setSelectedProperty(prop)}
                  onNavigateToMap={() => handleTabSelect('map-search')}
                  savedIds={savedPropertyIds}
                  onToggleSave={handleToggleSave}
                />
              ) : (
                <div className="bg-white rounded-3xl border border-stone-200/80 p-12 text-center max-w-xl mx-auto space-y-4 shadow-xs">
                  <div className="w-14 h-14 rounded-2xl bg-[#FAF6F4] border border-[#F0D5CC] flex items-center justify-center mx-auto text-[#D95D39]">
                    <Heart className="w-7 h-7" />
                  </div>
                  <h3 className="font-serif-luxury text-2xl font-normal text-[#1D2421]">
                    No Saved Residences Yet
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    Click the heart icon on any residence to bookmark it here for side-by-side comparison, financial modeling, or private showings.
                  </p>
                  <button
                    onClick={() => handleTabSelect('properties')}
                    className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#D95D39] hover:bg-[#C8502C] text-white text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer"
                  >
                    <span>Explore Portfolio</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB: SCHEDULED TOURS */}
          {currentTab === 'tours' && (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
              <div className="border-b border-stone-200 pb-6">
                <div className="inline-flex items-center space-x-2 bg-[#EAEFE8] text-[#273B30] border border-[#D5DDD2] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
                  <Calendar className="w-3.5 h-3.5 text-[#3D5C4B]" />
                  <span>Private Viewings</span>
                </div>
                <h1 className="font-serif-luxury text-3xl sm:text-4xl font-normal text-[#1D2421]">
                  Scheduled Tours & Showings
                </h1>
                <p className="text-stone-600 text-sm mt-1">
                  Confirmed and pending confidential walkthroughs accompanied by your designated private wealth advisor.
                </p>
              </div>

              {scheduledTours.length > 0 ? (
                <div className="space-y-4">
                  {scheduledTours.map((tour) => (
                    <div
                      key={tour.id}
                      className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                    >
                      <div className="flex items-start space-x-4">
                        <img
                          src={tour.property.images[0]}
                          alt={tour.property.title}
                          className="w-24 h-24 rounded-xl object-cover shrink-0 border border-stone-200"
                        />
                        <div className="space-y-1">
                          <span className="inline-flex items-center space-x-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{tour.status}</span>
                          </span>
                          <h3 className="font-serif-luxury text-lg font-bold text-[#1D2421]">
                            {tour.property.street}
                          </h3>
                          <p className="text-xs text-stone-500">
                            {tour.property.neighborhood} • {tour.property.city}
                          </p>
                          <div className="flex items-center space-x-3 text-xs text-stone-700 pt-1 font-medium">
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-3.5 h-3.5 text-[#D95D39]" />
                              <span>{tour.date}</span>
                            </span>
                            <span>•</span>
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3.5 h-3.5 text-[#3D5C4B]" />
                              <span>{tour.time}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 w-full md:w-auto">
                        <button
                          onClick={() => setSelectedProperty(tour.property)}
                          className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-[#F8F9F5] hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-bold transition cursor-pointer"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleTabSelect('contact')}
                          className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl bg-[#D95D39] hover:bg-[#C8502C] text-white text-xs font-bold transition shadow-sm cursor-pointer"
                        >
                          Message Advisor
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-3">
                  <Calendar className="w-10 h-10 text-stone-400 mx-auto" />
                  <h3 className="font-serif-luxury text-xl font-bold text-[#1D2421]">No Active Showings</h3>
                  <p className="text-xs text-stone-600 max-w-sm mx-auto">
                    Select any residence from our portfolio to request a private walkthrough.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB: MAP SEARCH */}
          {currentTab === 'map-search' && (
            <MapSearchView
              properties={properties}
              onSelectProperty={(prop) => setSelectedProperty(prop)}
              savedIds={savedPropertyIds}
              onToggleSave={handleToggleSave}
            />
          )}

          {/* TAB: BUYERS */}
          {currentTab === 'buyers' && (
            <BuyersSection
              onNavigateToMap={() => handleTabSelect('map-search')}
              onNavigateToProperties={() => handleTabSelect('properties')}
              onNavigateToMortgage={() => handleTabSelect('mortgage')}
            />
          )}

          {/* TAB: SELLERS */}
          {currentTab === 'sellers' && (
            <SellersSection
              onNavigateToContact={() => handleTabSelect('contact')}
            />
          )}

          {/* TAB: MORTGAGE */}
          {currentTab === 'mortgage' && (
            <MortgageCalculatorSection
              properties={properties}
              initialProperty={calculatorProperty}
              onSelectProperty={(prop) => setSelectedProperty(prop)}
              onNavigateToContact={() => handleTabSelect('contact')}
            />
          )}

          {/* TAB: CONTACT */}
          {currentTab === 'contact' && (
            <ContactUsSection />
          )}

          {/* TAB: ADMIN (With full agent management & dynamic schema) */}
          {currentTab === 'admin' && (
            <AdminPortal
              properties={properties}
              customFields={customFields}
              agents={agents}
              initialTab={adminInitialTab}
              onRefreshData={loadData}
            />
          )}
        </main>

        {/* 3. Luxury Editorial Footer */}
        <footer className="bg-white text-stone-600 text-xs border-t border-stone-200/80 mt-16 shrink-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              
              {/* Brand column */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-full bg-[#1D2421] text-white flex items-center justify-center font-serif-luxury font-bold text-xs">
                    S
                  </div>
                  <span className="font-serif-luxury text-2xl font-bold text-[#1D2421] tracking-tight">
                    Shah <span className="italic text-[#D95D39]">&</span> Co.
                  </span>
                </div>
                <p className="text-[12px] text-stone-600 leading-relaxed">
                  A bespoke luxury real estate brokerage and private advisory specializing in architectural estates, trophy penthouses, and heritage restorations.
                </p>
                <div className="text-[10px] text-stone-500 font-mono">
                  RECO Brokerage License #4829104 • Shah & Co. Group
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-2">
                <div className="text-[#1D2421] font-bold text-xs uppercase tracking-wider">Navigation</div>
                <ul className="space-y-1.5">
                  <li><button onClick={() => handleTabSelect('properties')} className="hover:text-[#D95D39] transition cursor-pointer">Featured Portfolio</button></li>
                  <li><button onClick={() => handleTabSelect('map-search')} className="hover:text-[#D95D39] transition cursor-pointer">Interactive Map Search</button></li>
                  <li><button onClick={() => handleTabSelect('buyers')} className="hover:text-[#D95D39] transition cursor-pointer">Buyer Concierge & Schools</button></li>
                  <li><button onClick={() => handleTabSelect('sellers')} className="hover:text-[#D95D39] transition cursor-pointer">Home Valuation & Strategy</button></li>
                  <li><button onClick={() => handleTabSelect('mortgage')} className="hover:text-[#D95D39] transition cursor-pointer">Mortgage Modeler</button></li>
                </ul>
              </div>

              {/* Admin & Brokerage Operations */}
              <div className="space-y-2">
                <div className="text-[#1D2421] font-bold text-xs uppercase tracking-wider">Brokerage Console</div>
                <ul className="space-y-1.5">
                  <li><button onClick={() => handleTabSelect('admin-agents')} className="hover:text-[#D95D39] text-[#D95D39] font-semibold transition cursor-pointer">Manage Advisory Agents</button></li>
                  <li><button onClick={() => handleTabSelect('admin')} className="hover:text-[#D95D39] transition cursor-pointer">Property Catalog & Schema</button></li>
                  <li><button onClick={() => handleTabSelect('admin')} className="hover:text-[#D95D39] transition cursor-pointer">Custom Field Definitions</button></li>
                  <li><button onClick={() => handleTabSelect('contact')} className="hover:text-[#D95D39] transition cursor-pointer">VIP Client Inquiries</button></li>
                </ul>
              </div>

              {/* Headquarters & Contact */}
              <div className="space-y-2">
                <div className="text-[#1D2421] font-bold text-xs uppercase tracking-wider">Flagship Office</div>
                <div className="text-stone-600 space-y-1">
                  <div>200 Cumberland St, Yorkville / Annex</div>
                  <div>Toronto, ON M5R 1A6</div>
                  <div className="text-[#D95D39] font-semibold pt-1 font-mono">+1 (416) 902-8800</div>
                  <div className="text-stone-500">concierge@shahandco.com</div>
                </div>
              </div>

            </div>

            <div className="mt-8 pt-6 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-stone-500">
              <span>© {new Date().getFullYear()} Shah & Co. Real Estate. All rights reserved.</span>
              <span>Equal Housing Opportunity • Private Client Fiduciary Standards</span>
            </div>
          </div>
        </footer>

      {/* 4. Property Details Modal (Leaflet powered, no API key required) */}
      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          customFieldDefs={customFields}
          onOpenMortgageCalculator={handleOpenMortgageFromDetail}
        />
      )}

    </div>
  );
}
