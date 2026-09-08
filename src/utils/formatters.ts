import { PropertyCategory } from '../types';

export function formatCurrency(amount: number): string {
  if (isNaN(amount)) return '$0 CAD';
  return `${new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    currencyDisplay: 'narrowSymbol',
    maximumFractionDigits: 0,
  }).format(amount)} CAD`;
}

export function formatCompactCurrency(amount: number): string {
  if (isNaN(amount)) return '$0 CAD';
  if (amount >= 1_000_000) {
    const val = amount / 1_000_000;
    return `$${val % 1 === 0 ? val : val.toFixed(1)}M CAD`;
  }
  if (amount >= 1_000) {
    return `$${Math.round(amount / 1_000)}k CAD`;
  }
  return `$${amount} CAD`;
}

export function formatNumber(val: number): string {
  if (isNaN(val)) return '0';
  return new Intl.NumberFormat('en-US').format(val);
}

export function getCategoryLabel(category: PropertyCategory): string {
  switch (category) {
    case 'luxury_penthouse':
      return 'Luxury Penthouse';
    case 'residential':
      return 'Residential Estate';
    case 'commercial':
      return 'Commercial Real Estate';
    case 'land':
      return 'Development & Land';
    default:
      return 'Real Estate';
  }
}

export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function estimateDriveTime(distanceKm: number): string {
  if (distanceKm <= 0.5) return '2-3 min walk';
  if (distanceKm <= 1.2) return `${Math.round(distanceKm * 12)} min walk`;
  const driveMinutes = Math.max(3, Math.round(distanceKm * 2.5));
  return `~${driveMinutes} min drive`;
}
