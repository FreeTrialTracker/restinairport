import { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Star,
  Lock,
  DollarSign,
  Plane,
  Wifi,
  ShowerHead,
  Utensils,
  Monitor,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { navigateTo } from '../lib/navigation';
import { getBrandCompareUrlFromSlugs } from '../lib/brandRoutes';
import type { BrandRecord } from '../lib/brandData';
import { BRAND_DATA } from '../lib/brandData';
import type { BrandContentSections } from '../lib/brandContentEngine';
import { buildBrandPageContent } from '../lib/brandContentEngine';
import type { BrandFAQ } from '../lib/brandFaqEngine';
import {
  getBrandSnapshot,
  getBrandTypeLabel,
  getSleepQualityLabel,
  getPrivacyLabel,
  getPricingLabel,
} from '../lib/brandScoring';

interface BrandSEOContentProps {
  brandName: string;
  brandSlug: string;
  content: BrandContentSections;
  faqs: BrandFAQ[];
  allBrandSlugs: { name: string; slug: string }[];
  compareCandidates: string[];
  brand: BrandRecord;
}

const CATEGORY_LINKS = [
  { label: 'Sleep Pods', href: '/sleep-pods' },
  { label: 'Private Rooms', href: '/private-rooms' },
  { label: 'Transit Hotels', href: '/transit-hotels' },
  { label: 'Lounge Sleep', href: '/lounge-sleep' },
];

const ENDING_LINK_MAP: Record<string, string> = {
  'transit hotels': '/transit-hotels',
  'sleep pods': '/sleep-pods',
  'airport lounges': '/lounge-sleep',
  'airports': '/airports',
};

export default function BrandSEOContent({
  brandName,
  brandSlug,
  content,
  faqs,
  allBrandSlugs,
  compareCandidates,
  brand,
}: BrandSEOContentProps) {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const richContent = buildBrandPageContent(brand);
  const snapshot = getBrandSnapshot(brand);

  const resolvedCompareSlugs = compareCandidates
    .slice(0, 5)
    .map(slug => {
      const fromDb = allBrandSlugs.find(b => b.slug === slug);
      if (fromDb) return { slug, name: fromDb.name, available: true };
      const fromData = BRAND_DATA[slug];
      if (fromData) return { slug, name: fromData.name, available: true };
      return { slug, name: slug.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' '), available: false };
    })
    .filter(c => c.available);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-14">

      <BrandBadges brand={brand} snapshot={snapshot} />

      <ContentSection
        headline={content.positioningHeadline}
        body={content.positioningBody}
      />

      <ContentSection
        headline={content.coverageHeadline}
        body={content.coverageBody}
      />

      <ContentSection
        headline={content.accessHeadline}
        body={content.accessBody}
      />

      <ExperienceBreakdown brandName={brandName} content={richContent} brand={brand} />

      <BestForSection content={content} />

      {resolvedCompareSlugs.length > 0 && (
        <ComparisonLinks
          brandName={brandName}
          brandSlug={brandSlug}
          slugs={resolvedCompareSlugs}
        />
      )}

      <CategoryLinks />

      <FAQAccordion brandName={brandName} faqs={faqs} openFAQ={openFAQ} setOpenFAQ={setOpenFAQ} />

      <EndingBlock text={content.endingBlock} />

    </div>
  );
}

