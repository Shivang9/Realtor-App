export type PropertyCategory = 'residential' | 'commercial' | 'luxury_penthouse' | 'land';

export interface CustomFieldDefinition {
  id: string;
  categoryId: PropertyCategory | 'all';
  name: string;
  label: string;
  type: 'text' | 'number' | 'currency' | 'select' | 'boolean' | 'date';
  options?: string[];
  placeholder?: string;
  unit?: string;
  required?: boolean;
  section?: 'overview' | 'financial' | 'features' | 'building';
}

export interface SchoolInfo {
  name: string;
  type: 'Public' | 'Private' | 'Catholic' | 'International';
  grades: string;
  rating: number; // e.g. 9.4 / 10
  distance: string; // e.g. "0.4 km"
  walkTime?: string;
}

export interface AmenityInfo {
  name: string;
  category: 'Transit' | 'Dining' | 'Parks' | 'Shopping' | 'Culture' | 'Health';
  distance: string;
  walkTime?: string;
}

export interface AgentInfo {
  id?: string;
  name: string;
  title: string;
  licenseNumber: string;
  phone: string;
  email: string;
  whatsapp?: string;
  photo: string;
  brokerage: string;
  bio?: string;
  specialties?: string[];
  active?: boolean;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Property {
  id: string;
  title: string;
  unitNumber?: string;
  street: string;
  neighborhood: string;
  city: string;
  stateOrProvince: string;
  postalCode: string;
  price: number;
  category: PropertyCategory;
  status: 'For Sale' | 'Under Contract' | 'Sold' | 'For Lease';
  bedrooms: number;
  extraBeds?: number; // e.g., 3+1
  bathrooms: number;
  sqft: number;
  lotSize?: string;
  yearBuilt?: number;
  description: string;
  images: string[];
  coordinates: Coordinates;
  features: string[];
  customFields: Record<string, string | number | boolean | null | undefined>;
  schools: SchoolInfo[];
  amenities: AmenityInfo[];
  taxAnnual: number;
  hoaFeesMonthly?: number;
  agent: AgentInfo;
  featured?: boolean;
  createdAt: string;
}

export interface ContactSubmission {
  id: string;
  propertyId?: string;
  propertyTitle?: string;
  name: string;
  email: string;
  phone: string;
  inquiryType: 'Showing Request' | 'Property Inquiry' | 'Buying Consultation' | 'Selling Valuation' | 'General Message';
  preferredDate?: string;
  message: string;
  createdAt: string;
}

export interface ValuationRequest {
  id: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  propertyAddress: string;
  propertyType: PropertyCategory;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  renovationsNotes?: string;
  timeline: 'Immediately' | '1-3 months' | '3-6 months' | 'Just curious';
  estimatedValue?: number;
  createdAt: string;
}

export interface MortgageInputs {
  homePrice: number;
  downPayment: number;
  downPaymentPercent: number;
  loanTermYears: number;
  interestRate: number;
  propertyTaxAnnual: number;
  homeInsuranceAnnual: number;
  hoaMonthly: number;
  pmiMonthly?: number;
}

export interface MortgageBreakdown {
  monthlyPrincipalInterest: number;
  monthlyPropertyTax: number;
  monthlyHomeInsurance: number;
  monthlyHoa: number;
  monthlyPmi: number;
  monthlyTotal: number;
  totalLoanAmount: number;
  totalInterestPaid: number;
  totalCostOfLoan: number;
}
