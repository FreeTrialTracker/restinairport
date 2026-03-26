import { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  Loader,
  Hotel,
  MapPin,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { AirportFacility } from '../lib/database.types';
import Header from './Header';
import Footer from './Footer';
import { navigateTo } from '../lib/navigation';
import { updatePageMeta } from '../lib/seo';
import {
  groupFacilitiesByBrand,
  getFacilitiesForBrandSlug,
  type NormalizedBrand,
  type BrandType,
} from '../lib/brandNormalization';
import { getBrandUrl } from '../lib/brandRoutes';
import BackNavigation from './BackNavigation';

interface BrandComparePageProps {
  compareSlug: string;
}

interface BrandData {
  brand: NormalizedBrand;
  facilities: AirportFacility[];
  airportCount: number;
  airportCodes: string[];
}

const TYPE_COLORS: Record<BrandType, string> = {
  'Transit Hotel': 'bg-sky-100 text-sky-800 border-sky-200',
  'Sleep Pods': 'bg-teal-100 text-teal-800 border-teal-200',
  'Lounge Network': 'bg-amber-100 text-amber-800 border-amber-200',
  'Mixed': 'bg-slate-100 text-slate-700 border-slate-200',
};

const AMENITIES: Record<BrandType, {
  privateRoom: boolean;
  bed: boolean;
  shower: boolean;
  hourly: boolean;
  airside: boolean;
  overnight: boolean;
}> = {
  'Transit Hotel': { privateRoom: true, bed: true, shower: true, hourly: true, airside: true, overnight: true },
  'Sleep Pods': { privateRoom: true, bed: true, shower: false, hourly: true, airside: true, overnight: false },
  'Lounge Network': { privateRoom: false, bed: false, shower: true, hourly: false, airside: true, overnight: false },
  'Mixed': { privateRoom: true, bed: true, shower: true, hourly: true, airside: true, overnight: true },
};

const TYPE_BEST_FOR: Record<BrandType, string> = {
  'Transit Hotel': 'travelers wanting a full private room with a proper bed and en-suite facilities',
  'Sleep Pods': 'passengers who need a few hours of sleep in a compact, enclosed space',
  'Lounge Network': 'travelers looking for a comfortable seat, shower, and food during a layover',
  'Mixed': 'a range of layover needs from lounge access to private rest rooms',
};

const TYPE_COMFORT: Record<BrandType, string> = {
  'Transit Hotel': 'hotel-grade comfort with a proper bed, desk, and private bathroom — comparable to a city hotel',
  'Sleep Pods': 'a compact pod or cabin with a flat or reclining bed, privacy screen, and personal controls',
  'Lounge Network': 'shared lounge seating with recliner chairs — comfortable for rest but not designed for sleep',
  'Mixed': 'a mix of pod-style and room-based options depending on the location',
};

const TYPE_PRICING: Record<BrandType, string> = {
  'Transit Hotel': 'hourly day-room rates that work out to $30–$80 for 3–4 hours, or full overnight rates',
  'Sleep Pods': 'flexible hourly rates typically starting around $15–$25 per hour with a minimum block',
  'Lounge Network': 'per-visit flat fees of $30–$60 or access through premium credit cards and lounge memberships',
  'Mixed': 'variable pricing across pods and room types, typically with hourly and session-based options',
};

const TYPE_PRIVACY_DETAIL: Record<BrandType, string> = {
  'Transit Hotel': 'fully private rooms with a lockable door, complete separation from the terminal',
  'Sleep Pods': 'enclosed individual pods with a sliding door or privacy blind — not fully soundproof but highly private',
  'Lounge Network': 'shared open-plan spaces with designated seating — minimal acoustic privacy',
  'Mixed': 'a combination of private rooms and semi-private pods depending on the specific location',
};

const TYPE_NOISE: Record<BrandType, string> = {
  'Transit Hotel': 'well-insulated rooms with minimal airport noise intrusion',
  'Sleep Pods': 'good noise reduction due to the enclosed pod design, though not fully silent',
  'Lounge Network': 'ambient lounge noise — conversations, announcements, and background music are common',
  'Mixed': 'noise levels vary by facility type, with rooms offering better isolation than lounge areas',
};

function buildShortAnswer(a: BrandData, b: BrandData): string {
  const typeA = a.brand.brandType;
  const typeB = b.brand.brandType;

  if (typeA === typeB) {
    return `${a.brand.name} and ${b.brand.name} are both ${typeA.toLowerCase()} operators, but they differ in airport coverage and regional presence. ${a.brand.name} operates across ${a.airportCount} airport${a.airportCount !== 1 ? 's' : ''}, while ${b.brand.name} covers ${b.airportCount}. If you need a ${a.brand.name} location on your route, check availability first — coverage is the deciding factor between these two comparable brands.`;
  }

  return `${a.brand.name} is a ${typeA.toLowerCase()} brand best for ${TYPE_BEST_FOR[typeA]}. ${b.brand.name} is a ${typeB.toLowerCase()} brand better suited to ${TYPE_BEST_FOR[typeB]}. Choose ${a.brand.name} for maximum privacy and a proper bed; go with ${b.brand.name} if you need a shorter rest or lounge-style comfort.`;
}

function buildKeyDifferences(a: BrandData, b: BrandData): string[] {
  const typeA = a.brand.brandType;
  const typeB = b.brand.brandType;

  const privacyA = AMENITIES[typeA].privateRoom ? 'fully private' : 'shared';
  const privacyB = AMENITIES[typeB].privateRoom ? 'fully private' : 'shared';

  const pricingA = TYPE_PRICING[typeA];
  const pricingB = TYPE_PRICING[typeB];

  const wider = a.airportCount >= b.airportCount ? a.brand.name : b.brand.name;
  const narrower = a.airportCount >= b.airportCount ? b.brand.name : a.brand.name;

  const diffs: string[] = [
    `Privacy: ${a.brand.name} offers ${privacyA} accommodations; ${b.brand.name} provides ${privacyB} spaces`,
    `Pricing: ${a.brand.name} uses ${pricingA}; ${b.brand.name} uses ${pricingB}`,
    `Coverage: ${wider} operates at more airports globally, making it easier to find in transit hubs`,
    `Sleeping: ${AMENITIES[typeA].bed ? a.brand.name + ' includes a flat bed' : a.brand.name + ' does not offer a standard bed'}; ${AMENITIES[typeB].bed ? b.brand.name + ' includes a flat bed' : b.brand.name + ' does not offer a standard bed'}`,
    `Shower access: ${AMENITIES[typeA].shower ? a.brand.name + ' includes shower facilities' : a.brand.name + ' does not typically include showers'}; ${AMENITIES[typeB].shower ? b.brand.name + ' includes shower facilities' : b.brand.name + ' does not typically include showers'}`,
    `Location: both operate primarily airside, so no transit visa is required for most locations`,
  ];

  if (narrower !== wider) {
    diffs.push(`Overnight stays: ${AMENITIES[typeA].overnight ? a.brand.name : b.brand.name} is more suited to overnight bookings`);
  }

  return diffs.slice(0, 6);
}

function buildComfortSection(a: BrandData, b: BrandData): string {
  const typeA = a.brand.brandType;
  const typeB = b.brand.brandType;
  return `When it comes to sleeping quality, ${a.brand.name} offers ${TYPE_COMFORT[typeA]}. ${b.brand.name} provides ${TYPE_COMFORT[typeB]}.

In terms of noise isolation, ${a.brand.name} facilities feature ${TYPE_NOISE[typeA]}, while ${b.brand.name} locations typically have ${TYPE_NOISE[typeB]}.

For personal space, ${a.brand.name} gives you ${TYPE_PRIVACY_DETAIL[typeA]}, while ${b.brand.name} provides ${TYPE_PRIVACY_DETAIL[typeB]}. For travelers prioritising undisturbed sleep on a long layover, ${AMENITIES[typeA].privateRoom ? a.brand.name : b.brand.name} has the stronger offering.`;
}

function buildPricingSection(a: BrandData, b: BrandData): string {
  const typeA = a.brand.brandType;
  const typeB = b.brand.brandType;

  const cheaperBrand = typeA === 'Sleep Pods' ? a.brand.name
    : typeB === 'Sleep Pods' ? b.brand.name
    : typeA === 'Lounge Network' ? a.brand.name
    : typeB === 'Lounge Network' ? b.brand.name
    : a.brand.name;

  const pricingA = TYPE_PRICING[typeA];
  const pricingB = TYPE_PRICING[typeB];

  return `${a.brand.name} typically charges ${pricingA}. ${b.brand.name} operates on ${pricingB}.

Both brands are designed for transit passengers, so pricing is generally structured around hours rather than full nights. ${cheaperBrand} tends to offer a lower entry price point, making it attractive for a short rest between flights. Longer stays often become more cost-effective when comparing the per-hour rate to a full session price. Always check the specific location for current pricing, as rates vary by airport and region.`;
}

function buildAvailabilitySection(a: BrandData, b: BrandData): string {
  const wider = a.airportCount >= b.airportCount ? a : b;
  const narrower = a.airportCount >= b.airportCount ? b : a;

  return `${wider.brand.name} has the broader global footprint with ${wider.airportCount} airport${wider.airportCount !== 1 ? 's' : ''} covered, compared to ${narrower.airportCount} for ${narrower.brand.name}. This makes ${wider.brand.name} the more likely option to be available at your layover airport. ${narrower.brand.name} focuses on specific regions or hubs where it operates, often providing high-quality facilities in those locations. If you're transiting through a major hub, check whether either brand is present — overlap at shared airports means you may have a genuine choice.`;
}

function buildUseCases(a: BrandData, b: BrandData): { chooseA: string[]; chooseB: string[] } {
  const typeA = a.brand.brandType;
  const typeB = b.brand.brandType;

  const chooseA = [
    typeA === 'Transit Hotel' ? 'You want a proper private room with a full bed and en-suite bathroom' :
    typeA === 'Sleep Pods' ? 'You need a compact enclosed space with a flat bed for a few hours' :
    'You want lounge access with shower facilities and food options',
    typeA === 'Lounge Network' ? 'Your layover is under 4 hours and a seat and shower is enough' : 'Your layover is long enough to justify a full rest session',
    `${a.brand.name} operates at your specific transit airport`,
    AMENITIES[typeA].overnight ? 'You have an overnight connection and need a real bed' : 'You need quick, affordable hourly rest',
    typeA !== typeB ? `You prefer the ${typeA.toLowerCase()} format over a ${typeB.toLowerCase()}` : `${a.brand.name} is available and ${b.brand.name} is not`,
  ];

  const chooseB = [
    typeB === 'Transit Hotel' ? 'You want a proper private room with a full bed and en-suite bathroom' :
    typeB === 'Sleep Pods' ? 'You need a compact enclosed space with a flat bed for a few hours' :
    'You want lounge access with shower facilities and food options',
    typeB === 'Lounge Network' ? 'Your layover is under 4 hours and a seat and shower is enough' : 'Your layover is long enough to justify a full rest session',
    `${b.brand.name} operates at your specific transit airport`,
    AMENITIES[typeB].overnight ? 'You have an overnight connection and need a real bed' : 'You need quick, affordable hourly rest',
    typeA !== typeB ? `You prefer the ${typeB.toLowerCase()} format over a ${typeA.toLowerCase()}` : `${b.brand.name} is available and ${a.brand.name} is not`,
  ];

  return { chooseA, chooseB };
}

function buildVerdict(a: BrandData, b: BrandData): string {
  const typeA = a.brand.brandType;
  const typeB = b.brand.brandType;

  if (typeA === typeB) {
    const wider = a.airportCount >= b.airportCount ? a : b;
    const narrower = a.airportCount < b.airportCount ? a : b;
    return `Both ${a.brand.name} and ${b.brand.name} offer comparable ${typeA.toLowerCase()} experiences, so the decision largely comes down to availability. ${wider.brand.name} covers more airports, making it the default choice for most routes. However, if ${narrower.brand.name} is present at your layover airport, it is absolutely worth considering. Check both options for your specific transit hub before booking.`;
  }

  const transitBrand = typeA === 'Transit Hotel' ? a : typeB === 'Transit Hotel' ? b : null;
  const podBrand = typeA === 'Sleep Pods' ? a : typeB === 'Sleep Pods' ? b : null;
  const loungeBrand = typeA === 'Lounge Network' ? a : typeB === 'Lounge Network' ? b : null;

  if (transitBrand && podBrand) {
    return `For a long layover where comfort is the priority, ${transitBrand.brand.name} wins with its private room and full hotel experience. For a quick rest without spending a full room rate, ${podBrand.brand.name} is the more practical and affordable choice. Overnight connections: choose ${transitBrand.brand.name}. Layovers of 2–5 hours: ${podBrand.brand.name} is the smarter pick.`;
  }

  if (transitBrand && loungeBrand) {
    return `${transitBrand.brand.name} is the better choice for genuine sleep — it offers a private room and a real bed. ${loungeBrand.brand.name} is superior for lounge comfort: showers, food, and a relaxed environment without the room price tag. For anything over 4 hours where actual sleep matters, choose ${transitBrand.brand.name}. For shorter layovers focused on freshening up, ${loungeBrand.brand.name} wins.`;
  }

  if (podBrand && loungeBrand) {
    return `${podBrand.brand.name} is purpose-built for sleep with its enclosed pod design and flat or reclining bed. ${loungeBrand.brand.name} excels for lounge access, showers, and refreshments during a shorter stop. If sleep is your goal, ${podBrand.brand.name} is the clear winner. If you want a shower and somewhere to sit comfortably, ${loungeBrand.brand.name} is the better fit.`;
  }

  return `${a.brand.name} suits travelers who need ${TYPE_BEST_FOR[typeA]}. ${b.brand.name} is the right pick for those who want ${TYPE_BEST_FOR[typeB]}. Your ideal choice depends on the length of your layover and whether you prioritise private sleep or a comfortable shared space.`;
}

function buildFAQs(a: BrandData, b: BrandData): { q: string; a: string }[] {
  const typeA = a.brand.brandType;
  const typeB = b.brand.brandType;
  const wider = a.airportCount >= b.airportCount ? a : b;
  const narrower = a.airportCount < b.airportCount ? a : b;

  const betterForSleep = (AMENITIES[typeA].bed && AMENITIES[typeA].privateRoom) ? a.brand.name :
    (AMENITIES[typeB].bed && AMENITIES[typeB].privateRoom) ? b.brand.name : a.brand.name;

  const cheaperApparent = typeA === 'Sleep Pods' ? a.brand.name
    : typeB === 'Sleep Pods' ? b.brand.name
    : typeA === 'Lounge Network' ? a.brand.name
    : b.brand.name;

  const overnightBrand = AMENITIES[typeA].overnight ? a.brand.name
    : AMENITIES[typeB].overnight ? b.brand.name : null;

  return [
    {
      q: `Which is better, ${a.brand.name} or ${b.brand.name}?`,
      a: `It depends on your layover type. ${a.brand.name} is better for ${TYPE_BEST_FOR[typeA]}. ${b.brand.name} is stronger for ${TYPE_BEST_FOR[typeB]}. If you need ${AMENITIES[typeA].privateRoom ? 'full privacy and a bed' : 'lounge comfort and shower access'}, ${a.brand.name} is the better pick.`,
    },
    {
      q: `Which one is cheaper, ${a.brand.name} or ${b.brand.name}?`,
      a: `${cheaperApparent} generally has a lower entry-level price point, typically using ${TYPE_PRICING[cheaperApparent === a.brand.name ? typeA : typeB]}. Actual prices vary by airport and booking time, so always check current rates for your specific location.`,
    },
    {
      q: `Can you sleep overnight in ${a.brand.name} and ${b.brand.name}?`,
      a: overnightBrand
        ? `${overnightBrand} supports overnight stays with proper sleeping facilities. ${overnightBrand === a.brand.name ? b.brand.name : a.brand.name} is more suited to shorter layover rest sessions rather than full overnight bookings.`
        : `Both ${a.brand.name} and ${b.brand.name} support overnight rest. Check specific location hours, as some airport facilities have minimum and maximum stay limits.`,
    },
    {
      q: `Are ${a.brand.name} and ${b.brand.name} inside airport security (airside)?`,
      a: `Both brands predominantly operate airside, meaning you do not need to clear customs or obtain a transit visa to access them. This is standard for airport rest facilities designed for transit passengers. Always confirm the specific terminal location before your flight.`,
    },
    {
      q: `Which has more airport locations, ${a.brand.name} or ${b.brand.name}?`,
      a: `${wider.brand.name} operates at more airports (${wider.airportCount} vs ${narrower.airportCount} for ${narrower.brand.name}), giving it wider availability across global transit hubs. ${narrower.brand.name} may be concentrated in specific regions or high-traffic airports where it delivers a strong product.`,
    },
    {
      q: `Do you need a visa to use ${a.brand.name} or ${b.brand.name}?`,
      a: `No visa is required for either brand when facilities are located airside. You stay within the international transit zone throughout your booking. For landside locations, standard entry requirements for that country apply.`,
    },
    {
      q: `Which is more comfortable for a long layover?`,
      a: `${betterForSleep} offers the more comfortable experience for extended layovers, with ${TYPE_COMFORT[betterForSleep === a.brand.name ? typeA : typeB]}. For layovers over 4 hours where quality rest matters, this is the recommended choice.`,
    },
    {
      q: `How do I book ${a.brand.name} or ${b.brand.name}?`,
      a: `Both brands can typically be booked online through their official websites or at the facility directly on arrival. Advance booking is recommended for transit hotels, especially at busy hubs. Walk-in availability depends on occupancy and time of day.`,
    },
  ];
}

function AmenityRow({ label, a, b }: { label: string; a: boolean; b: boolean }) {
  return (
    <tr className="border-b border-slate-100 last:border-0">
      <td className="py-3 px-4 text-sm text-slate-600 font-medium">{label}</td>
      <td className="py-3 px-4 text-center">
        {a
          ? <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" />
          : <XCircle className="w-5 h-5 text-slate-300 mx-auto" />}
      </td>
      <td className="py-3 px-4 text-center">
        {b
          ? <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" />
          : <XCircle className="w-5 h-5 text-slate-300 mx-auto" />}
      </td>
    </tr>
  );
}

function FAQItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-slate-50 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-medium text-slate-800 pr-4">{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="px-5 pb-5 pt-1 bg-white border-t border-slate-100">
          <p className="text-slate-600 text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      onClick={(e) => { e.preventDefault(); navigateTo(href); }}
      className="inline-flex items-center gap-1.5 text-slate-700 hover:text-slate-900 text-sm font-medium group transition-colors"
    >
      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
      {children}
    </a>
  );
}