function BrandBadges({
  brand,
  snapshot,
}: {
  brand: BrandRecord;
  snapshot: ReturnType<typeof getBrandSnapshot>;
}) {
  const badges = [
    { icon: <Star className="w-4 h-4" />, label: 'Type', value: getBrandTypeLabel(brand.type) },
    {
      icon: null,
      label: 'Access',
      value: brand.accessTypes[0] === 'self-service'
        ? 'Self-Service'
        : brand.accessTypes[0] === 'front-desk'
          ? 'Front Desk'
          : brand.accessTypes[0] === 'card-access'
            ? 'Card / Membership'
            : 'Paid Entry',
    },
    { icon: <Star className="w-4 h-4" />, label: 'Sleep Quality', value: `${getSleepQualityLabel(brand.sleepQualityScore)} (${brand.sleepQualityScore}/5)` },
    { icon: <Lock className="w-4 h-4" />, label: 'Privacy', value: getPrivacyLabel(brand.privacyLevel) },
    { icon: <DollarSign className="w-4 h-4" />, label: 'Pricing', value: getPricingLabel(brand.pricingLevel) },
    { icon: <Plane className="w-4 h-4" />, label: 'Airside', value: brand.airsideTypical ? 'Yes — no immigration needed' : 'Varies by location' },
  ];

  return (
    <section>
      <div className="flex flex-wrap gap-3 mb-6">
        {badges.map(badge => (
          <div
            key={badge.label}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-sm shadow-sm"
          >
            {badge.icon && <span className="text-slate-400">{badge.icon}</span>}
            <span className="text-slate-500 font-medium">{badge.label}:</span>
            <span className="text-slate-800 font-semibold">{badge.value}</span>
          </div>
        ))}
      </div>
      {snapshot.primaryUseCase && (
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          Best Use Case: {snapshot.primaryUseCase}
        </div>
      )}
    </section>
  );
}

function ContentSection({ headline, body }: { headline: string; body: string }) {
  if (!headline && !body) return null;
  return (
    <section>
      {headline && <h2 className="text-2xl font-bold text-slate-900 mb-4">{headline}</h2>}
      {body && <p className="text-slate-600 leading-relaxed max-w-3xl">{body}</p>}
    </section>
  );
}

function ExperienceBreakdown({
  brandName,
  content,
  brand,
}: {
  brandName: string;
  content: ReturnType<typeof buildBrandPageContent>;
  brand: BrandRecord;
}) {
  const amenities = brand.amenitySignals;
  const hasShower = amenities.some(a => a.toLowerCase().includes('shower'));
  const hasWifi = amenities.some(a => a.toLowerCase().includes('wi-fi') || a.toLowerCase().includes('wifi'));
  const hasFood = amenities.some(a => a.toLowerCase().includes('food') || a.toLowerCase().includes('buffet'));
  const hasDesk = amenities.some(a => a.toLowerCase().includes('desk'));

  const amenityIcons: Array<{ icon: React.ReactNode; label: string; present: boolean }> = [
    { icon: <ShowerHead className="w-4 h-4" />, label: 'Shower', present: hasShower },
    { icon: <Wifi className="w-4 h-4" />, label: 'Wi-Fi', present: hasWifi },
    { icon: <Utensils className="w-4 h-4" />, label: 'Food', present: hasFood },
    { icon: <Monitor className="w-4 h-4" />, label: 'Desk / Work', present: hasDesk },
  ];

  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Inside {brandName}</h2>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mb-8">
        <ExperienceCard title="Seating & Sleep Quality" body={content.experience.seatingSleep} />
        <ExperienceCard title="Privacy Level" body={content.experience.privacy} />
        <ExperienceCard title="Food & Amenities" body={content.experience.foodAmenities} />
        <ExperienceCard title="Best Suitability" body={content.experience.suitability} />
      </div>

      <div className="flex flex-wrap gap-3 max-w-4xl">
        {amenityIcons.map(({ icon, label, present }) => (
          <div
            key={label}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border ${
              present
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}
          >
            <span className={present ? 'text-emerald-600' : 'text-slate-300'}>{icon}</span>
            {label}
            {!present && <XCircle className="w-3.5 h-3.5 ml-0.5 text-slate-300" />}
          </div>
        ))}
      </div>
    </section>
  );
}

function ExperienceCard({ title, body }: { title: string; body: string }) {
  if (!body) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{title}</p>
      <p className="text-sm text-slate-700 leading-relaxed">{body}</p>
    </div>
  );
}

