import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Hotel, Loader, ChevronDown, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Header from './Header';
import Footer from './Footer';
import { updatePageMeta } from '../lib/seo';
import { navigateTo } from '../lib/navigation';
import { groupFacilitiesByBrand, type NormalizedBrand, type BrandType } from '../lib/brandNormalization';

function BrandTypeBadge({ type }: { type: BrandType }) {
  const styles: Record<BrandType, string> = {
    'Transit Hotel': 'bg-sky-100 text-sky-800',
    'Sleep Pods': 'bg-teal-100 text-teal-800',
    'Lounge Network': 'bg-amber-100 text-amber-800',
    'Mixed': 'bg-slate-100 text-slate-700',
  };
  return (
    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${styles[type]}`}>
      {type}
    </span>
  );
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<NormalizedBrand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<NormalizedBrand[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    updatePageMeta(
      'Airport Sleep Facility Brands Worldwide (2026 Guide) | RestInAirport.com',
      'Discover airport sleep facility brands worldwide, from sleep pods and capsule hotels to transit hotels and private room providers. Compare global brands across airports.',
      `${window.location.origin}/brands`
    );
    fetchBrands();
  }, []);

  async function fetchBrands() {
    setLoading(true);
    const { data, error } = await supabase
      .from('airport_facilities')
      .select('facility, airport_code')
      .order('facility', { ascending: true });

    if (error) {
      console.error('Error fetching brands:', error);
    } else {
      const allBrands = groupFacilitiesByBrand(data ?? []);
      const primaryBrands = allBrands.filter(b => b.isPrimary);
      setBrands(primaryBrands);
      setFilteredBrands(primaryBrands);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const filtered = brands.filter(brand =>
        brand.name.toLowerCase().includes(query)
      );
      setFilteredBrands(filtered);
    } else {
      setFilteredBrands(brands);
    }
  }, [searchQuery, brands]);

  const groupedBrands = filteredBrands.reduce((acc, brand) => {
    const firstLetter = brand.name[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(brand);
    return acc;
  }, {} as Record<string, NormalizedBrand[]>);

  const faqItems = [
    {
      question: 'What are airport sleep facility brands?',
      answer: 'They are companies that operate sleep pods, private rooms, transit hotels, or lounges inside airports.'
    },
    {
      question: 'Which brands offer sleep pods in airports?',
      answer: 'Several global and regional brands specialize in Sleep Pods, depending on the airport.'
    },
    {
      question: 'What is the difference between transit hotel brands and private room providers?',
      answer: 'Transit Hotels offer full hotel rooms, while Private Rooms are smaller and typically rented hourly.'
    },
    {
      question: 'Are airport sleep brands available worldwide?',
      answer: 'They are mainly found in major international airports, with varying availability by region.'
    },
    {
      question: 'Which brand is best for airport sleep?',
      answer: 'It depends on your needs. Sleep Pods are best for short rest, while Transit Hotels are better for overnight stays.'
    },
    {
      question: 'Can you book airport sleep brands in advance?',
      answer: 'Yes, many brands offer online booking depending on the airport.'
    },
    {
      question: 'Are airport sleep facilities operated by airlines?',
      answer: 'Some lounges are airline-operated, but most sleep facilities are managed by independent brands.'
    },
    {
      question: 'Are airport sleep brands safe?',
      answer: 'Yes, they operate within secure airport environments.'
    },
    {
      question: 'Do all brands offer airside access?',
      answer: 'No, some are landside and require immigration clearance.'
    },
    {
      question: 'How do I find which brand is available at my airport?',
      answer: 'Use this directory and explore individual airports or brand listings.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <Helmet>
        <title>Airport Sleep Facility Brands Worldwide (2026 Guide) | RestInAirport.com</title>
        <meta name="description" content="Discover airport sleep facility brands worldwide, from sleep pods and capsule hotels to transit hotels and private room providers. Compare global brands across airports." />
        <link rel="canonical" href="https://restinairport.com/brands" />
        <meta property="og:title" content="Airport Sleep Facility Brands Worldwide (2026 Guide) | RestInAirport.com" />
        <meta property="og:description" content="Discover airport sleep facility brands worldwide, from sleep pods and capsule hotels to transit hotels and private room providers." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://restinairport.com/brands" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Airport Sleep Facility Brands Worldwide (2026 Guide) | RestInAirport.com" />
        <meta name="twitter:description" content="Discover airport sleep facility brands worldwide, from sleep pods and capsule hotels to transit hotels and private room providers." />
      </Helmet>
      <Header />

      <main className="flex-1">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Airport Sleep Facility Brands Worldwide (2026 Guide)</h1>

            <div className="flex items-center space-x-2 mt-8">
              <Hotel className="w-6 h-6" />
              <div>
                <div className="text-2xl font-bold">{filteredBrands.length}</div>
                <div className="text-sm text-slate-300">Brands</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="prose prose-slate max-w-none mb-12">
            <p className="text-lg text-slate-700 leading-relaxed">
              Discover airport sleep facility brands worldwide, from sleep pods and capsule hotels to transit hotels and private room providers. Compare global brands across airports and find the best option for your layover.
            </p>
          </div>
          {loading ? (
            <div className="text-center py-20">
              <Loader className="inline-block animate-spin w-12 h-12 text-slate-700" />
              <p className="mt-4 text-slate-600">Loading brands...</p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by brand name (e.g., YOTELAIR, Minute Suites)..."
                    className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-slate-900 placeholder:text-slate-500"
                  />
                </div>
              </div>

              {filteredBrands.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 shadow-lg border border-slate-200 text-center">
                  <p className="text-xl text-slate-600">
                    No brands found for "{searchQuery}"
                  </p>
                  <p className="text-slate-500 mt-2">
                    Try searching for a different brand name.
                  </p>
                </div>
              ) : (
                <div className="space-y-12">
                {Object.keys(groupedBrands).sort().map((letter) => (
                  <div key={letter}>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-slate-300">
                      {letter}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {groupedBrands[letter].map((brand) => (
                        <a
                          key={brand.slug}
                          href={`/brand/${brand.slug}`}
                          onClick={(e) => { e.preventDefault(); navigateTo(`/brand/${brand.slug}`); }}
                          className="bg-white rounded-lg p-5 shadow-md border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-slate-900 mb-2">{brand.name}</h3>
                              <div className="mb-2">
                                <BrandTypeBadge type={brand.brandType} />
                              </div>
                              <div className="space-y-1 text-sm text-slate-600">
                                <p>{brand.facilityCount} {brand.facilityCount === 1 ? 'location' : 'locations'}</p>
                                <p>{brand.airportCount} {brand.airportCount === 1 ? 'airport' : 'airports'}</p>
                              </div>
                            </div>
                            <Hotel className="w-5 h-5 text-slate-400 flex-shrink-0 ml-2" />
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
                </div>
              )}

              <div className="mt-16 space-y-12">
                <section>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Global Brand Coverage</h2>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    This page includes airport sleep facility brands operating across a global dataset of 200+ facilities in 100+ airports worldwide.
                  </p>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    Brands range from global operators with multiple airport locations to smaller regional providers offering specialized services. Each brand listing shows how many locations and airports it operates in, helping you quickly identify the scale and reliability of each provider.
                  </p>
                  <p className="text-slate-700 leading-relaxed">
                    You can explore how these brands operate across different airports via{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/airports'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                      airports
                    </a>{' '}
                    or compare their offerings across categories such as{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                      sleep pods
                    </a>,{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                      private rooms
                    </a>,{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                      transit hotels
                    </a>, and{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/lounge-sleep'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                      lounge sleep
                    </a>.
                  </p>
                </section>

                <section>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Types of Airport Sleep Facility Brands</h2>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    Airport sleep brands typically fall into four main categories:
                  </p>

                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                          Sleep Pod Brands
                        </a>
                      </h3>
                      <p className="text-slate-700 leading-relaxed">
                        Focused on compact, capsule-style rest solutions for short layovers.
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                          Private Room Providers
                        </a>
                      </h3>
                      <p className="text-slate-700 leading-relaxed">
                        Offer enclosed spaces with beds and workspace for added comfort.
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                          Transit Hotel Brands
                        </a>
                      </h3>
                      <p className="text-slate-700 leading-relaxed">
                        Provide full hotel-style rooms inside or connected to airport terminals.
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/lounge-sleep'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                          Lounge Operators
                        </a>
                      </h3>
                      <p className="text-slate-700 leading-relaxed">
                        Offer seating, quiet areas, and facilities for light rest under{' '}
                        <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/lounge-sleep'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                          lounge sleep
                        </a>.
                      </p>
                    </div>
                  </div>

                  <p className="text-slate-700 leading-relaxed mt-4">
                    Many brands specialize in one category, while others operate across multiple types of facilities.
                  </p>
                </section>

                <section>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">How to Choose the Right Brand</h2>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    Not all brands offer the same experience. When comparing airport sleep brands, consider:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
                    <li>Type of facility offered (pods, rooms, hotels, lounges)</li>
                    <li>Number of locations and airports</li>
                    <li>Pricing structure (hourly vs nightly)</li>
                    <li>Access requirements (airside vs landside)</li>
                    <li>Level of comfort and privacy</li>
                  </ul>
                  <p className="text-slate-700 leading-relaxed">
                    For example, if you need quick rest, brands under{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                      sleep pods
                    </a>{' '}
                    are ideal. For longer stays,{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                      transit hotels
                    </a>{' '}
                    provide better comfort.
                  </p>
                </section>

                <section>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Global vs Regional Brands</h2>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    Some airport sleep brands operate globally across multiple continents, while others are focused on specific regions or airports.
                  </p>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    Global brands typically offer more standardized experiences and booking systems, while regional brands may provide unique or location-specific features.
                  </p>
                  <p className="text-slate-700 leading-relaxed">
                    Exploring both options allows you to find the best fit for your travel needs.
                  </p>
                </section>

                <section>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Brand Choice Matters</h2>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    Choosing the right brand can significantly impact your airport experience.
                  </p>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    Well-established brands often provide:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
                    <li>Consistent quality across locations</li>
                    <li>Reliable booking systems</li>
                    <li>Clear pricing and policies</li>
                  </ul>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    Meanwhile, smaller or local brands may offer:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
                    <li>More flexible pricing</li>
                    <li>Unique layouts or features</li>
                    <li>Less crowded facilities</li>
                  </ul>
                  <p className="text-slate-700 leading-relaxed">
                    Understanding brand differences helps you make better decisions when selecting between{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                      sleep pods
                    </a>,{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                      private rooms
                    </a>, or{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                      transit hotels
                    </a>.
                  </p>
                </section>

                <section>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">How to Use This Brand Directory</h2>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    Use this page to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
                    <li>Compare airport sleep brands</li>
                    <li>Identify brands available at your transit airport</li>
                    <li>Explore different types of facilities</li>
                    <li>Plan your layover more effectively</li>
                  </ul>
                  <p className="text-slate-700 leading-relaxed">
                    Click into each brand to see its locations and available facilities across airports.
                  </p>
                </section>

                <section>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
                  <div className="space-y-3">
                    {faqItems.map((item, index) => (
                      <div key={index} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                        <button
                          onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
                        >
                          <h3 className="text-lg font-semibold text-slate-900">{item.question}</h3>
                          <ChevronDown
                            className={`w-5 h-5 text-slate-600 transition-transform ${
                              openFaqIndex === index ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {openFaqIndex === index && (
                          <div className="px-6 pb-4">
                            <p className="text-slate-700 leading-relaxed">{item.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Final Thoughts on Airport Sleep Facility Brands</h2>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    Airport sleep facility brands play a key role in improving the travel experience for passengers worldwide. From compact{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                      sleep pods
                    </a>{' '}
                    to full-service{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                      transit hotels
                    </a>, these brands provide structured solutions for rest during layovers.
                  </p>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    Understanding how each brand operates, where they are located, and what they offer allows you to make better travel decisions and choose the right option for your needs.
                  </p>
                  <p className="text-slate-700 leading-relaxed">
                    Whether you are looking for quick rest, privacy, or full overnight comfort, selecting the right brand can significantly enhance your journey.
                  </p>
                </section>

                <section>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Explore Airport Sleep Options by Category</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                      <h3 className="text-xl font-bold text-slate-900 mb-3">Sleep Pods in Airports Options</h3>
                      <p className="text-slate-700 leading-relaxed mb-4">
                        Compact, private pods designed for short layovers and quick rest inside terminals.
                      </p>
                      <button
                        onClick={() => navigateTo('/sleep-pods')}
                        className="w-full bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                      >
                        Explore Sleep Pods
                      </button>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                      <h3 className="text-xl font-bold text-slate-900 mb-3">Private Rooms in Airports</h3>
                      <p className="text-slate-700 leading-relaxed mb-4">
                        Enclosed rooms offering more space, privacy, and comfort for medium-length layovers.
                      </p>
                      <button
                        onClick={() => navigateTo('/private-rooms')}
                        className="w-full bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                      >
                        Explore Private Rooms
                      </button>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                      <h3 className="text-xl font-bold text-slate-900 mb-3">Transit Hotels in Airports Options</h3>
                      <p className="text-slate-700 leading-relaxed mb-4">
                        Full hotel rooms located inside or connected to terminals for overnight stays.
                      </p>
                      <button
                        onClick={() => navigateTo('/transit-hotels')}
                        className="w-full bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                      >
                        Explore Transit Hotels
                      </button>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                      <h3 className="text-xl font-bold text-slate-900 mb-3">Airport Lounge Sleep Options</h3>
                      <p className="text-slate-700 leading-relaxed mb-4">
                        Comfortable seating and rest areas inside airport lounges for short breaks.
                      </p>
                      <button
                        onClick={() => navigateTo('/lounge-sleep')}
                        className="w-full bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                      >
                        Explore Lounge Sleep
                      </button>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Choosing the Best Airport Sleep Option</h2>
                  <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
                    <li>
                      For short layovers under 4 hours,{' '}
                      <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/lounge-sleep'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                        lounge sleep
                      </a>{' '}
                      is usually sufficient
                    </li>
                    <li>
                      For 4 to 8 hours,{' '}
                      <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                        sleep pods
                      </a>{' '}
                      or{' '}
                      <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                        private rooms
                      </a>{' '}
                      offer better rest
                    </li>
                    <li>
                      For long or overnight layovers,{' '}
                      <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                        transit hotels
                      </a>{' '}
                      provide the best experience
                    </li>
                  </ul>
                  <p className="text-slate-700 leading-relaxed">
                    Understanding the differences between{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                      sleep pods
                    </a>,{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                      private rooms
                    </a>,{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                      transit hotels
                    </a>, and{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/lounge-sleep'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                      lounge sleep
                    </a>{' '}
                    helps you choose the right option for your journey.
                  </p>
                </section>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
