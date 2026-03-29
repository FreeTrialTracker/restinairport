import type { BrandRecord } from './brandData';
import {
  getBrandTypeLabel,
  getBrandTypePluralLabel,
  getAccessSummary,
  getBrandPositioningAngle,
  getRegionSummary,
  getSleepQualityLabel,
  getPrivacyLabel,
  getPricingLabel,
  getSuitabilitySignals,
} from './brandScoring';
import type { PositioningAngle } from './brandScoring';

export interface BrandContentSections {
  heroTagline: string;
  heroDescription: string;
  positioningHeadline: string;
  positioningBody: string;
  coverageHeadline: string;
  coverageBody: string;
  accessHeadline: string;
  accessBody: string;
  experienceHeadline: string;
  experienceBody: string;
  limitationsHeadline: string;
  limitationsBody: string;
  bestForHeadline: string;
  bestForItems: string[];
  notIdealForItems: string[];
  comparisonIntro: string;
  endingBlock: string;
  badges: Array<{ label: string; value: string }>;
}

export interface BrandPageContent {
  hero: { title: string; intro: string };
  positioning: { headline: string; body: string };
  coverage: { headline: string; body: string };
  access: { headline: string; body: string };
  experience: {
    seatingSleep: string;
    privacy: string;
    foodAmenities: string;
    suitability: string;
  };
  limitations: { headline: string; body: string };
  bestFor: { headline: string; items: string[]; notFor: string[] };
  comparisonIntro: string;
  ending: string;
}

export function buildBrandPageContent(brand: BrandRecord): BrandPageContent {
  const angle = getBrandPositioningAngle(brand);
  const hub = brand.strongestHubs[0] ?? 'its primary hub';
  const regionSummary = getRegionSummary(brand.regions);

  return {
    hero: buildHero(brand, angle, hub),
    positioning: buildPositioning(brand, angle, hub, regionSummary),
    coverage: buildCoverage(brand, angle, hub),
    access: buildAccess(brand, angle, hub),
    experience: buildExperience(brand, angle, hub),
    limitations: buildLimitations(brand, angle, hub),
    bestFor: buildBestFor(brand, angle),
    comparisonIntro: buildComparisonIntro(brand, angle),
    ending: buildEnding(brand, angle, hub),
  };
}

export function generateBrandContent(
  brand: BrandRecord,
  airportCount: number,
  facilityCount: number,
  liveAirportCodes: string[]
): BrandContentSections {
  const angle = getBrandPositioningAngle(brand);
  const hub = brand.strongestHubs[0] ?? 'its primary hub';
  const regionSummary = getRegionSummary(brand.regions);
  const hubList = brand.strongestHubs.length > 0
    ? brand.strongestHubs.slice(0, 3).join(', ')
    : regionSummary;

  const badges: Array<{ label: string; value: string }> = [
    { label: 'Sleep Quality', value: getSleepQualityLabel(brand.sleepQualityScore) },
    { label: 'Privacy', value: getPrivacyLabel(brand.privacyLevel) },
    { label: 'Pricing', value: getPricingLabel(brand.pricingLevel) },
    { label: 'Airside', value: brand.airsideTypical ? 'Yes' : 'Varies' },
  ];

  const hero = buildHero(brand, angle, hub);
  const positioning = buildPositioning(brand, angle, hub, regionSummary);
  const coverage = buildCoverageWithCounts(brand, angle, hub, hubList, airportCount, facilityCount);
  const access = buildAccess(brand, angle, hub);
  const experience = buildExperience(brand, angle, hub);
  const limitations = buildLimitations(brand, angle, hub);
  const bestFor = buildBestFor(brand, angle);

  return {
    heroTagline: hero.title,
    heroDescription: hero.intro,
    positioningHeadline: positioning.headline,
    positioningBody: positioning.body,
    coverageHeadline: coverage.headline,
    coverageBody: coverage.body,
    accessHeadline: access.headline,
    accessBody: access.body,
    experienceHeadline: `Inside ${brand.name}`,
    experienceBody: [
      experience.seatingSleep,
      experience.privacy,
      experience.foodAmenities,
      experience.suitability,
    ].filter(Boolean).join(' '),
    limitationsHeadline: limitations.headline,
    limitationsBody: limitations.body,
    bestForHeadline: bestFor.headline,
    bestForItems: bestFor.items,
    notIdealForItems: bestFor.notFor,
    comparisonIntro: buildComparisonIntro(brand, angle),
    endingBlock: buildEnding(brand, angle, hub),
    badges,
  };
}

