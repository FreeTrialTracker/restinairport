import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { BrandType } from '../lib/brandNormalization';
import { navigateTo } from '../lib/navigation';
import { getBrandCompareUrlFromSlugs, getBrandCategoryUrl } from '../lib/brandRoutes';


interface BrandSEOContentProps {
  brandName: string;
  brandSlug: string;
  brandType: BrandType;
  facilityCount: number;
  airportCount: number;
  airportCodes: string[];
  allBrandSlugs: { name: string; slug: string }[];
}

const BRAND_DESCRIPTIONS: Record<string, {
  overview: string;
  coverage: string;
  verdict: string;
  bestFor: string;
  notIdealFor: string;
  downside: string;
  metaDescription?: string;
  intro?: string;
}> = {
  'aerotel': {
    overview: 'Aerotel is one of the world\'s most established airside transit hotel brands, operating fully enclosed private rooms within international terminal buildings. Positioned as a Transit Hotel, Aerotel provides passengers with a proper bed, shower, and privacy without ever leaving the secure airside zone. The brand was pioneered at Singapore Changi and has since expanded to major hubs across Asia, the Middle East, and beyond. Unlike sleep pods, Aerotel rooms offer full hotel amenities in a compact format, making them a genuine alternative to leaving the airport and checking into an off-site property.',
    coverage: 'Aerotel operates across several of the world\'s busiest international airports, concentrating on major transit hubs in Asia and the Middle East. Key locations include Singapore Changi, London Heathrow, and Abu Dhabi. The brand focuses on high-traffic layover routes where passengers regularly face long connections between international flights. Availability and room types vary by terminal and airport.',
    verdict: 'Aerotel is an excellent choice for travelers who need genuine rest on a long layover without the hassle of leaving the airport. The airside location means no customs re-entry, which is particularly valuable for passengers without the required visa to exit.',
    bestFor: 'Long layovers of 4+ hours, passengers without exit visas, travelers prioritizing sleep quality over cost',
    notIdealFor: 'Budget travelers seeking minimal rest stops or those with very short connections under 2 hours',
    downside: 'Rates can be high compared to sleep pods, and availability at peak times is not guaranteed without advance booking.',
    metaDescription: 'Discover Aerotel, a leading airside transit hotel at Singapore Changi, London Heathrow, and Abu Dhabi. View room options, access rules, pricing, and whether transit passengers can stay without clearing immigration.',
    intro: 'Aerotel is an airside transit hotel available at major international hubs including Singapore Changi, London Heathrow, and Abu Dhabi. It is designed for transit passengers on long layovers, premium travelers, and anyone who needs a private room and shower without leaving the secure terminal zone. This guide covers locations, access rules, pricing, and whether you can stay inside the airport without clearing immigration.',
  },
  'gosleep': {
    overview: 'GoSleep is a Finnish-designed sleep pod brand that offers semi-private sleeping capsules within airport terminals. Classified as a Sleep Pods operator, GoSleep units feature a flat reclining seat that converts into a sleeping position, with a privacy visor that can be pulled down to block light and reduce noise. The design is compact and efficient, requiring no check-in process — passengers simply occupy an available pod. GoSleep has expanded from its Nordic origins to airports across Europe, Asia, and the Middle East.',
    coverage: 'GoSleep pods are available at a growing number of international airports across Europe and Asia. The brand maintains a presence at major Scandinavian and Gulf hubs, with additional locations added in recent years. The self-service model keeps operational costs low, allowing deployment across a wider range of airport sizes.',
    verdict: 'GoSleep is ideal for travelers who want affordable, no-frills rest without committing to a hotel booking. The pay-as-you-go approach makes it flexible for varying layover lengths.',
    bestFor: 'Short to medium layovers, budget-conscious travelers, passengers who want a quick rest without a booking process',
    notIdealFor: 'Those needing full privacy, shower access, or hotel-level amenities',
    downside: 'The visor provides partial privacy only — it is not a fully enclosed space, and noise from the terminal can still be noticeable.',
    metaDescription: 'Discover GoSleep, a Finnish-designed sleep pod brand available at airports across Europe and the Middle East. View pod locations, access rules, hourly pricing, and transit passenger eligibility.',
    intro: 'GoSleep is a sleep pod brand available at international airports across Europe, Asia, and the Middle East. It is designed for budget-conscious travelers and those on short to medium layovers who want affordable rest without a hotel booking. This guide covers pod locations, access rules, pricing, and whether transit passengers can use GoSleep without clearing immigration.',
  },
  'yotelair': {
    overview: 'YOTELAIR is a premium transit hotel brand that operates compact, cabin-style accommodation inside major international airport terminals. Classified as a Transit Hotel, YOTELAIR cabins offer a proper bed, private bathroom with shower, and hotel services in a smartly designed small-footprint format. The brand has a strong presence in European hub airports and has expanded to North American locations. YOTELAIR blends boutique hotel aesthetics with the practicality of airside access, appealing to premium economy and business travelers seeking genuine recovery during layovers.',
    coverage: 'YOTELAIR operates at several of the world\'s largest hub airports, including Amsterdam Schiphol, London Gatwick, London Heathrow, Paris Charles de Gaulle, and New York JFK. The brand targets high-frequency long-haul routes and positions its cabins within the international departures area, ensuring no passport control is required for most passengers.',
    verdict: 'YOTELAIR is the top choice for travelers who want hotel-quality rest without leaving the terminal. The private cabin with en-suite shower is unmatched among airside options at the airports it serves.',
    bestFor: 'Long layovers, premium travelers, those wanting a proper shower and bed before a connecting flight',
    notIdealFor: 'Budget travelers; YOTELAIR is priced at the higher end of the airside accommodation market',
    downside: 'Availability can be limited during peak travel periods and cabins book out quickly at popular hubs.',
    metaDescription: 'Discover YOTELAIR, a premium transit hotel at Amsterdam Schiphol, London Heathrow, Paris CDG, and New York JFK. View cabin options, pricing, access rules, and whether you can stay airside without clearing immigration.',
    intro: 'YOTELAIR is a premium transit hotel available at major European and North American airports including Amsterdam Schiphol, London Heathrow, Paris Charles de Gaulle, and New York JFK. It is designed for business travelers and premium passengers seeking hotel-quality rest with an en-suite shower during long layovers. This guide covers cabin locations, access rules, hourly and overnight pricing, and transit passenger eligibility.',
  },
  'napcabs': {
    overview: 'Napcabs is a German sleep pod brand offering fully enclosed private sleeping cabins inside airport terminals. Unlike open-design pods, Napcabs units are sealed individual capsules with a lockable door, providing complete privacy, blackout conditions, and noise reduction. Classified as a Sleep Pods operator, Napcabs combines the convenience of self-service with a level of privacy closer to a private room than a standard pod. The brand operates primarily at Munich Airport (MUC) and select other international locations.',
    coverage: 'Napcabs has a concentrated presence at Munich Airport, where it has operated for over a decade, with additional locations at other European and international airports. The Munich installations are airside in both Terminal 1 and Terminal 2, making them accessible without re-entering passport control.',
    verdict: 'Napcabs is the best sleep pod option for travelers who need true privacy and darkness during a layover. The locked cabin experience is noticeably superior to open-visor pods.',
    bestFor: 'Travelers wanting maximum privacy in a pod format, overnight layovers, light sleepers who need noise control',
    notIdealFor: 'Those who find enclosed spaces uncomfortable or who need shower access as part of their rest stop',
    downside: 'Limited airport coverage compared to more widely deployed brands — most accessible for travelers routing through Munich.',
    metaDescription: 'Discover Napcabs, a fully enclosed private sleep pod brand at Munich Airport and select international airports. View cabin locations, pricing, access rules, and transit passenger eligibility.',
    intro: 'Napcabs is an enclosed private sleeping cabin brand available primarily at Munich Airport (MUC) and select international locations. It is designed for light sleepers, privacy-seekers, and travelers on overnight layovers who need blackout conditions and a lockable door. This guide covers cabin locations, access rules, pricing, and whether transit passengers can use Napcabs without clearing immigration.',
  },
  'plaza-premium': {
    overview: 'Plaza Premium is a globally recognised independent lounge brand offering premium airport lounge access to any traveler, regardless of airline or frequent flyer status. Classified as a Lounge Network, Plaza Premium lounges provide food, beverages, showers, Wi-Fi, and comfortable seating in an environment that typically surpasses standard airline lounges. The brand operates extensively across Asia-Pacific, the Middle East, and Europe, making it one of the most widely accessible premium lounge networks in the world.',
    coverage: 'Plaza Premium operates at over 100 locations worldwide, with major concentrations in Asia, including Hong Kong, Kuala Lumpur, Singapore, and Beijing. The brand also maintains strong coverage in the Middle East and has expanded into European and North American airports. Many locations are airside, accessible after passport control without leaving the terminal.',
    verdict: 'Plaza Premium is the best lounge option for travelers without airline lounge access who still want a quiet, comfortable environment with food and showers during a long wait.',
    bestFor: 'Frequent flyers without airline lounge access, long layovers, travelers wanting food and shower facilities',
    notIdealFor: 'Very short connections where the lounge visit time is too brief to justify the entry fee',
    downside: 'Entry fees vary significantly by location and can be expensive at peak times, particularly for walk-in access.',
    metaDescription: 'Discover Plaza Premium, a globally independent lounge network available at 100+ airports across Asia, the Middle East, and Europe. View lounge locations, access rules, entry fees, and transit passenger eligibility.',
    intro: 'Plaza Premium is an independent airport lounge network available at over 100 airports across Asia-Pacific, the Middle East, and Europe. It is designed for frequent flyers without airline lounge access, business travelers, and anyone seeking premium food, showers, and a quiet environment during a long layover. This guide covers lounge locations, access rules, pricing, and whether transit passengers can use Plaza Premium without clearing immigration.',
  },
  'minute-suites': {
    overview: 'Minute Suites is a US-based private day suite concept operating inside major American airport terminals. Offering fully enclosed private rooms available by the hour, Minute Suites bridges the gap between a sleep pod and a transit hotel. Each suite includes a daybed sofa that converts for sleeping, a work desk, TV, and Wi-Fi, with optional shower access available at select locations. The brand caters to business travelers and anyone needing genuine privacy during a domestic or international layover.',
    coverage: 'Minute Suites operates at several US airport hubs including Hartsfield-Jackson Atlanta, Philadelphia, Dallas Fort Worth, and Charlotte Douglas. Locations are positioned airside within the terminal, allowing seamless access between connections without clearing security again.',
    verdict: 'Minute Suites is the best private rest option available inside US airports, offering a level of privacy and comfort that no pod brand matches in the domestic market.',
    bestFor: 'Business travelers, families with young children, anyone needing a private space for calls or rest during a US domestic or connecting layover',
    notIdealFor: 'International travelers unfamiliar with the US hub system or those outside the served airports',
    downside: 'Coverage is limited to a handful of US airports, making it unavailable for most international routing.',
    metaDescription: 'Discover Minute Suites, private hourly rest suites at US airports including Atlanta, Philadelphia, Dallas Fort Worth, and Charlotte Douglas. View suite locations, pricing, access rules, and transit eligibility.',
    intro: 'Minute Suites is a private hourly day suite brand available at major US airport hubs including Atlanta Hartsfield-Jackson, Philadelphia, Dallas Fort Worth, and Charlotte Douglas. It is designed for business travelers, families, and anyone needing a fully private space for rest or work during a domestic or connecting layover. This guide covers suite locations, access rules, hourly pricing, and transit passenger eligibility.',
  },
  'miracle': {
    overview: 'Miracle is a Thailand-based independent airport lounge brand operating multiple tiers of lounge across Bangkok\'s Suvarnabhumi Airport. Classified as a Lounge Network, Miracle lounges range from Business Class to First Class tier offerings, providing food, beverages, showers, and relaxation areas. The brand is one of the most prominent independent lounge operators in Southeast Asia, accessible to any passenger holding the correct access credentials, paid entry, or applicable credit card.',
    coverage: 'Miracle operates exclusively at Suvarnabhumi Airport (BKK) in Bangkok, Thailand. While geographically concentrated, Bangkok is one of the world\'s busiest international transit hubs, serving tens of millions of passengers annually. Multiple lounge locations across different terminals and gates give the brand strong internal coverage at this single location.',
    verdict: 'For travelers transiting through Bangkok Suvarnabhumi, Miracle lounges represent one of the best independent lounge options available, particularly for those without airline-specific access.',
    bestFor: 'Passengers transiting through Bangkok, travelers wanting a premium break at BKK without airline lounge access',
    notIdealFor: 'Travelers routing through airports other than Bangkok Suvarnabhumi',
    downside: 'The brand has no presence outside BKK, limiting its appeal to Thailand transit passengers only.',
    metaDescription: 'Discover Miracle Lounge, the leading independent lounge brand at Bangkok Suvarnabhumi Airport (BKK). View lounge tiers, locations, access rules, pricing, and whether transit passengers can enter without a Thai visa.',
    intro: 'Miracle is an independent airport lounge brand operating multiple tiers of lounge exclusively at Bangkok Suvarnabhumi Airport (BKK). It is designed for passengers transiting through Bangkok who want premium food, beverages, showers, and a quiet rest area without requiring airline lounge membership. This guide covers lounge locations, access rules, entry pricing, and whether transit passengers can use Miracle without clearing Thai immigration.',
  },
  'izzleep': {
    overview: 'izZzleep is a contemporary airport sleep pod brand offering private enclosed capsules designed for quality rest during layovers. Classified as a Sleep Pods operator, izZzleep units feature fully enclosed sleeping spaces with controlled lighting, climate settings, and secure storage. The brand is positioned as a mid-market option between open visor pods and full transit hotels, aiming to deliver meaningful sleep quality in a compact self-service format.',
    coverage: 'izZzleep currently operates at a select number of international airports. The brand is in a growth phase, with its installations targeting key transit corridors in Europe and Asia. Exact airport availability should be verified directly as coverage continues to expand.',
    verdict: 'izZzleep suits travelers who want enclosed privacy and genuine sleep quality without the cost of a full transit hotel room.',
    bestFor: 'Travelers wanting a private pod with real sleep quality, medium to long layovers',
    notIdealFor: 'Those needing shower access or full hotel-style check-in experience',
    downside: 'Coverage is limited and the brand is still expanding; availability at your specific airport should be checked in advance.',
    metaDescription: 'Discover izZzleep, an enclosed private sleep pod brand at select international airports. View pod locations, pricing, access rules, and whether transit passengers can rest without clearing immigration.',
    intro: 'izZzleep is an enclosed private sleep pod brand available at select international airports. It is designed for travelers on medium to long layovers who want genuine privacy and sleep quality without the cost of a full transit hotel. This guide covers pod locations, access rules, pricing, and whether transit passengers can use izZzleep without clearing immigration.',
  },
  'encalm': {
    overview: 'Encalm is an Indian airport hospitality brand offering a full spectrum of services including premium lounges, sleep pods, and transit hotel rooms under one roof. Classified as a Mixed-category brand, Encalm operates at Indian international airports providing travelers with flexible rest and dining options. The brand stands out for consolidating multiple service tiers — from quick lounge access to overnight accommodation — within a single airport facility.',
    coverage: 'Encalm operates at major Indian international airports including Delhi Indira Gandhi International Airport (DEL). The brand is well positioned to serve the large volume of international transit passengers passing through Indian hub airports, with facilities covering both pre-departure and transit passenger needs.',
    verdict: 'Encalm is the strongest all-in-one rest option for travelers transiting through Indian international airports, offering more flexibility than single-category brands.',
    bestFor: 'Passengers transiting through India, travelers wanting lounge or hotel access at Indian hub airports',
    notIdealFor: 'Travelers not routing through India or those expecting global multi-airport coverage',
    downside: 'Coverage is concentrated in India, limiting utility for travelers on routes that do not pass through Indian airports.',
    metaDescription: 'Discover Encalm, an all-in-one airport hospitality brand at Delhi Indira Gandhi Airport offering lounges, sleep pods, and transit hotel rooms. View locations, access rules, pricing, and transit passenger eligibility.',
    intro: 'Encalm is a mixed-category airport hospitality brand available at Delhi Indira Gandhi International Airport (DEL) in India. It is designed for passengers transiting through India who want flexible access to lounges, sleep pods, or full transit hotel rooms under one roof. This guide covers facility locations, access rules, pricing tiers, and whether transit passengers can use Encalm without clearing Indian immigration.',
  },
  'zzzleepandgo': {
    overview: 'ZZZleepandGo is an Italian airport sleep pod brand offering modern enclosed sleeping capsules inside Italian airport terminals. Classified as a Sleep Pods operator, ZZZleepandGo cabins are fully enclosed private units designed for sleeping, featuring a bed, luggage storage, Wi-Fi, and climate control. The brand caters specifically to Italian airport passengers, providing a practical and affordable alternative to off-airport hotels for layovers and early morning departures.',
    coverage: 'ZZZleepandGo operates at major Italian airports including Milan Malpensa and Rome Fiumicino. The brand is the dominant sleep pod provider within Italy\'s international aviation network, offering a consistent product across the key hub airports serving both domestic and international routes.',
    verdict: 'ZZZleepandGo is the go-to choice for anyone needing rest at an Italian airport, offering solid value and genuine privacy in a market with limited alternatives.',
    bestFor: 'Passengers at Italian airports, early morning departures, overnight layovers at MXP or FCO',
    notIdealFor: 'Travelers outside Italy or those seeking a shower or full hotel experience',
    downside: 'Brand coverage is limited to Italy; travelers on non-Italian routing will not benefit.',
    metaDescription: 'Discover ZZZleepandGo, Italy\'s leading airport sleep pod brand at Milan Malpensa (MXP) and Rome Fiumicino (FCO). View pod locations, pricing, access rules, and transit passenger eligibility.',
    intro: 'ZZZleepandGo is an enclosed sleep pod brand available at major Italian airports including Milan Malpensa (MXP) and Rome Fiumicino (FCO). It is designed for passengers on overnight layovers, early morning departures, and anyone needing affordable private rest at an Italian hub. This guide covers pod locations, access rules, pricing, and whether transit passengers can use ZZZleepandGo without clearing immigration.',
  },
  'kepler-club': {
    overview: 'Kepler Club is a premium airport lounge and transit hotel brand offering a distinctive mix of private sleeping cabins and lounge access. Classified as a Lounge Network, Kepler Club positions itself at the intersection of business lounge comfort and boutique hotel privacy. The brand targets premium travelers seeking a quiet, exclusive environment with personalized service, offering both day access and overnight cabin bookings at select locations.',
    coverage: 'Kepler Club operates at a curated selection of international airports, with a focus on major Asian and Middle Eastern hub airports. The brand\'s limited footprint is intentional, maintaining service quality and exclusivity at each location rather than pursuing high-volume expansion.',
    verdict: 'Kepler Club is a strong option for premium travelers who want more than a standard lounge but prefer not to leave the terminal for a full hotel stay.',
    bestFor: 'Premium travelers, long layovers requiring sleep, those wanting a quieter and more exclusive lounge environment',
    notIdealFor: 'Budget travelers or those seeking a purely self-service experience',
    downside: 'The brand\'s selective presence means it is only available at a small number of airports.',
    metaDescription: 'Discover Kepler Club, a premium airport lounge and transit hotel brand at select Asian and Middle Eastern hub airports. View locations, cabin options, access rules, pricing, and transit passenger eligibility.',
    intro: 'Kepler Club is a premium airport lounge and private cabin brand available at select international airports across Asia and the Middle East. It is designed for premium travelers on long layovers who want an exclusive, quiet environment with personalized service — beyond what standard airline lounges provide. This guide covers lounge locations, cabin access rules, pricing, and transit passenger eligibility.',
  },
  "wait-n-rest": {
    overview: "Wait N' Rest is an airport sleep pod and rest facility operator providing affordable private resting spaces within airport terminals. Classified as a Sleep Pods brand, Wait N' Rest offers a practical solution for budget-conscious travelers who need rest during a layover without committing to a full transit hotel booking. The brand focuses on delivering clean, functional private spaces at accessible price points.",
    coverage: "Wait N' Rest operates at select international airports, targeting routes and terminals with high layover passenger volumes. The brand maintains a focused presence rather than a global network, concentrating on specific hub airports where demand for affordable airside rest is highest.",
    verdict: "Wait N' Rest is a solid budget-friendly option for travelers wanting basic private rest during a layover, particularly when cost is the primary consideration.",
    bestFor: 'Budget travelers, short to medium layovers, passengers wanting a clean private space without hotel pricing',
    notIdealFor: 'Travelers expecting premium amenities, shower access, or a hotel-level experience',
    downside: 'Facilities are functional rather than premium; amenities are limited compared to transit hotel competitors.',
    metaDescription: "Discover Wait N' Rest, a budget-friendly airport sleep pod brand at select international airports. View pod locations, pricing, access rules, and whether transit passengers can rest without clearing immigration.",
    intro: "Wait N' Rest is an affordable airport sleep pod brand available at select international airports. It is designed for budget-conscious travelers and those on short to medium layovers who need basic private rest without the cost of a full transit hotel. This guide covers pod locations, access rules, pricing, and transit passenger eligibility.",
  },
  'sh-premium-lounge': {
    overview: 'SH Premium Lounge is an independent airport lounge brand providing premium rest and dining facilities within international airport terminals. Classified as a Lounge Network, SH Premium Lounge offers food, beverages, shower facilities, and comfortable seating to any eligible passenger, operating outside of airline-affiliated access programs. The brand serves travelers seeking a quieter, more comfortable alternative to the general terminal environment.',
    coverage: 'SH Premium Lounge operates at selected international airports, providing services to a mix of transit and departing passengers. The brand focuses on delivering consistent lounge quality across its locations, with facilities designed for comfort during short to medium pre-flight or layover periods.',
    verdict: 'SH Premium Lounge is a reliable independent lounge choice for travelers at the airports it serves, offering a strong value alternative to airline-specific lounges.',
    bestFor: 'Passengers without airline lounge access, long pre-departure waits, travelers wanting food and Wi-Fi in a calm setting',
    notIdealFor: 'Very short visits where access fees may not represent value',
    downside: 'Coverage is limited and the brand does not operate a global network comparable to Plaza Premium or similar players.',
    metaDescription: 'Discover SH Premium Lounge, an independent airport lounge brand at select international airports. View lounge locations, access rules, entry fees, and whether transit passengers can use it without clearing immigration.',
    intro: 'SH Premium Lounge is an independent airport lounge brand available at select international airports. It is designed for passengers without airline lounge access who want premium food, Wi-Fi, and shower facilities during a pre-departure wait or layover. This guide covers lounge locations, access rules, entry fees, and transit passenger eligibility.',
  },
  'skyhub-lounge': {
    overview: 'Skyhub Lounge is a Korean independent airport lounge brand offering premium lounge facilities to passengers at Korean hub airports. Classified as a Lounge Network, Skyhub Lounge provides food, beverages, shower access, and comfortable lounge seating in well-appointed spaces. The brand targets travelers transiting through South Korea who do not have airline lounge access, offering an accessible premium alternative.',
    coverage: 'Skyhub Lounge operates at Korean international airports, with locations at Incheon (ICN) and Gimpo (GMP). The two-airport presence covers South Korea\'s primary international and regional gateway airports, giving the brand meaningful coverage for passengers arriving from international routes.',
    verdict: 'For travelers transiting through South Korea, Skyhub Lounge is one of the better independent lounge options available, with consistent facilities across its Korean locations.',
    bestFor: 'Passengers transiting through ICN or GMP without airline lounge access, long layovers at Korean airports',
    notIdealFor: 'Travelers routing through airports outside South Korea',
    downside: 'Brand is confined to South Korea, which restricts its value to passengers specifically transiting through Korean airports.',
    metaDescription: 'Discover Skyhub Lounge, a Korean independent airport lounge brand at Incheon (ICN) and Gimpo (GMP) airports. View lounge locations, access rules, entry fees, and transit passenger eligibility without a Korean visa.',
    intro: 'Skyhub Lounge is an independent airport lounge brand available at Incheon International Airport (ICN) and Gimpo Airport (GMP) in South Korea. It is designed for passengers transiting through South Korea who want premium food, beverages, and shower access without airline lounge membership. This guide covers lounge locations, access rules, entry fees, and whether transit passengers can use Skyhub Lounge without clearing Korean immigration.',
  },
  'sleepover': {
    overview: 'Sleepover is an airport sleep pod brand offering private resting capsules within airport terminal buildings. Classified as a Sleep Pods operator, Sleepover provides enclosed sleeping units that allow passengers to rest during layovers without leaving the secure airside area. The brand targets budget and mid-market travelers seeking genuine rest in a compact, self-service pod format that is more private than open seating but more affordable than a full transit hotel room.',
    coverage: 'Sleepover operates at a select number of international airports. The brand maintains focused deployment in terminals with high layover passenger traffic, targeting airports where demand for affordable private rest options is demonstrated.',
    verdict: 'Sleepover is a practical middle-ground option for layover rest, offering more privacy than open pod brands at a lower price point than transit hotels.',
    bestFor: 'Medium layovers, travelers wanting a private enclosed pod, those prioritizing sleep quality on a moderate budget',
    notIdealFor: 'Passengers needing shower access or premium amenities as part of their rest stop',
    downside: 'Airport coverage is limited; the brand is not yet available at the majority of international hubs.',
    metaDescription: 'Discover Sleepover, an enclosed airport sleep pod brand at select international airports. View pod locations, pricing, access rules, and whether transit passengers can rest without clearing immigration.',
    intro: 'Sleepover is an enclosed airport sleep pod brand available at select international airports. It is designed for travelers on medium layovers who want private rest at a price point below transit hotels. This guide covers pod locations, access rules, pricing, and whether transit passengers can use Sleepover without clearing immigration.',
  },
};

