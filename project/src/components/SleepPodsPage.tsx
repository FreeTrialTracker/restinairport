import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Hotel, MapPin, Loader, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { AirportFacility } from '../lib/database.types';
import SearchResults from './SearchResults';
import FacilityFilters from './FacilityFilters';
import Header from './Header';
import Footer from './Footer';
import { updatePageMeta, generateFAQStructuredData } from '../lib/seo';
import { navigateTo } from '../lib/navigation';

const SLEEP_PODS_FAQ = [
  { question: 'Can you sleep in airport pods without a visa?', answer: 'Yes, if the pods are located airside within the transit zone, you do not need to pass immigration or hold a visa.' },
  { question: 'How much do airport sleep pods cost?', answer: 'Most sleep pods cost between 10 and 40 USD per hour depending on the airport and amenities.' },
  { question: 'Are sleep pods worth it?', answer: 'Yes, especially for short layovers. They offer privacy and comfort compared to sleeping in public areas.' },
  { question: 'What is the difference between sleep pods and transit hotels?', answer: 'Sleep pods are compact and rented hourly, while transit hotels provide full private rooms for longer stays.' },
  { question: 'Do airport sleep pods have showers?', answer: 'Some do, but many require separate access to airport shower facilities.' },
  { question: 'Can you book sleep pods in advance?', answer: 'Yes, many airports allow online booking, but availability may be limited in busy hubs.' },
  { question: 'Are airport sleep pods safe?', answer: 'Yes, they are located in secure airport areas with monitoring and staff nearby.' },
  { question: 'Which airports have sleep pods?', answer: 'Major airports like Doha, Dubai, Helsinki, Tokyo, and Seoul offer sleep pod facilities.' },
  { question: 'How long can you stay in a sleep pod?', answer: 'Most facilities allow hourly bookings, typically starting from 1 to 3 hours, with options to extend.' },
  { question: 'Are sleep pods better than airport lounges?', answer: 'Yes for sleeping. Lounges are better for relaxing, but sleep pods provide more privacy and comfort for rest.' },
];

