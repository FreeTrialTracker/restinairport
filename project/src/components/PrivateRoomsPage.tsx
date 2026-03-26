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

const PRIVATE_ROOMS_FAQ = [
  { question: 'Can you rent a private room in an airport?', answer: 'Yes, many airports offer private rooms through dedicated facilities or transit services, usually available on an hourly basis.' },
  { question: 'Do airport private rooms require a visa?', answer: 'It depends on location. Airside rooms do not require a visa, while landside rooms do.' },
  { question: 'How much do airport private rooms cost?', answer: 'Most private rooms cost between 40 and 80 USD per hour depending on the airport and amenities.' },
  { question: 'Are private rooms better than sleep pods?', answer: 'Yes, they offer more space, privacy, and comfort compared to sleep pods, but at a higher cost.' },
  { question: 'Can you sleep overnight in airport private rooms?', answer: 'Some allow extended stays, but transit hotels are usually better for full overnight rest.' },
  { question: 'Do private rooms include showers?', answer: 'Some premium options include showers, while others may require separate facilities.' },
  { question: 'Can you book private rooms in advance?', answer: 'Yes, many providers allow online booking, though availability can be limited.' },
  { question: 'Are airport private rooms safe?', answer: 'Yes, they are located in secure airport areas with controlled access.' },
  { question: 'What is the difference between private rooms and transit hotels?', answer: 'Private rooms are usually smaller and rented hourly, while transit hotels offer full hotel rooms.' },
  { question: 'Which airports have private rooms?', answer: 'Airports like Atlanta, Dallas, Miami, and Charlotte offer private room facilities.' },
];

