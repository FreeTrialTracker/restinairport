import type { BrandRecord, BrandType } from './brandData';
import { getBrandPositioningAngle, getSuitabilitySignals } from './brandScoring';
import type { PositioningAngle } from './brandScoring';

export interface BrandFAQ {
  q: string;
  a: string;
}

export function buildBrandFaqs(brand: BrandRecord): BrandFAQ[] {
  const angle = getBrandPositioningAngle(brand);
  return assembleFaqs(brand, angle);
}

export function generateBrandFAQs(brand: BrandRecord, _airportCount: number): BrandFAQ[] {
  return buildBrandFaqs(brand);
}

function assembleFaqs(brand: BrandRecord, angle: PositioningAngle): BrandFAQ[] {
  const pool: BrandFAQ[] = [
    ...getImmigrationFaq(brand),
    ...getAccessFaqs(brand, angle),
    ...getPrivacyFaqs(brand, angle),
    ...getSleepFaqs(brand, angle),
    ...getCoverageFaqs(brand, angle),
    ...getAmenityFaqs(brand, angle),
    ...getComparisonFaqs(brand, angle),
    ...getUseCaseFaqs(brand, angle),
    ...getPricingFaqs(brand, angle),
  ];

  const seen = new Set<string>();
  const deduped: BrandFAQ[] = [];
  for (const faq of pool) {
    const key = faq.q.toLowerCase().replace(/\s+/g, ' ').slice(0, 60);
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(faq);
    }
  }

  return deduped.slice(0, 10);
}

function getImmigrationFaq(brand: BrandRecord): BrandFAQ[] {
  if (!brand.airsideTypical && !brand.transitFriendly) return [];

  if (brand.type === 'hotel') {
    const hub = brand.strongestHubs[0] ?? 'its primary airport';
    return [{
      q: `Can transit passengers check into ${brand.name} without clearing local immigration?`,
      a: `Yes. ${brand.name} is positioned entirely airside — inside the secure international departures zone after passport control but before boarding gates. Passengers transiting through ${hub} do not need to clear immigration for the transit country. Note that transit visa requirements depend on your nationality and route — verify those independently before travel.`,
    }];
  }

  if (brand.type === 'pod') {
    return [{
      q: `Do you need to clear immigration to access ${brand.name} pods?`,
      a: `No. ${brand.name} pods are installed in the airside terminal zone — accessible to transit passengers without entering the transit country's immigration queue. Your bags stay with you, and re-entry to security is not required.`,
    }];
  }

  if (brand.type === 'lounge' || brand.type === 'hybrid') {
    const hub = brand.strongestHubs[0] ?? 'its served airport';
    return [{
      q: `Can you use ${brand.name} during a transit without clearing immigration at ${hub}?`,
      a: `Yes. ${brand.name} is positioned in the international airside zone — transit passengers remain past security without needing to enter the transit country. Standard transit visa requirements still apply based on nationality; confirm your specific case before travel.`,
    }];
  }

  return [];
}

function getAccessFaqs(brand: BrandRecord, angle: PositioningAngle): BrandFAQ[] {
  const faqs: BrandFAQ[] = [];
  const selfService = brand.accessTypes.includes('self-service');
  const cardAccess = brand.accessTypes.includes('card-access');
  const paidEntry = brand.accessTypes.includes('paid-entry');
  const frontDesk = brand.accessTypes.includes('front-desk');

  if (selfService) {
    faqs.push({
      q: `Is there a check-in desk at ${brand.name} or is it fully self-service?`,
      a: `Fully self-service. There is no check-in queue and no staff interaction required. Walk to any available unit, complete payment at the pod terminal — card and contactless are accepted — and rest. The entire process from arrival to privacy visor down takes under two minutes.`,
    });
  }

  if (frontDesk && brand.type === 'hotel') {
    faqs.push({
      q: `How far in advance should you book ${brand.name} to guarantee availability?`,
      a: `At peak-demand hub airports, booking 24–48 hours ahead is advisable — particularly for overnight stays and peak season travel. Walk-in rooms are available subject to availability but cannot be guaranteed. Online advance booking through the ${brand.name} website is the most reliable approach for fixed layover schedules.`,
    });
  }

  if (cardAccess || paidEntry) {
    if (brand.type === 'lounge') {
      faqs.push({
        q: `Can you access ${brand.name} with a credit card travel benefit — or is it always paid separately?`,
        a: cardAccess
          ? `${brand.name} is accessible through several routes: a paid walk-in fee at the lounge, compatible premium credit cards that include lounge access as a benefit, and third-party programs such as Priority Pass or LoungeKey at eligible locations. Check your specific card benefits before paying a walk-in fee.`
          : `${brand.name} is a paid-entry independent lounge — access requires purchasing a visit fee at the lounge entrance. No airline status or credit card benefit is needed, but there is no complimentary access route. Some booking platforms may offer advance purchase discounts.`,
      });
    }
  }

  if (brand.type === 'hotel' && angle === 'full-recovery') {
    faqs.push({
      q: `Does ${brand.name} require a minimum booking duration?`,
      a: `Yes. ${brand.name} has a minimum booking window, typically starting at 3–6 hours depending on the airport. Overnight bookings covering a standard hotel window are also available and often offer better per-hour value for stays of 6+ hours. Check specific airport pricing for exact minimums.`,
    });
  }

  return faqs;
}

