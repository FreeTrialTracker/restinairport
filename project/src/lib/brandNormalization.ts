export type BrandType = 'Transit Hotel' | 'Sleep Pods' | 'Lounge Network' | 'Mixed';

/**
 * Maps any normalized facility name to its canonical root brand name.
 * Merges all brand variants (type/tier suffixes, location labels) into one root brand.
 *
 * Keys are post-normalization names (after location suffix stripping).
 * Values are the canonical brand name shown in the index.
 */
const BRAND_ALIAS_MAP: Record<string, string> = {
  // Encalm (India) — lounge + pods + hotel all under one brand
  'Encalm Lounge': 'Encalm',
  'Encalm Sleep Pods': 'Encalm',
  'Encalm Transit Hotel': 'Encalm',
  'Encalm Lounge / Sleep Facility': 'Encalm',

  // Miracle (Thailand) — multiple lounge tiers and transit
  'Miracle Business Class Lounge': 'Miracle',
  'Miracle First & Business Lounge': 'Miracle',
  'Miracle First Class Lounge': 'Miracle',
  'Miracle Lounge': 'Miracle',
  'Miracle Transit': 'Miracle',

  // Coral (Thailand) — all lounge variants
  'Coral Executive Lounge': 'Coral Executive Lounge',
  'Coral Finest Business Lounge': 'Coral Executive Lounge',
  'Coral First Class Lounge': 'Coral Executive Lounge',
  'Coral Cocoon Lounge': 'Coral Executive Lounge',
  'Coral Cosmo Lounge': 'Coral Executive Lounge',

  // Plaza Premium — all co-branded and tier variants
  'Plaza Premium Lounge': 'Plaza Premium',
  'Plaza Premium First': 'Plaza Premium',
  'Saphire - Plaza Premium First': 'Plaza Premium',
  'Saphire - Plaza Premium Lounge': 'Plaza Premium',
  'BLOSSOM - SATS & Plaza Premium Lounge': 'Plaza Premium',

  // GoSleep — pod and lounge variants
  'GoSleep Lounge': 'GoSleep',
  'GoSleep Pods': 'GoSleep',

  // Sleepover — pods variant
  'Sleepover Pods': 'Sleepover',

  // Skyhub — variant name
  'Sky Hub Lounge West': 'Skyhub Lounge',

  // Matina — gold tier
  'Matina Gold': 'Matina Lounge',

  // Ambassador Transit — hotel and lounge (raw names have inline "Terminal 2/3" without parens)
  'Ambassador Transit Hotel Terminal 2': 'Ambassador Transit',
  'Ambassador Transit Hotel Terminal 3': 'Ambassador Transit',
  'Ambassador Transit Lounge': 'Ambassador Transit',

  // Napcabs — XL variant
  'Napcabs XL': 'Napcabs',
};

/**
 * Brand type classification for each canonical root brand.
 */
const BRAND_TYPE_MAP: Record<string, BrandType> = {
  'Aerotel': 'Transit Hotel',
  'Encalm': 'Mixed',
  'GoSleep': 'Sleep Pods',
  'izZzleep': 'Sleep Pods',
  'Kepler Club': 'Lounge Network',
  'Minute Suites': 'Sleep Pods',
  'Miracle': 'Lounge Network',
  'Napcabs': 'Sleep Pods',
  'Plaza Premium': 'Lounge Network',
  'SH Premium Lounge': 'Lounge Network',
  'Skyhub Lounge': 'Lounge Network',
  'Sleepover': 'Sleep Pods',
  "Wait N' Rest": 'Sleep Pods',
  'YOTELAIR': 'Transit Hotel',
  'ZZZleepandGo': 'Sleep Pods',
};

/**
 * Well-known brands that qualify for the index even with only one airport.
 * These are recognisable global or regionally significant operators.
 */
const KNOWN_SINGLE_AIRPORT_BRANDS = new Set([
  'izZzleep',
]);

/**
 * Brands explicitly excluded from the primary brand index.
 * Includes: generic labels, single-property hotels, non-scalable local lounges,
 * and any brand that does not meet the multi-airport or recognized-global threshold.
 *
 * Single-airport operators not in KNOWN_SINGLE_AIRPORT_BRANDS are auto-excluded
 * by the airportCount >= 2 check — this set covers edge cases and
 * names that survive normalization but should still be suppressed.
 */