export default function PrivateRoomsPage() {
  const [facilities, setFacilities] = useState<AirportFacility[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<AirportFacility[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchFacilities();
    updatePageMeta(
      'Private Rooms in Airports Worldwide (2026 Guide) | RestInAirport.com',
      'Discover private room and suite-style facilities at 100+ airports worldwide. Compare hourly rates, transit-safe locations, and amenities for comfortable layover rest.',
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

  const faqItems = PRIVATE_ROOMS_FAQ;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <Helmet>
        <title>Private Rooms in Airports Worldwide (2026 Guide) | RestInAirport.com</title>
        <meta name="description" content="Discover private room and suite-style facilities at 100+ airports worldwide. Compare hourly rates, transit-safe locations, and amenities for comfortable layover rest." />
        <link rel="canonical" href="https://restinairport.com/private-rooms" />
        <meta property="og:title" content="Private Rooms in Airports Worldwide (2026 Guide) | RestInAirport.com" />
        <meta property="og:description" content="Discover private room and suite-style facilities at 100+ airports worldwide." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://restinairport.com/private-rooms" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Private Rooms in Airports Worldwide (2026 Guide) | RestInAirport.com" />
        <meta name="twitter:description" content="Discover private room and suite-style facilities at 100+ airports worldwide." />
      </Helmet>
      <Header />

      <main className="flex-1">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Private Rooms in Airports Worldwide (2026 Guide)</h1>

            <div className="flex flex-wrap gap-6 mt-8">
              <div className="flex items-center space-x-2">
                <Hotel className="w-6 h-6" />
                <div>
                  <div className="text-2xl font-bold">{privateRoomFacilities.length}</div>
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
              Private rooms in airports are fully enclosed spaces that offer travelers a quiet, secure place to rest during a layover. Unlike sleep pods, private rooms provide more space, better comfort, and often include beds, work areas, and sometimes private bathrooms, making them ideal for longer layovers or travelers who need full privacy inside the airport.
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
              <SearchResults facilities={privateRoomFacilities} query="" />
            </>
          )}

          <div className="mt-16 space-y-12">
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Global Coverage</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                This page focuses specifically on private room and suite-style facilities within a global dataset of 200+ airport rest facilities across 100+ airports worldwide.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                Private room options are available in major international hubs across Asia, the Middle East, Europe, and North America. You can explore all{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/airports'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  airports
                </a>{' '}
                or drill into specific locations directly from each listing above.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Each facility listing includes terminal location, access requirements, pricing estimates, and whether the room is available without immigration.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">What Are Private Rooms in Airports?</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Private rooms in airports are enclosed, hotel-style spaces designed for travelers who want comfort, privacy, and space during a layover.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                They are commonly found in dedicated rest facilities or premium services and offer significantly more comfort than{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  sleep pods
                </a>, while remaining more flexible than full hotel stays under{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  transit hotels
                </a>.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Typical features include a bed or daybed, workspace, power outlets, and sound insulation. Some premium rooms may include private bathrooms, showers, or larger suite layouts.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Who Should Use Private Rooms?</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Private rooms are ideal for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
                <li>Layovers between 3 to 10 hours</li>
                <li>Business travelers needing workspace and rest</li>
                <li>Travelers who want privacy beyond{' '}
                  <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                    sleep pods
                  </a>
                </li>
                <li>Passengers willing to pay more for comfort</li>
              </ul>
              <p className="text-slate-700 leading-relaxed">
                If your goal is both rest and productivity, private rooms are often the best option between{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  sleep pods
                </a>{' '}
                and{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  transit hotels
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Can You Use Private Rooms Without a Visa?</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                It depends on the location.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                Some private rooms are located airside, allowing access without passing immigration. Others are landside and require entry into the country.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Always check the facility details before booking. If you cannot pass immigration, consider alternatives under{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  sleep pods
                </a>{' '}
                or explore suitable options within{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  transit hotels
                </a>.
              </p>

              <div className="mt-6 bg-sky-50 border border-sky-200 rounded-xl p-5 flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <p className="font-semibold text-sky-900 mb-1">Unsure about your transit visa status?</p>
                  <p className="text-sky-800 text-sm leading-relaxed">
                    Airside vs landside access depends on your nationality and itinerary.{' '}
                    <a href="https://www.visainfoguide.com" target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-2 hover:text-sky-600">
                      Confirm your visa requirements at visainfoguide.com
                    </a>
                    {' '}before booking.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Private Rooms vs Other Airport Sleep Options</h2>

              <div className="space-y-4">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Private Rooms</h3>
                  <p className="text-slate-700 leading-relaxed">
                    Best for medium-length layovers with high comfort and privacy.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                      Sleep Pods
                    </a>
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                    Better for shorter rests with lower cost and compact space.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                      Transit Hotels
                    </a>
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                    Best for overnight stays with full hotel experience.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/lounge-sleep'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                      Lounge Sleep
                    </a>
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                    Suitable only for light rest with shared spaces.
                  </p>
                </div>
              </div>

              <p className="text-slate-700 leading-relaxed mt-4">
                Private rooms offer a strong balance between flexibility and comfort compared to{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  sleep pods
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
              <h2 className="text-3xl font-bold text-slate-900 mb-4">How Much Do Private Rooms Cost?</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Pricing varies by airport and provider:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
                <li>40 to 60 USD per hour for standard rooms</li>
                <li>60 to 80 USD per hour for premium suites</li>
                <li>100+ USD for extended stays or packages</li>
              </ul>
              <p className="text-slate-700 leading-relaxed">
                Most facilities offer hourly booking with minimum durations.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Best Airports for Private Rooms</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Airports known for private room options include Atlanta, Dallas, Charlotte, Miami, and Nashville.
              </p>
              <p className="text-slate-700 leading-relaxed">
                You can explore all supported{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/airports'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  airports
                </a>{' '}
                or directly through the listings above.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">When Should You Use a Private Room?</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Private rooms are best when your layover is between 3 and 10 hours and you need both rest and privacy.
              </p>
              <p className="text-slate-700 leading-relaxed">
                For shorter layovers, consider{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  sleep pods
                </a>.{' '}
                For overnight stays,{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  transit hotels
                </a>{' '}
                provide a more complete experience.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Tips for Booking Private Rooms</h2>
              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                <li>Confirm whether the room is airside or landside.</li>
                <li>Check minimum booking duration and pricing structure.</li>
                <li>Book early in busy airports.</li>
                <li>Review included amenities before booking.</li>
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
                For 4 to 8 hours, private rooms or{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  sleep pods
                </a>{' '}
                offer good balance.
              </p>
              <p className="text-slate-700 leading-relaxed">
                For longer layovers,{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  transit hotels
                </a>{' '}
                provide full comfort and space.
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
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Final Thoughts on Private Rooms in Airports</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Private rooms in airports offer one of the best balances between comfort, privacy, and flexibility during a layover. They provide significantly more space than{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  sleep pods
                </a>{' '}
                while remaining more accessible and flexible than full{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  transit hotels
                </a>.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                For travelers who need both rest and functionality, private rooms are often the most practical choice. They allow you to sleep, work, and recharge in a quiet, enclosed environment without committing to a full hotel stay.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                However, they are not always the best option for every situation. For shorter layovers,{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  sleep pods
                </a>{' '}
                may be more efficient, while longer or overnight stays are better suited for{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  transit hotels
                </a>. If your goal is simply to relax for a short time,{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/lounge-sleep'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  lounge sleep
                </a>{' '}
                may be sufficient.
              </p>
              <p className="text-slate-700 leading-relaxed">
                The key is understanding how private rooms fit within the broader range of airport sleep options.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Explore Other Airport Sleep Options</h2>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Sleep Pods in Airports</h3>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    Compact, private pods designed for short layovers and quick rest without leaving the terminal.
                  </p>
                  <button
                    onClick={() => navigateTo('/sleep-pods')}
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Explore Sleep Pods
                  </button>
                </div>

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
                Choosing the right airport sleep solution depends on your layover duration and comfort requirements.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
                <li>
                  For short layovers under 4 hours,{' '}
                  <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/lounge-sleep'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                    lounge sleep
                  </a>{' '}
                  is usually enough
                </li>
                <li>
                  For 4 to 8 hours,{' '}
                  <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                    sleep pods
                  </a>{' '}
                  or private rooms offer a good balance
                </li>
                <li>
                  For 8+ hours,{' '}
                  <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                    transit hotels
                  </a>{' '}
                  provide the best comfort and full rest
                </li>
              </ul>
              <p className="text-slate-700 leading-relaxed">
                Private rooms sit in the middle of the spectrum, offering more comfort than{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  sleep pods
                </a>{' '}
                and more flexibility than{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  transit hotels
                </a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
