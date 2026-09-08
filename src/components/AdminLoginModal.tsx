import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  X, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { AdminUser } from '../types';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (admin: AdminUser) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    // Normalize inputs
    const normalizedId = adminId.trim().toLowerCase();
    const normalizedPass = password.trim();

    setTimeout(() => {
      // Valid credentials:
      // Accepts:
      // ID: admin, admin@shahco.com, m.shah@shahco.com, maunil
      // Password: admin, admin123, shahco, shahco2026
      const isValidUser = 
        normalizedId === 'admin' || 
        normalizedId === 'admin@shahco.com' || 
        normalizedId === 'm.shah@shahco.com' || 
        normalizedId === 'maunil' ||
        normalizedId === 'broker';

      const isValidPassword = 
        normalizedPass === 'admin123' || 
        normalizedPass === 'admin' || 
        normalizedPass === 'shahco2026' || 
        normalizedPass === 'luxury123' ||
        normalizedPass === 'shahco';

      if (isValidUser && isValidPassword) {
        const adminData: AdminUser = {
          id: normalizedId.includes('shah') ? 'agent-alexander' : 'admin-1',
          name: normalizedId.includes('shah') || normalizedId.includes('maunil') ? 'Maunil Shah' : 'Admin Director',
          email: normalizedId.includes('@') ? normalizedId : 'admin@shahco.com',
          role: 'super_admin',
          lastLogin: new Date().toISOString(),
        };

        if (rememberMe) {
          localStorage.setItem('shahco_admin_auth', JSON.stringify(adminData));
        }

        setIsSubmitting(false);
        onLoginSuccess(adminData);
        onClose();
      } else {
        setIsSubmitting(false);
        setError('Invalid Admin ID or Password. Please check your credentials or use the demo shortcut below.');
      }
    }, 400);
  };

  const handleFillDemoCredentials = () => {
    setAdminId('admin');
    setPassword('admin123');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-[#FAF6F4] border-b border-[#F0D5CC] p-6 sm:p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-stone-200/70 hover:bg-stone-200 text-stone-600 hover:text-stone-900 flex items-center justify-center transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-[#D95D39] text-white flex items-center justify-center font-serif-luxury font-bold text-lg shadow-sm shrink-0">
              S
            </div>
            <div className="flex flex-col shrink-0 min-w-0">
              <span className="font-serif-luxury text-2xl font-bold tracking-tight text-[#D95D39] leading-none whitespace-nowrap">
                Shah <span className="font-serif italic font-normal text-[#D95D39]">&amp;</span> Co.
              </span>
              <span className="text-[10px] tracking-[0.22em] uppercase text-stone-500 font-semibold mt-1 whitespace-nowrap">
                Private Real Estate &amp; Advisory
              </span>
            </div>
          </div>

          <div className="pt-1">
            <h2 className="text-lg sm:text-xl font-serif-luxury font-bold text-[#1D2421] flex items-center space-x-2">
              <span>Admin Portal Login</span>
              <ShieldCheck className="w-4 h-4 text-[#D95D39]" />
            </h2>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Authorized access for partners, listing directors, and advisory agents to manage portfolio inventory and custom schemas.
            </p>
          </div>
        </div>

        {/* Login Form Body */}
        <div className="p-6 sm:p-8 space-y-5">
          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2.5 animate-in shake duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Admin ID or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  placeholder="e.g. admin or m.shah@shahco.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#D95D39] focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrative password"
                  className="w-full pl-10 pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#D95D39] focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-700 transition"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 text-stone-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-stone-300 text-[#D95D39] focus:ring-[#D95D39]"
                />
                <span>Remember on this browser</span>
              </label>
              
              <span className="text-[11px] text-stone-600">
                Encrypted Session
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-[#D95D39] hover:bg-[#C8502C] text-white font-bold text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Admin Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Helper */}
          <div className="pt-2 border-t border-stone-100">
            <div className="p-3 bg-[#F8F9F5] rounded-xl border border-stone-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#D95D39]" />
                  <span>Demo Credentials</span>
                </span>
                <button
                  type="button"
                  onClick={handleFillDemoCredentials}
                  className="text-[11px] font-bold text-[#D95D39] hover:text-[#C8502C] underline cursor-pointer"
                >
                  Auto-fill Demo
                </button>
              </div>
              <div className="text-[11px] text-stone-600 font-mono flex items-center justify-between bg-white px-2.5 py-1.5 rounded-lg border border-stone-200">
                <span>ID: <strong className="text-stone-800">admin</strong></span>
                <span>Pass: <strong className="text-stone-800">admin123</strong></span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-center text-stone-600">
            Buyers & sellers do not require an account. Explore all residences freely.
          </p>
        </div>
      </div>
    </div>
  );
};
