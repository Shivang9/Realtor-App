import React, { useState, useEffect } from 'react';
import { Property, MortgageInputs, MortgageBreakdown } from '../types';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { apiService } from '../services/apiService';
import { 
  Calculator, 
  DollarSign, 
  Percent, 
  Calendar, 
  ShieldCheck, 
  Building, 
  PieChart, 
  ArrowRight,
  TrendingDown
} from 'lucide-react';

interface MortgageCalculatorSectionProps {
  properties: Property[];
  initialProperty?: Property | null;
  onSelectProperty?: (property: Property) => void;
  onNavigateToContact?: () => void;
}

export const MortgageCalculatorSection: React.FC<MortgageCalculatorSectionProps> = ({
  properties,
  initialProperty,
  onSelectProperty,
  onNavigateToContact,
}) => {
  const [selectedPropId, setSelectedPropId] = useState<string>(initialProperty?.id || (properties[0]?.id ?? 'custom'));
  const [homePrice, setHomePrice] = useState<number>(initialProperty?.price || 15800000);
  const [downPaymentPct, setDownPaymentPct] = useState<number>(20);
  const [downPaymentAmount, setDownPaymentAmount] = useState<number>(Math.round((initialProperty?.price || 15800000) * 0.2));
  const [interestRate, setInterestRate] = useState<number>(5.75);
  const [loanTermYears, setLoanTermYears] = useState<number>(30);
  const [propertyTaxAnnual, setPropertyTaxAnnual] = useState<number>(initialProperty?.taxAnnual || 34500);
  const [homeInsuranceAnnual, setHomeInsuranceAnnual] = useState<number>(8500);
  const [hoaMonthly, setHoaMonthly] = useState<number>(initialProperty?.hoaFeesMonthly || 3850);
  
  const [breakdown, setBreakdown] = useState<MortgageBreakdown | null>(null);

  // Sync inputs when selecting a listing
  const handlePropertyChange = (propId: string) => {
    setSelectedPropId(propId);
    if (propId === 'custom') return;
    const found = properties.find((p) => p.id === propId);
    if (found) {
      setHomePrice(found.price);
      const dp = Math.round(found.price * (downPaymentPct / 100));
      setDownPaymentAmount(dp);
      setPropertyTaxAnnual(found.taxAnnual || Math.round(found.price * 0.007));
      setHoaMonthly(found.hoaFeesMonthly || 0);
    }
  };

  const handlePriceChange = (newPrice: number) => {
    setHomePrice(newPrice);
    setDownPaymentAmount(Math.round(newPrice * (downPaymentPct / 100)));
  };

  const handleDownPaymentAmountChange = (amount: number) => {
    setDownPaymentAmount(amount);
    if (homePrice > 0) {
      const pct = Math.round((amount / homePrice) * 100);
      setDownPaymentPct(pct);
    }
  };

  const handleDownPaymentPctChange = (pct: number) => {
    setDownPaymentPct(pct);
    setDownPaymentAmount(Math.round(homePrice * (pct / 100)));
  };

  // Recalculate whenever inputs change
  useEffect(() => {
    const inputs: MortgageInputs = {
      homePrice,
      downPayment: downPaymentAmount,
      downPaymentPercent: downPaymentPct,
      loanTermYears,
      interestRate,
      propertyTaxAnnual,
      homeInsuranceAnnual,
      hoaMonthly,
      pmiMonthly: downPaymentPct < 20 ? Math.round((homePrice - downPaymentAmount) * 0.005 / 12) : 0,
    };

    apiService.calculateMortgage(inputs)
      .then((data) => setBreakdown(data))
      .catch((err) => console.error('Mortgage calc error:', err));
  }, [
    homePrice,
    downPaymentAmount,
    downPaymentPct,
    loanTermYears,
    interestRate,
    propertyTaxAnnual,
    homeInsuranceAnnual,
    hoaMonthly,
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-[#1D2421]">
      
      {/* Editorial Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 bg-[#EAEFE8] text-[#273B30] border border-[#D5DDD2] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
          <Calculator className="w-3.5 h-3.5 text-[#3D5C4B]" />
          <span>Capital & Financing Advisory</span>
        </div>
        <h1 className="font-serif-luxury text-3xl sm:text-5xl font-normal text-[#1D2421] tracking-tight">
          Mortgage & Luxury Investment Calculator
        </h1>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
          Estimate precise monthly allocations, principal amortization schedules, property tax distributions, and HOA reserves across our portfolio.
        </p>
      </div>

      {/* Preset Listing Selector */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center space-x-2">
          <Building className="w-4 h-4 text-[#D95D39]" />
          <span>Simulate with an Active Property:</span>
        </label>
        <select
          value={selectedPropId}
          onChange={(e) => handlePropertyChange(e.target.value)}
          className="text-xs font-semibold p-2.5 rounded-xl border border-stone-200 bg-[#F8F9F5] text-[#1D2421] focus:bg-white focus:ring-2 focus:ring-[#D95D39]/30 focus:border-[#D95D39] focus:outline-none sm:min-w-[340px]"
        >
          <option value="custom">-- Custom Property Scenario --</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>
              {p.street} ({formatCurrency(p.price)}) - {p.neighborhood}
            </option>
          ))}
        </select>
      </div>

      {/* Main Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Controls Column (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/80 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-[#1D2421] border-b border-stone-100 pb-3 flex items-center justify-between">
            <span className="font-serif-luxury text-xl">Financing Parameters</span>
            <span className="text-xs font-medium text-stone-500 bg-[#F8F9F5] px-2.5 py-1 rounded-full border border-stone-200">
              Live Real-Time Model
            </span>
          </h2>

          {/* Home Price Input */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Purchase Price</label>
              <span className="text-base font-bold text-[#D95D39] font-mono">{formatCurrency(homePrice)}</span>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-semibold">$</span>
              <input
                type="number"
                value={homePrice}
                onChange={(e) => handlePriceChange(Number(e.target.value))}
                step="50000"
                className="w-full pl-8 pr-3 py-2.5 text-sm rounded-xl border border-stone-200 bg-[#F8F9F5] text-[#1D2421] focus:bg-white focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] focus:outline-none font-semibold transition"
              />
            </div>
            <input
              type="range"
              min="500000"
              max="35000000"
              step="250000"
              value={homePrice}
              onChange={(e) => handlePriceChange(Number(e.target.value))}
              className="w-full accent-[#D95D39] cursor-pointer"
            />
          </div>

          {/* Down Payment ($ and %) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Down Payment ({downPaymentPct}%)
              </label>
              <span className="text-sm font-bold text-[#273B30] font-mono">{formatCurrency(downPaymentAmount)}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-semibold">$</span>
                <input
                  type="number"
                  value={downPaymentAmount}
                  onChange={(e) => handleDownPaymentAmountChange(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2 text-sm rounded-xl border border-stone-200 bg-[#F8F9F5] text-[#1D2421] focus:bg-white focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] focus:outline-none transition"
                />
              </div>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="90"
                  value={downPaymentPct}
                  onChange={(e) => handleDownPaymentPctChange(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 bg-[#F8F9F5] text-[#1D2421] focus:bg-white focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] focus:outline-none transition"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-semibold">%</span>
              </div>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              step="5"
              value={downPaymentPct}
              onChange={(e) => handleDownPaymentPctChange(Number(e.target.value))}
              className="w-full accent-[#273B30] cursor-pointer"
            />
          </div>

          {/* Interest Rate & Loan Term */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Interest Rate (%)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.05"
                  min="1"
                  max="15"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-stone-200 bg-[#F8F9F5] text-[#1D2421] focus:bg-white focus:ring-2 focus:ring-[#D95D39]/20 focus:border-[#D95D39] focus:outline-none font-semibold transition"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-semibold">%</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Loan Term</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[15, 20, 30].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setLoanTermYears(term)}
                    className={`py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      loanTermYears === term
                        ? 'bg-[#273B30] text-white shadow-xs'
                        : 'bg-[#F8F9F5] text-stone-700 hover:bg-stone-100 border border-stone-200'
                    }`}
                  >
                    {term} Yrs
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Taxes, Insurance, and HOA */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-100">
            <div className="space-y-1">
              <label className="text-xs text-stone-600 font-medium">Annual Property Tax</label>
              <input
                type="number"
                value={propertyTaxAnnual}
                onChange={(e) => setPropertyTaxAnnual(Number(e.target.value))}
                className="w-full p-2.5 text-xs rounded-xl border border-stone-200 bg-[#F8F9F5] text-[#1D2421] focus:bg-white focus:ring-1 focus:ring-[#D95D39] focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-stone-600 font-medium">Annual Insurance</label>
              <input
                type="number"
                value={homeInsuranceAnnual}
                onChange={(e) => setHomeInsuranceAnnual(Number(e.target.value))}
                className="w-full p-2.5 text-xs rounded-xl border border-stone-200 bg-[#F8F9F5] text-[#1D2421] focus:bg-white focus:ring-1 focus:ring-[#D95D39] focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-stone-600 font-medium">Monthly HOA / Maint.</label>
              <input
                type="number"
                value={hoaMonthly}
                onChange={(e) => setHoaMonthly(Number(e.target.value))}
                className="w-full p-2.5 text-xs rounded-xl border border-stone-200 bg-[#F8F9F5] text-[#1D2421] focus:bg-white focus:ring-1 focus:ring-[#D95D39] focus:outline-none"
              />
            </div>
          </div>

        </div>

        {/* Results Card Column (5 cols) */}
        <div className="lg:col-span-5 bg-white text-[#1D2421] p-6 sm:p-8 rounded-2xl shadow-sm space-y-6 border border-stone-200/80">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#D95D39]">Monthly Commitment</span>
            <div className="font-serif-luxury text-4xl sm:text-5xl font-bold text-[#1D2421] mt-1">
              {breakdown ? formatCurrency(breakdown.monthlyTotal) : '...'}
              <span className="text-xs font-sans text-stone-500 font-normal"> / month</span>
            </div>
          </div>

          {/* Visual Breakdown Bars */}
          {breakdown && (
            <div className="space-y-4 pt-2">
              <div className="h-4 w-full bg-stone-100 rounded-full overflow-hidden flex border border-stone-200">
                <div
                  style={{ width: `${(breakdown.monthlyPrincipalInterest / breakdown.monthlyTotal) * 100}%` }}
                  className="bg-[#D95D39]"
                  title="Principal & Interest"
                />
                <div
                  style={{ width: `${(breakdown.monthlyPropertyTax / breakdown.monthlyTotal) * 100}%` }}
                  className="bg-[#3D5C4B]"
                  title="Property Tax"
                />
                <div
                  style={{ width: `${(breakdown.monthlyHomeInsurance / breakdown.monthlyTotal) * 100}%` }}
                  className="bg-[#8FA89B]"
                  title="Homeowners Insurance"
                />
                <div
                  style={{ width: `${(breakdown.monthlyHoa / breakdown.monthlyTotal) * 100}%` }}
                  className="bg-amber-600"
                  title="HOA Fees"
                />
              </div>

              {/* Itemized Legend */}
              <div className="space-y-2.5 text-xs text-stone-700 pt-2 border-t border-stone-100">
                <div className="flex justify-between items-center">
                  <span className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-[#D95D39]" />
                    <span>Principal & Interest</span>
                  </span>
                  <span className="font-bold text-[#1D2421] font-mono">{formatCurrency(breakdown.monthlyPrincipalInterest)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-[#3D5C4B]" />
                    <span>Property Taxes (Est.)</span>
                  </span>
                  <span className="font-bold text-[#1D2421] font-mono">{formatCurrency(breakdown.monthlyPropertyTax)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-[#8FA89B]" />
                    <span>Homeowners Insurance</span>
                  </span>
                  <span className="font-bold text-[#1D2421] font-mono">{formatCurrency(breakdown.monthlyHomeInsurance)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-amber-600" />
                    <span>HOA / Maintenance</span>
                  </span>
                  <span className="font-bold text-[#1D2421] font-mono">{formatCurrency(breakdown.monthlyHoa)}</span>
                </div>

                {breakdown.monthlyPmi > 0 && (
                  <div className="flex justify-between items-center text-rose-600">
                    <span className="flex items-center space-x-2">
                      <span className="w-3 h-3 rounded-full bg-rose-500" />
                      <span>PMI (&lt;20% Down)</span>
                    </span>
                    <span className="font-bold font-mono">{formatCurrency(breakdown.monthlyPmi)}</span>
                  </div>
                )}
              </div>

              {/* Loan Summary totals */}
              <div className="bg-[#F8F9F5] p-4 rounded-xl space-y-2 text-xs border border-stone-200/70 text-stone-700">
                <div className="flex justify-between">
                  <span>Total Financed Loan:</span>
                  <span className="font-bold text-[#1D2421] font-mono">{formatCurrency(breakdown.totalLoanAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Cumulative Interest:</span>
                  <span className="font-bold text-[#1D2421] font-mono">{formatCurrency(breakdown.totalInterestPaid)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Out-of-Pocket Cost:</span>
                  <span className="font-bold text-[#1D2421] font-mono">{formatCurrency(breakdown.totalCostOfLoan)}</span>
                </div>
              </div>

              {/* Consultation CTA */}
              <button 
                onClick={() => {
                  if (onNavigateToContact) {
                    onNavigateToContact();
                  } else {
                    const contactEl = document.getElementById('contact-us-root');
                    if (contactEl) contactEl.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="w-full bg-[#D95D39] hover:bg-[#C8502C] text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition text-center flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
              >
                <span>Speak with a Private Mortgage Advisor</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