function BestForSection({ content }: { content: BrandContentSections }) {
  const hasItems = content.bestForItems.length > 0 || content.notIdealForItems.length > 0;
  const hasLimitations = content.limitationsBody;

  if (!hasItems && !hasLimitations) return null;

  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-900 mb-5">{content.bestForHeadline}</h2>

      {hasItems && (
        <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mb-5">
          {content.bestForItems.length > 0 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-3">Best for</p>
              <ul className="space-y-2">
                {content.bestForItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {content.notIdealForItems.length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Not ideal for</p>
              <ul className="space-y-2">
                {content.notIdealForItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <XCircle className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {hasLimitations && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 max-w-3xl">
          <h3 className="text-sm font-semibold text-amber-800 mb-2">{content.limitationsHeadline}</h3>
          <p className="text-sm text-slate-700 leading-relaxed">{content.limitationsBody}</p>
        </div>
      )}
    </section>
  );
}

function ComparisonLinks({
  brandName,
  brandSlug,
  slugs,
}: {
  brandName: string;
  brandSlug: string;
  slugs: { slug: string; name: string; available: boolean }[];
}) {
  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">
        Compare {brandName} With Other Brands
      </h2>
      <p className="text-slate-500 text-sm mb-4 max-w-xl">
        See how {brandName} stacks up against similar airport rest options by category, coverage, and sleep quality.
      </p>
      <ul className="space-y-2 max-w-xl">
        {slugs.map(({ slug, name }) => {
          const href = getBrandCompareUrlFromSlugs(brandSlug, slug);
          return (
            <li key={slug}>
              <a
                href={href}
                onClick={(e) => { e.preventDefault(); navigateTo(href); }}
                className="inline-flex items-center gap-1.5 text-slate-700 hover:text-slate-900 font-medium group transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                {brandName} vs {name}
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function CategoryLinks() {
  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Explore Other Airport Rest Options</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
        {CATEGORY_LINKS.map(({ label, href }) => (
          <a
            key={href}
            href={href}
            onClick={(e) => { e.preventDefault(); navigateTo(href); }}
            className="flex items-center justify-center px-4 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors text-center"
          >
            {label}
          </a>
        ))}
      </div>
    </section>
  );
}

function FAQAccordion({
  brandName,
  faqs,
  openFAQ,
  setOpenFAQ,
}: {
  brandName: string;
  faqs: BrandFAQ[];
  openFAQ: number | null;
  setOpenFAQ: (i: number | null) => void;
}) {
  if (faqs.length === 0) return null;

  return (
    <section>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">
        Frequently Asked Questions About {brandName}
      </h2>
      <div className="max-w-3xl border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200">
        {faqs.map((faq, i) => (
          <div key={i}>
            <button
              className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-slate-50 transition-colors"
              onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
              aria-expanded={openFAQ === i}
            >
              <span className="font-medium text-slate-800 pr-4">{faq.q}</span>
              <ChevronDown
                className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                  openFAQ === i ? 'rotate-180' : ''
                }`}
              />
            </button>

            <div
              className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${openFAQ === i ? 'max-h-[800px]' : 'max-h-0'}`}
              aria-hidden={openFAQ !== i}
            >
              <div className="px-5 pb-5 bg-white">
                <FAQAnswer answer={faq.a} />
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
  );
}

function FAQAnswer({ answer }: { answer: string }) {
  const visaKeywords = /\btransit visa\b|\bvisa requirement/i;
  if (!visaKeywords.test(answer)) {
    return <p className="text-slate-600 leading-relaxed text-sm">{answer}</p>;
  }

  return (
    <p className="text-slate-600 leading-relaxed text-sm">
      {answer}{' '}
      <a
        href="https://www.visainfoguide.com"
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-sky-700 hover:text-sky-600 underline underline-offset-2"
      >
        Check transit visa requirements at visainfoguide.com
      </a>
      .
    </p>
  );
}

function EndingBlock({ text }: { text: string }) {
  if (!text) return null;

  const pattern = new RegExp(`(${Object.keys(ENDING_LINK_MAP).join('|')})`, 'gi');
  const parts = text.split(pattern);

  return (
    <section className="border-t border-slate-100 pt-10">
      <div className="max-w-3xl">
        <p className="text-slate-600 leading-relaxed">
          {parts.map((part, idx) => {
            const href = ENDING_LINK_MAP[part.toLowerCase()];
            if (href) {
              return (
                <a
                  key={idx}
                  href={href}
                  onClick={(e) => { e.preventDefault(); navigateTo(href); }}
                  className="font-medium text-slate-800 underline underline-offset-2 hover:text-slate-600 transition-colors"
                >
                  {part}
                </a>
              );
            }
            return part;
          })}
        </p>
      </div>
    </section>
  );
}
