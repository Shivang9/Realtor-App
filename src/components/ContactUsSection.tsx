import React, { useState } from 'react';
import { INITIAL_CLIENT_TESTIMONIALS } from '../data/mockData';
import { apiService } from '../services/apiService';
import { 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  Send, 
  Star, 
  MessageSquare, 
  Shield, 
  Clock, 
  UserCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export const ContactUsSection: React.FC = () => {
  const [activeClientIdx, setActiveClientIdx] = useState(0);
  const clients = INITIAL_CLIENT_TESTIMONIALS;
  const currentClient = clients[activeClientIdx];

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [inquiryType, setInquiryType] = useState<'Showing Request' | 'Property Inquiry' | 'Buying Consultation' | 'Selling Valuation' | 'General Message'>('Buying Consultation');
  const [preferredDate, setPreferredDate] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);
    try {
      const res = await apiService.submitContact({
        name,
        email,
        phone,
        inquiryType,
        preferredDate,
        message,
      });
      setSubmitSuccess(true);
      setFeedbackMsg(res.message || 'Thank you. A dedicated broker will connect with you within 2 business hours.');
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
    } catch (err: any) {
      alert(err.message || 'Failed to submit inquiry');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contact-us-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-[#1D2421]">
      
      {/* Editorial Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 bg-[#EAEFE8] text-[#273B30] border border-[#D5DDD2] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          <UserCheck className="w-3.5 h-3.5 text-[#3D5C4B]" />
          <span>Client Experience & VIP Advisory</span>
        </div>
        <h1 className="font-serif-luxury text-3xl sm:text-5xl font-normal text-[#1D2421] tracking-tight">
          Client Relationships & Direct Contact
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          Trusted by discerning private clients, institutional investors, and notable families across North America.
        </p>
      </div>

      {/* 1. PHOTO OF CLIENT SHOWCASE */}
      <div className="bg-white text-[#1D2421] rounded-3xl overflow-hidden shadow-xs border border-stone-200/80">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
          
          {/* Client Photo Column */}
          <div className="lg:col-span-6 relative min-h-[380px] sm:min-h-[460px] bg-stone-100">
            <img
              src={currentClient.photo}
              alt={currentClient.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-6 sm:p-8">
              <div className="flex items-center space-x-1 text-amber-400 mb-2">
                {[...Array(currentClient.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
                <span className="text-xs font-bold text-white ml-2">Verified Private Client</span>
              </div>
              <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-white">
                {currentClient.name}
              </h3>
              <p className="text-xs text-stone-300 mt-0.5">
                {currentClient.role}
              </p>
              <p className="text-xs text-stone-200 font-medium mt-1 flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-[#D95D39]" />
                <span>{currentClient.location}</span>
              </p>
            </div>

            {/* Carousel navigation controls */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={() => setActiveClientIdx((prev) => (prev > 0 ? prev - 1 : clients.length - 1))}
                className="p-2.5 rounded-full bg-white/90 hover:bg-white text-[#1D2421] border border-stone-200/80 backdrop-blur-md transition shadow-sm cursor-pointer"
                title="Previous Client"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveClientIdx((prev) => (prev < clients.length - 1 ? prev + 1 : 0))}
                className="p-2.5 rounded-full bg-white/90 hover:bg-white text-[#1D2421] border border-stone-200/80 backdrop-blur-md transition shadow-sm cursor-pointer"
                title="Next Client"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Client Testimonial Context & Brokerage Direct Info */}
          <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="text-xs font-bold text-[#D95D39] uppercase tracking-widest flex items-center space-x-2">
                <Shield className="w-4 h-4 text-[#D95D39]" />
                <span>Client Testimonial & Endorsement</span>
              </div>

              <blockquote className="font-serif-luxury text-xl sm:text-2xl text-[#1D2421] font-light italic leading-relaxed">
                "{currentClient.quote}"
              </blockquote>

              {/* Client Selection Mini Gallery */}
              <div className="pt-4 border-t border-stone-100">
                <div className="text-xs font-semibold text-stone-500 mb-2">View other client experiences:</div>
                <div className="flex space-x-3 overflow-x-auto pb-1">
                  {clients.map((c, idx) => (
                    <button
                      key={c.id}
                      onClick={() => setActiveClientIdx(idx)}
                      className={`flex items-center space-x-2 p-1.5 rounded-xl transition border text-left cursor-pointer shrink-0 ${
                        activeClientIdx === idx
                          ? 'border-[#D95D39] bg-[#FAF6F4]'
                          : 'border-stone-200 hover:border-stone-300 bg-[#F8F9F5]'
                      }`}
                    >
                      <img src={c.photo} alt={c.name} referrerPolicy="no-referrer" className="w-9 h-9 rounded-full object-cover" />
                      <div className="hidden sm:block pr-2">
                        <div className="text-xs font-bold text-[#1D2421]">{c.name.split(' ')[0]}</div>
                        <div className="text-[10px] text-stone-500">{c.location}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Direct Brokerage Hotline */}
            <div className="bg-[#F8F9F5] p-4 rounded-2xl border border-stone-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-700">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-[#D95D39] shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-stone-500 text-[10px]">Private Advisory Desk</div>
                  <div className="font-bold text-[#1D2421] font-mono">+1 (416) 902-8800</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center text-[#273B30] shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-stone-500 text-[10px]">Confidential Inbox</div>
                  <div className="font-bold text-[#1D2421] truncate">concierge@hearthandkey.com</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* 2. CONTACT FORM DIRECTLY BELOW THE PHOTO */}
      <div className="bg-white rounded-3xl p-6 sm:p-12 border border-stone-200/80 shadow-xs space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase tracking-widest font-bold text-[#D95D39]">Direct Inquiry</span>
          <h2 className="font-serif-luxury text-2xl sm:text-4xl font-normal text-[#1D2421]">
            Initiate a Confidential Conversation
          </h2>
          <p className="text-stone-600 text-xs sm:text-sm">
            Please provide your details below. All communications are governed by strict private client fiduciary standards.
          </p>
        </div>

        {submitSuccess ? (
          <div className="max-w-xl mx-auto bg-[#EAEFE8] border border-[#D5DDD2] p-8 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#273B30] mx-auto" />
            <h3 className="font-serif-luxury text-2xl font-bold text-[#1D2421]">Inquiry Received</h3>
            <p className="text-sm text-stone-700">{feedbackMsg}</p>
            <button
              onClick={() => setSubmitSuccess(false)}
              className="mt-4 px-6 py-2.5 rounded-xl bg-[#D95D39] hover:bg-[#C8502C] text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
            
            {/* Inquiry Category Buttons */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Inquiry Objective *</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  'Showing Request',
                  'Buying Consultation',
                  'Selling Valuation',
                  'General Message',
                ].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setInquiryType(type as any)}
                    className={`p-2.5 rounded-xl text-xs font-semibold transition border cursor-pointer ${
                      inquiryType === type
                        ? 'bg-[#273B30] text-white font-bold border-[#273B30] shadow-xs'
                        : 'bg-[#F8F9F5] text-stone-700 border-stone-200 hover:bg-stone-100 hover:text-stone-900'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Your Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sterling Montgomery"
                  className="w-full text-sm p-3 rounded-xl border border-stone-200 bg-[#F8F9F5] text-[#1D2421] focus:bg-white focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] focus:outline-none transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. s.montgomery@domain.com"
                  className="w-full text-sm p-3 rounded-xl border border-stone-200 bg-[#F8F9F5] text-[#1D2421] focus:bg-white focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] focus:outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Phone Number (Optional)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (416) 000-0000"
                  className="w-full text-sm p-3 rounded-xl border border-stone-200 bg-[#F8F9F5] text-[#1D2421] focus:bg-white focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] focus:outline-none transition"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-stone-700">Preferred Consultation Date</label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full text-sm p-3 rounded-xl border border-stone-200 bg-[#F8F9F5] text-[#1D2421] focus:bg-white focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] focus:outline-none transition"
                />
              </div>
            </div>

            {/* Message Area */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700">Message / Acquisition Criteria *</label>
              <textarea
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Detail your requirements, desired neighborhoods (e.g. Annex, Yorkville, Rosedale), budget parameters, or property details if selling..."
                className="w-full text-sm p-3 rounded-xl border border-stone-200 bg-[#F8F9F5] text-[#1D2421] focus:bg-white focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] focus:outline-none transition"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#D95D39] hover:bg-[#C8502C] text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Transmitting Request...' : 'Submit Confidential Inquiry'}</span>
            </button>

            <div className="text-center text-[11px] text-stone-500 flex items-center justify-center space-x-2">
              <Shield className="w-3.5 h-3.5 text-[#3D5C4B]" />
              <span>Protected by 256-bit SSL encryption & client confidentiality protocol.</span>
            </div>

          </form>
        )}
      </div>

    </div>
  );
};