function getPrivacyFaqs(brand: BrandRecord, angle: PositioningAngle): BrandFAQ[] {
  const faqs: BrandFAQ[] = [];

  if (brand.type === 'pod') {
    if (brand.privacyLevel === 'high') {
      faqs.push({
        q: `Are ${brand.name} capsules truly fully enclosed — or are they open pods with a visor?`,
        a: `Fully enclosed with a lockable door. Unlike visor-based pod designs, ${brand.name} units are sealed capsules that provide genuine blackout conditions and substantially better noise suppression. The enclosure level is closer to a private hotel room than to an open recliner — a meaningful distinction for light sleepers.`,
      });
    } else if (brand.privacyLevel === 'medium') {
      faqs.push({
        q: `How much privacy do ${brand.name} pods actually offer?`,
        a: `${brand.name} uses a ${brand.sleepNuance?.includes('visor') || brand.sleepNuance?.includes('hood') ? 'privacy visor or hood' : 'partial enclosure'} design. The pod is not a sealed capsule — overhead light is blocked but terminal ambient noise remains audible at busy periods. It offers meaningfully more isolation than a standard airport seat, but less than fully enclosed brands like Napcabs or izZzleep.`,
      });

      faqs.push({
        q: `Is ${brand.name} good enough for light sleepers, or does the terminal noise come through?`,
        a: `Light sleepers should be aware that ${brand.name} pods provide partial privacy only — the visor reduces light and some noise, but the pod is not sealed. At quiet terminals or off-peak hours, sleep quality can be good. At busy hubs during peak periods, ambient noise will be present. Travelers who are very noise-sensitive should consider a fully enclosed brand like Napcabs or izZzleep if available on their route.`,
      });
    }
  }

  if (brand.type === 'hotel' || (brand.type === 'hybrid' && brand.privacyLevel === 'high')) {
    faqs.push({
      q: `How soundproofed are ${brand.name} rooms compared to a standard city hotel?`,
      a: brand.sleepNuance
        ? `${brand.sleepNuance}`
        : `${brand.name} rooms are fully enclosed with lockable doors. Sound insulation inside the secure terminal is generally comparable to a compact business hotel. Terminal HVAC systems run continuously, and external gate noise is significantly reduced. Light sleepers can expect genuine rest.`,
    });
  }

  if (brand.type === 'lounge') {
    faqs.push({
      q: `Can you actually sleep at ${brand.name}, or is it lounge seating only?`,
      a: `${brand.name} is a lounge product — comfortable seating with rest zones at most locations, but not a dedicated sleep environment. ${brand.sleepNuance ?? 'There are no dedicated sleep pods or enclosed sleep areas. Rest chairs allow upright napping, but for genuine sleep during a long transit, a sleep pod or transit hotel room is the more appropriate format.'}`,
    });
  }

  return faqs;
}

