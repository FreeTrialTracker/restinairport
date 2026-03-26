import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPin, Loader, ChevronDown, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { AirportFacility } from '../lib/database.types';
import Header from './Header';
import Footer from './Footer';
import { updatePageMeta } from '../lib/seo';
import { getAirportSlug } from '../lib/categories';
import { navigateTo } from '../lib/navigation';

interface Airport {
  code: string;
  name: string;
  facilityCount: number;
  slug: string;
}

export default function AirportsPage() {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [filteredAirports, setFilteredAirports] = useState<Airport[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    updatePageMeta(
      'Airports with Sleep Facilities Worldwide | RestInAirport.com',
      'Browse airports worldwide with sleep facilities including sleep pods, transit hotels, private rooms, and lounge rest areas. Find the best airport sleep options without leaving the terminal.',
      `${window.location.origin}/airports`
    );
    fetchAirports();
  }, []);

  async function fetchAirports() {
    setLoading(true);
    const { data, error } = await supabase
      .from('airport_facilities')
      .select('airport, airport_code')
      .order('airport', { ascending: true });

    if (error) {
      console.error('Error fetching airports:', error);
    } else {
      const airportMap = new Map<string, { name: string; count: number }>();

      data?.forEach((facility) => {
        if (airportMap.has(facility.airport_code)) {
          const existing = airportMap.get(facility.airport_code)!;
          airportMap.set(facility.airport_code, {
            name: existing.name,
            count: existing.count + 1
          });
        } else {
          airportMap.set(facility.airport_code, {
            name: facility.airport,
            count: 1
          });
        }
      });

      const airportList: Airport[] = Array.from(airportMap.entries()).map(([code, data]) => ({
        code,
        name: data.name,
        facilityCount: data.count,
        slug: getAirportSlug(data.name, code)
      }));

      airportList.sort((a, b) => a.name.localeCompare(b.name));
      setAirports(airportList);
      setFilteredAirports(airportList);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const filtered = airports.filter(
        airport =>
          airport.name.toLowerCase().includes(query) ||
          airport.code.toLowerCase().includes(query)
      );
      setFilteredAirports(filtered);
    } else {
      setFilteredAirports(airports);
    }
  }, [searchQuery, airports]);

  const groupedAirports = filteredAirports.reduce((acc, airport) => {
    const firstLetter = airport.name[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(airport);
    return acc;
  }, {} as Record<string, Airport[]>);

  const faqItems = [
    {
      question: 'Can you sleep in airports during layovers?',
      answer: 'Yes, many airports offer sleep facilities such as Sleep Pods, Private Rooms, Transit Hotels, and Lounge Sleep.'
    },
    {
      question: 'Which airports have sleep pods?',
      answer: 'Major international airports such as Doha, Dubai, and Tokyo offer sleep pod facilities.'
    },
    {
      question: 'Do all airports have transit hotels?',
      answer: 'No, transit hotels are typically available only in larger international hubs.'
    },
    {
      question: 'Can you sleep in airports without a visa?',
      answer: 'Yes, if you stay in airside facilities such as Sleep Pods or airside Transit Hotels.'
    },
    {
      question: 'What is the best airport sleep option?',
      answer: 'It depends on your layover duration. Short layovers suit Sleep Pods, while long stays are better for Transit Hotels.'
    },
    {
      question: 'Are airport lounges good for sleeping?',
      answer: 'They are suitable for light rest under Lounge Sleep, but not ideal for deep sleep.'
    },
    {
      question: 'How much do airport sleep facilities cost?',
      answer: 'Costs vary widely, from lounge access fees to hourly pod rentals and full hotel rates.'
    },
    {
      question: 'Are airport sleep pods safe?',
      answer: 'Yes, they are located in secure areas within airport terminals.'
    },
    {
      question: 'What is the difference between private rooms and transit hotels?',
      answer: 'Private Rooms are smaller and flexible, while Transit Hotels offer full hotel-style accommodations.'
    },
    {
      question: 'How do I find sleep facilities at an airport?',
      answer: 'Use this directory to browse airports and explore available options based on your travel needs.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <Helmet>
        <title>Airports with Sleep Facilities Worldwide | RestInAirport.com</title>
        <meta name="description" content="Browse airports worldwide with sleep facilities including sleep pods, transit hotels, private rooms, and lounge rest areas. Find the best airport sleep options without leaving the terminal." />
        <link rel="canonical" href="https://restinairport.com/airports" />
        <meta property="og:title" content="Airports with Sleep Facilities Worldwide | RestInAirport.com" />
        <meta property="og:description" content="Browse airports worldwide with sleep facilities including sleep pods, transit hotels, private rooms, and lounge rest areas." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://restinairport.com/airports" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Airports with Sleep Facilities Worldwide | RestInAirport.com" />
        <meta name="twitter:description" content="Browse airports worldwide with sleep facilities including sleep pods, transit hotels, private rooms, and lounge rest areas." />
      </Helmet>
      <Header />

      <main className="flex-1">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Airports with Sleep Facilities Worldwide (2026 Guide)</h1>

            <div className="flex items-center space-x-2 mt-8">
              <MapPin className="w-6 h-6" />
              <div>
                <div className="text-2xl font-bold">{filteredAirports.length}</div>
                <div className="text-sm text-slate-300">Airports</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="prose prose-slate max-w-none mb-12">
            <p className="text-lg text-slate-700 leading-relaxed">
              Browse airports worldwide with sleep facilities including sleep pods, transit hotels, private rooms, and lounge rest areas. Whether you have a short layover or an overnight transit, find the best airport sleep options without leaving the terminal.
            </p>
          </div>
          {loading ? (
            <div className="text-center py-20">
              <Loader className="inline-block animate-spin w-12 h-12 text-slate-700" />
              <p className="mt-4 text-slate-600">Loading airports...</p>
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
                    placeholder="Search by airport name or code (e.g., Singapore, BKK, Tokyo)..."
                    className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-slate-900 placeholder:text-slate-500"
                  />
                </div>
              </div>

              {filteredAirports.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 shadow-lg border border-slate-200 text-center">
                  <p className="text-xl text-slate-600">
                    No airports found for "{searchQuery}"
                  </p>
                  <p className="text-slate-500 mt-2">
                    Try searching for a different airport name or code.
                  </p>
                </div>
              ) : (
                <div className="space-y-12">
                {Object.keys(groupedAirports).sort().map((letter) => (
                  <div key={letter}>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b-2 border-slate-300">
                      {letter}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {groupedAirports[letter].map((airport) => (
                        <a
                          key={airport.code}
                          href={`/airport/${airport.slug}`}
                          onClick={(e) => { e.preventDefault(); navigateTo(`/airport/${airport.slug}`); }}
                          className="bg-white rounded-lg p-5 shadow-md border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-slate-900 mb-1">{airport.name}</h3>
                              <p className="text-sm text-slate-600">
                                {airport.facilityCount} {airport.facilityCount === 1 ? 'facility' : 'facilities'}
                              </p>
                            </div>
                            <MapPin className="w-5 h-5 text-slate-400 flex-shrink-0 ml-2" />
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
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Global Airport Coverage</h2>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    This directory includes airports with verified rest facilities from a global dataset of 200+ airport sleep facilities across 100+ airports worldwide.
                  </p>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    You can explore airports by region, compare available sleep options, and identify whether facilities are accessible without immigration. Each airport listing provides a breakdown of available options including{' '}
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
                  <p className="text-slate-700 leading-relaxed">
                    This allows you to quickly understand what is available before you travel.
                  </p>
                </section>

                <section>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">What Sleep Options Are Available at Airports?</h2>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    Airports offer different types of rest facilities depending on size, location, and passenger volume.
                  </p>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    The main categories include:
                  </p>

                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                          Sleep Pods
                        </a>
                      </h3>
                      <p className="text-slate-700 leading-relaxed">
                        Compact and efficient for short layovers, typically located airside.
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                          Private Rooms
                        </a>
                      </h3>
                      <p className="text-slate-700 leading-relaxed">
                        Enclosed spaces offering more comfort and privacy for medium-length stays.
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                          Transit Hotels
                        </a>
                      </h3>
                      <p className="text-slate-700 leading-relaxed">
                        Full hotel-style rooms ideal for overnight stays and long layovers.
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/lounge-sleep'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                          Lounge Sleep
                        </a>
                      </h3>
                      <p className="text-slate-700 leading-relaxed">
                        Comfortable seating and quiet areas inside lounges for light rest.
                      </p>
                    </div>
                  </div>

                  <p className="text-slate-700 leading-relaxed mt-4">
                    Each airport may offer one or multiple options depending on its infrastructure.
                  </p>
                </section>

                <section>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">How to Choose the Right Airport for a Layover</h2>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    Choosing the right airport can significantly impact your travel experience.
                  </p>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    When evaluating airports, consider:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
                    <li>
                      Availability of{' '}
                      <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                        sleep pods
                      </a>{' '}
                      for short rest
                    </li>
                    <li>
                      Access to{' '}
                      <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                        private rooms
                      </a>{' '}
                      for privacy and work
                    </li>
                    <li>
                      Presence of{' '}
                      <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                        transit hotels
                      </a>{' '}
                      for overnight stays
                    </li>
                    <li>
                      Lounge access under{' '}
                      <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/lounge-sleep'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                        lounge sleep
                      </a>{' '}
                      for short breaks
                    </li>
                  </ul>
                  <p className="text-slate-700 leading-relaxed">
                    Airports with multiple options provide greater flexibility and comfort during transit.
                  </p>
                </section>

                <section>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Airside vs Landside Access</h2>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    One of the most important factors when choosing an airport sleep option is whether the facility is airside or landside.
                  </p>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    Airside facilities:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
                    <li>Located inside the transit zone</li>
                    <li>No immigration required</li>
                    <li>Ideal for international layovers</li>
                  </ul>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    Landside facilities:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
                    <li>Require entry into the country</li>
                    <li>May need a visa</li>
                    <li>Often include hotels connected to terminals</li>
                  </ul>
                  <p className="text-slate-700 leading-relaxed">
                    If you cannot pass immigration, focus on airports with strong airside options such as{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                      sleep pods
                    </a>{' '}
                    or airside{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                      transit hotels
                    </a>.
                  </p>
                </section>

                <section>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Airport Sleep Facilities Matter</h2>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    Layovers can be physically demanding, especially during long-haul travel.
                  </p>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    Access to structured rest options like{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                      sleep pods
                    </a>,{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                      private rooms
                    </a>, or{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                      transit hotels
                    </a>{' '}
                    can significantly improve comfort, reduce fatigue, and enhance overall travel experience.
                  </p>
                  <p className="text-slate-700 leading-relaxed">
                    Even short rest periods in{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/lounge-sleep'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                      lounge sleep
                    </a>{' '}
                    environments can improve alertness and productivity.
                  </p>
                </section>

                <section>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Best Airports for Sleeping During Layovers</h2>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    Some airports are better equipped for sleep and rest than others.
                  </p>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    Major international hubs such as Doha, Dubai, Singapore, and Tokyo offer a wide range of options including{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                      sleep pods
                    </a>,{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                      transit hotels
                    </a>, and premium lounges.
                  </p>
                  <p className="text-slate-700 leading-relaxed">
                    When planning your route, selecting airports with better sleep infrastructure can make a significant difference.
                  </p>
                </section>

                <section>
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">How to Use This Airport Directory</h2>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    Use this page to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
                    <li>Find airports with sleep facilities</li>
                    <li>Compare available rest options</li>
                    <li>Identify transit-friendly locations</li>
                    <li>Plan your layover more efficiently</li>
                  </ul>
                  <p className="text-slate-700 leading-relaxed">
                    Click into each airport to view detailed facility listings and determine which option best fits your needs.
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
                  <h2 className="text-3xl font-bold text-slate-900 mb-4">Final Thoughts on Airports with Sleep Facilities</h2>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    Not all airports are designed with rest in mind, but an increasing number now offer structured sleep solutions to support travelers during layovers.
                  </p>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    By understanding which airports offer{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                      sleep pods
                    </a>,{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                      private rooms
                    </a>,{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                      transit hotels
                    </a>, or{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/lounge-sleep'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                      lounge sleep
                    </a>, you can make better travel decisions and significantly improve your journey.
                  </p>
                  <p className="text-slate-700 leading-relaxed">
                    Planning ahead allows you to avoid uncomfortable waiting areas and instead use dedicated rest facilities that match your needs.
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
                    helps you maximize comfort during travel.
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
