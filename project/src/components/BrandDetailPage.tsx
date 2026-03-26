import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Hotel, MapPin, Loader, Shield, Clock, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { AirportFacility } from '../lib/database.types';
import SearchResults from './SearchResults';
import Header from './Header';
import Footer from './Footer';
import { updatePageMeta } from '../lib/seo';
import { navigateTo } from '../lib/navigation';
import BackNavigation from './BackNavigation';
import {
  groupFacilitiesByBrand,
  getFacilitiesForBrandSlug,
} from '../lib/brandNormalization';
import type { BrandType } from '../lib/brandNormalization';
import { BrandSEOContent, generateBrandFAQSchema, getBrandMetaDescription, getBrandIntro } from './BrandSEOContent';
import type { SSRBrandData } from '../App';

interface BrandDetailPageProps {
  brandSlug: string;
  ssrData?: SSRBrandData;
}

function getBrandH1Label(brandType: BrandType): string {
  if (brandType === 'Transit Hotel') return 'Transit Hotel';
  if (brandType === 'Sleep Pods') return 'Sleep Pods';
  if (brandType === 'Lounge Network') return 'Airport Lounge';
  return 'Airport Rest Facility';
}

function getBrandTitleLabel(brandType: BrandType): string {
  if (brandType === 'Transit Hotel') return 'Transit Hotel';
  if (brandType === 'Sleep Pods') return 'Sleep Pods';
  if (brandType === 'Lounge Network') return 'Airport Lounge';
  return 'Airport Rest Facility';
}

function getBrandTypePluralLabel(brandType: BrandType): string {
  if (brandType === 'Transit Hotel') return 'transit hotel rooms';
  if (brandType === 'Sleep Pods') return 'sleep pods';
  if (brandType === 'Lounge Network') return 'lounge access';
  return 'rest facilities';
}

function getCategoryStatLabel(brandType: BrandType): string {
  if (brandType === 'Transit Hotel') return 'Transit Hotel';
  if (brandType === 'Sleep Pods') return 'Sleep Pods';
  if (brandType === 'Lounge Network') return 'Lounge';
  return 'Mixed';
}

