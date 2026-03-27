import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Hotel, MapPin, Loader, ChevronDown, ShieldCheck, Clock, DollarSign, AlertCircle, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { AirportFacility } from '../lib/database.types';
import SearchResults from './SearchResults';
import FacilityFilters from './FacilityFilters';
import Header from './Header';
import Footer from './Footer';
import { updatePageMeta, generateFAQStructuredData } from '../lib/seo';
import { navigateTo } from '../lib/navigation';

const TRANSIT_HOTELS_FAQ = [
  {
    question: 'What is the difference between an airside and landside transit hotel?',
    answer: 'An airside transit hotel is located inside the secure zone of the terminal, after passport control. Transit passengers can access it without clearing immigration — no visa for the host country is needed. A landside transit hotel requires exiting the secure zone and clearing immigration to reach it. For passengers without entry permission for the transit country, only airside hotels are accessible.',
  },
  {
    question: 'Do I need a visa to use a transit hotel?',
    answer: 'For airside transit hotels, no. You can check in, sleep, and return to your gate without clearing immigration. For landside transit hotels, you must pass through immigration, which means you need a valid entry visa or qualifying transit permission for the country. Transit visa rules vary by nationality — check your eligibility before booking a landside property.',
  },
  {
    question: 'Which airports have airside transit hotels?',
    answer: 'Airports with well-established airside transit hotel options include Singapore Changi (SIN), London Heathrow (LHR), Dubai (DXB), Doha Hamad (DOH), Istanbul (IST), Tokyo Narita (NRT), and Kuala Lumpur (KUL). Transit hotel coverage at each airport can differ by terminal — verify terminal location before booking.',
  },
  {
    question: 'How much does an airport transit hotel cost?',
    answer: 'Prices typically range from $80–$120 for a 6–8 hour daytime stay, and $120–$250 for an overnight booking. Premium brands like YOTELAIR and Aerotel at major hub airports often sit at the higher end. Some hotels charge by the hour with minimum booking windows (usually 3–6 hours); others use fixed check-in/check-out windows similar to standard hotels.',
  },
  {
    question: 'Can you book a transit hotel for just a few hours?',
    answer: 'Yes. Most airport transit hotels offer short-stay bookings starting at 3–6 hours, charged at an hourly or short-stay rate. This is specifically designed for layover passengers. A full overnight stay is also available at most properties. Booking in advance is strongly recommended at busy hub airports where availability can be limited.',
  },
  {
    question: 'What amenities do transit hotels typically include?',
    answer: 'Standard transit hotel amenities include a private room with a proper bed, en-suite private bathroom with shower, Wi-Fi, and climate control. Better properties (YOTELAIR, Aerotel) also include in-room entertainment and fresh towels and toiletries. Room service or access to an onsite food outlet is available at many properties but varies by hotel and airport.',
  },
  {
    question: 'Are transit hotels the same as airport hotels?',
    answer: 'Not exactly. "Airport hotel" usually refers to an off-terminal hotel near the airport that requires a shuttle or taxi to reach. Transit hotels are inside or directly connected to the terminal. The key distinction for international passengers is that transit hotels are often airside, while most airport hotels outside the terminal are landside and require immigration clearance.',
  },
  {
    question: 'How is a transit hotel different from a private room?',
    answer: 'Transit hotels offer full hotel-style rooms with proper check-in, hotel services, and a minimum stay of typically 4–8 hours. Private rooms are smaller, hourly-rate enclosed spaces that function more like a rest cabin than a hotel. For layovers over 8 hours requiring proper rest, a transit hotel is usually the better choice.',
  },
  {
    question: 'Can families use transit hotels?',
    answer: 'Yes. Most transit hotels at major airports can accommodate families, though room size varies. Booking in advance is essential for families, as transit hotel capacity is limited and larger rooms sell out quickly. Check individual listings for maximum occupancy and available room types.',
  },
  {
    question: 'How far in advance should I book a transit hotel?',
    answer: 'At major hub airports, booking 48–72 hours in advance is recommended. At peak travel periods and for airports with only one transit hotel option, bookings can fill days in advance. Walk-in availability depends on occupancy, and cannot be relied upon at most hubs.',
  },
];