const COMPARISON_BRANDS: Record<string, string[]> = {
  'aerotel': ['yotelair', 'minute-suites', 'napcabs', 'gosleep', 'plaza-premium'],
  'gosleep': ['napcabs', 'aerotel', 'yotelair', 'zzzleepandgo', 'sleepover'],
  'yotelair': ['aerotel', 'minute-suites', 'napcabs', 'plaza-premium', 'kepler-club'],
  'napcabs': ['gosleep', 'yotelair', 'zzzleepandgo', 'aerotel', 'sleepover'],
  'plaza-premium': ['kepler-club', 'miracle', 'aerotel', 'yotelair', 'sh-premium-lounge'],
  'minute-suites': ['aerotel', 'yotelair', 'napcabs', 'gosleep', 'kepler-club'],
  'miracle': ['plaza-premium', 'kepler-club', 'sh-premium-lounge', 'skyhub-lounge', 'encalm'],
  'izzleep': ['gosleep', 'napcabs', 'zzzleepandgo', 'aerotel', 'sleepover'],
  'encalm': ['miracle', 'plaza-premium', 'aerotel', 'kepler-club', 'sh-premium-lounge'],
  'zzzleepandgo': ['napcabs', 'gosleep', 'izzleep', 'aerotel', 'sleepover'],
  'kepler-club': ['plaza-premium', 'aerotel', 'yotelair', 'miracle', 'sh-premium-lounge'],
  'wait-n-rest': ['gosleep', 'napcabs', 'sleepover', 'aerotel', 'izzleep'],
  'sh-premium-lounge': ['plaza-premium', 'kepler-club', 'miracle', 'skyhub-lounge', 'aerotel'],
  'skyhub-lounge': ['plaza-premium', 'miracle', 'sh-premium-lounge', 'kepler-club', 'aerotel'],
  'sleepover': ['gosleep', 'napcabs', 'zzzleepandgo', 'wait-n-rest', 'aerotel'],
};

