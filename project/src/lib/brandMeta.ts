import type { BrandRecord } from './brandData';
import {
  getBrandPositioningAngle,
  getRegionSummary,
} from './brandScoring';
import type { PositioningAngle } from './brandScoring';
import { buildBrandFaqs } from './brandFaqEngine';
import type { BrandFAQ } from './brandFaqEngine';

const SITE_ORIGIN = 'https://restinairport.com';
const SITE_SUFFIX = 'RestInAirport';

export function getBrandPageTitle(brand: BrandRecord, _airportCount?: number): string {
  const angle = getBrandPositioningAngle(brand);
  return buildTitle(brand, angle);
}

export function getBrandMetaDescription(brand: BrandRecord, _airportCount?: number): string {
  const angle = getBrandPositioningAngle(brand);
  return buildDescription(brand, angle);
}

export function getBrandCanonicalUrl(brandSlug: string): string {
  return `${SITE_ORIGIN}/brand/${brandSlug}`;
}

export function getBrandCanonical(brand: BrandRecord): string {
  return getBrandCanonicalUrl(brand.slug);
}

export function getBrandFaqSchema(brand: BrandRecord) {
  const faqs = buildBrandFaqs(brand);
  return generateBrandFAQSchema(faqs);
}

export function getBrandBreadcrumbSchema(brand: BrandRecord) {
  return generateBrandBreadcrumbSchema(brand);
}

export function generateBrandFAQSchema(faqs: BrandFAQ[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };
}

export function generateBrandBreadcrumbSchema(brand: BrandRecord) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_ORIGIN,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Brands',
        item: `${SITE_ORIGIN}/brands`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: brand.name,
        item: `${SITE_ORIGIN}/brand/${brand.slug}`,
      },
    ],
  };
}

function buildTitle(brand: BrandRecord, angle: PositioningAngle): string {
  const hub0 = brand.strongestHubs[0] ?? '';
  const hubShort = hub0 ? hub0.replace(/\s*\(.*?\)/, '').trim() : '';
  const regionShort = brand.regions[0] ?? '';

  switch (angle) {
    case 'full-recovery': {
      if (brand.airportCount <= 3 && hubShort) {
        return `${brand.name} Transit Hotel – Airside Rooms at ${hubShort} | ${SITE_SUFFIX}`;
      }
      return `${brand.name} – Private Airside Hotel Rooms, Showers & Hourly Booking | ${SITE_SUFFIX}`;
    }

    case 'privacy-first': {
      if (brand.airportCount <= 2 && hubShort) {
        return `${brand.name} Sleep Capsules at ${hubShort} – Fully Enclosed Pods | ${SITE_SUFFIX}`;
      }
      return `${brand.name} Enclosed Sleep Pods – Blackout Capsules for Airport Layovers | ${SITE_SUFFIX}`;
    }

    case 'budget-rest': {
      const airportStr = brand.airportCount > 1 ? `${brand.airportCount} Airports` : 'Airport';
      return `${brand.name} Sleep Pods – Walk-In Hourly Rest at ${airportStr} | ${SITE_SUFFIX}`;
    }

    case 'global-lounge': {
      return `${brand.name} Lounge – Access at ${brand.airportCount}+ Airports Worldwide | ${SITE_SUFFIX}`;
    }

    case 'hub-specialist': {
      if (brand.type === 'lounge' && hubShort) {
        return `${brand.name} Lounge at ${hubShort} – Access, Tiers & Pricing | ${SITE_SUFFIX}`;
      }
      if (brand.type === 'hotel' && hubShort) {
        return `${brand.name} at ${hubShort} – Airside Transit Hotel Review | ${SITE_SUFFIX}`;
      }
      if (hubShort) {
        return `${brand.name} at ${hubShort} – Access, Pricing & Sleep Quality | ${SITE_SUFFIX}`;
      }
      return `${brand.name} – Airport Rest Review, Access & Use Cases | ${SITE_SUFFIX}`;
    }

    case 'regional-niche': {
      if (brand.type === 'lounge') {
        return `${brand.name} Airport Lounge – ${regionShort} Paid-Entry Access & Review | ${SITE_SUFFIX}`;
      }
      if (brand.type === 'pod') {
        return `${brand.name} Sleep Pods – ${regionShort} Airport Rest, Pricing & Access | ${SITE_SUFFIX}`;
      }
      return `${brand.name} – ${regionShort} Airport Rest Brand Review | ${SITE_SUFFIX}`;
    }

    case 'flexible-hybrid': {
      if (hubShort) {
        return `${brand.name} at ${hubShort} – Lounge, Pods & Hotel Rooms in One Brand | ${SITE_SUFFIX}`;
      }
      return `${brand.name} – Flexible Airport Rest: Lounge, Sleep Pod & Hotel Room | ${SITE_SUFFIX}`;
    }
  }
}

