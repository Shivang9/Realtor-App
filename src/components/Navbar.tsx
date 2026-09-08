import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Calculator, 
  Phone, 
  ShieldCheck, 
  ChevronDown, 
  Menu, 
  X, 
  Sparkles, 
  Home, 
  TrendingUp, 
  Compass, 
  SlidersHorizontal,
  GraduationCap,
  Heart,
  Calendar,
  Settings,
  Lock,
  LogOut,
  User
} from 'lucide-react';
import { AdminUser } from '../types';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  savedCount: number;
  toursCount?: number;
  userRole?: 'buyer' | 'seller';
  onRoleChange?: (role: 'buyer' | 'seller') => void;
  isAdminLoggedIn: boolean;
  onOpenLoginModal: () => void;
  onAdminLogout: () => void;
  adminUser?: AdminUser | null;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentTab, 
  onSelectTab, 
  savedCount,
  toursCount = 1,
  userRole = 'buyer',
  onRoleChange,
  isAdminLoggedIn,
  onOpenLoginModal,
  onAdminLogout,
  adminUser
}) => {
  const [buyersOpen, setBuyersOpen] = useState(false);
  const [sellersOpen, setSellersOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const buyersTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sellersTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (buyersTimeoutRef.current) clearTimeout(buyersTimeoutRef.current);
      if (sellersTimeoutRef.current) clearTimeout(sellersTimeoutRef.current);
    };
  }, []);

  const handleBuyersEnter = () => {
    if (buyersTimeoutRef.current) clearTimeout(buyersTimeoutRef.current);
    if (sellersTimeoutRef.current) clearTimeout(sellersTimeoutRef.current);
    setBuyersOpen(true);
    setSellersOpen(false);
  };

  const handleBuyersLeave = () => {
    if (buyersTimeoutRef.current) clearTimeout(buyersTimeoutRef.current);
    buyersTimeoutRef.current = setTimeout(() => {
      setBuyersOpen(false);
    }, 200);
  };

  const handleSellersEnter = () => {
    if (sellersTimeoutRef.current) clearTimeout(sellersTimeoutRef.current);
    if (buyersTimeoutRef.current) clearTimeout(buyersTimeoutRef.current);
    setSellersOpen(true);
    setBuyersOpen(false);
  };

  const handleSellersLeave = () => {
    if (sellersTimeoutRef.current) clearTimeout(sellersTimeoutRef.current);
    sellersTimeoutRef.current = setTimeout(() => {
      setSellersOpen(false);
    }, 200);
  };

  const navigateTo = (tab: string) => {
    if (buyersTimeoutRef.current) clearTimeout(buyersTimeoutRef.current);
    if (sellersTimeoutRef.current) clearTimeout(sellersTimeoutRef.current);
    onSelectTab(tab);
    setBuyersOpen(false);
    setSellersOpen(false);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F8F9F5]/95 backdrop-blur-md border-b border-stone-200/80 transition-all duration-200">
      
      {/* Top Luxury Editorial Announcement Bar */}
      <div className="bg-[#F0F2EB] border-b border-stone-200/80 text-stone-600 text-xs px-4 sm:px-6 lg:px-8 py-1.5 flex justify-between items-center tracking-wider">
        <div className="flex items-center space-x-2.5">
          <span className="w-2 h-2 rounded-full bg-[#D95D39] inline-block animate-pulse"></span>
          <span className="font-bold text-[#1D2421] text-[11px] uppercase tracking-wider">EXCLUSIVE PORTFOLIO</span>
          <span className="hidden md:inline text-stone-400">|</span>
          <span className="hidden md:inline text-stone-600 text-[11px]">Private Curations, Architectural Estates & Commercial Advisory</span>
        </div>

        <div className="flex items-center space-x-3 text-stone-600 text-[11px]">
          <span className="hidden sm:inline text-stone-600">
            Direct Inquiries: <strong className="text-[#1D2421] font-mono">+1 (416) 902-8800</strong>
          </span>

          {/* Role switcher pill in top bar */}
          {onRoleChange && (
            <div className="hidden sm:flex items-center bg-white rounded-full p-0.5 border border-stone-200 shadow-2xs text-[10px] font-bold">
              <button
                onClick={() => onRoleChange('buyer')}
                className={`px-2.5 py-0.5 rounded-full transition cursor-pointer ${
                  userRole === 'buyer' 
                    ? 'bg-[#1D2421] text-white shadow-xs' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                For Buyers
              </button>
              <button
                onClick={() => onRoleChange('seller')}
                className={`px-2.5 py-0.5 rounded-full transition cursor-pointer ${
                  userRole === 'seller' 
                    ? 'bg-[#1D2421] text-white shadow-xs' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                For Sellers
              </button>
            </div>
          )}

          <button 
            onClick={() => navigateTo('admin')} 
            className="flex items-center space-x-1 text-stone-700 hover:text-[#1D2421] px-2.5 py-1 rounded-lg bg-white border border-stone-200 hover:border-stone-300 transition shadow-2xs font-semibold cursor-pointer"
            title="Open Admin Management Console"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#D95D39]" />
            <span>Admin Console</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <button 
            onClick={() => navigateTo('properties')}
            className="flex items-center space-x-3 text-left group focus:outline-none cursor-pointer shrink-0"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#D95D39] text-white flex items-center justify-center font-serif-luxury font-bold text-lg shadow-sm shrink-0 group-hover:scale-105 transition-transform">
              S
            </div>
            <div className="flex flex-col shrink-0 min-w-0">
              <span className="font-serif-luxury text-2xl sm:text-3xl font-bold tracking-tight text-[#D95D39] leading-none whitespace-nowrap">
                Shah <span className="font-serif italic font-normal text-[#D95D39]">&amp;</span> Co.
              </span>
              <span className="text-[10px] tracking-[0.22em] uppercase text-stone-500 font-semibold mt-1 whitespace-nowrap">
                Private Real Estate &amp; Advisory
              </span>
            </div>
          </button>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1">
            
            {/* Properties */}
            <button
              onClick={() => navigateTo('properties')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                currentTab === 'properties' 
                  ? 'text-[#D95D39] bg-white shadow-xs border border-stone-200' 
                  : 'text-stone-600 hover:text-[#1D2421] hover:bg-white/60'
              }`}
            >
              Listings
            </button>

            {/* Map Search */}
            <button
              onClick={() => navigateTo('map-search')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                currentTab === 'map-search' 
                  ? 'text-[#D95D39] bg-white shadow-xs border border-stone-200' 
                  : 'text-stone-600 hover:text-[#1D2421] hover:bg-white/60'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-[#D95D39]" />
              <span>Map Search</span>
            </button>

            {/* Buyers Menu Dropdown */}
            <div 
              className="relative" 
              onMouseEnter={handleBuyersEnter} 
              onMouseLeave={handleBuyersLeave}
            >
              <button
                onClick={() => setBuyersOpen(!buyersOpen)}
                className={`flex items-center space-x-1 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                  currentTab === 'buyers'
                    ? 'text-[#D95D39] bg-white shadow-xs border border-stone-200'
                    : 'text-stone-600 hover:text-[#1D2421] hover:bg-white/60'
                }`}
              >
                <span>Buyers</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${buyersOpen ? 'rotate-180 text-[#D95D39]' : ''}`} />
              </button>

              {buyersOpen && (
                <div 
                  className="absolute left-0 top-full pt-1.5 w-72 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  onMouseEnter={handleBuyersEnter}
                  onMouseLeave={handleBuyersLeave}
                >
                  <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-2">
                    <button
                      onClick={() => navigateTo('buyers')}
                      className="w-full text-left p-3 rounded-xl hover:bg-[#F8F9F5] flex items-start space-x-3 transition group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#FAF6F4] text-[#D95D39] flex items-center justify-center shrink-0 border border-[#F0D5CC]">
                        <Compass className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#1D2421] group-hover:text-[#D95D39] transition">Buyer Concierge & Roadmap</div>
                        <div className="text-[11px] text-stone-500 mt-0.5">Private property acquisition process</div>
                      </div>
                    </button>

                    <button
                      onClick={() => navigateTo('mortgage')}
                      className="w-full text-left p-3 rounded-xl hover:bg-[#F8F9F5] flex items-start space-x-3 transition group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#EAEFE8] text-[#273B30] flex items-center justify-center shrink-0 border border-[#D5DDD2]">
                        <Calculator className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#1D2421] group-hover:text-[#273B30] transition">Mortgage & Financing</div>
                        <div className="text-[11px] text-stone-500 mt-0.5">Live rates & amortization modeler</div>
                      </div>
                    </button>

                    <button
                      onClick={() => navigateTo('map-search')}
                      className="w-full text-left p-3 rounded-xl hover:bg-[#F8F9F5] flex items-start space-x-3 transition group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#FAF6F4] text-[#D95D39] flex items-center justify-center shrink-0 border border-[#F0D5CC]">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#1D2421] group-hover:text-[#D95D39] transition">Schools & Districts</div>
                        <div className="text-[11px] text-stone-500 mt-0.5">Explore top academic catchment zones</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sellers Menu Dropdown */}
            <div 
              className="relative" 
              onMouseEnter={handleSellersEnter} 
              onMouseLeave={handleSellersLeave}
            >
              <button
                onClick={() => setSellersOpen(!sellersOpen)}
                className={`flex items-center space-x-1 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                  currentTab === 'sellers' 
                    ? 'text-[#D95D39] bg-white shadow-xs border border-stone-200' 
                    : 'text-stone-600 hover:text-[#1D2421] hover:bg-white/60'
                }`}
              >
                <span>Sellers</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${sellersOpen ? 'rotate-180 text-[#D95D39]' : ''}`} />
              </button>

              {sellersOpen && (
                <div 
                  className="absolute left-0 top-full pt-1.5 w-72 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                  onMouseEnter={handleSellersEnter}
                  onMouseLeave={handleSellersLeave}
                >
                  <div className="bg-white rounded-2xl shadow-xl border border-stone-200 p-2">
                    <button
                      onClick={() => navigateTo('sellers')}
                      className="w-full text-left p-3 rounded-xl hover:bg-[#F8F9F5] flex items-start space-x-3 transition group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#FAF6F4] text-[#D95D39] flex items-center justify-center shrink-0 border border-[#F0D5CC]">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#1D2421] group-hover:text-[#D95D39] transition">Instant Valuation Request</div>
                        <div className="text-[11px] text-stone-500 mt-0.5">Confidential comparative market dossier</div>
                      </div>
                    </button>

                    <button
                      onClick={() => navigateTo('sellers')}
                      className="w-full text-left p-3 rounded-xl hover:bg-[#F8F9F5] flex items-start space-x-3 transition group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#EAEFE8] text-[#273B30] flex items-center justify-center shrink-0 border border-[#D5DDD2]">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#1D2421] group-hover:text-[#273B30] transition">Global Marketing Strategy</div>
                        <div className="text-[11px] text-stone-500 mt-0.5">International buyer syndication network</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mortgage Calculator direct */}
            <button
              onClick={() => navigateTo('mortgage')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                currentTab === 'mortgage' 
                  ? 'text-[#D95D39] bg-white shadow-xs border border-stone-200' 
                  : 'text-stone-600 hover:text-[#1D2421] hover:bg-white/60'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Calculator</span>
            </button>

            {/* Contact Us */}
            <button
              onClick={() => navigateTo('contact')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                currentTab === 'contact' 
                  ? 'text-[#D95D39] bg-white shadow-xs border border-stone-200' 
                  : 'text-stone-600 hover:text-[#1D2421] hover:bg-white/60'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Contact</span>
            </button>
          </nav>

          {/* Right Action CTA & Shortlist Group */}
          <div className="hidden lg:flex items-center space-x-2.5">
            
            {/* Saved Homes / Shortlist */}
            <button
              onClick={() => navigateTo('saved')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                currentTab === 'saved'
                  ? 'bg-[#FAF6F4] text-[#D95D39] border-[#F0D5CC]'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300 shadow-2xs'
              }`}
              title="View Shortlisted Residences"
            >
              <Heart className={`w-3.5 h-3.5 ${savedCount > 0 ? 'fill-[#D95D39] text-[#D95D39]' : 'text-stone-500'}`} />
              <span>Saved</span>
              {savedCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[#D95D39] text-white text-[10px] font-bold">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Scheduled Tours */}
            <button
              onClick={() => navigateTo('tours')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                currentTab === 'tours'
                  ? 'bg-[#EAEFE8] text-[#273B30] border-[#D5DDD2]'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300 shadow-2xs'
              }`}
              title="View Scheduled Walkthroughs"
            >
              <Calendar className="w-3.5 h-3.5 text-[#3D5C4B]" />
              <span>Tours</span>
              {toursCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[#3D5C4B] text-white text-[10px] font-bold">
                  {toursCount}
                </span>
              )}
            </button>

            {/* Admin / Login Action */}
            {isAdminLoggedIn ? (
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => navigateTo('admin')}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                    currentTab === 'admin'
                      ? 'bg-[#1D2421] text-white border-[#1D2421] shadow-xs'
                      : 'bg-[#FAF6F4] text-[#D95D39] border-[#F0D5CC] hover:bg-[#F3EBE7]'
                  }`}
                  title="Admin Listing & Team Console"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Panel</span>
                </button>

                <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-stone-100 border border-stone-200 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-semibold text-stone-700 max-w-[110px] truncate text-[11px]">
                    {adminUser?.name || 'Admin'}
                  </span>
                </div>

                <button
                  onClick={onAdminLogout}
                  className="p-2 rounded-xl border border-stone-200 text-stone-500 hover:text-rose-600 hover:border-rose-200 bg-white shadow-2xs transition cursor-pointer"
                  title="Sign out of Admin Portal"
                  aria-label="Sign out of Admin Portal"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLoginModal}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition border border-stone-200 hover:border-stone-300 bg-white text-stone-700 hover:text-[#1D2421] shadow-2xs cursor-pointer"
                title="Brokerage Partner / Admin Login"
              >
                <Lock className="w-3.5 h-3.5 text-[#D95D39]" />
                <span>Admin Login</span>
              </button>
            )}

            {/* Book Tour Button */}
            <button
              onClick={() => navigateTo('contact')}
              className="bg-[#D95D39] hover:bg-[#C8502C] text-white font-bold px-4 py-2 rounded-xl text-xs tracking-wider uppercase transition shadow-sm cursor-pointer ml-1"
            >
              Book Private Tour
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={() => navigateTo('saved')}
              className="p-2 rounded-xl bg-white border border-stone-200 text-stone-700 relative cursor-pointer"
              aria-label="Saved Homes"
            >
              <Heart className={`w-5 h-5 ${savedCount > 0 ? 'fill-[#D95D39] text-[#D95D39]' : ''}`} />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D95D39] text-white text-[10px] font-bold flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-[#1D2421] cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200 shadow-lg">
          {/* Mobile role switcher */}
          {onRoleChange && (
            <div className="flex items-center justify-center bg-[#F8F9F5] rounded-xl p-1 border border-stone-200 mb-3 text-xs font-bold">
              <button
                onClick={() => onRoleChange('buyer')}
                className={`flex-1 py-1.5 rounded-lg transition ${
                  userRole === 'buyer' 
                    ? 'bg-white text-[#1D2421] shadow-xs' 
                    : 'text-stone-600'
                }`}
              >
                For Buyers
              </button>
              <button
                onClick={() => onRoleChange('seller')}
                className={`flex-1 py-1.5 rounded-lg transition ${
                  userRole === 'seller' 
                    ? 'bg-white text-[#1D2421] shadow-xs' 
                    : 'text-stone-600'
                }`}
              >
                For Sellers
              </button>
            </div>
          )}

          <button
            onClick={() => navigateTo('properties')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-2.5 ${
              currentTab === 'properties' ? 'bg-[#FAF6F4] text-[#D95D39]' : 'text-stone-700 hover:bg-[#F8F9F5]'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Property Listings</span>
          </button>

          <button
            onClick={() => navigateTo('map-search')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-2.5 ${
              currentTab === 'map-search' ? 'bg-[#FAF6F4] text-[#D95D39]' : 'text-stone-700 hover:bg-[#F8F9F5]'
            }`}
          >
            <MapPin className="w-4 h-4 text-[#D95D39]" />
            <span>Interactive Map Search</span>
          </button>

          <button
            onClick={() => navigateTo('saved')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-between ${
              currentTab === 'saved' ? 'bg-[#FAF6F4] text-[#D95D39]' : 'text-stone-700 hover:bg-[#F8F9F5]'
            }`}
          >
            <span className="flex items-center space-x-2.5">
              <Heart className="w-4 h-4 text-[#D95D39]" />
              <span>Saved Shortlist</span>
            </span>
            {savedCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#D95D39] text-white text-[10px] font-bold">
                {savedCount} saved
              </span>
            )}
          </button>

          <button
            onClick={() => navigateTo('tours')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-between ${
              currentTab === 'tours' ? 'bg-[#EAEFE8] text-[#273B30]' : 'text-stone-700 hover:bg-[#F8F9F5]'
            }`}
          >
            <span className="flex items-center space-x-2.5">
              <Calendar className="w-4 h-4 text-[#3D5C4B]" />
              <span>Scheduled Tours</span>
            </span>
            {toursCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#3D5C4B] text-white text-[10px] font-bold">
                {toursCount} active
              </span>
            )}
          </button>

          <button
            onClick={() => navigateTo('buyers')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-2.5 ${
              currentTab === 'buyers' ? 'bg-[#FAF6F4] text-[#D95D39]' : 'text-stone-700 hover:bg-[#F8F9F5]'
            }`}
          >
            <Compass className="w-4 h-4 text-[#D95D39]" />
            <span>Buyers Concierge & Schools</span>
          </button>

          <button
            onClick={() => navigateTo('sellers')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-2.5 ${
              currentTab === 'sellers' ? 'bg-[#FAF6F4] text-[#D95D39]' : 'text-stone-700 hover:bg-[#F8F9F5]'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-[#D95D39]" />
            <span>Sellers Valuation & Strategy</span>
          </button>

          <button
            onClick={() => navigateTo('mortgage')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-2.5 ${
              currentTab === 'mortgage' ? 'bg-[#FAF6F4] text-[#D95D39]' : 'text-stone-700 hover:bg-[#F8F9F5]'
            }`}
          >
            <Calculator className="w-4 h-4 text-[#273B30]" />
            <span>Mortgage & Amortization Modeler</span>
          </button>

          <button
            onClick={() => navigateTo('contact')}
            className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-2.5 ${
              currentTab === 'contact' ? 'bg-[#FAF6F4] text-[#D95D39]' : 'text-stone-700 hover:bg-[#F8F9F5]'
            }`}
          >
            <Phone className="w-4 h-4 text-[#D95D39]" />
            <span>Contact Advisory Concierge</span>
          </button>

          {/* Admin / Login in Mobile Drawer */}
          {isAdminLoggedIn ? (
            <div className="pt-2 border-t border-stone-200 space-y-2">
              <button
                onClick={() => navigateTo('admin')}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-between bg-[#1D2421] text-white shadow-xs"
              >
                <span className="flex items-center space-x-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#D95D39]" />
                  <span>Admin Management Console</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">Logged in</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onAdminLogout();
                }}
                className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center space-x-2.5 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Admin Portal</span>
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-stone-200">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLoginModal();
                }}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-2.5 bg-white border border-stone-200 hover:border-stone-300 text-stone-800 shadow-2xs"
              >
                <Lock className="w-4 h-4 text-[#D95D39]" />
                <span>Admin / Broker Login</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
