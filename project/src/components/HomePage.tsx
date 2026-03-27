import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Search,
  Plane,
  Hotel,
  MapPin,
  Filter,
  ChevronDown,
  BedDouble,
  DoorOpen,
  Building2,
  Coffee,
  Globe,
  DollarSign,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { AirportFacility } from '../lib/database.types';
import Header from './Header';
import Footer from './Footer';
import { navigateTo } from '../lib/navigation';

type FilterState = {
  region: string;
  country: string;
  airport: string;
  facilityName: string;
  immigration: string;
  transitSafe: string;
  zone: string;
  connectivity: string;
  eligibility: string;
  cards: string;
};

const ITEMS_PER_PAGE = 12;

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [facilities, setFacilities] = useState<AirportFacility[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<AirportFacility[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    region: '',
    country: '',
    airport: '',
    facilityName: '',
    immigration: '',
    transitSafe: '',
    zone: '',
    connectivity: '',
    eligibility: '',
    cards: '',
  });

  useEffect(() => {
    fetchFacilities();
  }, []);

  useEffect(() => {
    applyFilters();
    setCurrentPage(1);
  }, [searchQuery, filters, facilities]);

  function applyFilters() {
    let filtered = [...facilities];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (f) =>
          f.airport.toLowerCase().includes(query) ||
          f.airport_code.toLowerCase().includes(query) ||
          f.facility.toLowerCase().includes(query) ||
          f.location.toLowerCase().includes(query) ||
          f.type.toLowerCase().includes(query) ||
          f.zone.toLowerCase().includes(query)
      );
    }

    if (filters.airport) {
      filtered = filtered.filter((f) => f.airport_code === filters.airport);
    }

    if (filters.facilityName) {
      filtered = filtered.filter((f) => f.facility === filters.facilityName);
    }

    if (filters.immigration) {
      filtered = filtered.filter((f) => f.immigration === filters.immigration);
    }

    if (filters.transitSafe) {
      const isSafe = filters.transitSafe === 'yes';
      filtered = filtered.filter((f) => f.transit_safe === isSafe);
    }

    if (filters.zone) {
      filtered = filtered.filter((f) => f.zone === filters.zone);
    }

    if (filters.connectivity) {
      filtered = filtered.filter((f) => f.connectivity === filters.connectivity);
    }

    if (filters.eligibility) {
      filtered = filtered.filter((f) => f.eligibility === filters.eligibility);
    }

    if (filters.cards) {
      filtered = filtered.filter((f) => f.cards && f.cards.includes(filters.cards));
    }

    setFilteredFacilities(filtered);
  }

  async function fetchFacilities() {
    setLoading(true);

    const { data, error } = await supabase
      .from('airport_facilities')
      .select('*')
      .order('airport', { ascending: true });

    if (error) {
      console.error('Error fetching facilities:', error);
    } else {
      setFacilities(data || []);
    }

    setLoading(false);
  }

  const stats = {
    airports: new Set(facilities.map((f) => f.airport_code)).size,
    facilities: facilities.length,
    countries: new Set(
      facilities.map((f) => {
        const match = f.airport.match(/\(([A-Z]{3})\)/);
        return match ? match[1].slice(0, 2) : '';
      })
    ).size,
  };

  const uniqueAirports = Array.from(new Set(facilities.map((f) => f.airport_code)))
    .map((code) => {
      const facility = facilities.find((f) => f.airport_code === code);
      return { code, name: facility?.airport || code };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const uniqueZones = Array.from(new Set(facilities.map((f) => f.zone))).sort();
  const uniqueImmigration = Array.from(new Set(facilities.map((f) => f.immigration))).sort();
  const uniqueFacilities = Array.from(new Set(facilities.map((f) => f.facility))).sort();
  const uniqueConnectivity = Array.from(new Set(facilities.map((f) => f.connectivity))).sort();
  const uniqueEligibility = Array.from(new Set(facilities.map((f) => f.eligibility))).sort();

  const hasActiveFilters = Object.values(filters).some((v) => v !== '');
  const displayFacilities = hasActiveFilters || searchQuery.trim() ? filteredFacilities : facilities;

  const faqItems = [
    {
      question: 'Do I need to clear immigration to use a transit hotel or sleep pod?',
      answer:
        'It depends on where the facility is located. Airside facilities — including most sleep pod brands and transit hotels like Aerotel, YOTELAIR, and Oryx — are accessible without clearing immigration. You stay within the secure terminal zone. Landside facilities require you to exit the secure area, which means clearing immigration and potentially needing a transit or entry visa. Always check whether a facility is airside or landside before booking.',
    },
    {
      question: 'What is the difference between a sleep pod, private room, transit hotel, and lounge?',
      answer:
        'Sleep pods are compact, capsule-style units booked by the hour — best for 2–6 hour layovers. Private rooms are larger, lockable rooms inside the terminal with more space, priced hourly or by short-stay block. Transit hotels are full hotel rooms, usually with a bed, shower, and hotel services — designed for 6–12+ hour stays or overnights. Lounges are shared spaces with seating, food, and sometimes rest chairs — not designed for actual sleep but useful for shorter layovers with included meal service.',
    },
    {
      question: 'Can I use airport rest facilities without a visa during a transit stop?',
      answer:
        'Yes, if the facility is airside. Airside transit hotels, sleep pods, and private rooms are accessible after security screening but before immigration. No visa or entry permit is required. If you need a facility landside — outside the secure zone — you will need to check visa-free access rules for that country. Nationals of some countries require a transit visa even to remain in the international zone.',
    },
    {
      question: 'How much does a transit hotel inside an airport cost?',
      answer:
        'Airside transit hotel rates typically start at $80–$120 for a short stay (4–6 hours) and $120–$250 for an overnight stay. Premium brands like YOTELAIR and Aerotel charge at the higher end, especially at major European and Middle Eastern hubs. Pricing varies by airport, room type, and duration.',
    },
    {
      question: 'Which airports have the best sleep and rest facilities?',
      answer:
        'Singapore Changi (SIN), Seoul Incheon (ICN), Doha Hamad (DOH), Dubai International (DXB), Amsterdam Schiphol (AMS), and Munich (MUC) consistently rank highest. These airports offer a full range of airside options: sleep pods, transit hotels, private rooms, shower facilities, and free rest zones — all without requiring immigration clearance.',
    },
    {
      question: 'Are airport sleep pods safe?',
      answer:
        'Yes. Sleep pods at major international airports are in secure, staffed areas within the terminal. Most have lockable doors or privacy screens, and pods located airside are within the security perimeter. Standard precautions apply: keep your boarding pass and valuables with you, and use a bag lock if sleeping.',
    },
    {
      question: 'Can I book airport rest facilities in advance?',
      answer:
        'Most providers allow — and recommend — advance booking, especially at busy hubs. YOTELAIR, Aerotel, Minute Suites, and Plaza Premium all have online booking systems. Sleep pod brands like GoSleep and Napcabs are typically walk-in only. For overnight stays or layovers longer than 8 hours, advance booking is strongly advised.',
    },
    {
      question: 'What do airport lounges offer for sleeping?',
      answer:
        'Standard airport lounges offer comfortable seating, food, drinks, and sometimes shower access — but they are not designed for sleeping. Most lounges have armchair-style seating rather than flat beds, shared spaces with noise, and no guaranteed quiet hours. If actual rest is the priority for a layover over 4 hours, sleep pods or private rooms deliver significantly better conditions.',
    },
    {
      question: 'What is the cheapest way to rest at an airport?',
      answer:
        'The cheapest option is free terminal seating in quiet zones, available at most major airports. For paid facilities, sleep pods are typically the most affordable at $10–$30/hour. Airport lounges accessed via credit card membership (e.g., Priority Pass, Amex Centurion) offer the best value if you already hold a qualifying card, as they include food and drinks in the access fee.',
    },
    {
      question: 'How do I find what rest facilities are available at my specific airport?',
      answer:
        'Search by airport name or IATA code on RestInAirport. Each airport page lists all available facilities — sleep pods, transit hotels, private rooms, lounges, and free zones — with airside/landside status, terminal location, pricing, and opening hours. You can also filter by rest type, transit eligibility, and amenities.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <Helmet>
        <title>RestInAirport.com - Find Airport Lounges, Hotels & Rest Facilities Worldwide</title>
        <meta name="description" content="Find the best airport rest facilities worldwide. Compare lounges, pod hotels, sleep pods and transit hotels across major international airports." />
        <meta name="keywords" content="airport hotels, airport rest facilities, sleep pods, transit hotels, layover hotels, airport lounges, international transit" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href="https://restinairport.com/" />
        <meta property="og:title" content="RestInAirport.com - Find Airport Lounges, Hotels & Rest Facilities Worldwide" />
        <meta property="og:description" content="Find the best airport rest facilities worldwide. Compare lounges, pod hotels, sleep pods and transit hotels across major international airports." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://restinairport.com/" />
        <meta property="og:site_name" content="RestInAirport.com" />
        <meta property="og:image" content="https://restinairport.com/immigration_OG.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="RestInAirport.com - Find Airport Lounges, Hotels & Rest Facilities Worldwide" />
        <meta name="twitter:description" content="Find the best airport rest facilities worldwide. Compare lounges, pod hotels, sleep pods and transit hotels across major international airports." />
        <meta name="twitter:image" content="https://restinairport.com/immigration_OG.png" />
      </Helmet>
      <Header />

      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDMiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40" />

      <div className="relative flex-1">
        <header className="pt-8 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <Plane className="w-12 h-12 text-slate-700 mr-3" />
                <h1 className="text-5xl font-bold text-slate-900">RestInAirport.com</h1>
              </div>

              <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                Find the <span className="font-bold">Perfect Rest</span> at Any Airport
                <br />
                Sleep pods, transit hotels, and quiet spaces for every layover.
              </p>

              <div className="max-w-3xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
                  <input
                    type="text"
                    placeholder="Search by airport, region, facility, or country (e.g., Singapore, BKK, Tokyo)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoComplete="off"
                    list="search-suggestions"
                    className="w-full pl-16 pr-6 py-5 text-lg border-2 border-slate-300 rounded-2xl focus:outline-none focus:ring-4 focus:ring-slate-300 focus:border-slate-500 shadow-lg transition-all bg-white"
                  />

                  <datalist id="search-suggestions">
                    {uniqueAirports.map((airport) => (
                      <option key={airport.code} value={airport.name} />
                    ))}
                    {Array.from(new Set(facilities.map((f) => f.facility))).map((name) => (
                      <option key={name} value={name} />
                    ))}
                  </datalist>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-300 border-t-slate-700" />
              <p className="mt-4 text-slate-600">Loading facilities...</p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center">
                    <Filter className="w-5 h-5 mr-2" />
                    Filters
                  </h2>

                  {hasActiveFilters && (
                    <button
                      onClick={() =>
                        setFilters({
                          region: '',
                          country: '',
                          airport: '',
                          facilityName: '',
                          immigration: '',
                          transitSafe: '',
                          zone: '',
                          connectivity: '',
                          eligibility: '',
                          cards: '',
                        })
                      }
                      className="text-sm text-slate-600 hover:text-slate-900"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Airport</label>
                    <select
                      value={filters.airport}
                      onChange={(e) => setFilters({ ...filters, airport: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                    >
                      <option value="">All Airports</option>
                      {uniqueAirports.map((airport) => (
                        <option key={airport.code} value={airport.code}>
                          {airport.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Facility Name</label>
                    <select
                      value={filters.facilityName}
                      onChange={(e) => setFilters({ ...filters, facilityName: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                    >
                      <option value="">All Facilities</option>
                      {uniqueFacilities.map((facility) => (
                        <option key={facility} value={facility}>
                          {facility}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Transit Safe</label>
                    <select
                      value={filters.transitSafe}
                      onChange={(e) => setFilters({ ...filters, transitSafe: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                    >
                      <option value="">All</option>
                      <option value="yes">No Immigration Required</option>
                      <option value="no">Immigration Required</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Zone</label>
                    <select
                      value={filters.zone}
                      onChange={(e) => setFilters({ ...filters, zone: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                    >
                      <option value="">All Zones</option>
                      {uniqueZones.map((zone) => (
                        <option key={zone} value={zone}>
                          {zone}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="flex items-center text-sm text-slate-700 hover:text-slate-900 font-medium"
                >
                  <ChevronDown
                    className={`w-4 h-4 mr-1 transition-transform ${
                      showAdvancedFilters ? 'rotate-180' : ''
                    }`}
                  />
                  {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
                </button>

                {showAdvancedFilters && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-200">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Immigration</label>
                      <select
                        value={filters.immigration}
                        onChange={(e) => setFilters({ ...filters, immigration: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                      >
                        <option value="">All</option>
                        {uniqueImmigration.map((imm) => (
                          <option key={imm} value={imm}>
                            {imm}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Connectivity</label>
                      <select
                        value={filters.connectivity}
                        onChange={(e) => setFilters({ ...filters, connectivity: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                      >
                        <option value="">All</option>
                        {uniqueConnectivity.map((conn) => (
                          <option key={conn} value={conn}>
                            {conn}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Eligibility</label>
                      <select
                        value={filters.eligibility}
                        onChange={(e) => setFilters({ ...filters, eligibility: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                      >
                        <option value="">All</option>
                        {uniqueEligibility.map((elig) => (
                          <option key={elig} value={elig}>
                            {elig}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Cards</label>
                      <select
                        value={filters.cards}
                        onChange={(e) => setFilters({ ...filters, cards: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400"
                      >
                        <option value="">All</option>
                        <option value="PP">PP (Priority Pass)</option>
                        <option value="LK">LK (LoungeKey)</option>
                        <option value="DP">DP (DragonPass)</option>
                        <option value="Partial">Partial</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 mb-8">
                <h2 className="text-2xl font-bold text-slate-900">
                  {displayFacilities.length} {displayFacilities.length === 1 ? 'Facility' : 'Facilities'} at {stats.airports} {stats.airports === 1 ? 'Airport' : 'Airports'}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {(() => {
                  const totalPages = Math.ceil(displayFacilities.length / ITEMS_PER_PAGE);
                  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
                  const endIndex = startIndex + ITEMS_PER_PAGE;
                  const paginatedFacilities = displayFacilities.slice(startIndex, endIndex);

                  return paginatedFacilities.map((facility) => (
                    <a
                      key={facility.id}
                      href={`/facility/${facility.slug}`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo(`/facility/${facility.slug}`);
                      }}
                      className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow flex flex-col"
                    >
                      <div className="bg-gradient-to-r from-slate-700 to-slate-600 text-white px-4 py-3">
                        <div className="text-xs font-medium opacity-90 mb-1">{facility.airport}</div>
                        <h3 className="font-bold text-lg leading-tight">{facility.facility}</h3>
                      </div>

                      <div className="p-4 flex-1 flex flex-col">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-start text-sm">
                            <MapPin className="w-4 h-4 mr-2 text-slate-500 flex-shrink-0 mt-0.5" />
                            <span className="text-slate-700">{facility.location}</span>
                          </div>

                          <div className="flex items-start text-sm">
                            <Hotel className="w-4 h-4 mr-2 text-slate-500 flex-shrink-0 mt-0.5" />
                            <span className="text-slate-700">{facility.type}</span>
                          </div>

                          <div className="flex items-start text-sm">
                            <ShieldCheck className="w-4 h-4 mr-2 text-slate-500 flex-shrink-0 mt-0.5" />
                            <span className="text-slate-700">
                              {facility.transit_safe ? 'No Immigration' : 'Immigration Req.'}
                            </span>
                          </div>

                          <div className="flex items-start text-sm">
                            <DollarSign className="w-4 h-4 mr-2 text-slate-500 flex-shrink-0 mt-0.5" />
                            <span className="text-slate-700 font-semibold">{facility.price}</span>
                          </div>
                        </div>

                        {facility.transit_safe && (
                          <div className="mt-3 pt-3 border-t border-slate-200">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Transit Safe
                            </span>
                          </div>
                        )}
                      </div>
                    </a>
                  ));
                })()}
              </div>

              {(() => {
                const totalPages = Math.ceil(displayFacilities.length / ITEMS_PER_PAGE);
                return totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 mb-8">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md border border-slate-200 hover:shadow-lg hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      <span className="font-medium">Previous</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-lg font-medium transition-all ${
                            currentPage === page
                              ? 'bg-slate-700 text-white shadow-lg'
                              : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:shadow-md'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md border border-slate-200 hover:shadow-lg hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md transition-all"
                    >
                      <span className="font-medium">Next</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                );
              })()}

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 mb-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-6">
                  Find Somewhere to Rest at Any Airport, Anywhere in the World
                </h2>

                <p className="text-lg text-slate-700 leading-relaxed mb-4">
                  RestInAirport.com is a global directory of rest facilities at airports worldwide. We
                  catalog every type of resting option available inside airport terminals, including{' '}
                  <a
                    href="/sleep-pods"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('/sleep-pods');
                    }}
                    className="text-slate-900 font-semibold hover:underline"
                  >
                    sleep pods
                  </a>
                  , pay-per-use nap cabins,{' '}
                  <a
                    href="/lounge-sleep"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('/lounge-sleep');
                    }}
                    className="text-slate-900 font-semibold hover:underline"
                  >
                    airport lounges
                  </a>
                  , free quiet zones, recliner seating areas, shower facilities, and{' '}
                  <a
                    href="/transit-hotels"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('/transit-hotels');
                    }}
                    className="text-slate-900 font-semibold hover:underline"
                  >
                    in-terminal transit hotels
                  </a>
                  . Each listing tells you exactly where to go, how much it costs, what hours it
                  operates, and what other travelers have said about it.
                </p>
              </div>

              <div className="mb-8">
                <div
                  dangerouslySetInnerHTML={{
                    __html: `<div style="width:100%;margin-top:10px;all:unset;"><style scoped> .brandpush-logo-container-item { height: auto; width: 100%; position: relative; padding: 25px 50px; } .brandpush-vertical-center { height: inherit; display: flex; align-content: center; flex-wrap: wrap; flex-direction: row; justify-content: center; align-content: center; align-items: center; } .brandpush-vertical-center img.brandpush-news-logo{ max-width: 100px; max-height: 66px; min-width: 50px; min-height: 14px; height: auto; width: auto; margin: 7px 10px; overflow: visible; } .brandpush-trust-badge, .brandpush-title, .brandpush-footer{ font-family: sans-serif !important; } .brandpush-title:before, .brandpush-title:after { content: ""; flex: 1 1; border-bottom: 1px solid #d8d8d8; margin: auto; width: 27%; display: block; position: relative; } .brandpush-title:before{ margin-left: 30px; top:12px; width: 25.5%; } .brandpush-title:after{ margin-right: 30px; top: -13px; } @media screen and (min-width: 585px) { .brandpush-logo-container{padding: 0 20px;} } @media screen and (max-width: 584px) { .brandpush-news-logo {max-width:70px !important;} .brandpush-title {font-size: 15px;top: -5px;letter-spacing: 6px;} .brandpush-title:before, .brandpush-title:after{border-bottom:none !important;} .brandpush-leaf{display:none !important;} } @media screen and (max-width: 340px) { .brandpush-title-hr {display:none !important;} .brandpush-title {font-size:14px;padding:0 !important;} .brandpush-footer {font-size:11px !important;margin:20px 0 25px 0 !important;letter-spacing: 2px !important;} .brandpush-news-logo{max-width:50px !important;} } .brandpush-logo-container{ text-align: center; margin: 0 auto 0 auto; display: flex; align-content: center; justify-content: space-between; align-items: center; flex-wrap: nowrap; flex-direction: row; } .brandpush-newslogos { display:inline-block; position:relative; } </style><div id="brandpush-trust-badge" style="position: relative;width:100%;background:#ffffff;border-radius:10px;min-height:180px;margin-left: auto;margin-right: auto;padding-bottom:12px;"><div style="text-align:center;padding:0px 5px 10px 5px;font-size: 18px;font-family: sans-serif;font-weight: 600;letter-spacing: 8px;line-height: 1.3;"><div style="height: 58px;"><span class="brandpush-title" style="z-index: 1; position: relative; padding: 0 20px;margin:0;color:#0e0e0e;">AS SEEN ON</span></div><div class="brandpush-logo-container"><img class="brandpush-leaf" alt="Trust Reef" style="position:absolute;height: 110px;left: 25px;margin:0;padding:0;z-index: 0;opacity: 0.2;" src="https://www.brandpush.co/cdn-cgi/imagedelivery/gKm6BYVdHCj_SVQET_Msrw/3fb10293-8878-4ce5-5496-cef376fe9300/public"><img class="brandpush-leaf" alt="Trust Reef" style="position:absolute;height: 110px;right: 25px;margin:0;padding:0;z-index: 0;opacity: 0.2;-webkit-transform: scaleX(-1);transform: scaleX(-1);" src="https://www.brandpush.co/cdn-cgi/imagedelivery/gKm6BYVdHCj_SVQET_Msrw/3fb10293-8878-4ce5-5496-cef376fe9300/public"><div class="brandpush-logo-container-item"><div class="brandpush-vertical-center"><a href="https://money.mymotherlode.com/clarkebroadcasting.mymotherlode/news/article/marketersmedia-2026-3-17-visainfoguidecom-launches-enhanced-2026-global-travel-intelligence-platform-to-simplify-complex-international-visa-requirements-and-entry-rules-for-travelers-worldwide" target="_Blank" class="brandpush-newslogos"><img alt="Featured on My Mother Lode" class="brandpush-news-logo" style="margin-right: 14px;" src="https://www.brandpush.co/cdn-cgi/imagedelivery/gKm6BYVdHCj_SVQET_Msrw/d3e046d7-03ea-40d6-f101-13d5098e6700/public"></a><a href="http://markets.chroniclejournal.com/chroniclejournal/news/article/marketersmedia-2026-3-17-visainfoguidecom-launches-enhanced-2026-global-travel-intelligence-platform-to-simplify-complex-international-visa-requirements-and-entry-rules-for-travelers-worldwide" target="_Blank" class="brandpush-newslogos"><img alt="Featured on The Chronicle Journal" class="brandpush-news-logo" style="margin-right: 14px;" src="https://www.brandpush.co/cdn-cgi/imagedelivery/gKm6BYVdHCj_SVQET_Msrw/ac708810-3bf8-4cd0-f934-a3f51cd64e00/public"></a><a href="http://finance.minyanville.com/minyanville/news/article/marketersmedia-2026-3-17-visainfoguidecom-launches-enhanced-2026-global-travel-intelligence-platform-to-simplify-complex-international-visa-requirements-and-entry-rules-for-travelers-worldwide" target="_Blank" class="brandpush-newslogos"><img alt="Featured on Minyanville" class="brandpush-news-logo" style="margin-right: 14px;" src="https://www.brandpush.co/cdn-cgi/imagedelivery/gKm6BYVdHCj_SVQET_Msrw/b79268ce-3bb2-42ee-7919-7c650b840700/public"></a></div></div></div><div style="margin-top:0px;font-family: sans-serif !important;"><span class="brandpush-footer" style=" text-align: center; padding: 0 20px; font-size: 13px; font-family: sans-serif; font-weight: 600; letter-spacing: 3px; position: relative; width: 100%; margin: 0 0 8px 0; display: inline-block; color: #a5a5a5;">AND OVER 350 NEWS SITES</span><div style="color:#717171;font-size:10px;letter-spacing:0;height: 15px;margin: 3px 0 0 0;display: flex;justify-content: center;align-content: center;align-items: center;"><img style="width:12px;margin:0 3px 0 0;" src="https://www.brandpush.co/cdn-cgi/imagedelivery/gKm6BYVdHCj_SVQET_Msrw/5e5b9b47-6288-4640-2b2a-cd2459605c00/public"><span style="font-family: sans-serif !important;">Verified by <a style="color:#717171;" href="https://www.brandpush.co?utm_source=Client+Referral&utm_medium=Trust+Badge&utm_campaign=Trust+Badge&utm_content=1773393683134" target="_Blank">BrandPush.co</a></span></div></div></div></div></div>`,
                  }}
                />
              </div>

              <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200 text-center">
                  <Plane className="w-8 h-8 text-slate-700 mb-3 mx-auto" />
                  <div className="text-3xl font-bold text-slate-900">Global</div>
                  <div className="text-slate-600 mt-1">Coverage</div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200 text-center">
                  <Globe className="w-8 h-8 text-slate-700 mb-3 mx-auto" />
                  <div className="text-3xl font-bold text-slate-900">{stats.countries}</div>
                  <div className="text-slate-600 mt-1">Countries Covered</div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200 text-center">
                  <MapPin className="w-8 h-8 text-slate-700 mb-3 mx-auto" />
                  <div className="text-3xl font-bold text-slate-900">{stats.airports}</div>
                  <div className="text-slate-600 mt-1">Airports Covered</div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200 text-center">
                  <Hotel className="w-8 h-8 text-slate-700 mb-3 mx-auto" />
                  <div className="text-3xl font-bold text-slate-900">{stats.facilities}</div>
                  <div className="text-slate-600 mt-1">Rest Facilities</div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 mt-8">
                <p className="text-lg text-slate-700 leading-relaxed mb-8">
                  Finding a place to rest at an airport used to mean wandering the terminal and hoping
                  for the best. RestInAirport.com gives you the information before you arrive, so you
                  can go directly to the right facility without wasting time. Whether you have a
                  two-hour connection, an overnight layover, or an unexpected delay, there is a rest
                  option that fits your situation.{' '}
                  <a
                    href="/airports"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('/airports');
                    }}
                    className="text-slate-900 font-semibold hover:underline"
                  >
                    Search your airport
                  </a>{' '}
                  to see everything available.
                </p>

                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  How to Find Your Rest Facility
                </h2>

                <p className="text-lg text-slate-700 leading-relaxed mb-8">
                  Search for your airport by name or IATA code. Browse all rest facilities available,
                  filtered by type, terminal, cost, and traveler rating. Get the exact location, hours,
                  pricing, and tips so you can go straight there without wasting time.
                </p>

                <h2 className="text-2xl font-bold text-slate-900 mb-4">How It Works</h2>

                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <div className="bg-slate-100 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                      <span className="text-xl font-bold text-slate-700">1</span>
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">Search Your Airport</h3>
                    <p className="text-slate-600">
                      Enter your airport code, city name, or browse by region.
                    </p>
                  </div>

                  <div>
                    <div className="bg-slate-100 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                      <span className="text-xl font-bold text-slate-700">2</span>
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">Compare Options</h3>
                    <p className="text-slate-600">
                      View details on hotels, pods, prices, and transit accessibility.
                    </p>
                  </div>

                  <div>
                    <div className="bg-slate-100 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                      <span className="text-xl font-bold text-slate-700">3</span>
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2">Rest Easy</h3>
                    <p className="text-slate-600">Book your rest facility and enjoy your layover.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                <a
                  href="/sleep-pods"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/sleep-pods');
                  }}
                  className="group bg-white rounded-xl p-6 shadow-md border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center mb-3">
                    <div className="bg-slate-100 rounded-full p-3 mr-3 group-hover:bg-slate-700 transition-colors">
                      <BedDouble className="w-6 h-6 text-slate-700 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                      Sleep Pods
                    </h3>
                  </div>
                  <p className="text-sm text-slate-600">
                    Compact capsules for quick rest during layovers
                  </p>
                </a>

                <a
                  href="/private-rooms"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/private-rooms');
                  }}
                  className="group bg-white rounded-xl p-6 shadow-md border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center mb-3">
                    <div className="bg-slate-100 rounded-full p-3 mr-3 group-hover:bg-slate-700 transition-colors">
                      <DoorOpen className="w-6 h-6 text-slate-700 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                      Private Rooms
                    </h3>
                  </div>
                  <p className="text-sm text-slate-600">
                    Spacious suites with beds and private bathrooms
                  </p>
                </a>

                <a
                  href="/transit-hotels"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/transit-hotels');
                  }}
                  className="group bg-white rounded-xl p-6 shadow-md border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center mb-3">
                    <div className="bg-slate-100 rounded-full p-3 mr-3 group-hover:bg-slate-700 transition-colors">
                      <Building2 className="w-6 h-6 text-slate-700 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                      Transit Hotels
                    </h3>
                  </div>
                  <p className="text-sm text-slate-600">
                    Full-service hotels inside airport terminals
                  </p>
                </a>

                <a
                  href="/lounge-sleep"
                  onClick={(e) => {
                    e.preventDefault();
                    navigateTo('/lounge-sleep');
                  }}
                  className="group bg-white rounded-xl p-6 shadow-md border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center mb-3">
                    <div className="bg-slate-100 rounded-full p-3 mr-3 group-hover:bg-slate-700 transition-colors">
                      <Coffee className="w-6 h-6 text-slate-700 group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
                      Lounge Sleep
                    </h3>
                  </div>
                  <p className="text-sm text-slate-600">
                    Airport lounges with rest areas and comfort
                  </p>
                </a>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 mt-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  Frequently Asked Questions About Resting at Airports
                </h2>

                <div className="space-y-3">
                  {faqItems.map((faq, index) => (
                    <div key={index} className="border border-slate-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
                      >
                        <h3 className="font-bold text-slate-900">{faq.question}</h3>
                        <ChevronDown
                          className={`w-5 h-5 text-slate-600 transition-transform ${
                            openFaqIndex === index ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {openFaqIndex === index && (
                        <div className="px-6 py-4 bg-white">
                          <p className="text-slate-700 leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200 mt-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  About RestInAirport
                </h2>

                <div className="space-y-4 text-lg text-slate-700 leading-relaxed">
                  <p>
                    RestInAirport is a directory of airport rest facilities worldwide — covering{' '}
                    <a
                      href="/sleep-pods"
                      onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }}
                      className="text-slate-900 font-semibold hover:underline"
                    >
                      sleep pods
                    </a>
                    ,{' '}
                    <a
                      href="/private-rooms"
                      onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }}
                      className="text-slate-900 font-semibold hover:underline"
                    >
                      private rooms
                    </a>
                    ,{' '}
                    <a
                      href="/transit-hotels"
                      onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }}
                      className="text-slate-900 font-semibold hover:underline"
                    >
                      transit hotels
                    </a>
                    , and{' '}
                    <a
                      href="/lounge-sleep"
                      onClick={(e) => { e.preventDefault(); navigateTo('/lounge-sleep'); }}
                      className="text-slate-900 font-semibold hover:underline"
                    >
                      lounge rest options
                    </a>{' '}
                    at hundreds of international airports. Every listing includes terminal location, airside or landside status, pricing, and access requirements so you can plan before you arrive.
                  </p>

                  <p>
                    The most important factor for transit passengers is whether a facility is airside — accessible without clearing immigration — or landside, which requires exiting the secure zone and may require a visa. RestInAirport flags this clearly for every listing. If you need to understand your transit visa options, check{' '}
                    <a
                      href="https://visainfoguide.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-900 font-semibold hover:underline"
                    >
                      VisaInfoGuide.com
                    </a>{' '}
                    for country-specific entry rules before booking a landside facility.
                  </p>

                  <p>
                    Browse by{' '}
                    <a
                      href="/airports"
                      onClick={(e) => { e.preventDefault(); navigateTo('/airports'); }}
                      className="text-slate-900 font-semibold hover:underline"
                    >
                      airport
                    </a>
                    , by rest type, or by brand to find the right option for your layover duration and access situation. Every listing is updated regularly to reflect current availability.
                  </p>
                </div>
              </div>

              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-8 mt-8">
                <div className="flex items-start gap-4">
                  <div className="bg-sky-100 rounded-full p-3 flex-shrink-0">
                    <ShieldCheck className="w-6 h-6 text-sky-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-sky-900 mb-2">Planning a Landside Stop?</h3>
                    <p className="text-sky-800 leading-relaxed">
                      If you need to exit the secure zone to reach a hotel or rest facility, you may need a transit visa depending on your nationality and destination country. Check visa-free access and airside transit rules at{' '}
                      <a
                        href="https://visainfoguide.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold underline hover:text-sky-900"
                      >
                        VisaInfoGuide.com
                      </a>{' '}
                      before booking.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}