function buildHero(
  brand: BrandRecord,
  angle: PositioningAngle,
  hub: string
): { title: string; intro: string } {
  switch (angle) {
    case 'full-recovery':
      return {
        title: `${brand.name} — Private Transit Hotel Inside the Terminal`,
        intro: `${brand.name} operates fully private transit hotel rooms inside the secure airside zone at ${describeAirportCount(brand.airportCount)}. No immigration clearance needed — each room has a proper bed, an en-suite shower, and hotel-grade amenities. ${brand.keyDifferentiator}`,
      };

    case 'hub-specialist':
      return {
        title: `${brand.name} — Specialist Rest at ${hub}`,
        intro: `${brand.name} focuses entirely on ${hub}${brand.airportCount > 1 ? ` and ${brand.airportCount - 1} other airport${brand.airportCount - 1 > 1 ? 's' : ''}` : ''}, rather than building a global network. ${brand.keyDifferentiator} For travelers whose routes pass through this airport, that depth of coverage matters more than breadth.`,
      };

    case 'privacy-first':
      return {
        title: `${brand.name} — Fully Enclosed Sleep Capsules for Layovers`,
        intro: `${brand.name} offers enclosed, lockable sleep capsules at ${describeAirportCount(brand.airportCount)} — a fundamentally different privacy standard from visor-based pods. ${brand.keyDifferentiator} Best suited to travelers who find open-format pods too exposed for real sleep.`,
      };

    case 'budget-rest':
      return {
        title: `${brand.name} — Walk-In Airport Sleep Pods, No Booking Required`,
        intro: `${brand.name} provides self-service sleep pods at ${describeAirportCount(brand.airportCount)}. Walk up, pay by the hour, rest — no desk, no reservation, no minimum commitment. ${brand.keyDifferentiator}`,
      };

    case 'global-lounge':
      return {
        title: `${brand.name} — Independent Lounge Access Across ${brand.airportCount}+ Airports`,
        intro: `${brand.name} is the largest independent airport lounge operator by location count, with over ${brand.airportCount} lounges concentrated in Asia-Pacific, the Middle East, and Europe. Any passenger can access a visit — no airline status, no premium ticket required. ${brand.keyDifferentiator}`,
      };

    case 'regional-niche':
      return {
        title: `${brand.name} — Airport Rest in Its Served Region`,
        intro: `${brand.name} operates at ${describeAirportCount(brand.airportCount)} in ${getRegionSummary(brand.regions) || 'its served region'}. ${brand.keyDifferentiator} Coverage is intentionally focused — the brand serves a defined set of airports well rather than spreading thin.`,
      };

    case 'flexible-hybrid':
      return {
        title: `${brand.name} — Lounge, Pod, and Hotel Room Under One Roof`,
        intro: `${brand.name} consolidates three rest tiers — lounge, sleep pod, and private hotel room — into a single facility at ${hub}. Travelers choose the tier that fits their layover length and budget without navigating separate operators or check-in queues. ${brand.keyDifferentiator}`,
      };
  }
}