function buildDescription(brand: BrandRecord, angle: PositioningAngle): string {
  const hub0 = brand.strongestHubs[0] ?? '';
  const hub1 = brand.strongestHubs[1] ?? '';
  const hubPair = hub1 ? `${hub0} & ${hub1}` : hub0;
  const regionSummary = getRegionSummary(brand.regions);
  const airports = brand.airportCount;

  let desc = '';

  switch (angle) {
    case 'full-recovery':
      if (airports <= 3 && hubPair) {
        desc = `${brand.name} airside transit hotel at ${hubPair} — private rooms with en-suite showers, no immigration needed. Hourly and overnight rates available.`;
      } else {
        desc = `${brand.name} transit hotel — fully private airside rooms with en-suite showers at ${airports} airports. No immigration clearance needed for transit passengers.`;
      }
      break;

    case 'privacy-first':
      if (airports <= 2 && hubPair) {
        desc = `${brand.name} fully enclosed sleep capsules at ${hubPair} — lockable blackout pods, transit-friendly, self-service hourly booking.`;
      } else {
        desc = `${brand.name} enclosed sleep pods at ${airports} airports — fully sealed capsules with blackout and noise reduction, no reservation required.`;
      }
      break;

    case 'budget-rest':
      desc = `${brand.name} self-service sleep pods across ${regionSummary} — walk-in hourly rest at ${airports} airports with no advance booking required.`;
      break;

    case 'global-lounge':
      desc = `${brand.name} independent airport lounges at ${brand.facilityCount}+ locations across ${airports}+ airports worldwide — open to any passenger, hot food, showers, and Wi-Fi included. No airline status needed.`;
      break;

    case 'hub-specialist':
      if (brand.type === 'lounge' && hubPair) {
        desc = `${brand.name} independent airport lounge at ${hubPair} — paid entry for any passenger, tiered access levels, food and shower facilities included.`;
      } else if (brand.type === 'hotel' && hubPair) {
        desc = `${brand.name} at ${hubPair} — airside transit hotel rooms with private bathroom. No immigration clearance required. Hourly and overnight booking.`;
      } else if (hubPair) {
        desc = `${brand.name} at ${hubPair} — ${brand.keyDifferentiator.slice(0, 100)}`;
      } else {
        desc = `${brand.name} airport rest — ${brand.keyDifferentiator.slice(0, 110)}`;
      }
      break;

    case 'regional-niche':
      if (brand.type === 'lounge' && hubPair) {
        desc = `${brand.name} independent lounge at ${hubPair} — paid-entry access for any passenger in ${regionSummary}. Food, Wi-Fi, and rest zones included.`;
      } else if (brand.type === 'pod' && hubPair) {
        desc = `${brand.name} sleep pods at ${hubPair} in ${regionSummary} — self-service hourly rest, no booking required, transit-friendly airside access.`;
      } else {
        desc = `${brand.name} in ${regionSummary} — ${brand.keyDifferentiator.slice(0, 100)}`;
      }
      break;

    case 'flexible-hybrid':
      if (hubPair) {
        desc = `${brand.name} at ${hubPair} — lounge, sleep pods, and hotel rooms under one brand. Choose rest tier by layover length. All tiers airside.`;
      } else {
        desc = `${brand.name} hybrid airport rest — lounge access, sleep pods, and private hotel rooms available under one operator. No airline status required.`;
      }
      break;
  }

  return trimToMetaLength(desc);
}

function trimToMetaLength(text: string): string {
  if (text.length <= 160) return text;
  const trimmed = text.slice(0, 157);
  const lastSpace = trimmed.lastIndexOf(' ');
  return (lastSpace > 120 ? trimmed.slice(0, lastSpace) : trimmed) + '...';
}
