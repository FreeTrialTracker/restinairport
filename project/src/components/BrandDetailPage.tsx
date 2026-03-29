import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Hotel, MapPin, Loader, Tag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { AirportFacility } from '../lib/database.types';
import SearchResults from './SearchResults';
import Header from './Header';
import Footer from './Footer';
import { navigateTo } from '../lib/navigation';
import BackNavigation from './BackNavigation';
import {
  groupFacilitiesByBrand,
  getFacilitiesForBrandSlug,
} from '../lib/brandNormalization';
import type { BrandType } from '../lib/brandNormalization';
import BrandSEOContent from './BrandSEOContent';
import { BRAND_DATA } from '../lib/brandData';
import { generateBrandContent } from '../lib/brandContentEngine';
import { generateBrandFAQs } from '../lib/brandFaqEngine';
import {
  getBrandPageTitle,
  getBrandMetaDescription,
  getBrandCanonicalUrl,
  generateBrandFAQSchema,
  generateBrandBreadcrumbSchema,
} from '../lib/brandMeta';
import {
  getBrandTypeLabel,
  getBrandTypePluralLabel,
  getBrandCategoryLabel,
} from '../lib/brandScoring';
import type { SSRBrandData } from '../App';

interface BrandDetailPageProps {
  brandSlug: string;
  ssrData?: SSRBrandData;
}

function legacyTypeToCategory(brandType: BrandType) {
  if (brandType === 'Transit Hotel') return 'hotel' as const;
  if (brandType === 'Sleep Pods') return 'pod' as const;
  if (brandType === 'Lounge Network') return 'lounge' as const;
  return 'hybrid' as const;
}

function slugToDisplayName(slug: string): string {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
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

  const resolvedBrandType = brandMeta
    ? legacyTypeToCategory(brandMeta.brandType)
    : 'hybrid' as const;

  const typeLabel = getBrandTypeLabel(resolvedBrandType);
  const typePluralLabel = getBrandTypePluralLabel(resolvedBrandType);

  const activeBrandName = brandName || slugToDisplayName(brandSlug);

  const brandRecord = BRAND_DATA[brandSlug];

  const content = brandRecord
    ? generateBrandContent(
        brandRecord,
        airportCount,
        ssrData ? ssrData.facilityCount : facilities.length,
        brandMeta?.airportCodes ?? []
      )
    : null;

  const faqs = brandRecord ? generateBrandFAQs(brandRecord, airportCount) : [];

  const facilityCount = ssrData ? ssrData.facilityCount : facilities.length;

  const pageTitle = brandRecord
    ? getBrandPageTitle(brandRecord, airportCount)
    : `${activeBrandName} ${typeLabel} – Locations, Prices & Access | RestInAirport`;

  const metaDesc = brandRecord
    ? getBrandMetaDescription(brandRecord, airportCount)
    : `${activeBrandName} airport rest facilities — locations, access rules, and pricing for transit passengers at ${airportCount} airports.`;

  const canonical = getBrandCanonicalUrl(brandSlug);

  const faqSchema = brandRecord ? generateBrandFAQSchema(faqs) : null;
  const breadcrumbSchema = brandRecord ? generateBrandBreadcrumbSchema(brandRecord) : {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://restinairport.com' },
      { '@type': 'ListItem', position: 2, name: 'Brands', item: 'https://restinairport.com/brands' },
      { '@type': 'ListItem', position: 3, name: activeBrandName, item: canonical },
    ],
  };

  const heroDescription = content?.heroDescription ??
    `${activeBrandName} provides airport rest facilities at ${airportCount} ${airportCount === 1 ? 'airport' : 'airports'}. This guide covers locations, access rules, pricing, and transit passenger eligibility.`;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
        <Helmet>
          <title>{pageTitle}</title>
          <meta name="description" content={metaDesc} />
          <link rel="canonical" href={canonical} />
          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={metaDesc} />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={canonical} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={pageTitle} />
          <meta name="twitter:description" content={metaDesc} />
          <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
          {faqSchema && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
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
        <Helmet>
          <title>Brand Not Found | RestInAirport</title>
          <meta name="robots" content="noindex" />
        </Helmet>
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
        <title>{pageTitle}</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDesc} />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        {faqSchema && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
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
                {getBrandCategoryLabel(resolvedBrandType)}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {content?.heroTagline ?? `${activeBrandName} ${typeLabel}`}
            </h1>

            <p className="text-lg text-slate-200 max-w-3xl mb-8 leading-relaxed">
              {heroDescription}
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
                <Tag className="w-6 h-6" />
                <div>
                  <div className="text-xl font-bold leading-tight">{getBrandCategoryLabel(resolvedBrandType)}</div>
                  <div className="text-sm text-slate-300">Category</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">

          {uniqueAirports.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                Where You'll Find {activeBrandName}
              </h2>
              <p className="text-slate-600 mb-5 max-w-3xl leading-relaxed">
                {activeBrandName} {typePluralLabel} are available at {airportCount}{' '}
                {airportCount === 1 ? 'airport' : 'airports'} worldwide. Terminal placement and
                access rules differ by location — confirm your specific terminal before travel.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-3xl">
                {uniqueAirports.map(airport => (
                  <a
                    key={airport.code}
                    href={`/airport/${airport.code.toLowerCase()}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo(`/airport/${airport.code.toLowerCase()}`);
                    }}
                    className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-colors group"
                  >
                    <span className="inline-flex items-center justify-center w-10 h-10 bg-slate-100 group-hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700 transition-colors flex-shrink-0">
                      {airport.code}
                    </span>
                    <span className="text-sm font-medium text-slate-700 leading-tight">
                      {airport.name}
                    </span>
                  </a>
                ))}
              </div>
            </section>
          )}

          {facilities.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                All {activeBrandName} Locations
              </h2>
              <SearchResults facilities={facilities} query="" />
            </section>
          )}

        </div>

        <div className="border-t border-slate-200 bg-white pt-14">
          {brandMeta && content && brandRecord && (
            <BrandSEOContent
              brandName={activeBrandName}
              brandSlug={brandSlug}
              content={content}
              faqs={faqs}
              allBrandSlugs={allBrands}
              compareCandidates={brandRecord.compareCandidates}
              brand={brandRecord}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