export default function SleepPodsPage() {
  const [facilities, setFacilities] = useState<AirportFacility[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<AirportFacility[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchFacilities();
    updatePageMeta(
      'Sleep Pods in Airports Worldwide (2026 Guide) | RestInAirport.com',
      'Discover airport sleep pods and capsule hotels at 100+ airports worldwide. Compare hourly rates, transit-safe locations, and amenities for efficient layover rest.',
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

  const faqItems = SLEEP_PODS_FAQ;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <Helmet>
        <title>Sleep Pods in Airports Worldwide (2026 Guide) | RestInAirport.com</title>
        <meta name="description" content="Discover airport sleep pods and capsule hotels at 100+ airports worldwide. Compare hourly rates, transit-safe locations, and amenities for efficient layover rest." />
        <link rel="canonical" href="https://restinairport.com/sleep-pods" />
        <meta property="og:title" content="Sleep Pods in Airports Worldwide (2026 Guide) | RestInAirport.com" />
        <meta property="og:description" content="Discover airport sleep pods and capsule hotels at 100+ airports worldwide. Compare hourly rates, transit-safe locations, and amenities." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://restinairport.com/sleep-pods" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sleep Pods in Airports Worldwide (2026 Guide) | RestInAirport.com" />
        <meta name="twitter:description" content="Discover airport sleep pods and capsule hotels at 100+ airports worldwide." />
      </Helmet>
      <Header />

      <main className="flex-1">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Sleep Pods in Airports Worldwide (2026 Guide)</h1>

            <div className="flex flex-wrap gap-6 mt-8">
              <div className="flex items-center space-x-2">
                <Hotel className="w-6 h-6" />
                <div>
                  <div className="text-2xl font-bold">{sleepPodFacilities.length}</div>
                  <div className="text-sm text-slate-300">Facilities</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-6 h-6" />
                <div>
                  <div className="text-2xl font-bold">{airportCount}</div>
                  <div className="text-sm text-slate-300">Airports</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="prose prose-slate max-w-none mb-12">
            <p className="text-lg text-slate-700 leading-relaxed">
              Sleep pods in airports are compact, private sleeping units located inside airport terminals, often in airside transit areas. Travelers can rest during layovers without{' '}
              <a href="https://www.visainfoguide.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-sky-700 hover:text-sky-600 underline underline-offset-2">passing immigration</a>,
              making them ideal for short layovers. These pods are typically rented by the hour and include a bed, charging ports, and basic privacy features.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <Loader className="inline-block animate-spin w-12 h-12 text-slate-700" />
              <p className="mt-4 text-slate-600">Loading facilities...</p>
            </div>
          ) : (
            <>
              <FacilityFilters
                facilities={facilities}
                onFilterChange={setFilteredFacilities}
              />
              <SearchResults facilities={sleepPodFacilities} query="" />
            </>
          )}

          <div className="mt-16 space-y-12">
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Global Coverage</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                This page focuses specifically on airport sleep pod and capsule-style facilities within a global dataset of 200+ airport rest facilities across 100+ airports worldwide.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                Sleep pod locations are available in major international hubs across Asia, the Middle East, Europe, and North America. You can explore all airports directly via the{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/airports'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  airports
                </a>{' '}
                page or drill into specific locations through each listing.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Each facility listing includes terminal-level location, access rules, pricing estimates, and whether the pod is transit-safe without immigration.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">What Are Airport Sleep Pods?</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Airport sleep pods (also known as capsule pods or nap pods) are compact, enclosed sleeping units designed for short-term rest inside airport terminals.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                They are optimized for quick recovery during layovers and are often located near gates or inside transit zones. Unlike full rooms listed on{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  private rooms
                </a>{' '}
                or longer-stay options on{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  transit hotels
                </a>, sleep pods focus on efficiency and accessibility.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Typical features include a reclining or flat sleeping surface, power outlets, adjustable lighting, and a compact enclosed design for privacy.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Who Should Use Sleep Pods?</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Sleep pods are ideal for travelers with layovers between 2 to 8 hours, especially those who cannot pass immigration.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                They are commonly used by solo travelers, transit passengers, and budget-conscious travelers who want better rest than public seating but do not need a full room like those listed under{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  private rooms
                </a>{' '}
                or{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  transit hotels
                </a>.
              </p>
              <p className="text-slate-700 leading-relaxed">
                If your goal is quick rest during transit, sleep pods are usually the best option.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Can You Use Sleep Pods Without a Visa?</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                In many airports, yes.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                Most sleep pods are located airside, meaning inside the secure transit zone. This allows travelers to rest without passing immigration or needing a visa.
              </p>
              <p className="text-slate-700 leading-relaxed">
                However, some facilities may be located landside or require{' '}
                <a href="https://www.visainfoguide.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-sky-700 hover:text-sky-600 underline underline-offset-2">entry clearance</a>.
                Always check the facility details before booking or compare with options under{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  transit hotels
                </a>{' '}
                if you plan to enter the country.
              </p>

              <div className="mt-6 bg-sky-50 border border-sky-200 rounded-xl p-5 flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <p className="font-semibold text-sky-900 mb-1">Not sure if you need a transit visa?</p>
                  <p className="text-sky-800 text-sm leading-relaxed">
                    Visa rules vary by nationality and transit country.{' '}
                    <a href="https://www.visainfoguide.com" target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-2 hover:text-sky-600">
                      Check your transit visa eligibility at visainfoguide.com
                    </a>
                    {' '}before booking a landside facility.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Sleep Pods vs Other Airport Sleep Options</h2>

              <div className="space-y-4">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Sleep Pods</h3>
                  <p className="text-slate-700 leading-relaxed">
                    Best for short rest between 1 to 6 hours. They are compact, affordable, and accessible inside terminals.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                      Private Rooms
                    </a>
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                    Better for longer rest or work sessions, offering more space and privacy.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                      Transit Hotels
                    </a>
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                    Best for overnight stays or long layovers, with full hotel-style rooms.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/lounge-sleep'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                      Lounge Sleep
                    </a>
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                    Suitable for light rest only, typically without beds.
                  </p>
                </div>
              </div>

              <p className="text-slate-700 leading-relaxed mt-4">
                For most short layovers, sleep pods offer the best balance between cost, access, and privacy.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">How Much Do Airport Sleep Pods Cost?</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Pricing varies depending on the airport and facility, but typical ranges are:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
                <li>10 to 20 USD per hour for basic pods</li>
                <li>25 to 40 USD per hour for premium pods</li>
                <li>Higher rates for extended packages</li>
              </ul>
              <p className="text-slate-700 leading-relaxed">
                Many facilities offer fixed booking durations such as 3-hour or 6-hour blocks.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Best Airports for Sleep Pods</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Major airports with strong sleep pod availability include Doha, Dubai, Helsinki, Tokyo Narita, and Seoul Incheon.
              </p>
              <p className="text-slate-700 leading-relaxed">
                You can explore all supported airports through the{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/airports'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  airports
                </a>{' '}
                page or navigate directly via each listing above.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">When Should You Use a Sleep Pod?</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Sleep pods are best when your layover is under 8 hours and you need privacy without leaving the airport.
              </p>
              <p className="text-slate-700 leading-relaxed">
                If your layover exceeds 8 to 10 hours, consider upgrading to a{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  transit hotel
                </a>{' '}
                or a{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  private room
                </a>{' '}
                for better comfort.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Tips for Booking Sleep Pods</h2>
              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                <li>Always confirm whether the pod is airside or landside.</li>
                <li>Book early in major hubs where availability is limited.</li>
                <li>Check terminal and gate proximity before arrival.</li>
                <li>Bring essentials as pods are minimal.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">How to Choose the Right Sleep Option</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                For short layovers under 4 hours,{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/lounge-sleep'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  lounges
                </a>{' '}
                may be sufficient.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                For 4 to 8 hours, sleep pods are the most efficient option.
              </p>
              <p className="text-slate-700 leading-relaxed">
                For longer layovers, transit hotels or private rooms provide better comfort and space.
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
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Final Thoughts on Sleep Pods in Airports</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Sleep pods have become one of the most efficient ways to rest during a layover without leaving the airport. They offer a balance between affordability, privacy, and accessibility, especially for travelers who need quick recovery between flights.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                For short layovers, sleep pods are often the best option available. They provide significantly more comfort than public seating and better accessibility than full hotel rooms. However, they are not designed for long stays or deep sleep.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                If your travel situation changes, it is important to choose the right alternative. Travelers with longer layovers may benefit more from{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  transit hotels
                </a>, while those needing additional comfort and space should consider{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  private rooms
                </a>. For very short stays or access to food and facilities,{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/lounge-sleep'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  lounge sleep
                </a>{' '}
                may be sufficient.
              </p>
              <p className="text-slate-700 leading-relaxed">
                The key is to match your layover duration, budget, and comfort level with the right option.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Explore Other Airport Sleep Options</h2>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Transit Hotels in Airports</h3>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    Full hotel rooms inside airport terminals for overnight stays and maximum comfort. Best for long layovers and proper sleep.
                  </p>
                  <button
                    onClick={() => navigateTo('/transit-hotels')}
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Explore Transit Hotels
                  </button>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Private Rooms in Airports</h3>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    Quiet, enclosed rooms offering more space and privacy than pods. Ideal for medium-length layovers and business travelers.
                  </p>
                  <button
                    onClick={() => navigateTo('/private-rooms')}
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Explore Private Rooms
                  </button>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Lounge Sleep Options</h3>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    Rest in airport lounges with comfortable seating, food, and WiFi. Suitable for short layovers and light rest.
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
              <p className="text-slate-700 leading-relaxed mb-4">
                Choosing the right airport sleep solution depends on your layover duration and comfort needs.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
                <li>
                  For short layovers under 4 hours,{' '}
                  <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/lounge-sleep'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                    lounge sleep
                  </a>{' '}
                  is often enough
                </li>
                <li>For 4 to 8 hours, sleep pods provide the best balance</li>
                <li>
                  For 8+ hours,{' '}
                  <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                    private rooms
                  </a>{' '}
                  or{' '}
                  <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                    transit hotels
                  </a>{' '}
                  are more suitable
                </li>
              </ul>
              <p className="text-slate-700 leading-relaxed">
                Each option serves a different purpose, and understanding the difference will help you maximize comfort during your journey.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
