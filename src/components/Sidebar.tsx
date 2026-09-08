import React from 'react';
import { 
  Compass, 
  Heart, 
  MessageSquare, 
  Clock, 
  Calculator, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  Users,
  Home
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  savedCount: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onOpenMessages?: () => void;
  onOpenTours?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  savedCount,
  isOpenMobile = false,
  onCloseMobile,
  onOpenMessages,
  onOpenTours,
}) => {
  const handleNav = (tab: string) => {
    onSelectTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-stone-900/30 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#F8F9F5] border-r border-stone-200/90 flex flex-col justify-between p-6 transition-transform duration-300
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="space-y-8">
          {/* Brand Logo matching Hearth & Key */}
          <button 
            onClick={() => handleNav('properties')} 
            className="flex items-center space-x-3 text-left group focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full bg-[#1D2421] text-white flex items-center justify-center font-serif-luxury font-bold text-base shadow-sm group-hover:bg-[#D95D39] transition-colors">
              H
            </div>
            <div className="flex flex-col">
              <span className="font-serif-luxury text-xl font-bold tracking-tight text-[#1D2421] leading-none">
                Hearth <span className="font-light italic text-[#D95D39]">&</span> Key
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-stone-500 font-medium mt-0.5">
                Curated Luxury
              </span>
            </div>
          </button>

          {/* Group 1: YOUR WORKSPACE */}
          <div className="space-y-1.5">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 px-3 pb-1">
              Your Workspace
            </div>

            {/* Discover */}
            <button
              onClick={() => handleNav('properties')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                currentTab === 'properties'
                  ? 'bg-white text-[#D95D39] shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-stone-200/50'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Home className={`w-4 h-4 ${currentTab === 'properties' ? 'text-[#D95D39]' : 'text-stone-500'}`} />
                <span>Discover</span>
              </div>
            </button>

            {/* Saved homes */}
            <button
              onClick={() => handleNav('saved')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                currentTab === 'saved'
                  ? 'bg-white text-[#D95D39] shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-stone-200/50'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Heart className={`w-4 h-4 ${currentTab === 'saved' ? 'text-[#D95D39] fill-[#D95D39]' : 'text-stone-500'}`} />
                <span>Saved homes</span>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-stone-200/80 text-stone-700">
                {savedCount}
              </span>
            </button>

            {/* Messages */}
            <button
              onClick={() => {
                if (onOpenMessages) onOpenMessages();
                else handleNav('contact');
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-200/50 transition"
            >
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-4 h-4 text-stone-500" />
                <span>Messages</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#E06D53]" />
            </button>

            {/* My tours (Highlighted pill matching screenshot) */}
            <button
              onClick={() => {
                if (onOpenTours) onOpenTours();
                else handleNav('tours');
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                currentTab === 'tours'
                  ? 'bg-white text-[#D95D39] shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-stone-200/50'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Clock className={`w-4 h-4 ${currentTab === 'tours' ? 'text-[#D95D39]' : 'text-stone-500'}`} />
                <span>My tours</span>
              </div>
              {currentTab === 'tours' && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#D95D39]" />
              )}
            </button>
          </div>

          {/* Group 2: TOOLS */}
          <div className="space-y-1.5 pt-2">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 px-3 pb-1">
              Tools
            </div>

            {/* Mortgage Calculator */}
            <button
              onClick={() => handleNav('mortgage')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                currentTab === 'mortgage'
                  ? 'bg-white text-[#D95D39] shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-stone-200/50'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Calculator className={`w-4 h-4 ${currentTab === 'mortgage' ? 'text-[#D95D39]' : 'text-stone-500'}`} />
                <span>Mortgage calculator</span>
              </div>
            </button>

            {/* Seller's Guide */}
            <button
              onClick={() => handleNav('sellers')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                currentTab === 'sellers'
                  ? 'bg-white text-[#D95D39] shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-stone-200/50'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Sparkles className={`w-4 h-4 ${currentTab === 'sellers' ? 'text-[#D95D39]' : 'text-stone-500'}`} />
                <span>Seller's guide</span>
              </div>
            </button>

            {/* Interactive Live Map */}
            <button
              onClick={() => handleNav('map-search')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                currentTab === 'map-search'
                  ? 'bg-white text-[#D95D39] shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-stone-200/50'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <MapPin className={`w-4 h-4 ${currentTab === 'map-search' ? 'text-[#D95D39]' : 'text-stone-500'}`} />
                <span>Map search</span>
              </div>
            </button>

            {/* Advisory & Admin */}
            <button
              onClick={() => handleNav('admin')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                currentTab === 'admin'
                  ? 'bg-white text-[#D95D39] shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-stone-200/50'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <ShieldCheck className={`w-4 h-4 ${currentTab === 'admin' ? 'text-[#D95D39]' : 'text-stone-500'}`} />
                <span>Admin & Advisors</span>
              </div>
            </button>
          </div>
        </div>

        {/* Bottom Concierge / Support Card */}
        <div className="pt-4 border-t border-stone-200/80">
          <div className="bg-[#EAEFE8] rounded-xl p-3.5 space-y-1.5 border border-[#D5DDD2]">
            <div className="text-[11px] font-bold text-[#273B30] flex items-center space-x-1.5">
              <Users className="w-3.5 h-3.5 text-[#3D5C4B]" />
              <span>Private Advisory</span>
            </div>
            <p className="text-[10px] text-stone-600 leading-relaxed">
              White-glove acquisition services and discreet property showings.
            </p>
            <button
              onClick={() => handleNav('contact')}
              className="text-[11px] font-bold text-[#D95D39] hover:underline flex items-center space-x-1 pt-0.5"
            >
              <span>Connect with advisor ↗</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
