import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Hotel, MapPin, Loader, ChevronDown, ShieldCheck, Clock, DollarSign, Lock, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { AirportFacility } from '../lib/database.types';
import SearchResults from './SearchResults';
import FacilityFilters from './FacilityFilters';
import Header from './Header';
import Footer from './Footer';
import { updatePageMeta, generateFAQStructuredData } from '../lib/seo';
import { navigateTo } from '../lib/navigation';

const SLEEP_PODS_FAQ = [
  {
    question: 'Are airport sleep pods airside or landside?',
    answer: 'Most sleep pods in major international airports are located airside — inside the secure transit zone after security and passport control. This means transit passengers can use them without clearing immigration. A smaller number are landside, which requires exiting the airport and re-entering. Always check the specific facility listing before booking.',
  },
  {
    question: 'Can I use a sleep pod without a transit visa?',
    answer: 'Yes, if the pod is airside. Airside sleep pods are accessible to international transit passengers without needing to pass through immigration or hold a visa for the transit country. If the pod is landside, you would need to clear immigration, and transit visa rules would apply based on your nationality and the country you are transiting through.',
  },
  {
    question: 'How much do airport sleep pods cost?',
    answer: 'Pricing typically ranges from $10–$20 USD per hour for basic open-visor pods to $25–$50 per hour for fully enclosed premium capsules. Many facilities offer block bookings (3-hour, 6-hour) at a lower hourly rate. Overnight rates are available at some locations and usually offer better value than per-hour pricing.',
  },
  {
    question: 'What is the difference between a sleep pod and a private room?',
    answer: 'Sleep pods are compact, semi-private or fully enclosed capsules designed for short rest. They typically include a bed surface, charging ports, and sometimes a privacy visor or door. Private rooms are larger, fully enclosed spaces with a proper bed, and often a desk. Private rooms generally cost more and are better suited to layovers over 5 hours.',
  },
  {
    question: 'Which airports have the best sleep pods?',
    answer: 'Airports with well-established sleep pod options include Singapore Changi (SIN), Seoul Incheon (ICN), Helsinki Vantaa (HEL), Dubai (DXB), and Doha Hamad (DOH). Munich Airport (MUC) has Napcabs, a fully enclosed pod brand. Availability and quality vary significantly by terminal — check individual listings for terminal-level detail.',
  },
  {
    question: 'Do airport sleep pods have showers?',
    answer: 'Most sleep pod brands do not include en-suite showers. Some airports co-locate shower facilities alongside pod areas or offer paid showers nearby. If showering is important to you, check whether the specific facility has shower access or consider a private room or transit hotel, which typically include private bathrooms.',
  },
  {
    question: 'Can you sleep overnight in a sleep pod?',
    answer: 'Yes. Most sleep pod brands allow extended bookings that cover overnight hours. You book by the hour and can reserve as many hours as needed. Overnight stays are practical in fully enclosed pods like Napcabs. In open or visor-based pods, overnight sleep quality depends heavily on terminal noise levels.',
  },
  {
    question: 'Are sleep pods better than airport lounges for sleeping?',
    answer: 'Yes, for actual sleep. Airport lounges offer reclining chairs and quiet zones, but they are shared spaces with foot traffic, lighting, and noise. Sleep pods provide a dedicated, semi-private or fully enclosed space designed for rest. If your priority is sleep rather than food or Wi-Fi access, a pod delivers meaningfully better rest quality.',
  },
  {
    question: 'Is it safe to leave luggage in a sleep pod?',
    answer: 'Safety practices vary by brand. Many sleep pod facilities offer luggage storage lockers or secure hooks inside the pod. Fully enclosed pods with locking doors allow you to keep luggage inside while you sleep. Open-visor pod designs require more caution with valuables. Check the specific facility amenities before booking.',
  },
  {
    question: 'How far in advance should I book a sleep pod?',
    answer: 'At high-traffic hub airports like Singapore Changi, Seoul Incheon, and Doha, booking 24–48 hours in advance is recommended, especially during peak travel periods. Walk-in availability is possible but not guaranteed. Some pod brands operate on a walk-in only basis with no advance booking — check the facility page for booking policy.',
  },
];