const BRAND_NAME_MAP: Record<string, string> = {
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

function getRegionFromCodes(codes: string[]): string {
  const regionMap: Record<string, string> = {
    SIN: 'Asia', BKK: 'Asia', KUL: 'Asia', ICN: 'Asia', GMP: 'Asia', HKG: 'Asia',
    NRT: 'Asia', PEK: 'Asia', DEL: 'Asia', BOM: 'Asia', CGK: 'Asia', MNL: 'Asia',
    LHR: 'Europe', LGW: 'Europe', CDG: 'Europe', AMS: 'Europe', FRA: 'Europe',
    MUC: 'Europe', ZRH: 'Europe', FCO: 'Europe', MXP: 'Europe', MAD: 'Europe',
    DXB: 'Middle East', AUH: 'Middle East', DOH: 'Middle East', KWI: 'Middle East',
    CAI: 'Middle East', BAH: 'Middle East',
    JFK: 'North America', LAX: 'North America', ORD: 'North America',
    ATL: 'North America', PHL: 'North America', DFW: 'North America',
    YYZ: 'North America', YVR: 'North America',
    SYD: 'Australia/Pacific', MEL: 'Australia/Pacific', AKL: 'Australia/Pacific',
  };
  const regions = new Set(codes.map(c => regionMap[c]).filter(Boolean));
  if (regions.size === 0) return '';
  if (regions.size === 1) return Array.from(regions)[0];
  const list = Array.from(regions);
  if (list.length === 2) return `${list[0]} and ${list[1]}`;
  return `${list.slice(0, -1).join(', ')}, and ${list[list.length - 1]}`;
}

function getCategoryLabel(brandType: BrandType): string {
  if (brandType === 'Transit Hotel') return 'Transit Hotels';
  if (brandType === 'Sleep Pods') return 'Sleep Pods';
  if (brandType === 'Lounge Network') return 'Lounge Networks';
  return 'All Brands';
}

export function getBrandMetaDescription(
  brandName: string,
  brandType: BrandType,
  airportCodes: string[],
  airportCount: number,
  brandSlug: string
): string {
  const content = BRAND_DESCRIPTIONS[brandSlug];
  if (content?.metaDescription) return content.metaDescription;

  const region = getRegionFromCodes(airportCodes);
  const typeLabel = brandType === 'Transit Hotel' ? 'transit hotel'
    : brandType === 'Sleep Pods' ? 'sleep pod brand'
    : brandType === 'Lounge Network' ? 'airport lounge network'
    : 'airport rest facility';

  const regionText = region ? ` across ${region}` : '';
  return `Discover ${brandName}, an airport ${typeLabel} available at ${airportCount} ${airportCount === 1 ? 'airport' : 'airports'}${regionText}. View locations, access rules, pricing insights, and whether transit passengers can stay without clearing immigration.`;
}

export function getBrandIntro(
  brandName: string,
  brandType: BrandType,
  airportCodes: string[],
  airportCount: number,
  brandSlug: string
): string {
  const content = BRAND_DESCRIPTIONS[brandSlug];
  if (content?.intro) return content.intro;

  const region = getRegionFromCodes(airportCodes);
  const typeLabel = brandType === 'Transit Hotel' ? 'transit hotel'
    : brandType === 'Sleep Pods' ? 'sleep pod brand'
    : brandType === 'Lounge Network' ? 'airport lounge network'
    : 'airport rest facility';
  const regionText = region ? ` across ${region}` : ` at ${airportCount} ${airportCount === 1 ? 'airport' : 'airports'}`;

  return `${brandName} is an airport ${typeLabel} available${regionText}. This guide covers locations, access rules, pricing, and whether you can stay inside the airport without clearing immigration.`;
}

export function generateBrandFAQSchema(
  brandName: string,
  brandType: BrandType,
  airportCount: number,
  brandSlug: string
) {
  const content = BRAND_DESCRIPTIONS[brandSlug];
  const faqs = getBrandFAQs(brandName, brandType, airportCount, content);
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

function getBrandFAQs(
  brandName: string,
  brandType: BrandType,
  airportCount: number,
  content: (typeof BRAND_DESCRIPTIONS)[string] | undefined
) {
  const typeLabel = brandType === 'Mixed' ? 'airport rest facility' : brandType.toLowerCase();
  return [
    {
      q: `What is ${brandName} in airports?`,
      a: content?.overview?.split('.').slice(0, 2).join('.') + '.' ||
        `${brandName} is an airport ${typeLabel} operating at ${airportCount} ${airportCount === 1 ? 'airport' : 'airports'} worldwide.`,
    },
    {
      q: `Can you sleep overnight at ${brandName}?`,
      a: brandType === 'Transit Hotel'
        ? `Yes. ${brandName} operates as a transit hotel, offering private rooms with beds designed for overnight stays within the airport terminal. Rooms can typically be booked by the hour or for a full night.`
        : brandType === 'Sleep Pods'
        ? `Yes, most ${brandName} locations can be used for overnight rest. Sleep pod bookings are typically charged by the hour, so an overnight stay is possible by booking multiple consecutive hours.`
        : `${brandName} lounges are generally designed for short to medium stays and may have maximum stay limits. Check the specific lounge location for overnight policies.`,
    },
    {
      q: `Is ${brandName} inside security (airside)?`,
      a: `${brandName} operates primarily in airside terminal areas at the airports it serves, meaning you typically do not need to exit passport control to access the facilities. Always verify the specific terminal location when booking to confirm airside access at your airport.`,
    },
    {
      q: `How much does ${brandName} cost?`,
      a: brandType === 'Transit Hotel'
        ? `${brandName} charges by the hour, with minimum booking windows typically starting at 3–6 hours. Pricing varies by airport and room type. Full overnight rates are also available at most locations.`
        : brandType === 'Sleep Pods'
        ? `${brandName} pods are generally priced by the hour, making them a cost-effective option compared to transit hotels. Rates vary by airport and location.`
        : `${brandName} lounge access is typically priced per visit with a time-limited stay. Some locations offer day passes or are accessible through certain credit card programs.`,
    },
    {
      q: `Can you use ${brandName} without a visa?`,
      a: `In most cases, no visa is required to use ${brandName} because facilities are located in the airside area of the terminal, before you clear immigration and customs. However, if you need to travel between terminals or access landside areas, visa requirements for the transit country apply.`,
    },
    {
      q: `Does ${brandName} have shower facilities?`,
      a: brandType === 'Transit Hotel'
        ? `Yes. ${brandName} transit hotel rooms include private en-suite shower facilities as a standard feature.`
        : brandType === 'Sleep Pods'
        ? `Shower access varies by ${brandName} location. Some airports include shower facilities alongside pod bookings; others offer shower access as a separate paid option.`
        : `${brandName} lounges typically include shower facilities accessible to lounge guests, though availability may vary by location. Confirm shower access when booking.`,
    },
    {
      q: `How far in advance should I book ${brandName}?`,
      a: `For ${brandName} locations at major hub airports, booking at least 24–48 hours in advance is recommended, particularly during peak travel seasons. Some locations accept walk-ins when capacity is available, but advance booking guarantees your time slot.`,
    },
  ];
}

export function BrandSEOContent({
  brandName,
  brandSlug,
  brandType,
  facilityCount,
  airportCount,
  airportCodes,
  allBrandSlugs,
}: BrandSEOContentProps) {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const content = BRAND_DESCRIPTIONS[brandSlug];
  const region = getRegionFromCodes(airportCodes);
  const categoryPath = getBrandCategoryUrl(brandType);
  const categoryLabel = getCategoryLabel(brandType);

  const comparisonSlugs = (COMPARISON_BRANDS[brandSlug] || [])
    .filter(slug => allBrandSlugs.some(b => b.slug === slug))
    .slice(0, 5);

  const faqs = getBrandFAQs(brandName, brandType, airportCount, content);

  const overviewText = content?.overview ||
    `${brandName} is an airport ${brandType === 'Mixed' ? 'rest and hospitality' : brandType.toLowerCase()} brand operating at ${airportCount} ${airportCount === 1 ? 'airport' : 'airports'} worldwide. The brand provides travelers with dedicated rest and relaxation facilities within airport terminal buildings, offering an alternative to spending a layover in the general departures area. ${brandName} focuses on delivering quality ${brandType === 'Transit Hotel' ? 'private room accommodation' : brandType === 'Sleep Pods' ? 'sleep pod facilities' : 'lounge services'} to transit passengers.`;

  const coverageText = content?.coverage ||
    `${brandName} currently operates at ${airportCount} ${airportCount === 1 ? 'airport' : 'airports'} worldwide${region ? ` with a presence in ${region}` : ''}, with ${facilityCount} ${facilityCount === 1 ? 'facility' : 'facilities'} available to travelers. The brand maintains a focused network targeting key international transit routes.`;

  const verdictText = content?.verdict ||
    `${brandName} is a solid choice for travelers who need ${brandType === 'Transit Hotel' ? 'private accommodation during a layover' : brandType === 'Sleep Pods' ? 'affordable rest in a compact pod format' : 'lounge access and amenities during a wait'} at the airports where it operates.`;

  const bestFor = content?.bestFor || 'Travelers needing rest during layovers';
  const notIdealFor = content?.notIdealFor || 'Very short connections under 1–2 hours';
  const downside = content?.downside || 'Coverage is limited compared to the largest global brands.';

  const relatedCategories = [
    { label: 'Sleep Pods', path: getBrandCategoryUrl('Sleep Pods') },
    { label: 'Transit Hotels', path: getBrandCategoryUrl('Transit Hotel') },
    { label: 'Lounge Networks', path: getBrandCategoryUrl('Lounge Network') },
  ].filter(c => c.path !== categoryPath);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-14">

      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">What Is {brandName}?</h2>
        <p className="text-slate-600 leading-relaxed max-w-3xl">{overviewText}</p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Where Can You Find {brandName}?</h2>
        <p className="text-slate-600 leading-relaxed max-w-3xl">{coverageText}</p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Is {brandName} Worth It?</h2>
        <p className="text-slate-600 leading-relaxed max-w-3xl mb-5">
          {verdictText}
          {verdictText.toLowerCase().includes('visa') && (
            <>{' '}<a href="https://www.visainfoguide.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-sky-700 hover:text-sky-600 underline underline-offset-2">Check your transit visa requirements at visainfoguide.com</a>.</>
          )}
        </p>
        <div className="grid sm:grid-cols-2 gap-4 max-w-3xl">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">Best for</p>
            <p className="text-slate-700 text-sm leading-relaxed">{bestFor}</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Not ideal for</p>
            <p className="text-slate-600 text-sm leading-relaxed">{notIdealFor}</p>
          </div>
        </div>
        <p className="text-sm text-slate-500 mt-4 max-w-3xl">
          <span className="font-medium text-slate-600">One downside:</span> {downside}
        </p>
      </section>

      {comparisonSlugs.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Compare {brandName} with Other Airport Sleep Brands
          </h2>
          <ul className="space-y-2 max-w-xl">
            {comparisonSlugs.map(slug => {
              const otherBrand = allBrandSlugs.find(b => b.slug === slug);
              const otherName = BRAND_NAME_MAP[slug] || otherBrand?.name || slug;
              const bothExist = !!otherBrand;
              const href = bothExist ? getBrandCompareUrlFromSlugs(brandSlug, slug) : null;
              return (
                <li key={slug}>
                  {href ? (
                    <a
                      href={href}
                      onClick={(e) => { e.preventDefault(); navigateTo(href); }}
                      className="inline-flex items-center text-slate-700 hover:text-slate-900 font-medium group"
                    >
                      <ChevronRight className="w-4 h-4 mr-1 text-slate-400 group-hover:text-slate-600 transition-colors" />
                      {brandName} vs {otherName}
                    </a>
                  ) : (
                    <span className="inline-flex items-center text-slate-400 font-medium">
                      <ChevronRight className="w-4 h-4 mr-1 text-slate-300" />
                      {brandName} vs {otherName}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Explore Other Airport Rest Options</h2>
        <p className="text-slate-600 mb-5 max-w-2xl text-sm leading-relaxed">
          Not sure if {brandName} is right for your layover? Browse other airport rest categories or compare with other brands.
        </p>
        <div className="flex flex-wrap gap-3 mb-5">
          <a
            href={categoryPath}
            onClick={(e) => { e.preventDefault(); navigateTo(categoryPath); }}
            className="inline-flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
          >
            {categoryLabel}
          </a>
          {relatedCategories.map(cat => (
            <a
              key={cat.path}
              href={cat.path}
              onClick={(e) => { e.preventDefault(); navigateTo(cat.path); }}
              className="inline-flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors"
            >
              {cat.label}
            </a>
          ))}
          <a
            href="/sleep-pods"
            onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }}
            className="inline-flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            All Sleep Pods
          </a>
          <a
            href="/transit-hotels"
            onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }}
            className="inline-flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            All Transit Hotels
          </a>
          <a
            href="/lounge-sleep"
            onClick={(e) => { e.preventDefault(); navigateTo('/lounge-sleep'); }}
            className="inline-flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            Lounge Sleep Options
          </a>
          <a
            href="/airports"
            onClick={(e) => { e.preventDefault(); navigateTo('/airports'); }}
            className="inline-flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            Browse Airports
          </a>
          <a
            href="/brands"
            onClick={(e) => { e.preventDefault(); navigateTo('/brands'); }}
            className="inline-flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            Compare All Brands
          </a>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Frequently Asked Questions About {brandName}
        </h2>
        <div className="max-w-3xl space-y-0 border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200">
          {faqs.map((faq, i) => (
            <div key={i}>
              <button
                className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-slate-50 transition-colors"
                onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                aria-expanded={openFAQ === i}
              >
                <span className="font-medium text-slate-800 pr-4">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${openFAQ === i ? 'rotate-180' : ''}`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ${openFAQ === i ? 'max-h-96' : 'max-h-0'}`}
                aria-hidden={openFAQ !== i}
              >
                <div className="px-5 pb-5 bg-white">
                  <p className="text-slate-600 leading-relaxed text-sm">
                    {faq.a}
                    {faq.a.toLowerCase().includes('visa') && (
                      <>{' '}<a href="https://www.visainfoguide.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-sky-700 hover:text-sky-600 underline underline-offset-2">Check transit visa requirements at visainfoguide.com</a>.</>
                    )}
                  </p>
                </div>
              </div>
              <noscript>
                <div className="px-5 pb-5 bg-white">
                  <p className="text-slate-600 leading-relaxed text-sm">{faq.a}</p>
                </div>
              </noscript>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