export default function BrandComparePage({ compareSlug }: BrandComparePageProps) {
  const [brandA, setBrandA] = useState<BrandData | null>(null);
  const [brandB, setBrandB] = useState<BrandData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const parts = compareSlug.split('-vs-');
  const slugA = parts[0];
  const slugB = parts.slice(1).join('-vs-');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setNotFound(false);

    if (!slugA || !slugB) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('airport_facilities')
      .select('*')
      .order('airport', { ascending: true });

    if (error || !data) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const normalized = groupFacilitiesByBrand(data);
    const matchA = normalized.find(b => b.slug === slugA);
    const matchB = normalized.find(b => b.slug === slugB);

    if (!matchA || !matchB) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const facilitiesA = getFacilitiesForBrandSlug(data, slugA) as AirportFacility[];
    const facilitiesB = getFacilitiesForBrandSlug(data, slugB) as AirportFacility[];
    const codesA = [...new Set(facilitiesA.map(f => f.airport_code))].sort();
    const codesB = [...new Set(facilitiesB.map(f => f.airport_code))].sort();

    setBrandA({ brand: matchA, facilities: facilitiesA, airportCount: codesA.length, airportCodes: codesA });
    setBrandB({ brand: matchB, facilities: facilitiesB, airportCount: codesB.length, airportCodes: codesB });

    updatePageMeta(
      `${matchA.name} vs ${matchB.name}: Which Airport Sleep Option Is Better? | RestInAirport.com`,
      `Compare ${matchA.name} (${matchA.brandType}) and ${matchB.name} (${matchB.brandType}) side by side — pricing, comfort, coverage, and which suits your layover best.`,
      `${window.location.origin}${window.location.pathname}`
    );

    setLoading(false);
  }, [slugA, slugB]);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader className="inline-block animate-spin w-10 h-10 text-slate-600" />
            <p className="mt-4 text-slate-500 text-sm">Loading comparison...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (notFound || !brandA || !brandB) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center px-4">
            <p className="text-xl text-slate-700 font-semibold mb-2">Comparison not found</p>
            <p className="text-slate-500 text-sm mb-6">One or both brands could not be found in our database.</p>
            <BackNavigation fallbackUrl="/brands" fallbackLabel="Brands" className="inline-flex items-center text-slate-700 hover:text-slate-900 font-medium transition-colors" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const amenA = AMENITIES[brandA.brand.brandType] ?? AMENITIES['Mixed'];
  const amenB = AMENITIES[brandB.brand.brandType] ?? AMENITIES['Mixed'];
  const faqs = buildFAQs(brandA, brandB);
  const sharedAirports = brandA.airportCodes.filter(c => brandB.airportCodes.includes(c));
  const keyDiffs = buildKeyDifferences(brandA, brandB);
  const { chooseA, chooseB } = buildUseCases(brandA, brandB);
  const urlA = getBrandUrl(brandA.brand.name);
  const urlB = getBrandUrl(brandB.brand.name);

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Header />

      <main className="flex-1">
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
            <BackNavigation
              fallbackUrl="/brands"
              fallbackLabel="Brands"
              className="inline-flex items-center text-slate-300 hover:text-white mb-6 text-sm transition-colors"
            />

            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${TYPE_COLORS[brandA.brand.brandType]}`}>
                {brandA.brand.brandType}
              </span>
              <span className="text-slate-400 text-sm font-medium">vs</span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${TYPE_COLORS[brandB.brand.brandType]}`}>
                {brandB.brand.brandType}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              {brandA.brand.name} vs {brandB.brand.name}: Which Airport Sleep Option Is Better?
            </h1>

            <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-3xl">
              {buildShortAnswer(brandA, brandB)}
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-5">Quick Comparison</h2>
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="py-3 px-5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Brand</th>
                      <th className="py-3 px-5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                      <th className="py-3 px-5 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Locations</th>
                      <th className="py-3 px-5 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Airports</th>
                      <th className="py-3 px-5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Best For</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[brandA, brandB].map((bd) => (
                      <tr key={bd.brand.slug} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-5">
                          <a
                            href={getBrandUrl(bd.brand.name)}
                            onClick={(e) => { e.preventDefault(); navigateTo(getBrandUrl(bd.brand.name)); }}
                            className="font-semibold text-slate-900 hover:text-slate-600 transition-colors inline-flex items-center gap-1"
                          >
                            {bd.brand.name}
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </a>
                        </td>
                        <td className="py-4 px-5">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TYPE_COLORS[bd.brand.brandType]}`}>
                            {bd.brand.brandType}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-center font-semibold text-slate-800">{bd.facilities.length}</td>
                        <td className="py-4 px-5 text-center font-semibold text-slate-800">{bd.airportCount}</td>
                        <td className="py-4 px-5 text-sm text-slate-600 hidden sm:table-cell max-w-[200px]">
                          {TYPE_BEST_FOR[bd.brand.brandType]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-5">
              Key Differences Between {brandA.brand.name} and {brandB.brand.name}
            </h2>
            <ul className="space-y-3">
              {keyDiffs.map((diff, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2.5 flex-shrink-0" />
                  <p className="text-slate-700 leading-relaxed">{diff}</p>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-5">Amenities at a Glance</h2>
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="py-3 px-5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Feature</th>
                    <th className="py-3 px-5 text-center text-sm font-bold text-slate-800">{brandA.brand.name}</th>
                    <th className="py-3 px-5 text-center text-sm font-bold text-slate-800">{brandB.brand.name}</th>
                  </tr>
                </thead>
                <tbody>
                  <AmenityRow label="Private enclosed space" a={amenA.privateRoom} b={amenB.privateRoom} />
                  <AmenityRow label="Flat bed included" a={amenA.bed} b={amenB.bed} />
                  <AmenityRow label="Shower access" a={amenA.shower} b={amenB.shower} />
                  <AmenityRow label="Hourly booking" a={amenA.hourly} b={amenB.hourly} />
                  <AmenityRow label="Airside (no visa needed)" a={amenA.airside} b={amenB.airside} />
                  <AmenityRow label="Suitable for overnight" a={amenA.overnight} b={amenB.overnight} />
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Comfort and Privacy</h2>
            <div className="prose prose-slate max-w-none">
              {buildComfortSection(brandA, brandB).split('\n\n').map((para, i) => (
                <p key={i} className="text-slate-700 leading-relaxed mb-4 last:mb-0">{para}</p>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Pricing and Value</h2>
            <div className="prose prose-slate max-w-none">
              {buildPricingSection(brandA, brandB).split('\n\n').map((para, i) => (
                <p key={i} className="text-slate-700 leading-relaxed mb-4 last:mb-0">{para}</p>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Airport Availability</h2>
            <p className="text-slate-700 leading-relaxed mb-6">{buildAvailabilitySection(brandA, brandB)}</p>

            <div className="grid md:grid-cols-2 gap-5">
              {[brandA, brandB].map((bd) => (
                <div key={bd.brand.slug} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <h3 className="font-semibold text-slate-800">{bd.brand.name}</h3>
                    <span className="ml-auto text-xs text-slate-500 font-medium">{bd.airportCount} airports</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {bd.airportCodes.map(code => (
                      <span key={code} className="inline-block bg-slate-100 text-slate-600 text-xs font-mono px-2 py-0.5 rounded">
                        {code}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {sharedAirports.length > 0 && (
              <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-emerald-800 mb-2">
                  Both brands operate at {sharedAirports.length} shared airport{sharedAirports.length !== 1 ? 's' : ''}:
                </p>
                <div className="flex flex-wrap gap-2">
                  {sharedAirports.map(code => (
                    <span key={code} className="inline-block bg-emerald-100 text-emerald-700 text-xs font-mono font-semibold px-2.5 py-1 rounded">
                      {code}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              When to Choose {brandA.brand.name} vs {brandB.brand.name}
            </h2>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Hotel className="w-5 h-5 text-slate-500" />
                  <h3 className="font-bold text-slate-800">Choose {brandA.brand.name} if:</h3>
                </div>
                <ul className="space-y-2.5">
                  {chooseA.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Hotel className="w-5 h-5 text-slate-500" />
                  <h3 className="font-bold text-slate-800">Choose {brandB.brand.name} if:</h3>
                </div>
                <ul className="space-y-2.5">
                  {chooseB.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Final Verdict</h2>
            <div className="bg-slate-900 text-white rounded-2xl p-6 md:p-8">
              <p className="text-slate-200 leading-relaxed text-base">
                {buildVerdict(brandA, brandB)}
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-5">
              Frequently Asked Questions
            </h2>
            <div className="space-y-2">
              {faqs.map((faq, i) => (
                <FAQItem
                  key={i}
                  q={faq.q}
                  a={faq.a}
                  isOpen={openFAQ === i}
                  onToggle={() => setOpenFAQ(openFAQ === i ? null : i)}
                />
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-5">Explore More Airport Sleep Options</h2>
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="grid sm:grid-cols-2 gap-3">
                <NavLink href={urlA}>
                  All {brandA.brand.name} locations
                </NavLink>
                <NavLink href={urlB}>
                  All {brandB.brand.name} locations
                </NavLink>
                <NavLink href="/sleep-pods">
                  Browse all Sleep Pods
                </NavLink>
                <NavLink href="/transit-hotels">
                  Browse all Transit Hotels
                </NavLink>
                <NavLink href="/lounge-sleep">
                  Browse all Lounge Networks
                </NavLink>
                <NavLink href="/brands">
                  Compare all Brands
                </NavLink>
              </div>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
