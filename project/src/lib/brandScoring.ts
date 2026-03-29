import type { BrandRecord, BrandType, PrivacyLevel, PricingLevel, SleepQualityScore } from './brandData';

export type PositioningAngle =
  | 'global-lounge'
  | 'budget-rest'
  | 'full-recovery'
  | 'privacy-first'
  | 'hub-specialist'
  | 'flexible-hybrid'
  | 'regional-niche';

export interface SuitabilitySignals {
  shortLayover: boolean;
  overnightTransit: boolean;
  workSessions: boolean;
  budgetUse: boolean;
  privacyNeeds: boolean;
}

export interface BrandSnapshot {
  typeLabel: string;
  sleepScore: SleepQualityScore;
  sleepLabel: string;
  privacyLabel: string;
  primaryUseCase: string;
  accessSummary: string;
  angle: PositioningAngle;
}

export function getBrandTypeLabel(brand: BrandRecord | BrandType): string {
  const type: BrandType = typeof brand === 'string' ? brand : brand.type;
  switch (type) {
    case 'hotel': return 'Transit Hotel Brand';
    case 'pod': return 'Sleep Pod Brand';
    case 'lounge': return 'Airport Lounge';
    case 'hybrid': return 'Hybrid Airport Rest Brand';
  }
}

export function getBrandTypePluralLabel(type: BrandType): string {
  switch (type) {
    case 'hotel': return 'transit hotel rooms';
    case 'pod': return 'sleep pods';
    case 'lounge': return 'lounge locations';
    case 'hybrid': return 'hospitality facilities';
  }
}

export function getBrandCategoryLabel(type: BrandType): string {
  switch (type) {
    case 'hotel': return 'Transit Hotel';
    case 'pod': return 'Sleep Pods';
    case 'lounge': return 'Lounge';
    case 'hybrid': return 'Mixed';
  }
}

export function getSleepQualityLabel(score: SleepQualityScore): string {
  switch (score) {
    case 5: return 'Excellent';
    case 4: return 'Strong';
    case 3: return 'Solid';
    case 2: return 'Limited';
    case 1: return 'Basic';
  }
}

export function getPrivacyLabel(level: PrivacyLevel): string {
  switch (level) {
    case 'high': return 'Full Privacy';
    case 'medium': return 'Partial Privacy';
    case 'low': return 'Shared Space';
  }
}

export function getPricingLabel(level: PricingLevel): string {
  switch (level) {
    case 'low': return 'Budget';
    case 'mid': return 'Mid-Range';
    case 'high': return 'High';
    case 'premium': return 'Premium';
  }
}

export function getPrimaryUseCase(brand: BrandRecord): string {
  if (brand.type === 'hotel' && brand.sleepQualityScore >= 4) {
    return 'Full rest and recovery during a long transit';
  }
  if (brand.type === 'pod' && brand.privacyLevel === 'high') {
    return 'Private enclosed sleep during a layover';
  }
  if (brand.type === 'pod' && brand.pricingLevel === 'low') {
    return 'Budget napping with no booking required';
  }
  if (brand.type === 'lounge' && brand.airportCount >= 20) {
    return 'Food, showers, and rest at a major hub airport';
  }
  if (brand.type === 'lounge' && brand.airportCount === 1) {
    return 'Lounge access at its single served airport';
  }
  if (brand.type === 'hybrid') {
    return 'Choosing rest tier (lounge, pod, or room) at one facility';
  }
  if (brand.bestUseCases.length > 0) {
    return brand.bestUseCases[0];
  }
  return 'General layover rest';
}

export function getAccessSummary(brand: BrandRecord): string {
  const parts: string[] = [];

  if (brand.entryNuance) {
    return brand.entryNuance;
  }

  if (brand.airsideTypical) {
    parts.push('Airside — no immigration clearance needed');
  } else {
    parts.push('Landside — immigration clearance may be required');
  }

  if (brand.accessTypes.includes('self-service')) {
    parts.push('walk-in self-service');
  } else if (brand.accessTypes.includes('front-desk')) {
    parts.push('front desk check-in required');
  }

  if (brand.accessTypes.includes('card-access')) {
    parts.push('credit card or membership access available');
  } else if (brand.accessTypes.includes('paid-entry')) {
    parts.push('paid walk-in entry');
  }

  if (!brand.transitFriendly) {
    parts.push('not optimized for transit passengers');
  }

  return parts.join(' · ');
}

export function getBrandPositioningAngle(brand: BrandRecord): PositioningAngle {
  if (brand.type === 'hybrid') {
    return 'flexible-hybrid';
  }

  if (brand.type === 'hotel') {
    if (brand.sleepQualityScore === 5 && brand.privacyLevel === 'high') {
      return 'full-recovery';
    }
    if (brand.airportCount <= 2) {
      return 'hub-specialist';
    }
    return 'full-recovery';
  }

  if (brand.type === 'pod') {
    if (brand.privacyLevel === 'high') {
      return 'privacy-first';
    }
    if (brand.pricingLevel === 'low') {
      return 'budget-rest';
    }
    if (brand.airportCount <= 3) {
      return 'regional-niche';
    }
    return 'budget-rest';
  }

  if (brand.type === 'lounge') {
    if (brand.airportCount >= 20) {
      return 'global-lounge';
    }
    if (brand.airportCount <= 2) {
      return 'hub-specialist';
    }
    return 'regional-niche';
  }

  return 'regional-niche';
}

export function getSuitabilitySignals(brand: BrandRecord): SuitabilitySignals {
  const shortLayover =
    brand.accessTypes.includes('self-service') ||
    brand.pricingLevel === 'low' ||
    (brand.type === 'lounge' && brand.airportCount >= 5);

  const overnightTransit =
    brand.type === 'hotel' ||
    (brand.type === 'pod' && brand.privacyLevel === 'high' && brand.sleepQualityScore >= 4) ||
    (brand.type === 'hybrid' && brand.sleepQualityScore >= 4);

  const workSessions =
    brand.type === 'hotel' ||
    (brand.type === 'lounge' && brand.pricingLevel !== 'low') ||
    (brand.type === 'hybrid') ||
    brand.amenitySignals.some(s => s.toLowerCase().includes('desk') || s.toLowerCase().includes('wi-fi'));

  const budgetUse =
    brand.pricingLevel === 'low' ||
    (brand.pricingLevel === 'mid' && brand.accessTypes.includes('self-service')) ||
    brand.accessTypes.includes('card-access');

  const privacyNeeds =
    brand.privacyLevel === 'high' ||
    (brand.privacyLevel === 'medium' && brand.type !== 'lounge');

  return { shortLayover, overnightTransit, workSessions, budgetUse, privacyNeeds };
}

export function getBrandSnapshot(brand: BrandRecord): BrandSnapshot {
  return {
    typeLabel: getBrandTypeLabel(brand),
    sleepScore: brand.sleepQualityScore,
    sleepLabel: getSleepQualityLabel(brand.sleepQualityScore),
    privacyLabel: getPrivacyLabel(brand.privacyLevel),
    primaryUseCase: getPrimaryUseCase(brand),
    accessSummary: getAccessSummary(brand),
    angle: getBrandPositioningAngle(brand),
  };
}

export function getRegionSummary(regions: string[]): string {
  if (regions.length === 0) return '';
  if (regions.length === 1) return regions[0];
  if (regions.length === 2) return `${regions[0]} and ${regions[1]}`;
  return `${regions.slice(0, -1).join(', ')}, and ${regions[regions.length - 1]}`;
}

export function isTransitViable(brand: BrandRecord): boolean {
  return brand.airsideTypical && brand.transitFriendly;
}