function buildPositioning(
  brand: BrandRecord,
  angle: PositioningAngle,
  hub: string,
  regionSummary: string
): { headline: string; body: string } {
  const typeLabel = getBrandTypeLabel(brand.type);

  switch (angle) {
    case 'full-recovery':
      return {
        headline: `What Sets ${brand.name} Apart`,
        body: `${brand.name} operates at the premium end of the transit hotel market. The competition on price comes from sleep pods — but ${brand.name} delivers what a pod cannot: a lockable room, fresh linen on a proper bed, and a private en-suite shower, all without clearing immigration. For long transits where recovery quality directly affects the next leg of a journey, the price premium reflects a genuine experience difference. It is not a budget option, and it does not try to be.`,
      };

    case 'hub-specialist':
      return {
        headline: `${brand.name}'s Focused Strategy`,
        body: `${brand.name} deliberately operates at a small number of airports rather than chasing global scale. At ${hub}, this focus translates into a facility calibrated for that airport's transit flow — terminal positioning, staffing, and capacity are matched to the actual passenger volume passing through. For travelers routing through these specific hubs, the specialist approach tends to produce a better experience than a brand that replicates the same format indiscriminately across 50 airports.`,
      };

    case 'privacy-first':
      return {
        headline: `Why ${brand.name} Is Different From Other Sleep Pods`,
        body: `Most airport pods use a privacy visor — effective for light napping, inadequate for real sleep. ${brand.name} uses a sealed capsule design with a lockable door. The distinction matters for light sleepers: a visor blocks overhead light but lets in terminal ambient noise. A sealed capsule addresses both. For travelers who have tried standard pods and found them too exposed, ${brand.name} is the closest alternative to a private room at a pod price point.`,
      };

    case 'budget-rest':
      return {
        headline: `How ${brand.name} Works`,
        body: `The appeal of ${brand.name} is frictionless access. No booking system, no check-in queue, no minimum stay beyond the first paid hour. For layovers of 1–4 hours, the time saved on the access process is itself a meaningful advantage. The trade-off is privacy — the visor or partial enclosure reduces light and some noise, but it is not a sealed space. Travelers needing genuine quiet should consider an enclosed pod or transit hotel. For everyone else, the walk-up model at this price point is difficult to argue against.`,
      };

    case 'global-lounge':
      return {
        headline: `${brand.name} — Why Independent Lounge Access Matters`,
        body: `Airline lounges remain largely restricted to premium ticket holders and frequent flyers with tier status. ${brand.name} makes lounge access available to any traveler regardless of how they booked. With over ${brand.airportCount} locations, the practical coverage argument is strong for travelers on Asia-Pacific, Middle East, and connecting European routes. The business model — paid walk-in, credit card benefit, or third-party membership — means access does not require any long-term commitment or airline relationship.`,
      };

    case 'regional-niche':
      return {
        headline: `${brand.name} — Its Place in the Airport Rest Market`,
        body: `${brand.name} occupies a defined niche: a ${typeLabel.toLowerCase()} brand concentrated in ${regionSummary || 'its served region'}, serving travelers whose routes pass through its airports. It does not compete on global scale. What it offers at its served airports — ${brand.keyDifferentiator.toLowerCase().replace(/\.$/, '')} — is the relevant comparison to make, not whether it matches the footprint of a global lounge chain.`,
      };

    case 'flexible-hybrid':
      return {
        headline: `${brand.name} — One Operator, Every Layover Length`,
        body: `Most airports require travelers to use separate operators for a lounge, a sleep pod, or a hotel room — each with its own check-in process. ${brand.name} consolidates all three under one brand at ${hub}. A 90-minute connection suits the lounge tier. A 5-hour layover warrants the pod tier. An overnight transit calls for the hotel room tier. The flexibility removes the decision overhead and means one booking relationship covers the full range of layover scenarios at this airport.`,
      };
  }
}

function buildCoverage(
  brand: BrandRecord,
  angle: PositioningAngle,
  hub: string
): { headline: string; body: string } {
  return buildCoverageWithCounts(brand, angle, hub, hub, brand.airportCount, brand.facilityCount);
}

function buildCoverageWithCounts(
  brand: BrandRecord,
  angle: PositioningAngle,
  hub: string,
  hubList: string,
  airportCount: number,
  facilityCount: number
): { headline: string; body: string } {
  const countPhrase = describeAirportCount(airportCount);
  const facilityPhrase = facilityCount === 1 ? 'one location' : `${facilityCount} locations`;
  const regionSummary = getRegionSummary(brand.regions);

  switch (angle) {
    case 'global-lounge':
      return {
        headline: `Where ${brand.name} Operates`,
        body: `${brand.name} maintains ${facilityPhrase} across ${countPhrase}, with the highest density in Asia-Pacific — particularly ${hubList}. The Middle East and European footprint is smaller but growing. Coverage within individual airports varies: some host a single lounge, while major hubs carry multiple ${brand.name} properties across terminals. Verify your terminal when booking — access can differ within the same airport, and not every terminal at a served airport will have a location.`,
      };

    case 'hub-specialist':
      return {
        headline: `${brand.name} Terminal Coverage`,
        body: `${brand.name} operates ${facilityPhrase} at ${hubList}. ${brand.airsideTypical ? 'All locations are airside — accessible to transit passengers without clearing immigration.' : 'Location position varies; confirm immigration requirements for your specific terminal.'} Multiple positions within the same airport reduce walk distance from different gate zones. Check the location closest to your departure gates rather than treating the nearest entrance as the default.${brand.coverageNote ? ` ${brand.coverageNote}` : ''}`,
      };

    case 'flexible-hybrid':
      return {
        headline: `${brand.name} at ${hub}`,
        body: `${brand.name} currently operates at ${hub}, where it runs a full-service transit hospitality complex covering lounge, pod, and hotel room tiers. The facility is airside — no immigration clearance needed for transit passengers. Plans for additional airport coverage may exist; check the latest listings on RestInAirport for updates. Travelers not routing through ${hub} will need to use separate operators for each rest tier at their layover airport.`,
      };

    case 'full-recovery':
      return {
        headline: `${brand.name} Locations`,
        body: `${brand.name} operates at ${countPhrase} — ${hubList}. All locations are inside the secure airside zone after passport control. ${airportCount > 1 ? 'Terminal placement differs at multi-terminal airports; confirm your arrival and departure terminals before booking since some airports carry the brand in one terminal only.' : 'Confirm the terminal position before arrival to avoid long walks between gates.'} ${brand.coverageNote ? brand.coverageNote : ''}`,
      };

    case 'privacy-first':
      return {
        headline: `Where to Find ${brand.name}`,
        body: `${brand.name} is concentrated at ${hubList}${regionSummary ? `, both in ${regionSummary}` : ''}. ${brand.airsideTypical ? 'All installations are inside the international departures zone — transit passengers access them without clearing local immigration.' : 'Check immigration requirements for your specific terminal.'} Coverage outside these airports is limited. If your routing does not pass through a ${brand.name} hub, GoSleep or izZzleep are the closest comparable alternatives for enclosed or semi-enclosed pod formats.`,
      };

    default:
      return {
        headline: `${brand.name} Airport Coverage`,
        body: `${brand.name} operates ${facilityPhrase} across ${countPhrase}${regionSummary ? ` in ${regionSummary}` : ''}${hubList && hubList !== hub ? `, with its strongest presence at ${hubList}` : ''}. ${brand.airsideTypical ? 'All installations are airside — no immigration clearance needed for transit passengers.' : 'Check local immigration rules for your specific terminal.'} ${brand.coverageNote ?? ''}`.trim(),
      };
  }
}