const GENERIC_EXCLUSIONS = new Set([
  // Generic labels
  'Airport Hotel',
  'AUHotel',
  'Day Rooms',
  'Transit Hotel',
  'Transit Hotel (Gates B/D)',
  'Transit Hotel (Terminal 1)',
  'Transit Hotel (Terminal 2)',
  'Sleep Pods (Airport Hotel)',

  // One-off transit hotels
  'Dubai Intl Hotel',
  'Holiday Inn Express',
  'Mercure Transit',
  'My Cloud Transit Hotel',
  'Oryx Airport Hotel',
  'Royal Park Transit',
  'Serenediva Transit Hotel',
  'Skylight Transit',
  'TRYP by Wyndham',
  '080 Transit Hotel',

  // Single-airport lounges with no multi-airport presence
  'Apricot Business Lounge',
  'Aviserv Lounge',
  'CIP Lounge',
  'Concordia Lounge',       // SUB/DPS/SRG — all Indonesian, re-evaluated below
  'Extime Business Lounge',
  'Jasmine Halal Lounge',
  'Lounge Annex Rokko',
  'Lounge TIME International',
  'Manaia Lounge',          // CHC + ZQN = 2 NZ airports — re-evaluated below
  'marhaba Lounge',         // MNL only — 1 airport
  'Maslin Lounge',
  'MTB Air Lounge',
  'Pearl Exclusive Lounge',
  'Rose Business Lounge',
  'SASCO SleepZone',
  'SATS Premier Lounge',    // SIN only — 1 airport
  'SENS Leisure Lounge',
  'SkyTeam Lounge',
  'Sun Coast Lounge',
  'UCB Lounge',
  'VATC Sleep Pods',
  'Wassan Pods',

  // Single-airport pod/capsule operators without global recognition
  'CapsuleTransit',         // KUL only — 1 airport
  'Sama-Sama',              // KUL only — 1 airport
  'Saphire Lounge',         // KNO only after Plaza Premium variants extracted

  // Single-airport operations not flagged as globally recognized
  'Ambassador Transit',     // SIN only — 1 airport
  'Matina Lounge',          // ICN only — 1 airport

  // Removed from index per editorial decision
  '9h nine hours',
  'GettSleep',
  'JetQuay Sleeping Suite',
  'Niranta Transit Hotel Mumbai',
  'No1 Lounge Pod Bedrooms',
  'Concordia Lounge',
  'Coral Executive Lounge',
  'Manaia Lounge',
]);

/**
 * Override: remove from GENERIC_EXCLUSIONS brands that actually span 2+ airports.
 * This allows us to keep the exclusion list broad but still surface qualifying brands.
 */
const MULTI_AIRPORT_OVERRIDES = new Set([
  'Skyhub Lounge',  // ICN + GMP = 2 airports
]);

const LOCATION_SUFFIX_PATTERNS = [
  /\s+Terminal\s+\d+$/i,
  /\s+Terminal\s+[A-Z]$/i,
  /\s*\(Terminal\s*\)\s*$/i,
  /\s*\(Terminal\s+\d+[^)]*\)\s*$/i,
  /\s*\(Terminal\s+[A-Z][^)]*\)\s*$/i,
  /\s*\(T\d+[^)]*\)\s*$/i,
  /\s*\(Concourse\s+[^)]+\)\s*$/i,
  /\s*\(Gate\s+[^)]+\)\s*$/i,
  /\s*\(Satellite\s+[^)]+\)\s*$/i,
  /\s*\(North[^)]*\)\s*$/i,
  /\s*\(South[^)]*\)\s*$/i,
  /\s*\(East[^)]*\)\s*$/i,
  /\s*\(West[^)]*\)\s*$/i,
  /\s*\(Arrivals[^)]*\)\s*$/i,
  /\s*\(Departures[^)]*\)\s*$/i,
  /\s*\(International[^)]*\)\s*$/i,
  /\s*\(Domestic[^)]*\)\s*$/i,
  /\s*\(Intl[^)]*\)\s*$/i,
  /\s*\(Schengen[^)]*\)\s*$/i,
  /\s*\(Non-Schengen[^)]*\)\s*$/i,
  /\s*\(KLIA\d*[^)]*\)\s*$/i,
  /\s*\(Jewel[^)]*\)\s*$/i,
  /\s*\(Atrium[^)]*\)\s*$/i,
  /\s*\(Airside[^)]*\)\s*$/i,
  /\s*\(Landside[^)]*\)\s*$/i,
  /\s*\(Mezzanine[^)]*\)\s*$/i,
  /\s*\(No\.\s*\d+[^)]*\)\s*$/i,
  /\s*\([^)]*Pier[^)]*\)\s*$/i,
  /\s*\([^)]*Node[^)]*\)\s*$/i,
  /\s*\([A-Z]\)\s*$/,
];

