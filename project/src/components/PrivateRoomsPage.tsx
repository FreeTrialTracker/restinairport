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

const PRIVATE_ROOMS_FAQ = [
  {
    question: 'What is an airport private room?',
    answer: 'An airport private room is a fully enclosed, lockable room inside or connected to an airport terminal, available for hourly or short-stay rental. Private rooms are larger than sleep pods and typically include a proper bed, desk, and often an en-suite bathroom. They are designed for transit passengers who need genuine privacy and a real rest space during a layover, without the full hotel booking process.',
  },
  {
    question: 'Are airport private rooms airside or landside?',
    answer: 'Most airport private rooms at major international hubs are located airside — inside the secure terminal zone after passport control. Transit passengers can access them without clearing immigration. Some facilities are landside or require crossing between terminal zones — verify the specific location before booking.',
  },
  {
    question: 'Do I need a visa to use a private room at an airport?',
    answer: 'For airside private rooms, no. Airside facilities are accessible without clearing immigration, so no visa for the transit country is required. For landside private rooms, you must pass through immigration, which may require a transit visa or entry permission depending on your nationality and the host country.',
  },
  {
    question: 'How much does an airport private room cost?',
    answer: 'Typical pricing runs $40–$80 per hour, or $120–$200 for a full daytime stay. Some brands like Minute Suites offer hourly rates starting from $45; transit hotel brands like YOTELAIR and Aerotel offer comparable private rooms at $80–$200+ depending on the airport. Pricing varies significantly by location and time of day.',
  },
  {
    question: 'What is the difference between a private room and a transit hotel?',
    answer: 'Private rooms are self-contained hourly-rate rest spaces — smaller than a hotel room, focused on sleep and privacy, with a streamlined booking process. Transit hotels are full hotel-style properties with hotel services, check-in desks, minimum stays of 4–8 hours, and typically a higher price. For layovers of 3–6 hours, a private room usually offers better value than a transit hotel.',
  },
  {
    question: 'What is the difference between a private room and a sleep pod?',
    answer: 'Private rooms are larger, fully enclosed with a lockable door, and typically include a proper flat bed rather than a reclining sleep surface. Sleep pods are compact capsules — some fully enclosed, some with only a partial privacy visor. Private rooms are better suited to layovers of 4+ hours where you need full privacy and a proper lying-flat sleep position.',
  },
  {
    question: 'Do airport private rooms have showers?',
    answer: 'It depends on the facility. Some private room brands include en-suite shower facilities; others provide shared shower access as an add-on. Minute Suites at US airports offer showers at select locations. YOTELAIR cabins include en-suite rainfall showers. Check the individual listing for the specific facility you are considering.',
  },
  {
    question: 'Can families use airport private rooms?',
    answer: 'Yes. Private rooms are more suitable for families than sleep pods, as the enclosed space with a proper door allows parents to manage children without disturbing other passengers. Check room occupancy limits before booking — most private rooms accommodate 1–2 adults and can include a child with some brands.',
  },
  {
    question: 'How far in advance should I book an airport private room?',
    answer: 'At high-traffic hub airports, booking 24–48 hours in advance is advisable. Walk-in availability exists at many locations but cannot be relied upon at popular hubs during peak travel periods. At US airports with Minute Suites, walk-in access is commonly available.',
  },
  {
    question: 'Which airports have private rooms for transit passengers?',
    answer: 'Private room options are available at Singapore Changi (Aerotel), London Heathrow (Aerotel, YOTELAIR), Amsterdam Schiphol (YOTELAIR), Paris CDG (YOTELAIR), US airports including Atlanta, Philadelphia, and Dallas Fort Worth (Minute Suites), and Dubai and Doha through various hotel brands. Coverage varies by terminal — check individual airport listings.',
  },
];

