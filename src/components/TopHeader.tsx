import React, { useState } from 'react';
import { Settings, Menu, Bell, User, Check } from 'lucide-react';

interface TopHeaderProps {
  userRole: 'buyer' | 'seller';
  onRoleChange: (role: 'buyer' | 'seller') => void;
  onOpenMobileMenu: () => void;
  onOpenSettings?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  userRole,
  onRoleChange,
  onOpenMobileMenu,
  onOpenSettings,
}) => {
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-[#F8F9F5]/90 backdrop-blur-md border-b border-stone-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Left mobile menu trigger & mobile brand */}
        <div className="flex items-center space-x-3 lg:hidden">
          <button
            onClick={onOpenMobileMenu}
            className="p-2 rounded-xl bg-white border border-stone-200 text-stone-700 hover:text-[#1D2421] shadow-xs"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-full bg-[#1D2421] text-white flex items-center justify-center font-serif-luxury font-bold text-xs">
              H
            </div>
            <span className="font-serif-luxury text-lg font-bold text-[#1D2421]">
              Hearth <span className="italic text-[#D95D39]">&</span> Key
            </span>
          </div>
        </div>

        {/* Empty left filler on desktop so controls stay on right */}
        <div className="hidden lg:block">
          {/* Subtle breadcrumb / location indication */}
          <span className="text-xs text-stone-500 font-medium">
            Toronto & Northwood Luxury Portfolio
          </span>
        </div>

        {/* Right action group matching screenshot */}
        <div className="flex items-center space-x-3">
          {/* Segmented [ For buyers | For sellers ] pill toggle */}
          <div className="bg-[#ECEEE8] p-1 rounded-full flex items-center shadow-inner border border-stone-200/60 text-xs font-semibold">
            <button
              onClick={() => onRoleChange('buyer')}
              className={`px-3.5 py-1.5 rounded-full transition-all duration-200 ${
                userRole === 'buyer'
                  ? 'bg-white text-[#1D2421] shadow-sm font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              For buyers
            </button>
            <button
              onClick={() => onRoleChange('seller')}
              className={`px-3.5 py-1.5 rounded-full transition-all duration-200 ${
                userRole === 'seller'
                  ? 'bg-white text-[#1D2421] shadow-sm font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              For sellers
            </button>
          </div>

          {/* Settings button */}
          <button
            onClick={() => {
              if (onOpenSettings) onOpenSettings();
              else setShowSettingsModal(true);
            }}
            className="w-9 h-9 rounded-full bg-white border border-stone-200/90 text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition flex items-center justify-center shadow-xs"
            title="Account & Portal Preferences"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* User profile avatar (Maya) */}
          <div className="relative group cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
              alt="Maya"
              className="w-9 h-9 rounded-full object-cover border border-stone-200/90 ring-2 ring-transparent group-hover:ring-[#D95D39]/30 transition shadow-xs"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#F8F9F5]" />
          </div>
        </div>
      </header>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-stone-200 w-full max-w-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-serif-luxury text-lg font-bold text-[#1D2421]">Workspace Preferences</h3>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3 text-xs text-stone-600">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8F9F5] border border-stone-200/60">
                <span className="font-medium text-stone-800">Preferred Theme</span>
                <span className="text-[#D95D39] font-bold">Hearth & Key Organic</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8F9F5] border border-stone-200/60">
                <span className="font-medium text-stone-800">Notification Alerts</span>
                <span className="text-emerald-700 font-bold">Active</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#F8F9F5] border border-stone-200/60">
                <span className="font-medium text-stone-800">Default Currency</span>
                <span className="font-semibold text-stone-900">CAD ($)</span>
              </div>
            </div>

            <button
              onClick={() => setShowSettingsModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#1D2421] text-white text-xs font-bold hover:bg-[#D95D39] transition shadow-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
};