function buildAccess(
  brand: BrandRecord,
  angle: PositioningAngle,
  hub: string
): { headline: string; body: string } {
  const accessSummary = getAccessSummary(brand);
  const selfService = brand.accessTypes.includes('self-service');
  const cardAccess = brand.accessTypes.includes('card-access');
  const paidEntry = brand.accessTypes.includes('paid-entry');

  switch (angle) {
    case 'full-recovery':
      return {
        headline: `Booking and Entry`,
        body: `All ${brand.name} locations are airside — inside the secure international departures zone after passport control. Transit passengers do not need to clear the destination country's immigration to check in. ${brand.entryNuance ?? ''} Booking is handled at a staffed front desk and is also available online in advance. Walk-in access is possible subject to availability, but advance booking is strongly recommended during peak seasons and at major hub airports where capacity fills quickly.`,
      };

    case 'hub-specialist':
      return {
        headline: `Access at ${hub}`,
        body: `${brand.entryNuance ?? accessSummary} ${selfService ? `No staff interaction or advance booking is required — walk to an available unit, complete payment at the terminal, and rest.` : `Front desk check-in is required; online pre-booking reduces wait times at busy periods.`} ${brand.transitFriendly ? 'Transit passengers can access all facilities without clearing local immigration.' : 'Confirm immigration requirements before your transit.'} ${cardAccess ? 'Access may also be available via compatible premium credit cards at select locations.' : ''}`.trim(),
      };

    case 'privacy-first':
    case 'budget-rest':
    case 'regional-niche':
      return {
        headline: `How to Access ${brand.name}`,
        body: `${brand.name} pods are self-service at all locations. No staff interaction or advance booking required. Walk to an available unit, pay by card or contactless at the pod terminal, and rest. The full process — from arriving at the pod to having the privacy visor deployed — takes under two minutes. ${brand.airsideTypical ? 'All pods are inside the airside terminal zone; transit passengers can use them without clearing immigration.' : 'Check whether the pod location is airside or landside for your specific terminal.'} ${brand.entryNuance ? brand.entryNuance : ''}`.trim(),
      };

    case 'global-lounge':
      return {
        headline: `Who Can Access ${brand.name}`,
        body: `${brand.name} is open to any passenger regardless of airline, ticket class, or frequent flyer status. Entry is available through three routes: a paid walk-in fee at the lounge entrance; compatible premium credit cards that include ${brand.name} as a benefit; or third-party lounge membership programs such as Priority Pass or LoungeKey at eligible locations. ${brand.airsideTypical ? 'All lounges are airside — transit passengers do not need to clear immigration.' : 'Location position varies by airport.'} Typical stay duration is 2–3 hours per visit; extension options exist at some locations for an additional fee. ${brand.entryNuance ?? ''}`.trim(),
      };

    case 'flexible-hybrid':
      return {
        headline: `How ${brand.name} Access Works`,
        body: `${brand.name} operates a tiered access model. Lounge access is available via a paid per-visit fee. Sleep pods and transit hotel rooms are booked separately at the facility reception or online in advance. All tiers are airside at ${hub} — transit passengers do not need to clear immigration for any service level. ${brand.entryNuance ?? ''} For visits where layover duration is uncertain, lounge access can be purchased on arrival; pod and room bookings benefit from advance reservation at peak times.`.trim(),
      };

    default:
      return {
        headline: `Access and Booking`,
        body: `${accessSummary}. ${brand.transitFriendly ? 'Transit passengers can access all facilities without clearing local immigration.' : 'Confirm immigration requirements for your specific transit before arrival.'} ${selfService ? 'No advance booking required at most locations.' : 'Advance booking is recommended during peak periods.'}`,
      };
  }
}