const STANDALONE_GENERIC_PATTERN = /^(Transit Hotel|Airport Hotel|Day Rooms?)\s+\(.*\)$/i;

/**
 * Strips location/terminal suffixes from a raw facility name to produce
 * a normalised variant name suitable for alias lookup.
 */
export function normalizeBrandName(rawName: string): string {
  if (STANDALONE_GENERIC_PATTERN.test(rawName)) {
    return rawName;
  }

  let name = rawName;

  for (const pattern of LOCATION_SUFFIX_PATTERNS) {
    name = name.replace(pattern, '');
  }

  return name.trim() || rawName;
}

/**
 * Returns the canonical root brand name for a normalised facility variant name.
 */
export function getCanonicalBrandName(normalizedName: string): string {
  return BRAND_ALIAS_MAP[normalizedName] ?? normalizedName;
}

export function getBrandSlugFromNormalized(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export interface NormalizedBrand {
  name: string;
  slug: string;
  facilityCount: number;
  airportCount: number;
  airportCodes: string[];
  rawNames: string[];
  isPrimary: boolean;
  brandType: BrandType;
}

export function isPrimaryBrand(brand: NormalizedBrand): boolean {
  if (MULTI_AIRPORT_OVERRIDES.has(brand.name)) return true;
  if (GENERIC_EXCLUSIONS.has(brand.name)) return false;
  if (KNOWN_SINGLE_AIRPORT_BRANDS.has(brand.name)) return true;
  return brand.airportCount >= 2;
}

export function groupFacilitiesByBrand(
  facilities: Array<{ facility: string; airport_code: string }>
): NormalizedBrand[] {
  const brandMap = new Map<
    string,
    { airports: Set<string>; count: number; rawNames: Set<string> }
  >();

  for (const facility of facilities) {
    const normalized = normalizeBrandName(facility.facility);
    const canonical = getCanonicalBrandName(normalized);

    const existing = brandMap.get(canonical);
    if (existing) {
      existing.airports.add(facility.airport_code);
      existing.count += 1;
      existing.rawNames.add(facility.facility);
    } else {
      brandMap.set(canonical, {
        airports: new Set([facility.airport_code]),
        count: 1,
        rawNames: new Set([facility.facility]),
      });
    }
  }

  const brands = Array.from(brandMap.entries()).map(([name, data]) => {
    const brand: NormalizedBrand = {
      name,
      slug: getBrandSlugFromNormalized(name),
      facilityCount: data.count,
      airportCount: data.airports.size,
      airportCodes: Array.from(data.airports),
      rawNames: Array.from(data.rawNames),
      isPrimary: false,
      brandType: BRAND_TYPE_MAP[name] ?? 'Mixed',
    };
    brand.isPrimary = isPrimaryBrand(brand);
    return brand;
  });

  return brands.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Returns all facilities that belong to a given canonical brand slug.
 */
export function getFacilitiesForBrandSlug(
  facilities: Array<{ facility: string; airport_code: string }>,
  brandSlug: string
): typeof facilities {
  return facilities.filter((f) => {
    const normalized = normalizeBrandName(f.facility);
    const canonical = getCanonicalBrandName(normalized);
    return getBrandSlugFromNormalized(canonical) === brandSlug;
  });
}

/**
 * Returns the display name for a brand given its slug, by looking it up
 * from the live facilities list.
 */
export function getBrandNameFromSlug(
  facilities: Array<{ facility: string; airport_code: string }>,
  brandSlug: string
): string | null {
  const all = groupFacilitiesByBrand(facilities);
  const found = all.find((b) => b.slug === brandSlug);
  return found?.name ?? null;
}
