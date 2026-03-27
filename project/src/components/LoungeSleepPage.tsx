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

const LOUNGE_SLEEP_FAQ = [
  {
    question: 'Can I sleep in an airport lounge?',
    answer: 'Yes, but with limitations. Airport lounges are designed for comfort and rest, not dedicated sleep. Most offer reclining chairs, quieter environments, and lower foot traffic than the public terminal. A minority of premium lounges have designated nap zones or daybeds. Do not expect a flat bed or full privacy — if you need to actually sleep, a sleep pod or private room provides meaningfully better conditions.',
  },
  {
    question: 'Are airport lounges airside or landside?',
    answer: 'Most international airport lounges are airside — located in the departures area after security and passport control. This means international transit passengers can access them without clearing immigration. Some smaller airports have landside lounges accessible before passport control, which require no immigration to access but may have different access rules.',
  },
  {
    question: 'Do I need a visa to use an airport lounge during transit?',
    answer: 'For airside lounges, no. Transit passengers can use airside lounges without clearing immigration or holding a visa for the transit country. For lounges in terminals that require re-entering passport control to access, transit visa rules for the host country apply.',
  },
  {
    question: 'How much does airport lounge access cost?',
    answer: 'Walk-in rates typically range from $30–$70 for standard lounges and $50–$120 for premium independent lounges like Plaza Premium. Some lounges charge by the hour; others use a flat entry fee with a time limit. Access may be free through airline elite status, Priority Pass, Lounge Key, or certain credit cards — always check your benefits before paying.',
  },
  {
    question: 'Which credit cards give free airport lounge access?',
    answer: 'Many premium travel credit cards include lounge access through Priority Pass, Lounge Key, or direct airline lounge partnerships. Cards commonly providing lounge access include American Express Platinum and Gold tiers, certain Visa Infinite cards, and major airline co-branded cards. Coverage varies significantly by card and region — check your specific card benefits.',
  },
  {
    question: 'What is the difference between lounge sleep and a sleep pod?',
    answer: 'Lounge sleep is shared rest in a common area without dedicated sleeping space. Sleep pods are individual, semi-private or fully enclosed units specifically designed for rest. If you need more than light rest — actual sleep with reasonable darkness and privacy — a sleep pod is the better choice. Lounge sleep works well for short connections where you mainly need comfort, food, and Wi-Fi.',
  },
  {
    question: 'How long can I stay in an airport lounge?',
    answer: 'Most airport lounges allow stays of 2–3 hours per visit. Premium paid lounges may have longer time limits or unlimited stays. Airline status lounges may not impose time limits, but do monitor crowding. Always confirm the time policy before settling in for a longer layover.',
  },
  {
    question: 'Do airport lounges have showers?',
    answer: 'Many premium independent lounges (Plaza Premium, Aspire, Marhaba) include showers, typically as part of the standard entry fee or for a small additional charge. Airline business class lounges usually include showers for eligible passengers. Standard or lower-tier lounges may not have shower facilities — check the specific lounge listing.',
  },
  {
    question: 'Are independent lounges better than airline lounges for rest?',
    answer: 'It depends. Airline lounges (especially in long-haul business class) often have higher quality food, drinks, and furniture. But independent lounges like Plaza Premium are open to any passenger regardless of ticket class or airline, making them more accessible. For rest specifically, the quality of the seating and noise level matters more than the lounge type.',
  },
  {
    question: 'Which airports have the best lounges for sleeping?',
    answer: 'Singapore Changi, Doha Hamad, Dubai, and Tokyo Narita have high-quality independent lounges with rest areas. Changi and Incheon have free-to-use quiet zones and rest facilities alongside paid lounges. For paid premium lounge access, Plaza Premium at Hong Kong, Kuala Lumpur, and major Middle Eastern hubs offers strong rest facilities.',
  },
];