function buildExperience(
  brand: BrandRecord,
  angle: PositioningAngle,
  hub: string
): { seatingSleep: string; privacy: string; foodAmenities: string; suitability: string } {
  const amenities = brand.amenitySignals;
  const hasShower = amenities.some(a => a.toLowerCase().includes('shower'));
  const hasFood = amenities.some(a => a.toLowerCase().includes('food') || a.toLowerCase().includes('buffet') || a.toLowerCase().includes('dining'));
  const hasWifi = amenities.some(a => a.toLowerCase().includes('wi-fi') || a.toLowerCase().includes('wifi'));
  const hasDesk = amenities.some(a => a.toLowerCase().includes('desk'));

  switch (angle) {
    case 'full-recovery':
      return {
        seatingSleep: `${brand.name} rooms are designed for genuine rest: a proper bed with fresh linen, a lockable door, and blackout conditions. ${brand.sleepNuance ?? 'Sleep quality is at the upper end of what any airside facility can offer.'}`,
        privacy: `Full privacy — a private room with a lockable door. No shared sleeping space, no visor partition. Terminal noise does not penetrate at standard HVAC operation.`,
        foodAmenities: `En-suite shower is standard across all locations. ${hasDesk ? 'Desk space supports light work during a long stop.' : ''} ${hasWifi ? 'Wi-Fi is included.' : ''} ${brand.amenitySignals.filter(a => !['private room', 'real bed'].includes(a)).slice(0, 3).join(', ')}.`,
        suitability: `Optimal for layovers of 4 hours or more where recovery quality is the priority. The cost per hour is higher than pods or lounges — for short connections under 3 hours, the value equation does not hold as well.`,
      };

    case 'hub-specialist':
      return {
        seatingSleep: `At ${hub}, ${brand.name} offers ${brand.type === 'hotel' ? 'private rooms with proper beds' : brand.type === 'pod' ? 'sleep pod units optimized for the terminal layout' : 'lounge seating with dedicated rest zones'}. ${brand.sleepNuance ?? ''}`,
        privacy: `Privacy level is ${getPrivacyLabel(brand.privacyLevel).toLowerCase()} — ${brand.privacyLevel === 'high' ? 'a fully enclosed private space' : brand.privacyLevel === 'medium' ? 'partial enclosure with a privacy partition' : 'shared open-plan space with no individual enclosure'}.`,
        foodAmenities: `${hasFood ? 'Food and beverages are included.' : 'No dedicated food service.'} ${hasShower ? 'Shower access is available.' : ''} ${hasWifi ? 'Wi-Fi included.' : ''} ${amenities.slice(0, 3).join(', ')}.`.trim(),
        suitability: `Best suited to passengers routing through ${hub} who need ${brand.type === 'hotel' ? 'proper rest on a long transit' : brand.type === 'pod' ? 'a short rest without advance booking' : 'food, Wi-Fi, and comfort during a layover'}.`,
      };

    case 'privacy-first':
      return {
        seatingSleep: `Each ${brand.name} unit is a fully sealed individual capsule — not a visor-equipped recliner. The flat sleep surface accommodates most adult travelers. ${brand.sleepNuance ?? 'Blackout conditions inside the capsule are comparable to a darkened hotel room.'}`,
        privacy: `Full enclosure with a lockable door is the defining feature. Noise reduction is substantially better than any visor-based pod design. The capsule is a genuinely private space — not an approximation of privacy.`,
        foodAmenities: `No in-capsule food service. ${hasShower ? 'Shower access may be available at select airports adjacent to the pod area.' : 'No shower access is provided within the capsule.'} ${hasWifi ? 'Wi-Fi is available.' : ''} The capsule is equipped with a personal charging point and wake-up alarm.`,
        suitability: `Suited to light sleepers, noise-sensitive travelers, and anyone who has found standard visor pods inadequate. Less suitable for travelers who need a full shower or an overnight stay requiring hotel amenities.`,
      };

    case 'budget-rest':
      return {
        seatingSleep: `${brand.name} pods use a reclining-to-flat seat design. ${brand.sleepNuance ?? 'The surface is adequate for rest periods of 1–4 hours; extended overnight use is not the format\'s strength.'}`,
        privacy: `The privacy visor blocks overhead light and reduces some terminal noise. It does not create a sealed environment — ambient sounds from the terminal will be audible during busy periods. This is a meaningful limitation for light sleepers.`,
        foodAmenities: `No food or beverage service. ${hasWifi ? 'Wi-Fi is available.' : ''} Each pod has a personal payment terminal and wake-up alarm. The amenity set is intentionally minimal — the product is rest, not comfort.`,
        suitability: `Excellent for budget-conscious short layovers of 1–4 hours. Not ideal for travelers who need a shower, full quiet, or a genuine overnight rest. For those needs, a transit hotel room is the correct format.`,
      };

    case 'global-lounge':
      return {
        seatingSleep: `${brand.name} lounges provide comfortable seating in zones ranging from dining to quiet relaxation areas. ${brand.sleepNuance ?? 'Dedicated rest chairs are available at select locations, but the product is comfort and amenities, not sleep infrastructure.'}`,
        privacy: `Shared open-plan space. No individual enclosure. Quieter zones exist at most locations, but ambient noise from other guests is expected. This is a lounge, not a sleep facility.`,
        foodAmenities: `Hot and cold food buffet, beverages including alcohol, soft drinks, and hot drinks. Shower access is bookable on arrival at most locations. ${hasWifi ? 'Wi-Fi is included.' : ''} Lounge quality — particularly food — varies noticeably between Asia-Pacific and European locations, with the former generally stronger.`,
        suitability: `Best for layovers of 2–4 hours where food, Wi-Fi, and a comfortable seat are the priorities. For travelers primarily seeking sleep, a sleep pod or transit hotel room will deliver higher rest quality per dollar spent.`,
      };

    case 'regional-niche':
      return {
        seatingSleep: `${brand.name} provides ${brand.type === 'pod' ? 'sleep pod units' : brand.type === 'hotel' ? 'private transit hotel rooms' : 'lounge seating and rest zones'} at its served airports. ${brand.sleepNuance ?? ''}`,
        privacy: `${getPrivacyLabel(brand.privacyLevel)} — ${brand.privacyLevel === 'high' ? 'a fully enclosed private space with a lockable door' : brand.privacyLevel === 'medium' ? 'partial privacy via pod visor or partition' : 'shared space with no individual enclosure'}.`,
        foodAmenities: `${hasFood ? 'Food and drinks are available.' : 'No food service.'} ${hasShower ? 'Shower access is included or available on request.' : ''} ${hasWifi ? 'Wi-Fi is included.' : ''} ${amenities.filter(a => !['private room', 'real bed'].includes(a)).slice(0, 3).join(', ')}.`.trim(),
        suitability: `Relevant for passengers routing through its covered airports. Outside that network, alternative operators will need to cover the gap.`,
      };

    case 'flexible-hybrid':
      return {
        seatingSleep: `${brand.name} at ${hub} offers three distinct sleep formats within the same facility. Lounge seating for shorter waits; enclosed sleep pods for passengers needing rest; and private hotel rooms with proper beds for overnight connections.`,
        privacy: `Privacy scales with the tier chosen. Lounge tier is shared open-plan. Pod tier provides partial to full enclosure depending on the specific unit. Hotel room tier is fully private with a lockable door.`,
        foodAmenities: `${hasFood ? 'Food and beverage service is included at the lounge tier.' : ''} ${hasShower ? 'Shower access is available at pod and hotel room tiers.' : ''} ${hasWifi ? 'Wi-Fi is included across all tiers.' : ''} Amenity level escalates with the tier — travelers who book only lounge access should not expect pod or hotel-grade amenities.`,
        suitability: `Highly flexible — useful for any layover duration between 90 minutes and an overnight stop. The main constraint is airport coverage: it only works for passengers routing through ${hub}.`,
      };
  }
}