export default function PrivateRoomsPage() {
  const [facilities, setFacilities] = useState<AirportFacility[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<AirportFacility[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchFacilities();
    updatePageMeta(
      'Airport Private Rooms: Airside Access, Prices & Best Options (2026) | RestInAirport',
      'Find private rooms inside airport terminals at major hubs worldwide. Compare airside vs landside access, hourly pricing, shower availability, and booking tips for transit passengers.',
      `${window.location.origin}/private-rooms`,
      generateFAQStructuredData(PRIVATE_ROOMS_FAQ)
    );
  }, []);

  async function fetchFacilities() {
    setLoading(true);
    const { data, error } = await supabase
      .from('airport_facilities')
      .select('*')
      .or('type.ilike.%room%,type.ilike.%suite%')
      .order('airport', { ascending: true });

    if (error) {
      console.error('Error fetching facilities:', error);
    } else {
      setFacilities(data || []);
      setFilteredFacilities(data || []);
    }
    setLoading(false);
  }

  const privateRoomFacilities = filteredFacilities;
  const airportCount = new Set(privateRoomFacilities.map(f => f.airport)).size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <Helmet>
        <title>Airport Private Rooms: Airside Access, Prices & Best Options (2026) | RestInAirport</title>
        <meta name="description" content="Find private rooms inside airport terminals at major hubs worldwide. Compare airside vs landside access, hourly pricing, shower availability, and booking tips for transit passengers." />
        <link rel="canonical" href="https://restinairport.com/private-rooms" />
        <meta property="og:title" content="Airport Private Rooms: Airside Access, Prices & Best Options | RestInAirport" />
        <meta property="og:description" content="Find private rooms inside airport terminals. Compare access, pricing, and transit eligibility." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://restinairport.com/private-rooms" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Airport Private Rooms: Airside Access, Prices & Best Options | RestInAirport" />
        <meta name="twitter:description" content="Find private rooms inside airport terminals. Compare access, pricing, and transit eligibility." />
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Private Rooms in Airports</h1>
            <p className="text-lg text-slate-200 max-w-3xl mb-8 leading-relaxed">
              Fully enclosed, lockable private rooms inside airport terminals — available by the hour. More space and privacy than sleep pods, at a lower commitment than a transit hotel. Most are airside.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
              <div className="bg-slate-700 rounded-xl px-4 py-3 text-center">
                <div className="text-2xl font-bold">{privateRoomFacilities.length}</div>
                <div className="text-xs text-slate-300 mt-0.5">Facilities</div>
              </div>
              <div className="bg-slate-700 rounded-xl px-4 py-3 text-center">
                <div className="text-2xl font-bold">{airportCount}</div>
                <div className="text-xs text-slate-300 mt-0.5">Airports</div>
              </div>
              <div className="bg-slate-700 rounded-xl px-4 py-3 text-center">
                <div className="text-sm font-bold">$40–$80</div>
                <div className="text-xs text-slate-300 mt-0.5">Per Hour</div>
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
              <p className="text-sm text-slate-700 leading-relaxed">Layovers of 3–8 hours. Travelers needing full privacy. Families. Business travelers who need a quiet space to work or sleep before an onward flight.</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Not ideal for</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">Very long stays over 10 hours where a transit hotel would be better value. Budget travelers — private rooms cost more per hour than sleep pods.</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Access note</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">Most private rooms at major airports are airside. No immigration clearance needed for transit passengers. Verify each facility's location before booking.</p>
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
              <SearchResults facilities={privateRoomFacilities} query="" />
            </>
          )}

          <div className="mt-16 space-y-14">

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">What Are Airport Private Rooms?</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Airport private rooms are fully enclosed, lockable rest spaces inside terminal buildings, rented by the hour. They are positioned between sleep pods and transit hotels in terms of space, price, and service level. A private room provides a proper flat bed, total privacy, and a lockable door — without requiring a hotel-style check-in or minimum stay.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                Brands in this category include Minute Suites (US airports), YOTELAIR cabins (Europe), Aerotel (Asia and Middle East), and izZzleep (Europe/Asia). The facilities vary in size and amenity level — some include en-suite showers, others do not. Check individual listings for what is included.
              </p>
              <p className="text-slate-700 leading-relaxed">
                For layovers under 3 hours,{' '}
                <a href="/sleep-pods" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600 underline underline-offset-2">sleep pods</a>{' '}
                offer better value. For layovers over 8 hours,{' '}
                <a href="/transit-hotels" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-900 hover:text-sky-600 underline underline-offset-2">transit hotels</a>{' '}
                provide a more complete rest experience.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Airside vs Landside: Access for Transit Passengers</h2>
              <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mb-5">
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <p className="text-sm font-semibold text-emerald-700 mb-2">Airside Private Rooms</p>
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">Located inside the secure terminal zone after passport control. Transit passengers use these without clearing immigration. No visa for the transit country required. The standard setup at major hub airports.</p>
                  <p className="text-xs text-emerald-700 font-medium">Accessible to all transit passengers</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <p className="text-sm font-semibold text-amber-700 mb-2">Landside Private Rooms</p>
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">Located outside the secure zone. Clearing immigration is required to access these. Passengers may need a transit visa or entry permission for the host country. Less common at major hub airports.</p>
                  <p className="text-xs text-amber-700 font-medium">Check visa rules before booking</p>
                </div>
              </div>
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-5 flex gap-4 items-start max-w-3xl">
                <div className="flex-shrink-0 w-9 h-9 bg-sky-100 rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <p className="font-semibold text-sky-900 mb-1">Planning to use a landside facility?</p>
                  <p className="text-sky-800 text-sm leading-relaxed">
                    Transit and short-stay visa rules depend on your nationality and the country you are transiting.{' '}
                    <a href="https://www.visainfoguide.com" target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-2 hover:text-sky-600">
                      Check your entry and transit options at visainfoguide.com
                    </a>{' '}
                    before booking any landside facility.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Private Rooms vs Other Airport Rest Options</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse max-w-4xl">
                  <thead>
                    <tr className="bg-slate-100 text-left">
                      <th className="px-4 py-3 font-semibold text-slate-700 rounded-tl-lg">Option</th>
                      <th className="px-4 py-3 font-semibold text-slate-700">Privacy</th>
                      <th className="px-4 py-3 font-semibold text-slate-700">Best layover</th>
                      <th className="px-4 py-3 font-semibold text-slate-700">Typical cost</th>
                      <th className="px-4 py-3 font-semibold text-slate-700 rounded-tr-lg">Shower</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr className="bg-slate-700 text-white">
                      <td className="px-4 py-3 font-semibold">Private Rooms</td>
                      <td className="px-4 py-3">Fully private, lockable</td>
                      <td className="px-4 py-3">3–10 hours</td>
                      <td className="px-4 py-3">$40–$80/hr</td>
                      <td className="px-4 py-3">Often included</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-4 py-3">
                        <a href="/sleep-pods" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-medium text-slate-800 hover:text-sky-600 underline underline-offset-2">Sleep Pods</a>
                      </td>
                      <td className="px-4 py-3 text-slate-600">Semi to fully enclosed capsule</td>
                      <td className="px-4 py-3 text-slate-600">2–8 hours</td>
                      <td className="px-4 py-3 text-slate-600">$10–$50/hr</td>
                      <td className="px-4 py-3 text-slate-600">Usually separate</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="px-4 py-3">
                        <a href="/transit-hotels" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-medium text-slate-800 hover:text-sky-600 underline underline-offset-2">Transit Hotels</a>
                      </td>
                      <td className="px-4 py-3 text-slate-600">Full hotel room with services</td>
                      <td className="px-4 py-3 text-slate-600">6–16+ hours</td>
                      <td className="px-4 py-3 text-slate-600">$80–$250</td>
                      <td className="px-4 py-3 text-slate-600">Private en-suite</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-4 py-3">
                        <a href="/lounge-sleep" onClick={(e) => { e.preventDefault(); navigateTo('/lounge-sleep'); }} className="font-medium text-slate-800 hover:text-sky-600 underline underline-offset-2">Lounge Sleep</a>
                      </td>
                      <td className="px-4 py-3 text-slate-600">Shared seating area</td>
                      <td className="px-4 py-3 text-slate-600">Under 4 hours</td>
                      <td className="px-4 py-3 text-slate-600">$30–$120/visit</td>
                      <td className="px-4 py-3 text-slate-600">Often included</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Best Airports for Private Rooms</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Private room availability is strongest at major long-haul hub airports. Key locations include:
              </p>
              <ul className="space-y-2 text-slate-700 mb-4">
                <li className="flex items-start gap-2"><a href="/airport/london-heathrow-lhr" onClick={(e) => { e.preventDefault(); navigateTo('/airport/london-heathrow-lhr'); }} className="font-semibold min-w-fit hover:text-sky-600 hover:underline">London Heathrow (LHR)</a> — YOTELAIR cabins in T4, Aerotel in multiple terminals; all airside</li>
                <li className="flex items-start gap-2"><a href="/airport/amsterdam-schiphol-ams" onClick={(e) => { e.preventDefault(); navigateTo('/airport/amsterdam-schiphol-ams'); }} className="font-semibold min-w-fit hover:text-sky-600 hover:underline">Amsterdam Schiphol (AMS)</a> — YOTELAIR cabins airside in the main terminal</li>
                <li className="flex items-start gap-2"><a href="/airport/paris-charles-de-gaulle-cdg" onClick={(e) => { e.preventDefault(); navigateTo('/airport/paris-charles-de-gaulle-cdg'); }} className="font-semibold min-w-fit hover:text-sky-600 hover:underline">Paris CDG (CDG)</a> — YOTELAIR cabins in terminal 2E, airside</li>
                <li className="flex items-start gap-2"><a href="/airport/singapore-changi-sin" onClick={(e) => { e.preventDefault(); navigateTo('/airport/singapore-changi-sin'); }} className="font-semibold min-w-fit hover:text-sky-600 hover:underline">Singapore Changi (SIN)</a> — Aerotel rooms across T1/T2/T3, all airside</li>
                <li className="flex items-start gap-2"><a href="/airport/hartsfield-jackson-atlanta-international-atl" onClick={(e) => { e.preventDefault(); navigateTo('/airport/hartsfield-jackson-atlanta-international-atl'); }} className="font-semibold min-w-fit hover:text-sky-600 hover:underline">Atlanta (ATL)</a> — Minute Suites in Concourse A and D, airside</li>
                <li className="flex items-start gap-2"><a href="/airport/dallas-fort-worth-dfw" onClick={(e) => { e.preventDefault(); navigateTo('/airport/dallas-fort-worth-dfw'); }} className="font-semibold min-w-fit hover:text-sky-600 hover:underline">Dallas Fort Worth (DFW)</a> — Minute Suites in multiple concourses</li>
              </ul>
              <p className="text-slate-700 leading-relaxed">
                Browse all private room facilities above, or explore by airport on the{' '}
                <a href="/airports" onClick={(e) => { e.preventDefault(); navigateTo('/airports'); }} className="font-semibold text-slate-900 hover:text-sky-600 underline underline-offset-2">airports page</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">When to Use a Private Room vs Alternatives</h2>
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl p-4">
                  <Clock className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">Layover under 3 hours</p>
                    <p className="text-sm text-slate-600">A <a href="/sleep-pods" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600">sleep pod</a> or lounge is likely sufficient and more cost-effective.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-slate-700 text-white rounded-xl p-4">
                  <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Layover 3–8 hours</p>
                    <p className="text-sm text-slate-200">Private rooms are the best option. Full privacy, proper flat bed, and hourly pricing that beats transit hotel rates for shorter stays.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl p-4">
                  <Clock className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">Layover 8+ hours or overnight</p>
                    <p className="text-sm text-slate-600">
                      A <a href="/transit-hotels" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-900 hover:text-sky-600">transit hotel</a> offers better value for longer stays — full hotel services, a proper overnight rate, and amenities not available in private rooms.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Pricing: What to Expect</h2>
              <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mb-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
                  <DollarSign className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-800">Hourly rate</p>
                  <p className="text-xl font-bold text-slate-900 my-1">$40–$80</p>
                  <p className="text-xs text-slate-500">per hour — varies by brand and airport</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
                  <DollarSign className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-800">Short stay block</p>
                  <p className="text-xl font-bold text-slate-900 my-1">$120–$180</p>
                  <p className="text-xs text-slate-500">typical 4–6 hour block at major hub airports</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
                  <DollarSign className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-800">With shower</p>
                  <p className="text-xl font-bold text-slate-900 my-1">+$0–$20</p>
                  <p className="text-xs text-slate-500">some facilities include shower; others charge a small supplement</p>
                </div>
              </div>
              <p className="text-sm text-slate-500">Rates vary by airport, brand, and time of day. Check individual listings for current pricing.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-5">Frequently Asked Questions</h2>
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200 max-w-3xl">
                {PRIVATE_ROOMS_FAQ.map((item, index) => (
                  <div key={index}>
                    <button
                      onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                      className="w-full px-5 py-4 text-left flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
                      aria-expanded={openFaqIndex === index}
                    >
                      <span className="font-medium text-slate-800 pr-4">{item.question}</span>
                      <ChevronDown className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${openFaqIndex === index ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-200 ${openFaqIndex === index ? 'max-h-64' : 'max-h-0'}`}>
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
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Private Rooms: Bottom Line</h2>
              <div className="max-w-3xl space-y-3 text-slate-600 leading-relaxed">
                <p>
                  Airport private rooms are the most practical choice for layovers of 3–8 hours where you need genuine privacy and a proper rest space. They deliver a meaningful step up from sleep pods — a flat bed, total enclosure, and a lockable door — without the cost or commitment of a full transit hotel stay.
                </p>
                <p>
                  For transit passengers at major hub airports, the airside placement of most private room brands like Minute Suites, YOTELAIR, and Aerotel means access without immigration clearance. This makes them suitable for international passengers on tight connections who cannot or do not want to clear customs.
                </p>
                <p>
                  For shorter connections, a{' '}
                  <a href="/sleep-pods" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-800 underline underline-offset-2 hover:text-slate-600">sleep pod</a>{' '}
                  offers better hourly value. For overnight layovers, a{' '}
                  <a href="/transit-hotels" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-800 underline underline-offset-2 hover:text-slate-600">transit hotel</a>{' '}
                  justifies the additional cost. For short connections with food and Wi-Fi as the priority, a{' '}
                  <a href="/lounge-sleep" onClick={(e) => { e.preventDefault(); navigateTo('/lounge-sleep'); }} className="font-semibold text-slate-800 underline underline-offset-2 hover:text-slate-600">lounge</a>{' '}
                  is the most efficient option. Browse all{' '}
                  <a href="/airports" onClick={(e) => { e.preventDefault(); navigateTo('/airports'); }} className="font-semibold text-slate-800 underline underline-offset-2 hover:text-slate-600">airports</a>{' '}
                  to see what private room options are available on your route.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Explore Other Airport Rest Options</h2>
              <div className="grid sm:grid-cols-3 gap-4 max-w-3xl">
                <a href="/sleep-pods" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-sm transition-all group">
                  <Hotel className="w-6 h-6 text-slate-600 mb-3" />
                  <p className="font-semibold text-slate-800 mb-1 group-hover:text-slate-600">Sleep Pods</p>
                  <p className="text-sm text-slate-500">Compact hourly capsules. Better value for shorter layovers under 3 hours.</p>
                </a>
                <a href="/transit-hotels" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-sm transition-all group">
                  <MapPin className="w-6 h-6 text-slate-600 mb-3" />
                  <p className="font-semibold text-slate-800 mb-1 group-hover:text-slate-600">Transit Hotels</p>
                  <p className="text-sm text-slate-500">Full hotel rooms for layovers of 8+ hours and overnight connections.</p>
                </a>
                <a href="/lounge-sleep" onClick={(e) => { e.preventDefault(); navigateTo('/lounge-sleep'); }} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-sm transition-all group">
                  <Hotel className="w-6 h-6 text-slate-600 mb-3" />
                  <p className="font-semibold text-slate-800 mb-1 group-hover:text-slate-600">Lounge Sleep</p>
                  <p className="text-sm text-slate-500">Light rest with food and Wi-Fi. Best for short connections with lounge access.</p>
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