function getSleepFaqs(brand: BrandRecord, angle: PositioningAngle): BrandFAQ[] {
  const faqs: BrandFAQ[] = [];
  const signals = getSuitabilitySignals(brand);

  if (brand.type === 'hotel') {
    faqs.push({
      q: `Is ${brand.name} worth it for a short 2–3 hour layover, or only for longer stops?`,
      a: `${brand.name}'s value increases significantly with layover length. For 2–3 hours, the cost per hour is at its highest and most of that time is consumed by check-in, settling in, and check-out. The sweet spot is 4–8 hour layovers where a proper bed and shower provide genuine recovery. Overnight stays represent the strongest per-hour value. For 2-hour stops, a sleep pod or lounge visit is usually more cost-efficient.`,
    });
  }

  if (brand.type === 'pod' && signals.overnightTransit) {
    faqs.push({
      q: `Can you use ${brand.name} for a full overnight connection — not just a short nap?`,
      a: brand.privacyLevel === 'high'
        ? `Yes. ${brand.name}'s fully enclosed capsule design makes overnight use genuinely practical. Book consecutive hours to cover your full transit window. The blackout and noise conditions inside the capsule are adequate for extended sleep — it is one of the few pod formats where overnight use produces real rest rather than just a quiet seat.`
        : `${brand.name} pods can cover an overnight window through consecutive hourly bookings. The partial privacy design means light sleepers may be disturbed by terminal ambient noise during overnight stays. For overnight connections, a fully enclosed pod brand or a transit hotel room will serve better if available at your airport.`,
    });
  }

  if (brand.type === 'hybrid') {
    faqs.push({
      q: `Which ${brand.name} tier is best for an overnight layover versus a 3-hour connection?`,
      a: `For a 3-hour connection, the lounge tier covers food, Wi-Fi, and a comfortable seat. For a 5–8 hour layover, the sleep pod tier provides the rest infrastructure lounge seating cannot match. For overnight connections of 8+ hours, the hotel room tier with its proper bed and shower delivers genuine recovery. The choice should follow layover length — ${brand.name}'s multi-tier model means you are not locked into any single format.`,
    });
  }

  return faqs;
}

function getCoverageFaqs(brand: BrandRecord, angle: PositioningAngle): BrandFAQ[] {
  const faqs: BrandFAQ[] = [];
  const hubs = brand.strongestHubs;
  const hubCount = brand.airportCount;

  if (hubCount === 1 || hubs.length === 1) {
    const hub = hubs[0] ?? 'its single operated airport';
    faqs.push({
      q: `Is ${brand.name} available at any airport other than ${hub.split('(')[0].trim()}?`,
      a: `${brand.name} currently operates exclusively at ${hub}. Travelers transiting through any other airport will need to use alternative brands in the same category. Check the full airport listings on RestInAirport if you need equivalent options at a different hub.`,
    });
  }

  if (hubCount > 1 && hubCount <= 5) {
    const hubNames = hubs.slice(0, 3).join(', ');
    faqs.push({
      q: `Which airports is ${brand.name} most reliably available at right now?`,
      a: `${brand.name} has its most established presence at ${hubNames}. Coverage outside these airports may be limited or expanding — verify your specific terminal on RestInAirport before travel. Not all international airports in its regions carry the brand.`,
    });
  }

  if (hubCount > 5 && brand.type === 'lounge') {
    faqs.push({
      q: `Does ${brand.name} lounge quality vary significantly between airports?`,
      a: `Yes — quality across the network is not uniform. ${brand.name}'s strongest properties are in Asia-Pacific, where flagship locations in Hong Kong, Kuala Lumpur, and Singapore represent the top tier. European and North American locations tend to be smaller and less comprehensive. For any airport on your routing, checking the individual property listing rather than assuming network-wide quality is worthwhile.`,
    });
  }

  if (brand.type === 'pod' && brand.regions.length === 1) {
    faqs.push({
      q: `Is ${brand.name} only available at ${brand.regions[0]} airports?`,
      a: `Currently, yes — ${brand.name} deployment is concentrated in ${brand.regions[0]}. Coverage outside this region is limited or non-existent. For routes outside ${brand.regions[0]}, GoSleep, izZzleep, or Napcabs (at Munich) are the most comparable pod alternatives depending on your layover airport.`,
    });
  }

  return faqs;
}