export default function TransitHotelsPage() {
  const [facilities, setFacilities] = useState<AirportFacility[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<AirportFacility[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchFacilities();
    updatePageMeta(
      'Transit Hotels in Airports: Airside Rooms, Prices & Access Rules (2026) | RestInAirport',
      'Find airside transit hotels at airports worldwide. Compare room types, pricing, immigration requirements, and the best transit hotels for overnight layovers.',
      `${window.location.origin}/transit-hotels`,
      generateFAQStructuredData(TRANSIT_HOTELS_FAQ)
    );
  }, []);

  async function fetchFacilities() {
    setLoading(true);
    const { data, error } = await supabase
      .from('airport_facilities')
      .select('*')
      .or('type.ilike.%hotel%,type.ilike.%transit%')
      .order('airport', { ascending: true });

    if (error) {
      console.error('Error fetching facilities:', error);
    } else {
      setFacilities(data || []);
      setFilteredFacilities(data || []);
    }
    setLoading(false);
  }

  const transitHotelFacilities = filteredFacilities;
  const airportCount = new Set(transitHotelFacilities.map(f => f.airport)).size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <Helmet>
        <title>Transit Hotels in Airports: Airside Rooms, Prices & Access Rules (2026) | RestInAirport</title>
        <meta name="description" content="Find airside transit hotels at airports worldwide. Compare room types, pricing, immigration requirements, and the best transit hotels for overnight layovers." />
        <link rel="canonical" href="https://restinairport.com/transit-hotels" />
        <meta property="og:title" content="Transit Hotels in Airports: Airside Rooms, Prices & Access Rules | RestInAirport" />
        <meta property="og:description" content="Find airside transit hotels at 100+ airports. Compare pricing, immigration rules, and room types." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://restinairport.com/transit-hotels" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Transit Hotels in Airports: Airside Rooms, Prices & Access | RestInAirport" />
        <meta name="twitter:description" content="Find airside transit hotels at airports worldwide. Compare pricing and immigration rules." />
      </Helmet>
      <Header />

      <main className="flex-1">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-3">
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-slate-300 bg-slate-700 px-3 py-1 rounded-full">
                Category
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Transit Hotels in Airports</h1>
            <p className="text-lg text-slate-200 max-w-3xl mb-8 leading-relaxed">
              Full hotel rooms inside or directly connected to airport terminals — private bathroom, proper bed, and complete separation from the terminal. Most are airside. No immigration clearance needed for transit passengers.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
              <div className="bg-slate-700 rounded-xl px-4 py-3 text-center">
                <div className="text-2xl font-bold">{transitHotelFacilities.length}</div>
                <div className="text-xs text-slate-300 mt-0.5">Facilities</div>
              </div>
              <div className="bg-slate-700 rounded-xl px-4 py-3 text-center">
                <div className="text-2xl font-bold">{airportCount}</div>
                <div className="text-xs text-slate-300 mt-0.5">Airports</div>
              </div>
              <div className="bg-slate-700 rounded-xl px-4 py-3 text-center">
                <div className="text-sm font-bold">$80–$250</div>
                <div className="text-xs text-slate-300 mt-0.5">Typical Range</div>
              </div>
              <div className="bg-slate-700 rounded-xl px-4 py-3 text-center">
                <div className="text-sm font-bold">Mostly Airside</div>
                <div className="text-xs text-slate-300 mt-0.5">Access Type</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Best for</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">Layovers of 6+ hours. Overnight connections. Families. Travelers who need a full bed, shower, and complete privacy before a long onward flight.</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Not ideal for</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">Short connections under 4 hours where cost may not justify the stay. Budget travelers — transit hotels are the most expensive airport rest option.</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Access note</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">Most transit hotels at major hubs are airside. No immigration clearance needed. Landside options exist — these require clearing passport control. Verify before booking.</p>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <Loader className="inline-block animate-spin w-12 h-12 text-slate-700" />
              <p className="mt-4 text-slate-600">Loading facilities...</p>
            </div>
          ) : (
            <>
              <FacilityFilters facilities={facilities} onFilterChange={setFilteredFacilities} />
              <SearchResults facilities={transitHotelFacilities} query="" />
            </>
          )}

          <div className="mt-16 space-y-14">

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">What Is an Airport Transit Hotel?</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                A transit hotel is a fully-equipped hotel room inside or directly connected to an airport terminal. Unlike off-airport hotels that require transport to reach, transit hotels are accessed from within the terminal building — most without passing through immigration.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                Standard features include a private room with a proper bed, en-suite bathroom with shower, Wi-Fi, and climate control. Leading brands like Aerotel, YOTELAIR, and Minute Suites offer rooms that are comparable to good city hotels in terms of sleep quality.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Transit hotels are the top tier of in-terminal rest options. For shorter layovers or tighter budgets, consider{' '}
                <a href="/private-rooms" onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }} className="font-semibold text-slate-900 hover:text-sky-600 underline underline-offset-2">private rooms</a>{' '}
                or{' '}
                <a href="/sleep-pods" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600 underline underline-offset-2">sleep pods</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Airside vs Landside Transit Hotels</h2>
              <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mb-5">
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <p className="text-sm font-semibold text-emerald-700 mb-2">Airside Transit Hotels</p>
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">Located inside the secure terminal zone. Transit passengers check in without clearing immigration. No visa required for the transit country. Available at Singapore Changi, London Heathrow, Dubai, Doha, and others.</p>
                  <p className="text-xs text-emerald-700 font-medium">Suitable for all transit passengers</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <p className="text-sm font-semibold text-amber-700 mb-2">Landside Transit Hotels</p>
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">Located outside the secure zone. Requires clearing passport control to access. A valid visa or qualifying transit permission for the host country is needed. More common at smaller airports.</p>
                  <p className="text-xs text-amber-700 font-medium">Check visa rules before booking</p>
                </div>
              </div>
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-5 flex gap-4 items-start max-w-3xl">
                <div className="flex-shrink-0 w-9 h-9 bg-sky-100 rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <p className="font-semibold text-sky-900 mb-1">Planning a layover that involves leaving the secure zone?</p>
                  <p className="text-sky-800 text-sm leading-relaxed">
                    Whether you can clear immigration for a landside hotel depends on your nationality and the transit country's entry rules.{' '}
                    <a href="https://www.visainfoguide.com" target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-2 hover:text-sky-600">
                      Verify your transit and entry options at visainfoguide.com
                    </a>{' '}
                    before booking a landside property.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Transit Hotels vs Other Airport Rest Options</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse max-w-4xl">
                  <thead>
                    <tr className="bg-slate-100 text-left">
                      <th className="px-4 py-3 font-semibold text-slate-700 rounded-tl-lg">Option</th>
                      <th className="px-4 py-3 font-semibold text-slate-700">Space & privacy</th>
                      <th className="px-4 py-3 font-semibold text-slate-700">Best layover</th>
                      <th className="px-4 py-3 font-semibold text-slate-700">Typical cost</th>
                      <th className="px-4 py-3 font-semibold text-slate-700 rounded-tr-lg">Shower</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr className="bg-slate-700 text-white">
                      <td className="px-4 py-3 font-semibold">Transit Hotels</td>
                      <td className="px-4 py-3">Full hotel room, total privacy</td>
                      <td className="px-4 py-3">6–16+ hours</td>
                      <td className="px-4 py-3">$80–$250</td>
                      <td className="px-4 py-3">Private en-suite</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-4 py-3">
                        <a href="/private-rooms" onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }} className="font-medium text-slate-800 hover:text-sky-600 underline underline-offset-2">Private Rooms</a>
                      </td>
                      <td className="px-4 py-3 text-slate-600">Enclosed room, fully private</td>
                      <td className="px-4 py-3 text-slate-600">3–10 hours</td>
                      <td className="px-4 py-3 text-slate-600">$40–$80/hr</td>
                      <td className="px-4 py-3 text-slate-600">Often included</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="px-4 py-3">
                        <a href="/sleep-pods" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-medium text-slate-800 hover:text-sky-600 underline underline-offset-2">Sleep Pods</a>
                      </td>
                      <td className="px-4 py-3 text-slate-600">Capsule, semi to fully enclosed</td>
                      <td className="px-4 py-3 text-slate-600">2–8 hours</td>
                      <td className="px-4 py-3 text-slate-600">$10–$50/hr</td>
                      <td className="px-4 py-3 text-slate-600">Usually separate</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-4 py-3">
                        <a href="/lounge-sleep" onClick={(e) => { e.preventDefault(); navigateTo('/lounge-sleep'); }} className="font-medium text-slate-800 hover:text-sky-600 underline underline-offset-2">Lounge Sleep</a>
                      </td>
                      <td className="px-4 py-3 text-slate-600">Shared seating area</td>
                      <td className="px-4 py-3 text-slate-600">Under 4 hours</td>
                      <td className="px-4 py-3 text-slate-600">$30–$70/visit</td>
                      <td className="px-4 py-3 text-slate-600">Often included</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Best Airports for Transit Hotels</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Transit hotel infrastructure is strongest at the world's major long-haul transit hubs. Airports with multiple transit hotel options include:
              </p>
              <ul className="space-y-2 text-slate-700 mb-4">
                <li className="flex items-start gap-2"><a href="/airport/singapore-changi-sin" onClick={(e) => { e.preventDefault(); navigateTo('/airport/singapore-changi-sin'); }} className="font-semibold min-w-fit hover:text-sky-600 hover:underline">Singapore Changi (SIN)</a> — Aerotel in T1/T2/T3, all airside; also Ambassador Transit Hotel</li>
                <li className="flex items-start gap-2"><a href="/airport/london-heathrow-lhr" onClick={(e) => { e.preventDefault(); navigateTo('/airport/london-heathrow-lhr'); }} className="font-semibold min-w-fit hover:text-sky-600 hover:underline">London Heathrow (LHR)</a> — Aerotel in T1/T2/T3/T5, Yotel in T4; airside access</li>
                <li className="flex items-start gap-2"><a href="/airport/hamad-international-airport-doh" onClick={(e) => { e.preventDefault(); navigateTo('/airport/hamad-international-airport-doh'); }} className="font-semibold min-w-fit hover:text-sky-600 hover:underline">Doha Hamad (DOH)</a> — Oryx Airport Hotel inside the terminal, transit-accessible</li>
                <li className="flex items-start gap-2"><a href="/airport/dubai-international-dxb" onClick={(e) => { e.preventDefault(); navigateTo('/airport/dubai-international-dxb'); }} className="font-semibold min-w-fit hover:text-sky-600 hover:underline">Dubai (DXB)</a> — Several transit hotel options across T1 and T3</li>
                <li className="flex items-start gap-2"><a href="/airport/amsterdam-schiphol-ams" onClick={(e) => { e.preventDefault(); navigateTo('/airport/amsterdam-schiphol-ams'); }} className="font-semibold min-w-fit hover:text-sky-600 hover:underline">Amsterdam Schiphol (AMS)</a> — YOTELAIR airside in the terminal</li>
                <li className="flex items-start gap-2"><a href="/airport/istanbul-airport-ist" onClick={(e) => { e.preventDefault(); navigateTo('/airport/istanbul-airport-ist'); }} className="font-semibold min-w-fit hover:text-sky-600 hover:underline">Istanbul (IST)</a> — Istanbul Grand Airport Hotel, accessible for transit</li>
              </ul>
              <p className="text-slate-700 leading-relaxed">
                Browse all transit hotel facilities above, or explore by airport on the{' '}
                <a href="/airports" onClick={(e) => { e.preventDefault(); navigateTo('/airports'); }} className="font-semibold text-slate-900 hover:text-sky-600 underline underline-offset-2">airports page</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">When to Use a Transit Hotel vs Alternatives</h2>
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl p-4">
                  <Clock className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">Layover under 4 hours</p>
                    <p className="text-sm text-slate-600">A lounge or sleep pod is more practical. The cost and check-in process of a transit hotel may not be worth it for very short connections.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl p-4">
                  <Clock className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">Layover 4–8 hours</p>
                    <p className="text-sm text-slate-600">A private room may offer better value. Transit hotels are worth it if you need a full shower and proper bed, or if your layover falls entirely overnight.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-slate-700 text-white rounded-xl p-4">
                  <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Layover 8+ hours or overnight</p>
                    <p className="text-sm text-slate-200">A transit hotel is the best option. Full-length sleep, shower, privacy, and separation from terminal noise are worth the cost at this length of stay.</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Pricing: What to Expect</h2>
              <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mb-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
                  <DollarSign className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-800">Short stay</p>
                  <p className="text-xl font-bold text-slate-900 my-1">$80–$120</p>
                  <p className="text-xs text-slate-500">6–8 hour daytime stay — most common booking type</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
                  <DollarSign className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-800">Overnight stay</p>
                  <p className="text-xl font-bold text-slate-900 my-1">$120–$250</p>
                  <p className="text-xs text-slate-500">fixed overnight window, typically 10pm–8am</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
                  <DollarSign className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-800">Premium brands</p>
                  <p className="text-xl font-bold text-slate-900 my-1">$200+</p>
                  <p className="text-xs text-slate-500">YOTELAIR, Aerotel at Heathrow and Changi during peak periods</p>
                </div>
              </div>
              <p className="text-sm text-slate-500">Pricing varies significantly by airport and season. Check individual listings for current rates.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-5">Frequently Asked Questions</h2>
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200 max-w-3xl">
                {TRANSIT_HOTELS_FAQ.map((item, index) => (
                  <div key={index}>
                    <button
                      onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                      className="w-full px-5 py-4 text-left flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
                      aria-expanded={openFaqIndex === index}
                    >
                      <span className="font-medium text-slate-800 pr-4">{item.question}</span>
                      <ChevronDown className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${openFaqIndex === index ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-200 ${openFaqIndex === index ? 'max-h-72' : 'max-h-0'}`}>
                      <div className="px-5 pb-5 bg-white">
                        <p className="text-slate-600 leading-relaxed text-sm">{item.answer}</p>
                      </div>
                    </div>
                    <noscript>
                      <div className="px-5 pb-5 bg-white">
                        <p className="text-slate-600 leading-relaxed text-sm">{item.answer}</p>
                      </div>
                    </noscript>
                  </div>
                ))}
              </div>
            </section>

            <section className="border-t border-slate-200 pt-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Transit Hotels: Bottom Line</h2>
              <div className="max-w-3xl space-y-3 text-slate-600 leading-relaxed">
                <p>
                  Transit hotels offer the highest level of rest quality available at airports — a full private room, en-suite shower, and real separation from the terminal environment. For layovers of 8+ hours, or any connection that spans overnight, a transit hotel delivers comfort that no other in-terminal option can match.
                </p>
                <p>
                  The critical factor for international passengers is airside access. Most transit hotels at major global hubs — Singapore, London, Dubai, Doha, Amsterdam — are inside the secure zone and require no immigration clearance. At smaller airports, verify whether the property is airside or landside before booking.
                </p>
                <p>
                  For layovers under 6 hours,{' '}
                  <a href="/private-rooms" onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }} className="font-semibold text-slate-800 underline underline-offset-2 hover:text-slate-600">private rooms</a>{' '}
                  or{' '}
                  <a href="/sleep-pods" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-800 underline underline-offset-2 hover:text-slate-600">sleep pods</a>{' '}
                  may offer better value. For light rest only, consider{' '}
                  <a href="/lounge-sleep" onClick={(e) => { e.preventDefault(); navigateTo('/lounge-sleep'); }} className="font-semibold text-slate-800 underline underline-offset-2 hover:text-slate-600">airport lounges</a>.
                  Browse all{' '}
                  <a href="/airports" onClick={(e) => { e.preventDefault(); navigateTo('/airports'); }} className="font-semibold text-slate-800 underline underline-offset-2 hover:text-slate-600">airports</a>{' '}
                  to check what transit hotel options exist on your specific routing.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Explore Other Airport Rest Options</h2>
              <div className="grid sm:grid-cols-3 gap-4 max-w-3xl">
                <a href="/sleep-pods" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-sm transition-all group">
                  <Hotel className="w-6 h-6 text-slate-600 mb-3" />
                  <p className="font-semibold text-slate-800 mb-1 group-hover:text-slate-600">Sleep Pods</p>
                  <p className="text-sm text-slate-500">Compact capsules for layovers of 2–8 hours. Airside at most airports. Cheaper than private rooms.</p>
                </a>
                <a href="/private-rooms" onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-sm transition-all group">
                  <MapPin className="w-6 h-6 text-slate-600 mb-3" />
                  <p className="font-semibold text-slate-800 mb-1 group-hover:text-slate-600">Private Rooms</p>
                  <p className="text-sm text-slate-500">Enclosed hourly rooms with beds. Better value than a transit hotel for layovers under 8 hours.</p>
                </a>
                <a href="/lounge-sleep" onClick={(e) => { e.preventDefault(); navigateTo('/lounge-sleep'); }} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-sm transition-all group">
                  <Hotel className="w-6 h-6 text-slate-600 mb-3" />
                  <p className="font-semibold text-slate-800 mb-1 group-hover:text-slate-600">Lounge Sleep</p>
                  <p className="text-sm text-slate-500">Light rest in airport lounges. Best for short layovers with food and comfort included.</p>
                </a>
              </div>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