export default function LoungeSleepPage() {
  const [facilities, setFacilities] = useState<AirportFacility[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<AirportFacility[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchFacilities();
    updatePageMeta(
      'Airport Lounge Sleep: Access Rules, Costs & Best Options (2026) | RestInAirport',
      'Find airport lounges with rest areas at major hubs worldwide. Compare access rules, costs, shower availability, and whether lounge sleep is right for your layover.',
      `${window.location.origin}/lounge-sleep`,
      generateFAQStructuredData(LOUNGE_SLEEP_FAQ)
    );
  }, []);

  async function fetchFacilities() {
    setLoading(true);
    const { data, error } = await supabase
      .from('airport_facilities')
      .select('*')
      .or('type.ilike.%lounge%,type.ilike.%club%')
      .order('airport', { ascending: true });

    if (error) {
      console.error('Error fetching facilities:', error);
    } else {
      setFacilities(data || []);
      setFilteredFacilities(data || []);
    }
    setLoading(false);
  }

  const loungeFacilities = filteredFacilities;
  const airportCount = new Set(loungeFacilities.map(f => f.airport)).size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <Helmet>
        <title>Airport Lounge Sleep: Access Rules, Costs & Best Options (2026) | RestInAirport</title>
        <meta name="description" content="Find airport lounges with rest areas at major hubs worldwide. Compare access rules, costs, shower availability, and whether lounge sleep is right for your layover." />
        <link rel="canonical" href="https://restinairport.com/lounge-sleep" />
        <meta property="og:title" content="Airport Lounge Sleep: Access Rules, Costs & Best Options | RestInAirport" />
        <meta property="og:description" content="Find airport lounges with rest areas. Compare costs, access rules, and whether lounge sleep suits your layover." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://restinairport.com/lounge-sleep" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Airport Lounge Sleep: Access Rules, Costs & Best Options | RestInAirport" />
        <meta name="twitter:description" content="Find airport lounges with rest areas. Compare costs and access rules for your layover." />
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Lounge Sleep in Airports</h1>
            <p className="text-lg text-slate-200 max-w-3xl mb-8 leading-relaxed">
              Rest in airport lounges with comfortable seating, food, showers, and Wi-Fi. Most lounges are airside. Best for short layovers and light rest — not a substitute for a bed.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl">
              <div className="bg-slate-700 rounded-xl px-4 py-3 text-center">
                <div className="text-2xl font-bold">{loungeFacilities.length}</div>
                <div className="text-xs text-slate-300 mt-0.5">Lounge Facilities</div>
              </div>
              <div className="bg-slate-700 rounded-xl px-4 py-3 text-center">
                <div className="text-2xl font-bold">{airportCount}</div>
                <div className="text-xs text-slate-300 mt-0.5">Airports</div>
              </div>
              <div className="bg-slate-700 rounded-xl px-4 py-3 text-center">
                <div className="text-sm font-bold">$30–$120</div>
                <div className="text-xs text-slate-300 mt-0.5">Per Visit</div>
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
              <p className="text-sm text-slate-700 leading-relaxed">Layovers under 4 hours. Travelers with lounge access via card or status. Those who want food, Wi-Fi, and comfort rather than dedicated sleep space.</p>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Not ideal for</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">Long or overnight layovers. Travelers who need actual uninterrupted sleep. Lounges are shared spaces — noise, light, and foot traffic affect rest quality.</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Access note</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">Most airport lounges are airside. Transit passengers can access them without clearing immigration. Some require airline status, credit card membership, or paid entry.</p>
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
              <SearchResults facilities={loungeFacilities} query="" />
            </>
          )}

          <div className="mt-16 space-y-14">

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">What Is Lounge Sleep?</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Lounge sleep refers to resting inside airport lounges during a layover. Lounges are not sleeping facilities — they are comfort and hospitality spaces offering reclining chairs, quiet zones, food, showers, and Wi-Fi. Some premium lounges include designated rest areas or daybeds, but the majority offer shared seating only.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                For a short layover where you need comfort, a meal, and a place to decompress, a lounge is an excellent option. For a layover where you need actual sleep — particularly one that spans overnight — a{' '}
                <a href="/sleep-pods" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600 underline underline-offset-2">sleep pod</a>,{' '}
                <a href="/private-rooms" onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }} className="font-semibold text-slate-900 hover:text-sky-600 underline underline-offset-2">private room</a>, or{' '}
                <a href="/transit-hotels" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-900 hover:text-sky-600 underline underline-offset-2">transit hotel</a>{' '}
                delivers meaningfully better conditions.
              </p>
              <p className="text-slate-700 leading-relaxed">
                The strongest case for lounge sleep is when you already have access — through airline status, Priority Pass, or a credit card perk — making the rest effectively free.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Types of Airport Lounges</h2>
              <div className="grid sm:grid-cols-2 gap-4 max-w-3xl">
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <p className="text-sm font-semibold text-slate-800 mb-2">Airline Lounges</p>
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">Operated by airlines for their business/first class passengers and elite frequent flyers. Generally high quality food and service. Access strictly tied to ticket class or status — not available to economy passengers without day passes.</p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-5">
                  <p className="text-sm font-semibold text-slate-800 mb-2">Independent Lounges</p>
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">Brands like Plaza Premium, Aspire, Marhaba, and Miracle operate independently and are open to any passenger via paid entry, Priority Pass, or Lounge Key. Quality varies by brand and airport, but the best independent lounges rival airline business class lounges.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">How to Access Airport Lounges</h2>
              <div className="space-y-3 max-w-3xl">
                <div className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl p-4">
                  <DollarSign className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">Walk-in (paid entry)</p>
                    <p className="text-sm text-slate-600">Available to any passenger. Rates typically $30–$120 depending on the lounge tier and airport. Some lounges allow online pre-booking at a lower price than walk-in rates.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl p-4">
                  <DollarSign className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">Credit card or membership program</p>
                    <p className="text-sm text-slate-600">Priority Pass, Lounge Key, and Dragonpass provide access to independent lounges globally. Many premium credit cards include Priority Pass. Check your card benefits before paying walk-in rates.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl p-4">
                  <DollarSign className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">Airline status or ticket class</p>
                    <p className="text-sm text-slate-600">Business class tickets and elite airline status typically include lounge access. Confirmation of which specific lounges are included depends on your airline and status tier.</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Lounge Sleep vs Other Airport Rest Options</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse max-w-4xl">
                  <thead>
                    <tr className="bg-slate-100 text-left">
                      <th className="px-4 py-3 font-semibold text-slate-700 rounded-tl-lg">Option</th>
                      <th className="px-4 py-3 font-semibold text-slate-700">Sleep quality</th>
                      <th className="px-4 py-3 font-semibold text-slate-700">Best layover</th>
                      <th className="px-4 py-3 font-semibold text-slate-700">Typical cost</th>
                      <th className="px-4 py-3 font-semibold text-slate-700 rounded-tr-lg">Food included</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr className="bg-slate-700 text-white">
                      <td className="px-4 py-3 font-semibold">Lounge Sleep</td>
                      <td className="px-4 py-3">Light rest only</td>
                      <td className="px-4 py-3">Under 4 hours</td>
                      <td className="px-4 py-3">$30–$120/visit</td>
                      <td className="px-4 py-3">Yes — typically included</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-4 py-3">
                        <a href="/sleep-pods" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-medium text-slate-800 hover:text-sky-600 underline underline-offset-2">Sleep Pods</a>
                      </td>
                      <td className="px-4 py-3 text-slate-600">Good — dedicated rest space</td>
                      <td className="px-4 py-3 text-slate-600">2–8 hours</td>
                      <td className="px-4 py-3 text-slate-600">$10–$50/hr</td>
                      <td className="px-4 py-3 text-slate-600">No</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="px-4 py-3">
                        <a href="/private-rooms" onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }} className="font-medium text-slate-800 hover:text-sky-600 underline underline-offset-2">Private Rooms</a>
                      </td>
                      <td className="px-4 py-3 text-slate-600">Very good — fully private</td>
                      <td className="px-4 py-3 text-slate-600">3–10 hours</td>
                      <td className="px-4 py-3 text-slate-600">$40–$80/hr</td>
                      <td className="px-4 py-3 text-slate-600">No</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-4 py-3">
                        <a href="/transit-hotels" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-medium text-slate-800 hover:text-sky-600 underline underline-offset-2">Transit Hotels</a>
                      </td>
                      <td className="px-4 py-3 text-slate-600">Excellent — hotel room quality</td>
                      <td className="px-4 py-3 text-slate-600">6–16+ hours</td>
                      <td className="px-4 py-3 text-slate-600">$80–$250</td>
                      <td className="px-4 py-3 text-slate-600">Varies</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Best Airports for Lounge Sleep</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                The best airports for lounge access combine high-quality independent lounges with strong coverage across terminals. Top options include:
              </p>
              <ul className="space-y-2 text-slate-700 mb-4">
                <li className="flex items-start gap-2"><a href="/airport/singapore-changi-sin" onClick={(e) => { e.preventDefault(); navigateTo('/airport/singapore-changi-sin'); }} className="font-semibold min-w-fit hover:text-sky-600 hover:underline">Singapore Changi (SIN)</a> — Plaza Premium and airline lounges across all terminals; free rest zones also available</li>
                <li className="flex items-start gap-2"><a href="/airport/hong-kong-hkg" onClick={(e) => { e.preventDefault(); navigateTo('/airport/hong-kong-hkg'); }} className="font-semibold min-w-fit hover:text-sky-600 hover:underline">Hong Kong (HKG)</a> — Plaza Premium with multiple tiers, excellent facilities airside</li>
                <li className="flex items-start gap-2"><a href="/airport/hamad-international-airport-doh" onClick={(e) => { e.preventDefault(); navigateTo('/airport/hamad-international-airport-doh'); }} className="font-semibold min-w-fit hover:text-sky-600 hover:underline">Doha Hamad (DOH)</a> — Al Mourjan and Oryx lounges, high quality for transit passengers</li>
                <li className="flex items-start gap-2"><a href="/airport/kuala-lumpur-kul" onClick={(e) => { e.preventDefault(); navigateTo('/airport/kuala-lumpur-kul'); }} className="font-semibold min-w-fit hover:text-sky-600 hover:underline">Kuala Lumpur (KUL)</a> — Plaza Premium in KLIA and KLIA2, strong independent coverage</li>
                <li className="flex items-start gap-2"><a href="/airport/dubai-international-dxb" onClick={(e) => { e.preventDefault(); navigateTo('/airport/dubai-international-dxb'); }} className="font-semibold min-w-fit hover:text-sky-600 hover:underline">Dubai (DXB)</a> — Multiple lounge options in T1 and T3, suitable for long layovers</li>
              </ul>
              <p className="text-slate-700 leading-relaxed">
                Browse all lounge listings above, or explore options by airport on the{' '}
                <a href="/airports" onClick={(e) => { e.preventDefault(); navigateTo('/airports'); }} className="font-semibold text-slate-900 hover:text-sky-600 underline underline-offset-2">airports page</a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">When to Use Lounge Sleep vs Alternatives</h2>
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-start gap-3 bg-slate-700 text-white rounded-xl p-4">
                  <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm">Layover under 4 hours with lounge access</p>
                    <p className="text-sm text-slate-200">Lounge sleep is the strongest option. You get food, Wi-Fi, comfort, and reasonable rest at no extra cost if access is already included.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl p-4">
                  <Clock className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">Layover 4–8 hours</p>
                    <p className="text-sm text-slate-600">
                      A <a href="/sleep-pods" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600">sleep pod</a> will deliver better actual rest. Use the lounge for the first hour to eat, then move to a pod for sleep.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl p-4">
                  <Clock className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">Overnight layover</p>
                    <p className="text-sm text-slate-600">
                      A <a href="/transit-hotels" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-900 hover:text-sky-600">transit hotel</a> or <a href="/private-rooms" onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }} className="font-semibold text-slate-900 hover:text-sky-600">private room</a> is necessary. Sleeping upright in a lounge chair for 8+ hours is uncomfortable and not restorative.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-5">Frequently Asked Questions</h2>
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200 max-w-3xl">
                {LOUNGE_SLEEP_FAQ.map((item, index) => (
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
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Lounge Sleep: Bottom Line</h2>
              <div className="max-w-3xl space-y-3 text-slate-600 leading-relaxed">
                <p>
                  Lounge sleep is the most accessible airport rest option for short layovers, particularly when access is already free through a credit card, airline status, or membership program. At top-tier lounges — Plaza Premium at Singapore or Hong Kong, or Qatar Airways Al Mourjan at Doha — the food, showers, and comfort level genuinely improve a short layover.
                </p>
                <p>
                  The honest limitation is sleep quality. Lounges are shared environments with other passengers, terminal announcements, and ambient noise. They are not designed for sleep. If your layover exceeds 5 hours and actual rest is the priority,{' '}
                  <a href="/sleep-pods" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-800 underline underline-offset-2 hover:text-slate-600">sleep pods</a>{' '}
                  or{' '}
                  <a href="/private-rooms" onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }} className="font-semibold text-slate-800 underline underline-offset-2 hover:text-slate-600">private rooms</a>{' '}
                  deliver significantly better conditions for the same or lower cost than a premium lounge day pass.
                </p>
                <p>
                  For overnight layovers, only a{' '}
                  <a href="/transit-hotels" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-800 underline underline-offset-2 hover:text-slate-600">transit hotel</a>{' '}
                  provides the sleep quality needed before a long onward flight. Browse all{' '}
                  <a href="/airports" onClick={(e) => { e.preventDefault(); navigateTo('/airports'); }} className="font-semibold text-slate-800 underline underline-offset-2 hover:text-slate-600">airports</a>{' '}
                  to compare all available rest options at your connection point.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Explore Other Airport Rest Options</h2>
              <div className="grid sm:grid-cols-3 gap-4 max-w-3xl">
                <a href="/sleep-pods" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-sm transition-all group">
                  <Hotel className="w-6 h-6 text-slate-600 mb-3" />
                  <p className="font-semibold text-slate-800 mb-1 group-hover:text-slate-600">Sleep Pods</p>
                  <p className="text-sm text-slate-500">Private sleeping capsules. Better rest than a lounge for layovers of 2–8 hours.</p>
                </a>
                <a href="/private-rooms" onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-sm transition-all group">
                  <MapPin className="w-6 h-6 text-slate-600 mb-3" />
                  <p className="font-semibold text-slate-800 mb-1 group-hover:text-slate-600">Private Rooms</p>
                  <p className="text-sm text-slate-500">Fully enclosed hourly rooms with beds. Best for 4–10 hour layovers needing real privacy.</p>
                </a>
                <a href="/transit-hotels" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-sm transition-all group">
                  <Hotel className="w-6 h-6 text-slate-600 mb-3" />
                  <p className="font-semibold text-slate-800 mb-1 group-hover:text-slate-600">Transit Hotels</p>
                  <p className="text-sm text-slate-500">Full hotel rooms inside terminals. Essential for overnight layovers requiring proper rest.</p>
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