function getAmenityFaqs(brand: BrandRecord, angle: PositioningAngle): BrandFAQ[] {
  const faqs: BrandFAQ[] = [];
  const amenities = brand.amenitySignals;
  const hasShower = amenities.some(a => a.toLowerCase().includes('shower'));
  const hasWifi = amenities.some(a => a.toLowerCase().includes('wi-fi') || a.toLowerCase().includes('wifi'));
  const hasDesk = amenities.some(a => a.toLowerCase().includes('desk'));
  const hasStorage = amenities.some(a => a.toLowerCase().includes('storage') || a.toLowerCase().includes('luggage'));
  const hasFood = amenities.some(a => a.toLowerCase().includes('food') || a.toLowerCase().includes('buffet'));

  if (brand.type === 'hotel') {
    faqs.push({
      q: `Does ${brand.name} include a private shower in every room?`,
      a: hasShower
        ? `Yes. Private en-suite shower facilities are standard across ${brand.name} transit hotel rooms at all locations. This is the key amenity differentiator compared to sleep pods, which do not include bathroom facilities.`
        : `Shower access at ${brand.name} varies by location — not all rooms include en-suite facilities. Check the specific airport listing for amenity details before booking if a shower is a priority.`,
    });

    if (hasDesk) {
      faqs.push({
        q: `Can you use a ${brand.name} room as a workspace — not just for sleep?`,
        a: `Yes. ${brand.name} rooms include a desk, Wi-Fi, and a lockable private space, making them effective for work calls or focused sessions during a layover. Business travelers frequently book the room as much for privacy on calls as for rest.`,
      });
    }
  }

  if (brand.type === 'pod') {
    faqs.push({
      q: `Do ${brand.name} pods include shower access?`,
      a: hasShower
        ? `Shower access is available adjacent to ${brand.name} pod installations at select airports. Check the specific terminal listing on RestInAirport for current shower availability at your location.`
        : `No. Shower facilities are not included within the ${brand.name} pod units. If a mid-transit shower is essential, a transit hotel room is the more appropriate format at airports where both options are available.`,
    });

    if (hasStorage) {
      faqs.push({
        q: `Can you keep luggage inside a ${brand.name} pod — or does it have to be left outside?`,
        a: `${brand.name} includes secure luggage storage within the capsule. You do not need to leave bags at a separate facility — your luggage stays inside with you during your rest period.`,
      });
    }
  }

  if (brand.type === 'lounge') {
    if (hasFood) {
      faqs.push({
        q: `Does ${brand.name} include hot food in the entry price?`,
        a: `Yes. A food selection — typically a hot buffet or menu items alongside cold options — is included in the standard ${brand.name} entry fee. Beverage service including soft drinks, hot drinks, and usually alcohol is also included. Food quality varies by location, with Asia-Pacific properties generally providing a stronger offering than the European or North American footprint.`,
      });
    }

    if (hasShower) {
      faqs.push({
        q: `Is shower access included at ${brand.name}, or is it extra?`,
        a: `Shower access is available at ${brand.name} locations, typically included within the standard entry fee. Shower slot capacity is limited at peak times — if a shower is essential to your visit, asking for a slot on arrival rather than assuming one is immediately available is advisable.`,
      });
    }
  }

  return faqs;
}