function buildLimitations(
  brand: BrandRecord,
  angle: PositioningAngle,
  hub: string
): { headline: string; body: string } {
  const rawLimits = brand.limitations.slice(0, 3);

  switch (angle) {
    case 'full-recovery':
      return {
        headline: `When ${brand.name} Is Not the Right Choice`,
        body: `Coverage is the primary constraint — ${brand.name} operates at ${describeAirportCount(brand.airportCount)} only. If your routing does not pass through one of these airports, this option does not apply. For short connections under 2–3 hours, the cost-to-benefit ratio favors a sleep pod or lounge visit over a hotel room. Availability during peak seasons is not guaranteed without advance booking. ${rawLimits.length > 0 ? `Additional considerations: ${rawLimits.join('; ')}.` : ''}`,
      };

    case 'hub-specialist':
      return {
        headline: `Coverage Limitation`,
        body: `${brand.name} is only useful if your route passes through ${hub}${brand.airportCount > 1 ? ` or its other served airports` : ''}. Outside these airports, an alternative brand is required. ${brand.type === 'lounge' ? 'Within the airport, the lounge format is not designed for sleep — if overnight rest is needed, a transit hotel room will be more appropriate.' : ''} ${rawLimits.join('; ')}.`,
      };

    case 'privacy-first':
      return {
        headline: `Limitations`,
        body: `${brand.name} coverage is narrow — if you are not routing through its primary hub airports, you need an alternative. No shower access is built into the capsule; for travelers who prioritize a mid-transit shower, a transit hotel is the correct choice. Some travelers find fully enclosed small spaces uncomfortable — the sealed capsule design will not suit everyone. ${rawLimits.length > 0 ? rawLimits.join('; ') + '.' : ''}`,
      };

    case 'budget-rest':
      return {
        headline: `What ${brand.name} Does Not Offer`,
        body: `These pods provide rest, not hotel-level amenities. No shower facilities are built into the pod units. Terminal ambient noise penetrates the visor during busy periods — noise-sensitive travelers will notice. For layovers of 5+ hours, a transit hotel room delivers meaningfully better rest quality per hour. Privacy is partial, not full — travelers who need complete enclosure should look at fully sealed pod brands. ${rawLimits.length > 0 ? rawLimits.join('; ') + '.' : ''}`,
      };

    case 'global-lounge':
      return {
        headline: `Where ${brand.name} Has Gaps`,
        body: `Quality varies significantly across the network — some locations are exceptional, others are overcrowded and mediocre at peak times. Walk-in prices at major hubs can reach a level where a sleep pod delivers better value if rest is the primary goal. The 2–3 hour stay limit at most locations can be restrictive on long layovers. For travelers primarily seeking sleep rather than food and Wi-Fi, the lounge format is not the most efficient choice regardless of brand. ${rawLimits.join('; ')}.`,
      };

    case 'regional-niche':
      return {
        headline: `Limitations`,
        body: `${brand.name} is relevant only for passengers routing through its covered airports — it provides no value on routes that bypass its network. ${rawLimits.length > 0 ? rawLimits.join('; ') + '.' : `Outside its served airports, alternative operators in the same category will be required.`}`,
      };

    case 'flexible-hybrid':
      return {
        headline: `Coverage and Constraints`,
        body: `${brand.name} operates at ${hub} only — travelers not routing through this airport cannot use the facility. Peak-season availability at pod and hotel room tiers may require advance booking; lounge access is typically walk-in. The hybrid model is highly convenient for ${hub} transits and irrelevant for every other airport. ${rawLimits.join('; ')}.`,
      };
  }
}