export default function BrandDetailPage({ brandSlug, ssrData }: BrandDetailPageProps) {
  const isSSR = typeof window === 'undefined';

  const [facilities, setFacilities] = useState<AirportFacility[]>([]);
  const [loading, setLoading] = useState(!isSSR && !ssrData);
  const [brandName, setBrandName] = useState<string>(ssrData?.brandName ?? '');
  const [notFound, setNotFound] = useState(false);
  const [allBrands, setAllBrands] = useState<{ name: string; slug: string }[]>([]);
  const [brandMeta, setBrandMeta] = useState<{
    brandType: BrandType;
    airportCodes: string[];
  } | null>(
    ssrData
      ? { brandType: ssrData.brandType, airportCodes: ssrData.airportCodes }
      : null
  );

  useEffect(() => {
    if (isSSR) return;
    fetchBrandFacilities();
  }, [brandSlug]);

  async function fetchBrandFacilities() {
    setLoading(true);

    const { data, error } = await supabase
      .from('airport_facilities')
      .select('*')
      .order('airport', { ascending: true });

    if (error) {
      console.error('Error fetching facilities:', error);
    } else if (data) {
      const normalized = groupFacilitiesByBrand(data);
      const matchedBrand = normalized.find(b => b.slug === brandSlug);

      if (matchedBrand) {
        const matchedFacilities = getFacilitiesForBrandSlug(data, brandSlug);

        setBrandName(matchedBrand.name);
        setFacilities(matchedFacilities);
        setBrandMeta({
          brandType: matchedBrand.brandType,
          airportCodes: matchedBrand.airportCodes,
        });

        const primaryBrands = normalized
          .filter(b => b.isPrimary)
          .map(b => ({ name: b.name, slug: b.slug }));
        setAllBrands(primaryBrands);

        const airportCount = new Set(matchedFacilities.map(f => f.airport_code)).size;
        const metaDesc = getBrandMetaDescription(matchedBrand.name, matchedBrand.brandType, matchedBrand.airportCodes, airportCount, brandSlug);
        const titleLabel = getBrandTitleLabel(matchedBrand.brandType);

        const faqSchema = generateBrandFAQSchema(
          matchedBrand.name,
          matchedBrand.brandType,
          airportCount,
          brandSlug
        );

        updatePageMeta(
          `${matchedBrand.name} ${titleLabel} – Airport Locations, Prices & Access | RestInAirport`,
          metaDesc,
          `${window.location.origin}/brand/${brandSlug}`,
          faqSchema
        );
      } else {
        setNotFound(true);
      }
    }
    setLoading(false);
  }

  const airportCount = ssrData
    ? ssrData.airportCount
    : new Set(facilities.map(f => f.airport_code)).size;

  const uniqueAirports = ssrData
    ? ssrData.airports
    : Array.from(
        new Map(facilities.map(f => [f.airport_code, { code: f.airport_code, name: f.airport }])).values()
      ).sort((a, b) => a.name.localeCompare(b.name));

  const h1Label = brandMeta ? getBrandH1Label(brandMeta.brandType) : 'Airport Rest Facility';
  const titleLabel = brandMeta ? getBrandTitleLabel(brandMeta.brandType) : 'Airport Rest Facility';
  const typePluralLabel = brandMeta ? getBrandTypePluralLabel(brandMeta.brandType) : 'rest facilities';

  const activeBrandName = brandName || brandSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const introText = brandMeta
    ? getBrandIntro(activeBrandName, brandMeta.brandType, brandMeta.airportCodes, airportCount, brandSlug)
    : `${activeBrandName} is an airport rest facility available at ${airportCount} airports worldwide. This guide covers locations, access rules, pricing, and whether you can stay inside the airport without clearing immigration.`;

  const metaDesc = brandMeta
    ? getBrandMetaDescription(activeBrandName, brandMeta.brandType, brandMeta.airportCodes, airportCount, brandSlug)
    : `Discover ${activeBrandName} airport rest facilities. View locations, access rules, pricing, and whether transit passengers can stay without clearing immigration.`;

  const facilityCount = ssrData ? ssrData.facilityCount : facilities.length;

  if (loading) {
    const slugTitle = brandSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
        <Helmet>
          <title>{slugTitle} Transit Hotel – Airport Locations, Prices & Access | RestInAirport</title>
          <meta name="description" content={`Discover ${slugTitle} airport rest facilities. View locations, access rules, pricing, and whether transit passengers can stay without clearing immigration.`} />
          <link rel="canonical" href={`https://restinairport.com/brand/${brandSlug}`} />
          <meta property="og:title" content={`${slugTitle} – Airport Rest Facility | RestInAirport`} />
          <meta property="og:description" content={`Discover ${slugTitle} airport rest facilities worldwide.`} />
          <meta property="og:url" content={`https://restinairport.com/brand/${brandSlug}`} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={`${slugTitle} – Airport Rest Facility | RestInAirport`} />
          <meta name="twitter:description" content={`Discover ${slugTitle} airport rest facilities worldwide.`} />
        </Helmet>
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader className="inline-block animate-spin w-12 h-12 text-slate-700" />
            <p className="mt-4 text-slate-600">Loading brand details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (notFound || (!loading && !brandName && !ssrData)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-slate-600 mb-4">Brand not found</p>
            <BackNavigation fallbackUrl="/brands" fallbackLabel="Brands" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <Helmet>
        <title>{activeBrandName} {titleLabel} – Airport Locations, Prices & Access | RestInAirport</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={`https://restinairport.com/brand/${brandSlug}`} />
        <meta property="og:title" content={`${activeBrandName} ${titleLabel} – Airport Locations, Prices & Access | RestInAirport`} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://restinairport.com/brand/${brandSlug}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${activeBrandName} ${titleLabel} | RestInAirport`} />
        <meta name="twitter:description" content={metaDesc} />
      </Helmet>
      <Header />

      <main className="flex-1">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <BackNavigation
              fallbackUrl="/brands"
              fallbackLabel="Brands"
              className="inline-flex items-center text-slate-200 hover:text-white mb-6 transition-colors"
            />

            <div className="mb-3">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-slate-300 bg-slate-700 px-3 py-1 rounded-full">
                Transit Hotel
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {activeBrandName} {h1Label}
            </h1>

            <p className="text-lg text-slate-200 max-w-3xl mb-8 leading-relaxed">
              {introText}
            </p>

            <div className="flex flex-wrap gap-6">
              <div className="flex items-center space-x-2">
                <Hotel className="w-6 h-6" />
                <div>
                  <div className="text-2xl font-bold">{facilityCount}</div>
                  <div className="text-sm text-slate-300">Locations</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-6 h-6" />
                <div>
                  <div className="text-2xl font-bold">{airportCount}</div>
                  <div className="text-sm text-slate-300">Airports</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-6 h-6" />
                <div>
                  <div className="text-2xl font-bold">{brandMeta ? getCategoryStatLabel(brandMeta.brandType) : 'Transit Hotel'}</div>
                  <div className="text-sm text-slate-300">Category</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">

          {uniqueAirports.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Where You'll Find {activeBrandName}</h2>
              <p className="text-slate-600 mb-5 max-w-3xl leading-relaxed">
                {activeBrandName} operates at {airportCount} {airportCount === 1 ? 'airport' : 'airports'} worldwide. Terminal placement and access rules differ by location — confirm your specific terminal before travel.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl">
                {uniqueAirports.map(airport => (
                  <a
                    key={airport.code}
                    href={`/airport/${airport.code.toLowerCase()}`}
                    onClick={(e) => { e.preventDefault(); navigateTo(`/airport/${airport.code.toLowerCase()}`); }}
                    className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-colors group"
                  >
                    <span className="inline-flex items-center justify-center w-10 h-10 bg-slate-100 group-hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700 transition-colors flex-shrink-0">
                      {airport.code}
                    </span>
                    <span className="text-sm font-medium text-slate-700 leading-tight">{airport.name}</span>
                  </a>
                ))}
              </div>
            </section>
          )}

          {uniqueAirports.length === 0 && (
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Where You'll Find {activeBrandName}</h2>
              <p className="text-slate-600 max-w-3xl leading-relaxed">
                {activeBrandName} is available in major international transit hubs. Check the listings below for specific terminal locations and access details.
              </p>
            </section>
          )}

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Is {activeBrandName} Right for Your Layover?</h2>
            <p className="text-slate-600 mb-5 max-w-3xl leading-relaxed">
              Whether {activeBrandName} suits your layover depends on connection length, budget, and what you need from your rest stop.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mb-5">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">Best for</p>
                <p className="text-slate-700 text-sm leading-relaxed">
                  {brandMeta?.brandType === 'Transit Hotel'
                    ? 'Long layovers of 4+ hours, passengers without exit visas, premium travelers wanting a proper bed and shower'
                    : brandMeta?.brandType === 'Sleep Pods'
                    ? 'Short to medium layovers, budget travelers, passengers wanting affordable rest without a booking process'
                    : 'Frequent flyers without lounge access, long pre-departure waits, those wanting food and showers in a calm setting'}
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2">Not ideal for</p>
                <p className="text-slate-700 text-sm leading-relaxed">
                  {brandMeta?.brandType === 'Transit Hotel'
                    ? 'Budget travelers or those with connections under 2 hours where the value may not justify the cost'
                    : brandMeta?.brandType === 'Sleep Pods'
                    ? 'Travelers needing full privacy, shower access, or hotel-level amenities for longer stays'
                    : 'Very short connections where entry fees may not represent value for time spent'}
                </p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Access</p>
                <p className="text-slate-700 text-sm leading-relaxed">
                  {brandMeta?.brandType === 'Transit Hotel'
                    ? 'Typically airside — no immigration clearance needed for transit passengers at most locations'
                    : brandMeta?.brandType === 'Sleep Pods'
                    ? 'Generally airside in terminal departures areas, accessible without clearing customs'
                    : 'Varies by location — most lounges are airside but confirm before your journey'}
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Access Rules</h2>
            <div className="grid sm:grid-cols-2 gap-4 max-w-3xl">
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-slate-600" />
                  <h3 className="font-semibold text-slate-800">Airside vs Landside</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {brandMeta?.brandType === 'Transit Hotel'
                    ? `${activeBrandName} transit hotel rooms are typically located airside — inside the secure terminal zone after passport control. Most locations do not require exiting and re-entering immigration.`
                    : brandMeta?.brandType === 'Sleep Pods'
                    ? `${activeBrandName} sleep pods are generally located in the airside terminal area. You can access them without clearing customs, making them suitable for transit passengers on tight connections.`
                    : `${activeBrandName} lounge locations are typically situated airside within international departures. Access does not usually require clearing immigration for transit passengers.`
                  }
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-slate-600" />
                  <h3 className="font-semibold text-slate-800">Transit Eligibility</h3>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Transit passengers without a visa for the transit country can generally use {activeBrandName} if the facility is airside. No immigration clearance is required for airside-only access. Always confirm specific terminal locations before your journey.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Pricing</h2>
            <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-slate-600" />
                <h3 className="font-semibold text-slate-800">Typical Pricing Structure</h3>
              </div>
              <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
                {brandMeta?.brandType === 'Transit Hotel' ? (
                  <>
                    <p>{activeBrandName} charges by the hour with minimum booking windows typically starting at 3–6 hours. Full overnight rates are available at most locations.</p>
                    <p>Pricing varies significantly by airport and room type. Premium hub airports command higher rates. Advance booking is strongly recommended at major hubs to secure availability.</p>
                    <p className="text-xs text-slate-400">Rates shown on individual facility listings. Contact the property directly for current pricing.</p>
                  </>
                ) : brandMeta?.brandType === 'Sleep Pods' ? (
                  <>
                    <p>{activeBrandName} pods are priced by the hour, making them a cost-effective option compared to transit hotels. Most locations offer discounted rates for longer bookings.</p>
                    <p>Overnight stays are possible by booking consecutive hours. Rates vary by airport and pod type. Walk-in access is often available, but pre-booking saves time at busy periods.</p>
                    <p className="text-xs text-slate-400">Rates shown on individual facility listings. Pricing subject to change.</p>
                  </>
                ) : (
                  <>
                    <p>{activeBrandName} lounge access is priced per visit with a time-limited stay included. Some locations offer extended stays for an additional fee.</p>
                    <p>Walk-in rates are available but may be higher than pre-booked rates. Certain credit cards and travel programs include complimentary access — check your card benefits before paying.</p>
                    <p className="text-xs text-slate-400">Rates shown on individual facility listings. Pricing subject to change.</p>
                  </>
                )}
              </div>
            </div>
          </section>

          {facilities.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">All {activeBrandName} Locations</h2>
              <SearchResults facilities={facilities} query="" />
            </section>
          )}

        </div>

        <div className="border-t border-slate-200 bg-white pt-14">
          {brandMeta && (
            <BrandSEOContent
              brandName={activeBrandName}
              brandSlug={brandSlug}
              brandType={brandMeta.brandType}
              facilityCount={facilityCount}
              airportCount={airportCount}
              airportCodes={brandMeta.airportCodes}
              allBrandSlugs={allBrands}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