function getComparisonFaqs(brand: BrandRecord, angle: PositioningAngle): BrandFAQ[] {
  const faqs: BrandFAQ[] = [];
  const candidates = brand.compareCandidates.slice(0, 2);

  if (candidates.length === 0) return faqs;

  const competitor = candidates[0];
  const competitorName = formatCompetitorName(competitor);

  if (brand.type === 'hotel' && (competitor === 'yotelair' || competitor === 'aerotel')) {
    const other = brand.slug === 'aerotel' ? 'YOTELAIR' : 'Aerotel';
    const otherStrength = brand.slug === 'aerotel'
      ? 'European and North American routes (Amsterdam, Paris, London, New York)'
      : 'Asia-Pacific and Middle East routes (Singapore, Abu Dhabi)';
    const ownStrength = brand.slug === 'aerotel'
      ? 'Asia-Pacific and Middle East connections (Singapore, Abu Dhabi, London Heathrow)'
      : 'Western European and transatlantic routing (Amsterdam, Paris, London, New York)';

    faqs.push({
      q: `How does ${brand.name} compare to ${other} — which is better for a long layover?`,
      a: `Both are premium transit hotel brands with comparable room quality and pricing. The routing determines which is more useful: ${brand.name} is stronger for ${ownStrength}, while ${other} covers ${otherStrength}. At airports where both are present, the difference is minimal — room quality is broadly equivalent.`,
    });
    return faqs;
  }

  if (brand.type === 'pod') {
    if (brand.privacyLevel === 'high' && (competitor === 'gosleep' || competitor === 'zzzleepandgo')) {
      faqs.push({
        q: `How does ${brand.name} compare to ${competitorName} on sleep quality?`,
        a: `${brand.name} provides full enclosure — a sealed capsule with a lockable door and genuine blackout conditions. ${competitorName} uses a visor or partial hood design that reduces light but does not create a sealed space. For any layover where real sleep is the goal, ${brand.name} is the stronger choice where available. ${competitorName} has broader airport coverage and lower pricing, which may make it the practical choice on routes where ${brand.name} is not deployed.`,
      });
    }

    if (brand.privacyLevel === 'medium' && (competitor === 'napcabs' || competitor === 'izzleep')) {
      faqs.push({
        q: `Why would you choose ${brand.name} over a fully enclosed pod like ${competitorName}?`,
        a: `${brand.name} offers walk-in access at more airport locations, lower pricing, and zero booking friction. The trade-off is partial privacy — the visor reduces light but the pod is not sealed. ${competitorName} provides genuinely better sleep quality in a fully enclosed capsule, but is available at fewer airports. If ${competitorName} is deployed on your route and your layover calls for real sleep, it is the stronger choice. ${brand.name} is better suited to short naps, budget travelers, or airports where the alternative is unavailable.`,
      });
    }
  }

  if (brand.type === 'lounge' && brand.pricingLevel === 'premium') {
    const cheaperLounge = candidates.find(c => ['plaza-premium', 'miracle', 'skyhub-lounge'].includes(c));
    if (cheaperLounge) {
      faqs.push({
        q: `Is ${brand.name} worth the premium over a standard independent lounge like ${formatCompetitorName(cheaperLounge)}?`,
        a: `${brand.name} targets a higher quality tier than standard independent lounges — calmer environment, better food quality, and a less crowded layout. The premium is most justified for layovers of 3+ hours where you will spend meaningful time in the space. For a 1–2 hour connection where food and Wi-Fi are all you need, a standard independent lounge at a lower price point is usually sufficient.`,
      });
    }
  }

  if (brand.type === 'lounge' && brand.airportCount === 1) {
    const globalLounge = candidates.find(c => c === 'plaza-premium');
    if (globalLounge) {
      faqs.push({
        q: `What is the difference between ${brand.name} and Plaza Premium at this airport?`,
        a: `${brand.name} is a specialist brand at its home airport with strong local knowledge and multiple terminal positions. Plaza Premium has a global network recognizable through more credit card programs. At airports where both are present, ${brand.name} often has better gate proximity and a more locally optimized product. Plaza Premium offers the advantage of a single program covering multiple airports on your overall journey.`,
      });
    }
  }

  return faqs;
}

function getUseCaseFaqs(brand: BrandRecord, angle: PositioningAngle): BrandFAQ[] {
  const faqs: BrandFAQ[] = [];
  const signals = getSuitabilitySignals(brand);

  if (brand.type === 'hotel' && !brand.transitFriendly) {
    faqs.push({
      q: `Is ${brand.name} usable for international transit passengers — or is it only for domestic connections?`,
      a: `${brand.name} is positioned in the domestic terminal airside zone, which means it is primarily useful for passengers on domestic or connecting US flights. International transit passengers may need to confirm terminal access requirements. It is not the same format as airside international transit hotels like Aerotel or YOTELAIR, which are positioned inside international departures.`,
    });
  }

  if (brand.type === 'pod' && angle === 'budget-rest') {
    faqs.push({
      q: `Is ${brand.name} a practical choice for families with young children during a layover?`,
      a: `${brand.name} pods are individual units — not suitable for groups sharing one space. For a family needing to rest together during a layover, the pod format requires booking separate adjacent units, which can add up in cost. A private transit hotel room typically offers better practicality for multiple travelers. For a solo adult or a short individual rest, the pods work well.`,
    });
  }

  if (brand.type === 'lounge' && !signals.overnightTransit) {
    faqs.push({
      q: `Is ${brand.name} worth it for an overnight connection or only for daytime layovers?`,
      a: `${brand.name} is a lounge product — comfortable seating and food, not a dedicated sleep environment. For overnight connections, the lounge visit provides a meal, Wi-Fi, and a rest chair, but is unlikely to support meaningful sleep. Travelers with overnight transits who need real rest should pair a short lounge visit with sleep pod or transit hotel access, or choose the sleep-first option outright.`,
    });
  }

  if (brand.type === 'hybrid') {
    faqs.push({
      q: `Can you arrive at ${brand.name} without a pre-selected tier and choose on the day?`,
      a: `Yes. Lounge access at ${brand.name} is typically walk-in on the day — pay at the entrance and enter. Sleep pod and hotel room tiers benefit from advance booking, particularly during peak periods, but walk-in is possible subject to availability. If your layover duration is uncertain, securing lounge access on arrival and upgrading to a pod or room if the connection extends is a practical approach.`,
    });
  }

  if (brand.type === 'pod' && brand.privacyLevel === 'high') {
    faqs.push({
      q: `Is ${brand.name} useful for travelers with noise sensitivity who normally cannot sleep on planes?`,
      a: `${brand.name}'s fully enclosed capsule design is specifically suited to this use case. The sealed door and blackout conditions eliminate the two primary sleep disruptors in a terminal — light and ambient noise. Travelers who typically find open airport environments incompatible with rest tend to respond better to ${brand.name}'s enclosure level than to any visor-based pod alternative.`,
    });
  }

  return faqs;
}