export default function SleepPodsPage() {
  const [facilities, setFacilities] = useState<AirportFacility[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<AirportFacility[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchFacilities();
    updatePageMeta(
      'Airport Sleep Pods: Airside Locations, Prices & Transit Access (2026) | RestInAirport',
      'Find sleep pods at 100+ airports worldwide. Compare airside vs landside access, hourly rates, privacy levels, and which pods work for transit passengers without a visa.',
      `${window.location.origin}/sleep-pods`,
      generateFAQStructuredData(SLEEP_PODS_FAQ)
    );
  }, []);

  async function fetchFacilities() {
    setLoading(true);
    const { data, error } = await supabase
      .from('airport_facilities')
      .select('*')
      .or('type.ilike.%pod%,type.ilike.%capsule%')
      .order('airport', { ascending: true });

    if (error) {
      console.error('Error fetching facilities:', error);
    } else {
      setFacilities(data || []);
      setFilteredFacilities(data || []);
    }
    setLoading(false);
  }

  const sleepPodFacilities = filteredFacilities;
  const airportCount = new Set(sleepPodFacilities.map(f => f.airport)).size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <Helmet>
        <title>Airport Sleep Pods: Airside Locations, Prices & Transit Access (2026) | RestInAirport</title>
        <meta name="description" content="Find sleep pods at 100+ airports worldwide. Compare airside vs landside access, hourly rates, privacy levels, and which pods work for transit passengers without a visa." />
        <link rel="canonical" href="https://restinairport.com/sleep-pods" />
        <meta property="og:title" content="Airport Sleep Pods: Airside Locations, Prices & Transit Access | RestInAirport" />
        <meta property="og:description" content="Find sleep pods at 100+ airports. Compare airside vs landside access, hourly rates, and transit eligibility." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://restinairport.com/sleep-pods" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Airport Sleep Pods: Airside Locations, Prices & Transit Access | RestInAirport" />
        <meta name="twitter:description" content="Find sleep pods at 100+ airports. Compare access, pricing, and transit eligibility." />
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Sleep Pods in Airports</h1>
            <p className="text-lg text-slate-200 max-w-3xl mb-8 leading-relaxed">
              Compact, hourly-rate sleeping capsules located inside airport terminals. Most are airside — no immigration clearance required for international transit passengers.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
              <div className="bg-slate-700 rounded-xl px-4 py-3 text-center">
                <div className="text-2xl font-bold">{sleepPodFacilities.length}</div>
                <div className="text-xs text-slate-300 mt-0.5">Pod Facilities</div>
              </div>
              <div className="bg-slate-700 rounded-xl px-4 py-3 text-center">
                <div className="text-2xl font-bold">{airportCount}</div>
                <div className="text-xs text-slate-300 mt-0.5">Airports</div>
              </div>
              <div className="bg-slate-700 rounded-xl px-4 py-3 text-center">
                <div className="text-sm font-bold">$10–$50</div>
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
              <p className="text-sm text-slate-700 leading-relaxed">Layovers of 2–8 hours. Transit passengers who cannot clear immigration. Budget-conscious travelers who need real rest, not just a seat.</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Not ideal for</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">Overnight layovers over 10 hours. Travelers needing a shower or en-suite bathroom. Families or passengers with bulky luggage.</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Access note</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">Most sleep pods are airside. Transit passengers do not need to clear immigration. Confirm landside/airside status on each listing before booking.</p>
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
              <SearchResults facilities={sleepPodFacilities} query="" />
            </>
          )}

          <div className="mt-16 space-y-14">

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">What Are Airport Sleep Pods?</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Airport sleep pods are compact, enclosed or semi-enclosed sleeping units inside terminal buildings, available by the hour. They range from open-design recliner pods with a privacy visor (like GoSleep) to fully enclosed lockable capsules (like Napcabs at Munich). The quality of privacy and sound insulation varies significantly between brands.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                Most include a flat or reclining sleep surface, charging ports, Wi-Fi, and controlled lighting. Shower access is not standard — check the individual listing if that matters to you.
              </p>
              <p className="text-slate-700 leading-relaxed">
                For layovers under 8 hours where you need actual rest — not just a seat — a sleep pod is usually the most efficient option available at most airports. For longer stays or overnight layovers, consider{' '}
                <a href="/private-rooms" onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }} className="font-semibold text-slate-900 hover:text-sky-600 underline underline-offset-2">private rooms</a>{' '}
                or{' '}
                <a href="/transit-hotels" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-900 hover:text-sky-600 underline underline-offset-2">transit hotels</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Airside vs Landside: What It Means for Transit Passengers</h2>
              <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mb-5">
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <p className="text-sm font-semibold text-slate-800 mb-2">Airside Sleep Pods</p>
                  <p className="text-sm text-slate-600 leading-relaxed">Located inside the secure zone after passport control. International transit passengers can access them without clearing immigration. No transit visa is needed for the host country. This is the most common setup for sleep pods.</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <p className="text-sm font-semibold text-slate-800 mb-2">Landside Sleep Pods</p>
                  <p className="text-sm text-slate-600 leading-relaxed">Located outside the secure zone, before passport control or in the arrivals area. Using these requires clearing immigration. Passengers without a valid visa or transit permit for the host country may not be able to use landside facilities.</p>
                </div>
              </div>
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-5 flex gap-4 items-start max-w-3xl">
                <div className="flex-shrink-0 w-9 h-9 bg-sky-100 rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <p className="font-semibold text-sky-900 mb-1">Not sure if you need a transit visa?</p>
                  <p className="text-sky-800 text-sm leading-relaxed">
                    Transit visa rules depend on your nationality and the country you are connecting through.{' '}
                    <a href="https://www.visainfoguide.com" target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-2 hover:text-sky-600">
                      Check your transit visa requirements at visainfoguide.com
                    </a>{' '}
                    before booking a landside facility.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Sleep Pods vs Other Airport Rest Options</h2>
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
                      <td className="px-4 py-3 font-semibold">Sleep Pods</td>
                      <td className="px-4 py-3">Semi-private to fully enclosed</td>
                      <td className="px-4 py-3">2–8 hours</td>
                      <td className="px-4 py-3">$10–$50/hr</td>
                      <td className="px-4 py-3">Usually separate</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-4 py-3">
                        <a href="/lounge-sleep" onClick={(e) => { e.preventDefault(); navigateTo('/lounge-sleep'); }} className="font-medium text-slate-800 hover:text-sky-600 underline underline-offset-2">Lounge Sleep</a>
                      </td>
                      <td className="px-4 py-3 text-slate-600">Shared seating</td>
                      <td className="px-4 py-3 text-slate-600">Under 4 hours</td>
                      <td className="px-4 py-3 text-slate-600">$30–$70/visit</td>
                      <td className="px-4 py-3 text-slate-600">Often included</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="px-4 py-3">
                        <a href="/private-rooms" onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }} className="font-medium text-slate-800 hover:text-sky-600 underline underline-offset-2">Private Rooms</a>
                      </td>
                      <td className="px-4 py-3 text-slate-600">Fully private</td>
                      <td className="px-4 py-3 text-slate-600">3–10 hours</td>
                      <td className="px-4 py-3 text-slate-600">$40–$80/hr</td>
                      <td className="px-4 py-3 text-slate-600">Often included</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-4 py-3">
                        <a href="/transit-hotels" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-medium text-slate-800 hover:text-sky-600 underline underline-offset-2">Transit Hotels</a>
                      </td>
                      <td className="px-4 py-3 text-slate-600">Full hotel room</td>
                      <td className="px-4 py-3 text-slate-600">6–16+ hours</td>
                      <td className="px-4 py-3 text-slate-600">$80–$250/night</td>
                      <td className="px-4 py-3 text-slate-600">Private en-suite</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Best Airports for Sleep Pods</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                The strongest sleep pod coverage is at high-volume Asian and European transit hubs. Key airports include:
              </p>
              <ul className="space-y-2 text-slate-700 mb-4">
                <li className="flex items-start gap-2"><a href="/airport/singapore-changi-sin" onClick={(e) => { e.preventDefault(); navigateTo('/airport/singapore-changi-sin'); }} className="font-semibold min-w-fit hover:text-sky-600 hover:underline">Singapore Changi (SIN)</a> — Aerotel and multiple pod brands across terminals, all airside</li>
                <li className="flex items-start gap-2"><a href="/airport/seoul-incheon-icn" onClick={(e) => { e.preventDefault(); navigateTo('/airport/seoul-incheon-icn'); }} className="font-semibold min-w-fit hover:text-sky-600 hover:underline">Seoul Incheon (ICN)</a> — Capsule-style pods in both T1 and T2, no immigration needed</li>
                <li className="flex items-start gap-2"><a href="/airport/munich-muc" onClick={(e) => { e.preventDefault(); navigateTo('/airport/munich-muc'); }} className="font-semibold min-w-fit hover:text-sky-600 hover:underline">Munich (MUC)</a> — Napcabs fully enclosed pods in T1 and T2, airside</li>
                <li className="flex items-start gap-2"><a href="/airport/helsinki-vantaa-hel" onClick={(e) => { e.preventDefault(); navigateTo('/airport/helsinki-vantaa-hel'); }} className="font-semibold min-w-fit hover:text-sky-600 hover:underline">Helsinki Vantaa (HEL)</a> — GoSleep pods, transit-safe in departures</li>
                <li className="flex items-start gap-2"><a href="/airport/hamad-international-airport-doh" onClick={(e) => { e.preventDefault(); navigateTo('/airport/hamad-international-airport-doh'); }} className="font-semibold min-w-fit hover:text-sky-600 hover:underline">Doha Hamad (DOH)</a> — Multiple rest facilities in the main terminal</li>
              </ul>
              <p className="text-slate-700 leading-relaxed">
                Browse all sleep pod locations above, or explore all airports with rest facilities on the{' '}
                <a href="/airports" onClick={(e) => { e.preventDefault(); navigateTo('/airports'); }} className="font-semibold text-slate-900 hover:text-sky-600 underline underline-offset-2">airports page</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">How to Choose the Right Rest Option</h2>
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl p-4">
                  <Clock className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">Layover under 3 hours</p>
                    <p className="text-sm text-slate-600">A lounge or quiet zone is usually sufficient. The cost of booking a pod may not be worth it for very short connections.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-slate-700 text-white rounded-xl p-4">
                  <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Layover 3–8 hours</p>
                    <p className="text-sm text-slate-200">Sleep pods are the best option. They deliver real rest at a lower price than private rooms, with airside access at most airports.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl p-4">
                  <Clock className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">Layover 8+ hours or overnight</p>
                    <p className="text-sm text-slate-600">
                      Consider a <a href="/private-rooms" onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }} className="font-semibold text-slate-900 hover:text-sky-600">private room</a> or <a href="/transit-hotels" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-900 hover:text-sky-600">transit hotel</a> for better sleep quality, a proper bed, and shower access.
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
                  <p className="text-sm font-semibold text-slate-800">Basic pods</p>
                  <p className="text-xl font-bold text-slate-900 my-1">$10–$20</p>
                  <p className="text-xs text-slate-500">per hour — open-visor or recliner style, shared pod area</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
                  <DollarSign className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-800">Premium pods</p>
                  <p className="text-xl font-bold text-slate-900 my-1">$25–$50</p>
                  <p className="text-xs text-slate-500">per hour — fully enclosed, lockable capsule with climate control</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
                  <DollarSign className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-slate-800">Block bookings</p>
                  <p className="text-xl font-bold text-slate-900 my-1">$60–$120</p>
                  <p className="text-xs text-slate-500">typical 6-hour block — better hourly value than per-hour pricing</p>
                </div>
              </div>
              <p className="text-sm text-slate-500">Rates vary by airport, brand, and time of day. Check the individual facility listing for current pricing.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-5">Frequently Asked Questions</h2>
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200 max-w-3xl">
                {SLEEP_PODS_FAQ.map((item, index) => (
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
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Sleep Pods in Airports: Bottom Line</h2>
              <div className="max-w-3xl space-y-3 text-slate-600 leading-relaxed">
                <p>
                  Sleep pods are the most practical mid-layover rest option at most major international airports. For transit passengers on a 3–8 hour connection, a sleep pod delivers real rest at a lower price than a private room, without requiring immigration clearance at airside locations.
                </p>
                <p>
                  The category spans a wide range — from basic recliner pods with a visor to fully enclosed lockable capsules. At airports with strong pod coverage like Singapore Changi, Seoul Incheon, or Munich, quality options are available that genuinely rival the rest quality of a private room at a fraction of the cost.
                </p>
                <p>
                  For overnight layovers or those needing shower access, upgrade to a{' '}
                  <a href="/private-rooms" onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }} className="font-semibold text-slate-800 underline underline-offset-2 hover:text-slate-600">private room</a>{' '}
                  or{' '}
                  <a href="/transit-hotels" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-800 underline underline-offset-2 hover:text-slate-600">transit hotel</a>.
                  For very short connections, a{' '}
                  <a href="/lounge-sleep" onClick={(e) => { e.preventDefault(); navigateTo('/lounge-sleep'); }} className="font-semibold text-slate-800 underline underline-offset-2 hover:text-slate-600">lounge</a>{' '}
                  may be more efficient. Browse all{' '}
                  <a href="/airports" onClick={(e) => { e.preventDefault(); navigateTo('/airports'); }} className="font-semibold text-slate-800 underline underline-offset-2 hover:text-slate-600">airports</a>{' '}
                  to find sleep pod availability on your specific route.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Explore Other Airport Rest Options</h2>
              <div className="grid sm:grid-cols-3 gap-4 max-w-3xl">
                <a href="/private-rooms" onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-sm transition-all group">
                  <Hotel className="w-6 h-6 text-slate-600 mb-3" />
                  <p className="font-semibold text-slate-800 mb-1 group-hover:text-slate-600">Private Rooms</p>
                  <p className="text-sm text-slate-500">Fully enclosed hourly rooms with beds and often bathrooms. Best for 4–10 hour layovers.</p>
                </a>
                <a href="/transit-hotels" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-sm transition-all group">
                  <MapPin className="w-6 h-6 text-slate-600 mb-3" />
                  <p className="font-semibold text-slate-800 mb-1 group-hover:text-slate-600">Transit Hotels</p>
                  <p className="text-sm text-slate-500">Full hotel rooms inside or connected to terminals. Best for overnight stays and long layovers.</p>
                </a>
                <a href="/lounge-sleep" onClick={(e) => { e.preventDefault(); navigateTo('/lounge-sleep'); }} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-sm transition-all group">
                  <Hotel className="w-6 h-6 text-slate-600 mb-3" />
                  <p className="font-semibold text-slate-800 mb-1 group-hover:text-slate-600">Lounge Sleep</p>
                  <p className="text-sm text-slate-500">Shared rest areas inside airport lounges. Best for short layovers and travelers with lounge access.</p>
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