function buildBestFor(
  brand: BrandRecord,
  angle: PositioningAngle
): { headline: string; items: string[]; notFor: string[] } {
  const signals = getSuitabilitySignals(brand);

  const items: string[] = [];
  if (signals.shortLayover) items.push('Short layovers of 1–4 hours');
  if (signals.overnightTransit) items.push('Overnight transits needing genuine rest');
  if (signals.workSessions) items.push('Work sessions during a long connection');
  if (signals.budgetUse) items.push('Budget-conscious travelers watching per-hour cost');
  if (signals.privacyNeeds) items.push('Travelers who need privacy or full enclosure to sleep');

  if (brand.bestUseCases.length > 0 && items.length < 3) {
    brand.bestUseCases.forEach(u => {
      if (!items.includes(u)) items.push(u);
    });
  }

  const notFor: string[] = [];
  if (!signals.overnightTransit && brand.type !== 'hotel') notFor.push('Passengers needing full overnight recovery');
  if (!signals.budgetUse) notFor.push('Budget travelers where per-hour cost is a hard constraint');
  if (!signals.privacyNeeds && brand.privacyLevel === 'low') notFor.push('Travelers who require private enclosed rest space');
  if (brand.airportCount <= 3) notFor.push('Travelers not routing through its covered airports');
  if (!signals.shortLayover && brand.type === 'hotel') notFor.push('Very short connections under 2 hours');

  brand.limitations.slice(0, 2).forEach(l => {
    const lower = l.toLowerCase();
    if (lower.includes('shower') && !notFor.some(n => n.includes('shower'))) {
      notFor.push('Travelers who need mid-transit shower access');
    } else if ((lower.includes('noise') || lower.includes('partial privacy')) && !notFor.some(n => n.includes('noise'))) {
      notFor.push('Noise-sensitive travelers who need full sound isolation');
    } else if (lower.includes('cost') || lower.includes('premium') || lower.includes('higher')) {
      if (!notFor.some(n => n.includes('budget'))) notFor.push('Budget travelers where cost per hour is a hard limit');
    }
  });

  return {
    headline: `Is ${brand.name} Right for Your Layover?`,
    items: items.slice(0, 5),
    notFor: [...new Set(notFor)].slice(0, 4),
  };
}