function getPricingFaqs(brand: BrandRecord, angle: PositioningAngle): BrandFAQ[] {
  const faqs: BrandFAQ[] = [];

  if (brand.pricingLevel === 'premium' && brand.type === 'hotel') {
    faqs.push({
      q: `Is ${brand.name} significantly more expensive than booking a hotel outside the airport?`,
      a: `${brand.name} pricing reflects the airside position and the convenience of not clearing immigration. For a 4–8 hour layover, the per-hour cost is higher than an off-airport hotel but the total trip cost often works out similarly once you factor in transfer time and transit costs. For short stays under 3 hours, off-airport hotels are rarely practical regardless of cost. The premium is principally for location, not amenity — rooms are comparable to a 3-star city hotel.`,
    });
  }

  if (brand.pricingLevel === 'premium' && brand.type === 'lounge') {
    faqs.push({
      q: `Is ${brand.name} priced higher than most independent airport lounges — and is the difference noticeable?`,
      a: `${brand.name} sits above the standard independent lounge pricing tier. The difference in experience is generally noticeable — quieter layout, higher food quality, and more curated seating. Whether the premium is worth it depends on how long you will spend there: for 3+ hour layovers, the environmental upgrade justifies the cost; for a 90-minute connection, a standard lounge at lower entry cost is often sufficient.`,
    });
  }

  if (brand.pricingLevel === 'low' && brand.type === 'pod') {
    faqs.push({
      q: `How does ${brand.name}'s hourly rate compare to the cost of a transit hotel room at the same airport?`,
      a: `${brand.name} is significantly cheaper per hour than a transit hotel room. The cost gap makes it the clearly better choice for short stays of 1–4 hours. For 6+ hour layovers, a transit hotel room often becomes more cost-competitive when calculated per hour and delivers substantially better rest quality — private bathroom, proper bed, and full noise isolation. For short connections on a budget, ${brand.name} provides strong value.`,
    });
  }

  if (brand.pricingLevel === 'mid' && brand.type === 'lounge') {
    faqs.push({
      q: `Does ${brand.name} lounge access represent better value than booking a sleep pod at the same airport?`,
      a: `The two formats answer different needs. ${brand.name} provides food, Wi-Fi, showers, and a comfortable seat — it is the better choice when you want to eat and work during a layover. A sleep pod prioritizes rest over food and amenities. For layovers where recovery is the primary goal, a sleep pod per hour is often better value than lounge access. For connections where you want a meal and a comfortable environment, the lounge wins.`,
    });
  }

  return faqs;
}

function formatCompetitorName(slug: string): string {
  const names: Record<string, string> = {
    'aerotel': 'Aerotel',
    'gosleep': 'GoSleep',
    'yotelair': 'YOTELAIR',
    'napcabs': 'Napcabs',
    'plaza-premium': 'Plaza Premium',
    'minute-suites': 'Minute Suites',
    'miracle': 'Miracle',
    'izzleep': 'izZzleep',
    'encalm': 'Encalm',
    'zzzleepandgo': 'ZZZleepandGo',
    'kepler-club': 'Kepler Club',
    'wait-n-rest': "Wait N' Rest",
    'sh-premium-lounge': 'SH Premium Lounge',
    'skyhub-lounge': 'Skyhub Lounge',
    'sleepover': 'Sleepover',
  };
  return names[slug] ?? slug;
}
