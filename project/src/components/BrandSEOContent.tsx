import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { BrandType } from '../lib/brandNormalization';
import { navigateTo } from '../lib/navigation';
import { getBrandCompareUrlFromSlugs } from '../lib/brandRoutes';


interface BrandSEOContentProps {
  brandName: string;
  brandSlug: string;
  brandType: BrandType;
  facilityCount: number;
  airportCount: number;
  airportCodes: string[];
  allBrandSlugs: { name: string; slug: string }[];
}

export interface BrandDescriptionData {
  overview: string;
  coverage: string;
  verdict: string;
  bestFor: string;
  notIdealFor: string;
  accessModel: string;
  sleepFormat: string;
  downside?: string;
  metaDescription: string;
  intro: string;
  faqs: Array<{ q: string; a: string }>;
  closingParagraph: string;
  thinContent?: boolean;
}

const BRAND_DESCRIPTIONS: Record<string, BrandDescriptionData> = {
  'aerotel': {
    overview: 'Aerotel is one of the most established airside transit hotel brands in the world, operating fully enclosed private rooms inside international terminal buildings. Rooms come with a proper bed, private shower, and Wi-Fi — none of which requires clearing immigration to access. The brand was pioneered at Singapore Changi and has expanded to major hubs across Asia, the Middle East, and Europe. For transit passengers who need genuine recovery time, Aerotel delivers hotel-quality rest in a compact, terminal-integrated format.',
    coverage: 'Aerotel operates at several of the world\'s busiest international airports, concentrating on major transit hubs in Asia and the Middle East. Key locations include Singapore Changi (SIN), London Heathrow (LHR), and Abu Dhabi (AUH). The brand focuses on high-traffic layover routes where passengers regularly face long connections between international flights.',
    verdict: 'Aerotel is an excellent choice for travelers who need genuine rest on a long layover without the hassle of leaving the airport. The airside location is particularly valuable for passengers without the required visa to exit.',
    bestFor: 'Long layovers of 4+ hours, passengers without exit visas, travelers who want a proper bed and shower',
    notIdealFor: 'Budget travelers or those with short connections under 2 hours',
    accessModel: 'Airside — no immigration clearance needed. Located within the secure terminal zone at all served airports.',
    sleepFormat: 'Private enclosed rooms with a real bed, en-suite shower, desk, and Wi-Fi. Bookable by the hour (typically 3–6 hour minimum) or overnight.',
    downside: 'Rates can be high compared to sleep pods, and availability at peak times is not guaranteed without advance booking.',
    metaDescription: 'Aerotel transit hotel at Singapore Changi, London Heathrow & Abu Dhabi — private airside rooms with showers, no immigration clearance needed.',
    intro: 'Aerotel operates airside transit hotels at major international hubs including Singapore Changi, London Heathrow, and Abu Dhabi. Private rooms with en-suite showers are available by the hour for transit passengers, with no requirement to clear immigration. This guide covers Aerotel locations, access rules, pricing, and transit passenger eligibility.',
    faqs: [
      {
        q: 'Does Aerotel require clearing immigration?',
        a: 'No. Aerotel hotels are located airside — inside the secure terminal zone after the departure gate area. Transit passengers can check in and rest without clearing immigration or exiting the terminal.',
      },
      {
        q: 'Can you stay overnight at Aerotel?',
        a: 'Yes. Aerotel offers overnight bookings at most locations. Rooms can be booked by the hour with a minimum stay, or for a full overnight period. Availability varies by airport, so advance booking is recommended for overnight stays.',
      },
      {
        q: 'Are Aerotel rooms bookable by the hour?',
        a: 'Yes. Aerotel operates on an hourly rate model with a minimum booking window, typically starting at 3–6 hours depending on the location. Full overnight rates are also available.',
      },
      {
        q: 'Do Aerotel rooms have showers?',
        a: 'Yes. Private en-suite shower facilities are a standard feature in Aerotel transit hotel rooms. This is one of the key advantages over sleep pod options at the same airports.',
      },
      {
        q: 'Which airports have Aerotel?',
        a: 'Aerotel operates at Singapore Changi (SIN), London Heathrow (LHR), and Abu Dhabi (AUH), among other locations. Each airport may have Aerotel in specific terminals — verify your terminal before arrival.',
      },
      {
        q: 'How far in advance should you book Aerotel?',
        a: 'At major hub airports, booking 24–48 hours in advance is recommended, especially during peak travel seasons. Walk-in availability is possible but not guaranteed.',
      },
      {
        q: 'Is Aerotel better than a sleep pod?',
        a: 'Aerotel offers more privacy and full hotel amenities — a private room, en-suite shower, and proper bed — compared to sleep pod brands. The trade-off is a higher price point. For a long layover requiring genuine rest, Aerotel is the stronger option.',
      },
    ],
    closingParagraph: 'For transit passengers who need more than a reclining seat, Aerotel delivers a complete rest experience inside the terminal. With private rooms, en-suite showers, and airside access at key airports including Singapore Changi, London Heathrow, and Abu Dhabi, it is one of the most reliable transit hotel options for long layovers and overnight connections. Browse all transit hotels on RestInAirport to compare Aerotel with other airport accommodation options, or explore sleep pods and airport lounges if you are looking for a lighter or more affordable rest solution.',
  },
  'gosleep': {
    overview: 'GoSleep is a Finnish-designed sleep pod brand offering semi-private sleeping capsules inside airport terminals. Each unit features a flat-reclining seat with a privacy visor that pulls down to block light and reduce terminal noise. The design requires no check-in — passengers simply occupy an available pod. GoSleep has expanded from its Nordic origins to airports across Europe, Asia, and the Middle East, making it one of the more widely deployed pod brands in international transit hubs.',
    coverage: 'GoSleep pods are deployed at international airports across Europe and the Middle East. The self-service model keeps operational overhead low, enabling placement across a wider range of airport sizes. The brand has grown from Scandinavia into Gulf hub airports and select Asian locations.',
    verdict: 'GoSleep suits travelers who want affordable, no-frills rest without committing to a hotel booking. The pay-as-you-go approach works well for layovers of 1–4 hours.',
    bestFor: 'Short to medium layovers, budget-conscious travelers, passengers wanting a quick rest without a booking process',
    notIdealFor: 'Passengers needing full privacy, shower access, or hotel-level amenities',
    accessModel: 'Fully self-service — no check-in required. Walk up to any available pod, pay at the unit, and rest.',
    sleepFormat: 'Semi-enclosed seat with privacy visor. Flat-reclining position suitable for rest. No full enclosure — partial noise and light reduction only.',
    downside: 'The visor provides partial privacy only — it is not a fully enclosed space, and terminal noise can still be noticeable.',
    metaDescription: 'GoSleep sleep pods at airports in Europe & the Middle East — self-service hourly pods with privacy visors, no booking required for transit passengers.',
    intro: 'GoSleep operates self-service sleep pods at airports across Europe, Asia, and the Middle East. Pods feature a reclining seat and privacy visor, available by the hour with no check-in required. This guide covers GoSleep pod locations, pricing, access rules, and transit passenger eligibility.',
    faqs: [
      {
        q: 'How do GoSleep pods work?',
        a: 'GoSleep pods are self-service — there is no check-in desk or staff process. You find an available pod, use the onboard terminal to pay and set your wake-up alarm, lower the privacy visor, and rest. The process takes under a minute.',
      },
      {
        q: 'Do GoSleep pods have complete privacy?',
        a: 'GoSleep pods provide partial privacy. The visor blocks light from above and reduces some terminal noise, but the pod is not fully enclosed. It is more private than a standard airport seat, but less so than an enclosed capsule brand like Napcabs.',
      },
      {
        q: 'Can you sleep overnight in a GoSleep pod?',
        a: 'Yes. GoSleep pods can be used for overnight stays by booking consecutive hours. The flat-recline position makes extended rest possible, though the partial privacy means it is better suited to shorter rest periods.',
      },
      {
        q: 'How much does a GoSleep pod cost?',
        a: 'GoSleep charges by the hour. Rates vary by airport — typically lower than transit hotel rates. Some locations offer discounted multi-hour blocks. Prices are displayed at the pod terminal before payment.',
      },
      {
        q: 'Are GoSleep pods airside?',
        a: 'Yes. GoSleep pods are located in airside terminal areas at the airports they serve, meaning transit passengers can use them without clearing immigration or customs.',
      },
      {
        q: 'Do you need to book a GoSleep pod in advance?',
        a: 'No advance booking is required for most GoSleep locations — the pods operate on a walk-in, self-service basis. At busy hub airports during peak travel periods, arriving early is advisable to secure a pod.',
      },
    ],
    closingParagraph: 'GoSleep offers one of the simplest rest options available at airports — no check-in, no booking process, and an hourly price point that works for budget travelers and short layovers alike. Available across airports in Europe, the Middle East, and Asia, GoSleep pods are particularly suited to transit passengers who need a few hours of rest without the cost of a full transit hotel room. Explore all sleep pod options on RestInAirport, or browse transit hotels and airport lounges if you need additional amenities or a longer stay.',
  },
  'yotelair': {
    overview: 'YOTELAIR is a premium transit hotel brand operating compact, cabin-style accommodation inside major international airport terminals. Cabins include a proper bed, private bathroom with rainfall shower, in-room entertainment, and hotel services — all in a smartly designed small-footprint format. YOTELAIR has a strong presence at European hub airports and has extended into North American locations, appealing to premium economy and business travelers who want hotel-quality recovery without leaving the terminal.',
    coverage: 'YOTELAIR operates at several of the world\'s largest hub airports, including Amsterdam Schiphol (AMS), London Gatwick (LGW), London Heathrow (LHR), Paris Charles de Gaulle (CDG), and New York JFK (JFK). Most locations are positioned within international departures, ensuring no passport control is required for transit passengers.',
    verdict: 'YOTELAIR is the strongest choice for travelers who want hotel-quality rest without leaving the terminal. The private cabin with en-suite shower is among the best airside rest options available at the airports it serves.',
    bestFor: 'Long layovers, premium travelers, those wanting a proper shower and bed before a connecting flight',
    notIdealFor: 'Budget travelers — YOTELAIR is priced at the higher end of the airside accommodation market',
    accessModel: 'Airside at most locations — within the international departures zone. No immigration clearance needed for transit passengers.',
    sleepFormat: 'Fully private cabin with lockable door, SmartBed with fresh linen, rainfall shower, in-cabin entertainment, and Wi-Fi. Hourly minimum or overnight rate.',
    downside: 'Availability can be limited during peak travel periods, and cabins book out quickly at popular hubs.',
    metaDescription: 'YOTELAIR transit hotel cabins at Amsterdam Schiphol, London Heathrow, Paris CDG & New York JFK — private rooms with showers, hourly booking, airside access.',
    intro: 'YOTELAIR operates premium transit hotel cabins at major airports including Amsterdam Schiphol, London Heathrow, Paris Charles de Gaulle, and New York JFK. Private cabins with en-suite showers are available by the hour or overnight for transit passengers without leaving the terminal. This guide covers YOTELAIR locations, pricing, access rules, and booking guidance.',
    faqs: [
      {
        q: 'What is included in a YOTELAIR cabin?',
        a: 'YOTELAIR cabins include a SmartBed with fresh linen, a private en-suite bathroom with rainfall shower, in-cabin entertainment, Wi-Fi, and all necessary toiletries. The cabin is fully private with a lockable door.',
      },
      {
        q: 'Does YOTELAIR require clearing immigration?',
        a: 'No. YOTELAIR cabins are located airside at most locations, within the international departures zone. Transit passengers do not need to clear immigration or re-enter security to access a YOTELAIR cabin.',
      },
      {
        q: 'Can you stay overnight at YOTELAIR?',
        a: 'Yes. YOTELAIR offers overnight bookings in addition to short-stay hourly options. Overnight rates typically cover a set window (e.g., 22:00–08:00) and offer better value per hour than standard daytime rates.',
      },
      {
        q: 'How much does YOTELAIR cost?',
        a: 'YOTELAIR charges by the hour with a minimum booking window, typically starting at 4 hours. Full overnight rates are also available. Prices vary by airport and season. Advance booking online is generally cheaper than walk-in rates.',
      },
      {
        q: 'Which airports have YOTELAIR?',
        a: 'YOTELAIR currently operates at Amsterdam Schiphol (AMS), London Gatwick (LGW), London Heathrow (LHR), Paris Charles de Gaulle (CDG), and New York JFK (JFK). Each location is within the international terminal airside.',
      },
      {
        q: 'Is YOTELAIR better than Aerotel?',
        a: 'YOTELAIR and Aerotel are comparable in quality, with both offering private rooms, en-suite showers, and airside access. YOTELAIR tends to have a stronger European and North American presence, while Aerotel is more prevalent in Asia and the Middle East. The best choice depends on your routing.',
      },
    ],
    closingParagraph: 'YOTELAIR is among the few transit hotel brands that genuinely competes with off-airport hotels on comfort and service — all without leaving the terminal. With cabins at major transit hubs including Amsterdam Schiphol, London Heathrow, Paris CDG, and New York JFK, it is well positioned for long-haul layovers on transatlantic and European routes. Browse all transit hotels on RestInAirport to compare YOTELAIR with other airport accommodation options, or check sleep pods and airport lounges for lighter rest alternatives.',
  },
  'napcabs': {
    overview: 'Napcabs is a German sleep pod brand offering fully enclosed private sleeping cabins inside airport terminals. Unlike open-design pods, each Napcabs unit is a sealed individual capsule with a lockable door, providing complete privacy, blackout conditions, and effective noise reduction. The design makes Napcabs significantly more private than visor-based pods, delivering an experience closer to a private room. The brand operates primarily at Munich Airport (MUC) and select other international locations.',
    coverage: 'Napcabs is concentrated at Munich Airport, where it has operated for over a decade, with installations across both Terminal 1 and Terminal 2. Both locations are airside, accessible without re-entering passport control. The brand has also expanded to select additional international airports.',
    verdict: 'Napcabs is the best sleep pod option for travelers who need true privacy and darkness during a layover. The locked cabin experience is noticeably superior to open-visor pod brands.',
    bestFor: 'Travelers wanting maximum privacy in a pod format, overnight layovers, light sleepers who need noise control',
    notIdealFor: 'Those who find enclosed spaces uncomfortable or who need shower access',
    accessModel: 'Airside at Munich Airport T1 and T2. No immigration clearance required. Available by the hour via self-service booking.',
    sleepFormat: 'Fully enclosed lockable cabin with blackout conditions and noise reduction. Flat sleeping surface. Closer to a private room than a typical pod.',
    downside: 'Limited airport coverage — most accessible for travelers routing through Munich.',
    metaDescription: 'Napcabs fully enclosed sleep pod cabins at Munich Airport T1 & T2 — lockable blackout capsules, hourly booking, no immigration needed for transit passengers.',
    intro: 'Napcabs offers fully enclosed private sleeping cabins at Munich Airport (MUC) and select international locations. Each cabin is lockable with blackout conditions and noise reduction, bookable by the hour. This guide covers Napcabs cabin locations, pricing, access rules, and transit passenger eligibility.',
    faqs: [
      {
        q: 'Are Napcabs pods fully enclosed?',
        a: 'Yes. Unlike open-visor sleep pods, Napcabs units are fully enclosed cabins with a lockable door. They provide complete privacy, blackout conditions, and significantly better noise reduction than most competing pod brands.',
      },
      {
        q: 'Where are Napcabs located at Munich Airport?',
        a: 'Napcabs operates in both Terminal 1 and Terminal 2 at Munich Airport (MUC), both airside within the secure international departures zone. Transit passengers can access them without clearing immigration.',
      },
      {
        q: 'Can you sleep overnight at Napcabs?',
        a: 'Yes. Napcabs cabins support overnight stays through consecutive hourly bookings. The fully enclosed, blackout design makes them particularly well suited to longer rest periods compared to open pod formats.',
      },
      {
        q: 'How much does Napcabs cost?',
        a: 'Napcabs charges by the hour with a minimum booking window. Rates vary by location and time of day. The enclosed cabin format typically prices slightly above open pod brands but below transit hotel rates.',
      },
      {
        q: 'Do you need a visa to use Napcabs at Munich Airport?',
        a: 'No visa is needed to access Napcabs at Munich Airport, provided you remain in the airside zone. Both Napcabs Terminal 1 and Terminal 2 locations are within the international departures area and do not require clearing German immigration.',
      },
      {
        q: 'Does Napcabs have shower facilities?',
        a: 'Shower facilities are not typically included within the Napcabs cabin itself. Some airport locations may have adjacent shower facilities available for a separate fee — check the specific airport listing for details.',
      },
    ],
    closingParagraph: 'For travelers who need genuine privacy rather than partial screening, Napcabs sets a high standard for enclosed sleep pod accommodation in airports. With fully lockable blackout cabins at Munich Airport and select other locations, it is the preferred option for light sleepers, overnight layovers, and anyone routing through MUC who needs real rest without the cost of a full transit hotel. Compare all sleep pod brands on RestInAirport, or browse transit hotels and airport lounges for different rest formats.',
  },
  'plaza-premium': {
    overview: 'Plaza Premium is a globally recognised independent lounge brand offering premium airport lounge access to any traveler, regardless of airline or frequent flyer status. Lounges provide food, beverages, showers, Wi-Fi, and comfortable seating in an environment that typically surpasses standard airline lounges. The brand operates extensively across Asia-Pacific, the Middle East, and Europe, making it one of the most widely accessible premium lounge networks in the world.',
    coverage: 'Plaza Premium operates at over 100 locations worldwide, with major concentrations in Asia including Hong Kong (HKG), Kuala Lumpur (KUL), Singapore (SIN), and Beijing (PEK). The brand also maintains strong coverage in the Middle East and has expanded into European and North American airports. Many locations are airside, accessible after passport control without leaving the terminal.',
    verdict: 'Plaza Premium is the best lounge option for travelers without airline lounge access who still want a quiet, comfortable environment with food and showers during a long wait.',
    bestFor: 'Frequent flyers without airline lounge access, long layovers, travelers wanting food and shower facilities',
    notIdealFor: 'Very short connections where the entry fee may not represent value',
    accessModel: 'Open to all passengers — no airline or loyalty program membership required. Paid per visit, or via compatible credit cards and travel programs.',
    sleepFormat: 'Lounge seating with dedicated rest zones at select locations. Not a sleep pod or hotel — designed for comfort and amenities rather than full sleep.',
    downside: 'Entry fees vary significantly by location and can be expensive at peak times, particularly for walk-in access.',
    metaDescription: 'Plaza Premium independent airport lounges at 100+ airports across Asia, the Middle East & Europe — open to all passengers, food, showers, and Wi-Fi included.',
    intro: 'Plaza Premium operates independent airport lounges at over 100 airports across Asia-Pacific, the Middle East, and Europe. Lounge access is open to any passenger regardless of airline or frequent flyer status, with food, showers, and Wi-Fi included. This guide covers Plaza Premium lounge locations, entry pricing, access rules, and transit passenger eligibility.',
    faqs: [
      {
        q: 'Can anyone use Plaza Premium Lounge?',
        a: 'Yes. Plaza Premium lounges are open to any passenger regardless of airline, ticket class, or frequent flyer status. Access is available through a paid visit fee, or via compatible credit cards and travel memberships.',
      },
      {
        q: 'Does Plaza Premium have shower facilities?',
        a: 'Yes. Most Plaza Premium lounge locations include shower facilities accessible to lounge guests. Shower access is typically included in the lounge entry fee, though availability may be limited at peak times.',
      },
      {
        q: 'How long can you stay in Plaza Premium Lounge?',
        a: 'Most Plaza Premium lounge visits include a standard time allocation, typically 2–3 hours depending on location. Extended stays are available at some locations for an additional fee.',
      },
      {
        q: 'Can transit passengers use Plaza Premium without a visa?',
        a: 'In most cases, yes. Plaza Premium lounges at major hub airports are located airside within the international departures zone. Transit passengers can access them without clearing immigration for the transit country.',
      },
      {
        q: 'Which credit cards give free Plaza Premium access?',
        a: 'Several premium credit cards provide complimentary Plaza Premium access, particularly cards issued in Asia-Pacific and the Middle East. Check your card benefits before purchasing a walk-in pass, as complimentary access may be available.',
      },
      {
        q: 'How does Plaza Premium compare to airline lounges?',
        a: 'Plaza Premium lounges are generally comparable to or better than standard airline business class lounges in terms of food quality, facilities, and comfort. They are particularly strong in Asia and the Middle East where the brand has its highest concentration of premium properties.',
      },
    ],
    closingParagraph: 'Plaza Premium stands out as one of the few global lounge networks genuinely open to all travelers, regardless of how they booked their flight. With over 100 locations across Asia-Pacific, the Middle East, and Europe, it is a practical option for any long layover where a proper meal, shower, and quiet seating area would make a real difference. Browse all airport lounge options on RestInAirport, or compare transit hotels and sleep pods for rest-focused alternatives at the airports you transit through.',
  },
  'minute-suites': {
    overview: 'Minute Suites is a US-based private day suite concept operating inside major American airport terminals. Fully enclosed private rooms are available by the hour, with each suite including a daybed sofa that converts for sleeping, a work desk, TV, and Wi-Fi. Optional shower access is available at select locations. The brand bridges the gap between sleep pods and transit hotels, offering full privacy at a mid-market price point without the commitment of a full hotel booking.',
    coverage: 'Minute Suites operates at US airport hubs including Hartsfield-Jackson Atlanta (ATL), Philadelphia (PHL), Dallas Fort Worth (DFW), Charlotte Douglas (CLT), and select other locations. All sites are positioned airside within the terminal, allowing seamless access between connections without clearing security.',
    verdict: 'Minute Suites is the best private rest option available inside US airports, offering a level of privacy and comfort that no pod brand matches in the domestic market.',
    bestFor: 'Business travelers, families with young children, anyone needing a private space for calls or rest during a US layover',
    notIdealFor: 'International travelers outside the served US airports',
    accessModel: 'Airside at all US locations — no security re-clearance needed. Book by the hour via the front desk or online.',
    sleepFormat: 'Fully enclosed private suite with a daybed sofa, work desk, TV, and Wi-Fi. Optional shower at select airports. Suitable for sleep, work, or private calls.',
    downside: 'Coverage is limited to a handful of US airports, making it unavailable for most international routing.',
    metaDescription: 'Minute Suites private hourly rest suites at Atlanta, Philadelphia, Dallas Fort Worth & Charlotte Douglas airports — enclosed rooms with daybeds, desks, and optional showers.',
    intro: 'Minute Suites operates private hourly rest suites at major US airport hubs including Atlanta Hartsfield-Jackson, Philadelphia, Dallas Fort Worth, and Charlotte Douglas. Each suite is fully enclosed with a daybed, workspace, and TV — ideal for business travelers and families on domestic layovers. This guide covers Minute Suites locations, pricing, access rules, and what to expect.',
    faqs: [
      {
        q: 'What is included in a Minute Suites room?',
        a: 'Each Minute Suites room includes a daybed sofa that converts flat for sleeping, a work desk, television, and Wi-Fi. Shower access is available at select Minute Suites locations for an additional fee.',
      },
      {
        q: 'Can you sleep overnight at Minute Suites?',
        a: 'Yes. Minute Suites can be booked by the hour for as long as needed, making overnight stays possible. The fully enclosed, quiet space makes extended rest practical compared to open pod alternatives.',
      },
      {
        q: 'Are Minute Suites airside?',
        a: 'Yes. All Minute Suites locations are positioned airside within the terminal, so you do not need to clear security again to access them during a layover.',
      },
      {
        q: 'How much does Minute Suites cost?',
        a: 'Minute Suites is priced by the hour. Rates vary by airport and time of day. The hourly model means you only pay for the time you need, with no minimum stay commitment beyond the first hour.',
      },
      {
        q: 'Which US airports have Minute Suites?',
        a: 'Minute Suites currently operates at Atlanta Hartsfield-Jackson (ATL), Philadelphia (PHL), Dallas Fort Worth (DFW), Charlotte Douglas (CLT), and select additional US airport locations.',
      },
      {
        q: 'Is Minute Suites suitable for business calls?',
        a: 'Yes. The fully enclosed private suite with a desk, TV screen, and Wi-Fi makes it an effective workspace option during layovers, in addition to a rest space. Many business travelers use Minute Suites specifically for privacy during calls.',
      },
    ],
    closingParagraph: 'For travelers in the US domestic network, Minute Suites is the standout private rest option — fully enclosed, hourly-priced, and positioned airside at key hub airports. Whether you need a few hours of sleep before a red-eye, a quiet room for a conference call, or a private space to work through a long layover, Minute Suites delivers a level of privacy that no pod brand in the US market currently matches. Browse all transit hotel options on RestInAirport, or explore sleep pods and airport lounges for alternative rest formats.',
  },
  'miracle': {
    overview: 'Miracle is an independent airport lounge brand operating multiple tiers of lounge at Bangkok Suvarnabhumi Airport (BKK). Lounge tiers range from Business Class to First Class, with each level offering food, beverages, shower facilities, and rest areas. Miracle is one of the most prominent independent lounge operators in Southeast Asia, accessible to any passenger with paid entry or compatible access credentials, independent of airline or loyalty program.',
    coverage: 'Miracle operates exclusively at Suvarnabhumi Airport (BKK) in Bangkok, Thailand. While geographically concentrated, Bangkok is one of the world\'s busiest international transit hubs, serving tens of millions of passengers annually. Multiple lounge locations across the terminal give Miracle strong internal coverage for passengers transiting through BKK.',
    verdict: 'For travelers transiting through Bangkok Suvarnabhumi, Miracle lounges represent one of the best independent lounge options available, particularly for those without airline-specific access.',
    bestFor: 'Passengers transiting through Bangkok, travelers wanting a premium break at BKK without airline lounge access',
    notIdealFor: 'Travelers routing through airports other than Bangkok Suvarnabhumi',
    accessModel: 'Open to all passengers at Bangkok Suvarnabhumi — paid per visit, with tiered pricing by lounge class. Airside, no visa required for transit.',
    sleepFormat: 'Lounge seating with dedicated rest zones. Food, beverages, and showers included by tier. Not a pod or hotel — designed for comfort and relaxation.',
    downside: 'The brand has no presence outside BKK, limiting its appeal to Bangkok transit passengers only.',
    metaDescription: 'Miracle Lounge at Bangkok Suvarnabhumi Airport (BKK) — multiple lounge tiers open to all passengers, food, showers, and rest areas, no airline membership required.',
    intro: 'Miracle is an independent airport lounge brand operating Business Class and First Class lounge tiers at Bangkok Suvarnabhumi Airport (BKK). Access is open to any passenger via paid entry, with food, beverages, showers, and rest areas included. This guide covers Miracle lounge tiers, pricing, access rules, and transit passenger eligibility at BKK.',
    faqs: [
      {
        q: 'What lounge tiers does Miracle offer at Bangkok Airport?',
        a: 'Miracle operates multiple lounge tiers at Bangkok Suvarnabhumi (BKK), including Business Class and First Class levels. Each tier offers progressively higher quality food, seating comfort, and service standards.',
      },
      {
        q: 'Can transit passengers use Miracle Lounge without a Thai visa?',
        a: 'Yes. Miracle lounges at Bangkok Suvarnabhumi are located airside within the international departures area. Transit passengers do not need a Thai visa to access them if they remain in the transit zone.',
      },
      {
        q: 'Does Miracle Lounge have showers?',
        a: 'Yes. Shower facilities are available at Miracle lounge locations, typically included in the entry fee for higher-tier lounges. Availability may vary at peak times.',
      },
      {
        q: 'How much does Miracle Lounge cost?',
        a: 'Entry fees vary by lounge tier and are priced per visit. The Business Class tier is more affordable, while the First Class tier commands a premium. Check current pricing at the lounge directly or via lounge booking platforms.',
      },
      {
        q: 'Is there food included at Miracle Lounge?',
        a: 'Yes. Food and beverages are included in the Miracle lounge entry fee. Higher-tier lounges typically offer a broader menu with hot dishes, snacks, and a wider drinks selection.',
      },
      {
        q: 'Is Miracle Lounge available at other airports?',
        a: 'No. Miracle operates exclusively at Bangkok Suvarnabhumi Airport (BKK). Travelers transiting through other airports will need to look at alternative independent lounge brands.',
      },
    ],
    closingParagraph: 'Bangkok Suvarnabhumi is one of Asia\'s most important transit hubs, and Miracle Lounge fills a genuine gap for passengers who need a proper rest or meal during a layover without airline lounge credentials. With multiple tiers catering to different budgets and preferences, it is the strongest independent lounge option at BKK. Browse all airport lounge options on RestInAirport, or explore sleep pods and transit hotels for passengers on longer layovers who need more than lounge access.',
  },
  'izzleep': {
    overview: 'izZzleep is a contemporary airport sleep pod brand offering enclosed private capsules designed for quality rest during layovers. Each pod is fully enclosed with controlled lighting, climate settings, and secure luggage storage. The brand positions itself as a mid-market option between open-visor pods and full transit hotels, aiming to deliver genuine sleep quality in a compact self-service format that is more private than most competitors.',
    coverage: 'izZzleep currently operates at a select number of international airports. The brand is in a growth phase, targeting key transit corridors in Europe and Asia. Exact airport availability should be verified directly as coverage continues to expand.',
    verdict: 'izZzleep suits travelers who want enclosed privacy and genuine sleep quality without the cost of a full transit hotel room.',
    bestFor: 'Travelers wanting a private pod with real sleep quality, medium to long layovers',
    notIdealFor: 'Those needing shower access or a full hotel check-in experience',
    accessModel: 'Airside at all operated locations. Self-service booking by the hour — no front desk check-in needed at most sites.',
    sleepFormat: 'Fully enclosed private capsule with climate control, adjustable lighting, and secure luggage storage. Flat sleep surface. Significantly more private than open-visor pod designs.',
    downside: 'Coverage is limited and still expanding; availability at your specific airport should be checked in advance.',
    metaDescription: 'izZzleep enclosed private sleep pod capsules at select international airports — climate-controlled, fully private, hourly booking for transit passengers.',
    intro: 'izZzleep operates fully enclosed sleep pod capsules at select international airports in Europe and Asia. Each pod includes climate control, lighting, and secure storage, available by the hour. This guide covers izZzleep pod locations, pricing, access rules, and transit passenger eligibility.',
    faqs: [
      {
        q: 'Are izZzleep pods fully enclosed?',
        a: 'Yes. izZzleep pods are fully enclosed private capsules, unlike open-visor pod designs. This provides complete privacy, better noise reduction, and effective light blocking during rest.',
      },
      {
        q: 'How does izZzleep compare to GoSleep?',
        a: 'izZzleep provides full enclosure and greater privacy than GoSleep, which uses a visor-based design. GoSleep is typically more widely deployed and easier to find; izZzleep offers a higher-quality sleep environment at airports where it is available.',
      },
      {
        q: 'Can you stay overnight in an izZzleep pod?',
        a: 'Yes. izZzleep pods can be booked for extended periods. The fully enclosed design makes them more suitable for overnight stays than open pod formats.',
      },
      {
        q: 'Are izZzleep pods airside?',
        a: 'Yes. izZzleep installations are located in airside terminal areas, meaning transit passengers can access them without clearing immigration or customs at the airports where the brand operates.',
      },
      {
        q: 'How much does izZzleep cost?',
        a: 'izZzleep pods are priced by the hour with rates varying by airport. Pricing is generally positioned between open visor pods and full transit hotel rooms.',
      },
      {
        q: 'Where can I find izZzleep pods?',
        a: 'izZzleep operates at a select number of international airports in Europe and Asia. As the brand is in an active expansion phase, check the latest airport listings on RestInAirport for current availability at your specific airport.',
      },
    ],
    closingParagraph: 'For travelers who want more privacy than a standard sleep pod without paying transit hotel prices, izZzleep offers a strong middle-ground solution. Fully enclosed capsules with climate control and luggage storage deliver genuine rest quality in a compact format. As the brand continues expanding across European and Asian airports, it is worth checking for availability on your specific routing. Compare all sleep pod brands on RestInAirport, or browse transit hotels and airport lounges for alternative formats.',
  },
  'encalm': {
    overview: 'Encalm is an Indian airport hospitality brand offering a full spectrum of services — premium lounges, sleep pods, and transit hotel rooms — under one roof. The brand stands out for consolidating multiple service tiers within a single airport facility, giving travelers flexible rest and dining options at Indian international airports without needing to navigate separate operators.',
    coverage: 'Encalm operates at major Indian international airports including Delhi Indira Gandhi International Airport (DEL). The brand serves the large volume of international transit passengers passing through Indian hub airports, with facilities covering both pre-departure and transit passenger needs.',
    verdict: 'Encalm is the strongest all-in-one rest option for travelers transiting through Indian international airports, offering more flexibility than single-category brands.',
    bestFor: 'Passengers transiting through India, travelers wanting lounge or hotel access at Indian hub airports',
    notIdealFor: 'Travelers not routing through India or expecting global multi-airport coverage',
    accessModel: 'Open to all passengers at Delhi Airport. Airside access available for transit passengers. Tiered pricing by service level — lounge, pod, or hotel room.',
    sleepFormat: 'Multi-tier: lounge seating for short waits, sleep pods for rest, and full transit hotel rooms for longer stays. Choose the tier that matches your layover length.',
    downside: 'Coverage is concentrated in India, limiting utility for travelers on routes that do not pass through Indian airports.',
    metaDescription: 'Encalm airport hospitality at Delhi Indira Gandhi Airport — lounges, sleep pods, and transit hotel rooms in one facility, open to all passengers.',
    intro: 'Encalm operates a mixed-category airport hospitality facility at Delhi Indira Gandhi International Airport (DEL), combining lounge access, sleep pods, and transit hotel rooms under one brand. Travelers can choose the service tier that fits their layover length and budget. This guide covers Encalm locations, service tiers, pricing, and transit passenger eligibility.',
    faqs: [
      {
        q: 'What services does Encalm offer?',
        a: 'Encalm offers a full range of airport hospitality services including premium lounge access, sleep pods, and private transit hotel rooms. Travelers can choose the tier that matches their layover length and budget.',
      },
      {
        q: 'Is Encalm available at Delhi Airport?',
        a: 'Yes. Encalm operates at Delhi Indira Gandhi International Airport (DEL), one of India\'s busiest international hubs.',
      },
      {
        q: 'Can transit passengers use Encalm without clearing Indian immigration?',
        a: 'Encalm\'s airside facilities can generally be accessed without clearing Indian immigration for transit passengers. Verify the specific access requirements for your terminal before travel.',
      },
      {
        q: 'Does Encalm have shower access?',
        a: 'Yes. Shower facilities are available at Encalm depending on the service tier selected. Transit hotel rooms include private bathrooms, and lounge access typically includes shower facilities.',
      },
      {
        q: 'How does Encalm pricing work?',
        a: 'Encalm pricing varies by service tier — lounge access, sleep pods, and hotel rooms are priced separately. This allows travelers to select only the services they need for their layover length.',
      },
      {
        q: 'Is Encalm available at other Indian airports?',
        a: 'Encalm\'s primary presence is at Delhi (DEL). Coverage at other Indian airports is developing — check the latest listings on RestInAirport for current availability.',
      },
    ],
    closingParagraph: 'Encalm fills an important gap in the Indian airport market by offering multiple rest options under one brand — from a quick lounge visit to a full transit hotel room. For passengers transiting through Delhi Indira Gandhi Airport, it provides flexibility that is hard to find at most airports globally. Browse all transit hotel and sleep pod options on RestInAirport, or explore airport lounges for lighter rest alternatives on your routing.',
  },
  'zzzleepandgo': {
    overview: 'ZZZleepandGo is an Italian airport sleep pod brand operating self-service rest capsules inside Italian airport terminals. The pods are designed for quick, affordable rest during short layovers — a semi-enclosed format that is available by the hour without a booking requirement. The brand is part of the growing European wave of self-service pod concepts positioned as a practical alternative to sitting in the departures hall.',
    coverage: 'ZZZleepandGo operates at Italian airports, with a focus on key Italian hubs. The brand serves domestic and international passengers transiting through Italy who need a short rest without the cost or commitment of a full transit hotel.',
    verdict: 'ZZZleepandGo is a practical option for short layovers at Italian airports where a proper rest room is not available or is too expensive.',
    bestFor: 'Short layovers at Italian airports, budget travelers, passengers wanting a quick rest without booking',
    notIdealFor: 'Travelers expecting full enclosure, shower access, or hotel-level comfort',
    accessModel: 'Self-service, walk-in access. No booking required. Hourly payment at the pod terminal.',
    sleepFormat: 'Semi-enclosed pod design with a reclining seat. Limited noise reduction. Suitable for short rest periods of 1–3 hours.',
    downside: 'Coverage is limited to Italian airports, and the semi-enclosed design provides less privacy than fully enclosed pod brands.',
    metaDescription: 'ZZZleepandGo self-service sleep pods at Italian airports — hourly rest capsules, no booking required, suitable for short layovers in Italy.',
    intro: 'ZZZleepandGo operates self-service sleep pod capsules at Italian airport terminals. Pods are available by the hour with no booking requirement, designed for short layover rest. This guide covers ZZZleepandGo locations, pricing, and access rules.',
    faqs: [
      {
        q: 'Where can I find ZZZleepandGo pods?',
        a: 'ZZZleepandGo operates at Italian airports. Check the facility listings on RestInAirport for the specific terminals and airports where pods are currently available.',
      },
      {
        q: 'Do ZZZleepandGo pods require a booking?',
        a: 'No. ZZZleepandGo pods operate on a self-service, walk-in basis. You pay at the pod terminal for the hours you need with no advance reservation required.',
      },
      {
        q: 'Are ZZZleepandGo pods fully enclosed?',
        a: 'ZZZleepandGo pods use a semi-enclosed design. They provide more privacy than an open airport seat but are not fully enclosed like Napcabs or izZzleep capsules.',
      },
      {
        q: 'How much do ZZZleepandGo pods cost?',
        a: 'ZZZleepandGo charges by the hour. Rates are displayed at the pod terminal before payment. Pricing is typically comparable to or lower than fully enclosed pod brands.',
      },
    ],
    closingParagraph: 'ZZZleepandGo provides a simple, accessible rest option for travelers passing through Italian airports on short layovers. While the semi-enclosed design has its limitations, the no-booking, hourly model makes it one of the quickest ways to get a rest break inside an Italian terminal. Compare all sleep pod brands on RestInAirport, or browse transit hotels for a more private and amenity-rich experience.',
  },
  'kepler-club': {
    overview: 'Kepler Club is a premium independent airport lounge brand offering high-quality lounge access at select international airports. The brand positions itself in the upper tier of independent lounges, with a focus on food quality, comfort, and a calm environment. Kepler Club is open to all passengers regardless of airline or ticket class, with paid access per visit.',
    coverage: 'Kepler Club operates at a select number of international airports. The brand targets premium positioning at airports where travelers are willing to pay for a higher standard of independent lounge than standard options provide.',
    verdict: 'Kepler Club is a strong choice for passengers seeking premium lounge facilities without relying on airline status or business class tickets.',
    bestFor: 'Travelers wanting a premium independent lounge experience, long layovers, passengers without airline lounge access',
    notIdealFor: 'Budget travelers — Kepler Club is priced at the premium end of the independent lounge market',
    accessModel: 'Open to all passengers — paid per visit. No airline or loyalty program required. Airside at served airports.',
    sleepFormat: 'Premium lounge seating with comfortable rest zones. Not a sleep pod or hotel — designed for elevated lounge comfort with quality food and amenities.',
    metaDescription: 'Kepler Club premium airport lounge at select international airports — open to all passengers, high-quality food and amenities, paid per visit.',
    intro: 'Kepler Club operates premium independent airport lounges at select international airports. The brand is open to any passenger via paid entry, with a focus on food quality, comfortable seating, and a calm environment. This guide covers Kepler Club locations, pricing, and access rules.',
    faqs: [
      {
        q: 'Is Kepler Club open to all passengers?',
        a: 'Yes. Kepler Club is open to any passenger regardless of airline, ticket class, or loyalty status. Access is available through a paid visit fee.',
      },
      {
        q: 'What makes Kepler Club different from standard airport lounges?',
        a: 'Kepler Club focuses on a premium food and comfort experience above what standard independent lounges offer. The brand targets travelers who want a noticeably higher quality environment for their layover.',
      },
      {
        q: 'Are Kepler Club lounges airside?',
        a: 'Yes. Kepler Club lounges are located airside at the airports they serve, so transit passengers can access them without clearing immigration.',
      },
      {
        q: 'How much does Kepler Club cost?',
        a: 'Kepler Club is priced per visit at the premium end of the independent lounge market. Rates vary by location — check the specific lounge listing for current pricing.',
      },
    ],
    closingParagraph: 'For travelers who want a premium lounge experience without relying on airline status, Kepler Club offers a strong alternative to standard independent lounges. Browse all airport lounge options on RestInAirport, or compare transit hotels and sleep pods for rest-focused layover solutions.',
  },
  'wait-n-rest': {
    overview: "Wait N' Rest is an airport sleep pod brand providing self-service rest capsules at select airports. The brand offers an affordable, accessible alternative to transit hotels for passengers who need a short rest during a layover. Pods are available by the hour with straightforward self-service access.",
    coverage: "Wait N' Rest operates at a select number of airports. The brand focuses on providing accessible rest options at airports where dedicated sleep facilities are limited.",
    verdict: "Wait N' Rest is a practical option for budget-conscious travelers who need a short rest and are transiting through an airport where the brand operates.",
    bestFor: 'Budget travelers, short layovers, passengers wanting accessible rest without hotel pricing',
    notIdealFor: 'Travelers needing full privacy, showers, or hotel amenities',
    accessModel: 'Self-service, walk-in. No advance booking required at most locations. Hourly rate paid at the terminal.',
    sleepFormat: 'Sleep pod format with basic rest facilities. Suitable for short layover rest of 1–4 hours.',
    metaDescription: "Wait N' Rest airport sleep pods at select airports — self-service hourly rest capsules for budget travelers on short layovers.",
    intro: "Wait N' Rest operates self-service sleep pods at select airports, providing affordable hourly rest for transit passengers. This guide covers Wait N' Rest locations, pricing, and access rules.",
    faqs: [
      {
        q: "Where does Wait N' Rest operate?",
        a: "Wait N' Rest operates at a select number of airports. Check the facility listings on RestInAirport for current terminal and airport availability.",
      },
      {
        q: "How much does Wait N' Rest cost?",
        a: "Wait N' Rest is priced by the hour. Rates vary by airport and are displayed at the pod terminal before payment.",
      },
      {
        q: "Are Wait N' Rest pods airside?",
        a: "Verify the specific location for your airport — most Wait N' Rest installations are positioned in the airside terminal area for transit passenger access.",
      },
    ],
    closingParagraph: "Wait N' Rest provides a straightforward rest option for travelers on short layovers who want affordable pod access. Browse all sleep pod options on RestInAirport to compare with other available brands at your airport.",
  },
  'sh-premium-lounge': {
    overview: 'SH Premium Lounge is an independent airport lounge brand offering paid lounge access at select airports. The lounge provides a comfortable alternative to the general departures hall, with food, beverages, and Wi-Fi included in the visit price. Access is open to all passengers regardless of airline or class of travel.',
    coverage: 'SH Premium Lounge operates at a select number of international airports. The brand focuses on providing accessible premium lounge amenities at airports where independent lounge options are limited.',
    verdict: 'SH Premium Lounge is a solid option for travelers at its served airports who want a comfortable, food-inclusive lounge environment without airline lounge access.',
    bestFor: 'Passengers without airline lounge access, travelers wanting a comfortable waiting area with food included',
    notIdealFor: 'Travelers at airports where SH Premium Lounge does not operate',
    accessModel: 'Open to all passengers — paid per visit. No airline status required. Airside at served locations.',
    sleepFormat: 'Lounge seating with rest areas. Food, beverages, and Wi-Fi included in the visit price.',
    metaDescription: 'SH Premium Lounge independent airport lounge at select airports — open to all passengers, food and Wi-Fi included, paid per visit.',
    intro: 'SH Premium Lounge operates independent airport lounges at select airports, open to all passengers via a paid visit fee. This guide covers SH Premium Lounge locations, amenities, and access rules.',
    faqs: [
      {
        q: 'Who can access SH Premium Lounge?',
        a: 'Any passenger can access SH Premium Lounge by paying the visit fee. No airline membership, loyalty points, or premium ticket is required.',
      },
      {
        q: 'What is included in SH Premium Lounge access?',
        a: 'SH Premium Lounge access typically includes food, beverages, Wi-Fi, and comfortable seating. Check the specific airport listing for full amenity details.',
      },
      {
        q: 'Are SH Premium Lounge locations airside?',
        a: 'Yes. SH Premium Lounge locations are positioned airside at the airports they serve, accessible without clearing immigration for transit passengers.',
      },
    ],
    closingParagraph: 'SH Premium Lounge provides a comfortable lounge option for passengers at its served airports who want food and amenities during a layover. Browse all airport lounge options on RestInAirport to compare with other independent lounges on your route.',
  },
  'skyhub-lounge': {
    overview: 'Skyhub Lounge is an independent airport lounge offering paid access to travelers at select airports. The lounge provides a comfortable rest and dining environment for passengers who want an alternative to the general departures hall. Access is open to all passengers with a visit fee.',
    coverage: 'Skyhub Lounge operates at select airports, targeting travelers who need a comfortable paid lounge option. The brand provides independent lounge access at locations where dedicated rest facilities are otherwise limited.',
    verdict: 'Skyhub Lounge is a practical choice for travelers at its served airports who want a comfortable, food-inclusive lounge without requiring airline or status access.',
    bestFor: 'Passengers without airline lounge access, layovers requiring food and comfortable seating',
    notIdealFor: 'Travelers at airports where Skyhub Lounge does not operate',
    accessModel: 'Open to all passengers — paid per visit. Airside at served locations.',
    sleepFormat: 'Lounge seating and rest areas. Food, beverages, and Wi-Fi included in the standard visit.',
    metaDescription: 'Skyhub Lounge independent airport lounge at select airports — open to all passengers, food and Wi-Fi included, paid per visit.',
    intro: 'Skyhub Lounge operates independent airport lounges at select airports, open to all passengers via paid entry. This guide covers Skyhub Lounge locations, amenities, and access rules.',
    faqs: [
      {
        q: 'Who can access Skyhub Lounge?',
        a: 'Any passenger can access Skyhub Lounge by paying the visit fee — no airline membership or frequent flyer status required.',
      },
      {
        q: 'What does Skyhub Lounge include?',
        a: 'Skyhub Lounge typically includes food, beverages, Wi-Fi, and comfortable seating in a quiet lounge environment. Check the specific airport listing for full details.',
      },
      {
        q: 'Are Skyhub Lounge locations airside?',
        a: 'Yes. Skyhub Lounge locations are positioned airside at the airports they serve, accessible without clearing immigration for transit passengers.',
      },
    ],
    closingParagraph: 'Skyhub Lounge offers a straightforward lounge option for travelers who need food, Wi-Fi, and comfortable seating during a layover. Browse all airport lounge options on RestInAirport to compare independent lounge choices across your route.',
  },
  'sleepover': {
    overview: 'Sleepover is an airport sleep pod brand providing self-service rest capsules at select international airports. Pods are available by the hour with a walk-in model — no advance booking needed. The brand provides an affordable alternative to transit hotels for passengers on short to medium layovers.',
    coverage: 'Sleepover operates at select international airports. The brand targets airports where dedicated sleep pod options are limited, filling a gap for travelers who need affordable hourly rest.',
    verdict: 'Sleepover is a useful option for budget-conscious travelers on short layovers at the airports where it operates, providing basic pod rest without hotel-level costs.',
    bestFor: 'Short to medium layovers, budget travelers, passengers wanting walk-in pod access',
    notIdealFor: 'Travelers needing full privacy, shower access, or extended overnight stays',
    accessModel: 'Self-service walk-in. No advance booking required. Hourly rate paid at the terminal.',
    sleepFormat: 'Sleep pod format with reclining or flat sleep surface. Basic privacy screening. Suitable for short rest of 1–4 hours.',
    metaDescription: 'Sleepover airport sleep pods at select international airports — self-service hourly rest capsules for transit passengers, no booking required.',
    intro: 'Sleepover operates self-service sleep pod capsules at select international airports, available by the hour with walk-in access. This guide covers Sleepover pod locations, pricing, and access rules.',
    faqs: [
      {
        q: 'Where does Sleepover operate?',
        a: 'Sleepover operates at select international airports. Check the facility listings on RestInAirport for current airport and terminal availability.',
      },
      {
        q: 'Do Sleepover pods require a booking?',
        a: 'No. Sleepover pods operate on a walk-in, self-service basis. Pay at the pod terminal for the hours you need.',
      },
      {
        q: 'Are Sleepover pods airside?',
        a: 'Sleepover pods are located in airside terminal areas at the airports they serve, so transit passengers can access them without clearing immigration.',
      },
      {
        q: 'How much does Sleepover cost?',
        a: 'Sleepover is priced by the hour with rates displayed at the pod terminal before payment. Pricing varies by airport.',
      },
    ],
    closingParagraph: 'Sleepover provides a simple, accessible rest option for transit passengers on short layovers. Browse all sleep pod brands on RestInAirport to compare options, or explore transit hotels if you need more privacy and amenities for a longer stay.',
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

export const BRAND_NAME_MAP: Record<string, string> = {
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

export function getBrandData(brandSlug: string): BrandDescriptionData | null {
  return BRAND_DESCRIPTIONS[brandSlug] || null;
}

export function isThinContentBrand(brandSlug: string): boolean {
  const data = BRAND_DESCRIPTIONS[brandSlug];
  return !data || (data.thinContent === true);
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
  return `${brandName} ${typeLabel} at ${airportCount} ${airportCount === 1 ? 'airport' : 'airports'}${regionText} — locations, pricing, and transit passenger access rules.`;
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

  return `${brandName} operates as an airport ${typeLabel} available${regionText}. This guide covers locations, access rules, pricing, and transit passenger eligibility.`;
}

export function generateBrandFAQSchema(
  brandName: string,
  brandType: BrandType,
  airportCount: number,
  brandSlug: string
) {
  const content = BRAND_DESCRIPTIONS[brandSlug];
  const faqs = content?.faqs ?? getGenericBrandFAQs(brandName, brandType, airportCount);
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

function getGenericBrandFAQs(
  brandName: string,
  brandType: BrandType,
  airportCount: number
): Array<{ q: string; a: string }> {
  return [
    {
      q: `What is ${brandName}?`,
      a: `${brandName} is an airport ${brandType === 'Transit Hotel' ? 'transit hotel' : brandType === 'Sleep Pods' ? 'sleep pod brand' : 'lounge network'} operating at ${airportCount} ${airportCount === 1 ? 'airport' : 'airports'}. It provides travelers with dedicated rest facilities within airport terminal buildings.`,
    },
    {
      q: `Can you sleep overnight at ${brandName}?`,
      a: brandType === 'Transit Hotel'
        ? `Yes. ${brandName} operates as a transit hotel, offering private rooms with beds designed for overnight stays within the airport terminal. Rooms can typically be booked by the hour or for a full night.`
        : brandType === 'Sleep Pods'
        ? `Yes, most ${brandName} locations can be used for overnight rest. Sleep pod bookings are typically charged by the hour, so an overnight stay is possible by booking multiple consecutive hours.`
        : `${brandName} lounges are generally designed for short to medium stays. Check the specific lounge location for overnight policies.`,
    },
    {
      q: `Is ${brandName} airside?`,
      a: `${brandName} operates primarily in airside terminal areas at the airports it serves, meaning you typically do not need to exit passport control to access the facilities. Always verify the specific terminal when booking.`,
    },
    {
      q: `How much does ${brandName} cost?`,
      a: brandType === 'Transit Hotel'
        ? `${brandName} charges by the hour, with minimum booking windows typically starting at 3–6 hours. Pricing varies by airport and room type. Full overnight rates are also available.`
        : brandType === 'Sleep Pods'
        ? `${brandName} pods are generally priced by the hour, making them a cost-effective option compared to transit hotels. Rates vary by airport.`
        : `${brandName} lounge access is typically priced per visit with a time-limited stay. Some locations are accessible through certain credit card programs.`,
    },
    {
      q: `Can you use ${brandName} without a visa?`,
      a: `In most cases, no visa is required to use ${brandName} because facilities are located in the airside area of the terminal, before immigration and customs.`,
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

  const comparisonSlugs = (COMPARISON_BRANDS[brandSlug] || [])
    .filter(slug => allBrandSlugs.some(b => b.slug === slug))
    .slice(0, 5);

  const faqs = content?.faqs ?? getGenericBrandFAQs(brandName, brandType, airportCount);

  const overviewText = content?.overview ||
    `${brandName} is an airport ${brandType === 'Mixed' ? 'rest and hospitality' : brandType.toLowerCase()} brand operating at ${airportCount} ${airportCount === 1 ? 'airport' : 'airports'} worldwide. The brand provides travelers with dedicated rest facilities within airport terminal buildings.`;

  const coverageText = content?.coverage ||
    `${brandName} currently operates at ${airportCount} ${airportCount === 1 ? 'airport' : 'airports'} worldwide${region ? ` with a presence in ${region}` : ''}, with ${facilityCount} ${facilityCount === 1 ? 'facility' : 'facilities'} available to travelers.`;

  const verdictText = content?.verdict ||
    `${brandName} is a solid choice for travelers who need ${brandType === 'Transit Hotel' ? 'private accommodation during a layover' : brandType === 'Sleep Pods' ? 'affordable rest in a compact pod format' : 'lounge access and amenities during a wait'} at the airports where it operates.`;

  const closingParagraph = content?.closingParagraph ||
    `${brandName} provides a practical rest solution for transit passengers at the airports it serves. Browse all ${brandType === 'Transit Hotel' ? 'transit hotels' : brandType === 'Sleep Pods' ? 'sleep pods' : 'airport lounges'} on RestInAirport to compare options, or explore all rest categories to find the right solution for your layover.`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-14">

      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">What Is {brandName}?</h2>
        <p className="text-slate-600 leading-relaxed max-w-3xl">{overviewText}</p>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">{brandName} Coverage</h2>
        <p className="text-slate-600 leading-relaxed max-w-3xl">
          {coverageText}
          {airportCodes.length === 0 && ' Available in major international transit hubs — check individual listings for terminal details.'}
        </p>
      </section>

      {(content?.accessModel || content?.sleepFormat) && (
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">How {brandName} Works</h2>
          <div className="grid sm:grid-cols-2 gap-4 max-w-3xl">
            {content?.accessModel && (
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Access Model</p>
                <p className="text-slate-700 text-sm leading-relaxed">{content.accessModel}</p>
              </div>
            )}
            {content?.sleepFormat && (
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Sleep Format</p>
                <p className="text-slate-700 text-sm leading-relaxed">{content.sleepFormat}</p>
              </div>
            )}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Is {brandName} Worth It?</h2>
        <p className="text-slate-600 leading-relaxed max-w-3xl mb-5">{verdictText}</p>
        <div className="grid sm:grid-cols-2 gap-4 max-w-3xl">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">Best for</p>
            <p className="text-slate-700 text-sm leading-relaxed">{content?.bestFor || 'Travelers needing rest during layovers'}</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Not ideal for</p>
            <p className="text-slate-600 text-sm leading-relaxed">{content?.notIdealFor || 'Very short connections under 1–2 hours'}</p>
          </div>
        </div>
        {content?.downside && (
          <p className="text-sm text-slate-500 mt-4 max-w-3xl">
            <span className="font-medium text-slate-600">One downside:</span> {content.downside}
          </p>
        )}
      </section>

      {comparisonSlugs.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Compare {brandName} with Other Brands
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
        <div className="grid sm:grid-cols-2 gap-3 max-w-md">
          <a
            href="/sleep-pods"
            onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }}
            className="flex items-center px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            Sleep Pods
          </a>
          <a
            href="/private-rooms"
            onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }}
            className="flex items-center px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            Private Rooms
          </a>
          <a
            href="/transit-hotels"
            onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }}
            className="flex items-center px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            Transit Hotels
          </a>
          <a
            href="/lounge-sleep"
            onClick={(e) => { e.preventDefault(); navigateTo('/lounge-sleep'); }}
            className="flex items-center px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            Lounge Sleep
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

      <section className="border-t border-slate-100 pt-10">
        <div className="max-w-3xl">
          <p className="text-slate-600 leading-relaxed">
            {closingParagraph.split(/(\btransit hotels\b|\bsleep pods\b|\bairport lounges\b|\bairports\b)/gi).map((part, idx) => {
              const lower = part.toLowerCase();
              if (lower === 'transit hotels') {
                return <a key={idx} href="/transit-hotels" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-medium text-slate-800 underline underline-offset-2 hover:text-slate-600 transition-colors">transit hotels</a>;
              }
              if (lower === 'sleep pods') {
                return <a key={idx} href="/sleep-pods" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-medium text-slate-800 underline underline-offset-2 hover:text-slate-600 transition-colors">sleep pods</a>;
              }
              if (lower === 'airport lounges') {
                return <a key={idx} href="/lounge-sleep" onClick={(e) => { e.preventDefault(); navigateTo('/lounge-sleep'); }} className="font-medium text-slate-800 underline underline-offset-2 hover:text-slate-600 transition-colors">airport lounges</a>;
              }
              if (lower === 'airports') {
                return <a key={idx} href="/airports" onClick={(e) => { e.preventDefault(); navigateTo('/airports'); }} className="font-medium text-slate-800 underline underline-offset-2 hover:text-slate-600 transition-colors">airports</a>;
              }
              return part;
            })}
          </p>
        </div>
      </section>

    </div>
  );
}