function buildComparisonIntro(brand: BrandRecord, angle: PositioningAngle): string {
  switch (angle) {
    case 'full-recovery':
      return `${brand.name} sits at the top of the transit hotel market. Before booking, compare it with other private-room options at its served airports:`;
    case 'hub-specialist':
      return `${brand.name} specializes at a small number of hubs. If you transit through those airports, compare it directly with alternatives:`;
    case 'privacy-first':
      return `If full privacy during your layover is the priority, these comparisons help clarify the options:`;
    case 'budget-rest':
      return `${brand.name} competes on price and access speed. Compare with alternatives before your next layover:`;
    case 'global-lounge':
      return `${brand.name} offers the broadest independent lounge coverage, but quality varies. Compare with alternatives at your specific airport:`;
    case 'regional-niche':
      return `${brand.name} is the strongest option at its covered airports. Compare with other operators for your specific route:`;
    case 'flexible-hybrid':
      return `${brand.name} consolidates multiple options under one roof. See how its individual tiers compare with standalone alternatives:`;
  }
}

function buildEnding(brand: BrandRecord, angle: PositioningAngle, hub: string): string {
  switch (angle) {
    case 'full-recovery':
      return `For transit passengers who need genuine recovery on a long layover, ${brand.name} remains one of the most reliable private room options available inside a terminal. The combination of an en-suite shower, a proper bed, and no immigration requirement puts it ahead of most alternatives at its served airports. Browse all transit hotels on RestInAirport to compare ${brand.name} with other options, or explore sleep pods and airport lounges for lighter and more affordable rest formats.`;

    case 'hub-specialist':
      return `${brand.name} earns its position by executing well at a defined set of airports rather than spreading thin across a global network. For travelers routing through ${hub}, it is among the strongest options available in its category. Browse all ${getBrandTypePluralLabel(brand.type)} on RestInAirport to compare options across other airports, or explore transit hotels if your layover warrants a full private room.`;

    case 'privacy-first':
      return `For travelers who need meaningful privacy during a layover without paying transit hotel prices, ${brand.name} offers a genuinely different pod experience. The sealed capsule outperforms visor-based pods on every sleep quality metric. Compare all sleep pods on RestInAirport to find alternatives on routes outside ${hub}, or browse transit hotels if your layover warrants a full private room.`;

    case 'budget-rest':
      return `${brand.name} removes the booking and check-in friction that makes other rest options feel like extra work. For short layovers and budget travelers, the walk-up hourly model is its defining advantage. The partial privacy is a real trade-off — but at pod pricing, the value equation holds for most short connections. Compare all sleep pod brands on RestInAirport, or explore transit hotels if your layover is long enough to justify a private room.`;

    case 'global-lounge':
      return `${brand.name} is the most practical lounge option for travelers who lack airline access credentials. With over ${brand.airportCount} locations concentrated in Asia-Pacific and the Middle East, coverage on most major routing is strong. Quality varies by location — reviewing individual airport pages before paying a walk-in fee is worthwhile. Browse all airport lounges on RestInAirport, or compare sleep pods and transit hotels if your layover calls for deeper rest rather than food and Wi-Fi.`;

    case 'regional-niche':
      return `${brand.name} is the right choice for passengers whose routes pass through its covered airports and who need ${brand.type === 'hotel' ? 'a private room with shower access' : brand.type === 'pod' ? 'budget pod rest without advance booking' : 'lounge access without airline credentials'}. For routes that bypass its network, alternative brands in the same category are required. Browse all airports on RestInAirport to compare options, or explore sleep pods, transit hotels, and airport lounges for your specific layover.`;

    case 'flexible-hybrid':
      return `${brand.name} is the most complete single-operator transit hospitality option at ${hub}. The ability to choose lounge, pod, or hotel room within one booking infrastructure is a meaningful advantage for travelers with varying layover lengths. Browse all transit hotel and sleep pod options on RestInAirport to compare alternatives at other airports, or explore airport lounges if food and comfort take priority over sleep.`;
  }
}

function describeAirportCount(count: number): string {
  if (count === 1) return 'one airport';
  if (count <= 5) return `${count} airports`;
  if (count <= 15) return `${count} airports`;
  return `more than ${count} airports`;
}
