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

const TRANSIT_HOTELS_FAQ = [
  { question: 'What is a transit hotel in an airport?', answer: 'A transit hotel is a full-service hotel located inside or connected to an airport terminal, designed for travelers during layovers.' },
  { question: 'Do transit hotels require a visa?', answer: 'Airside transit hotels do not require a visa, while landside hotels do.' },
  { question: 'How much do transit hotels cost?', answer: 'Most cost between 80 and 250 USD depending on duration, location, and hotel quality.' },
  { question: 'Can you stay overnight in a transit hotel?', answer: 'Yes, transit hotels are ideal for overnight stays and long layovers.' },
  { question: 'What is the difference between transit hotels and sleep pods?', answer: 'Transit hotels offer full rooms, while sleep pods are compact and designed for short naps.' },
  { question: 'Are transit hotels inside the airport?', answer: 'Some are inside the terminal (airside), while others are connected or nearby (landside).' },
  { question: 'Can you book transit hotels in advance?', answer: 'Yes, most transit hotels allow advance booking online.' },
  { question: 'Are transit hotels worth it?', answer: 'Yes, for long layovers they provide the best comfort and proper sleep compared to other options.' },
  { question: 'What is the difference between transit hotels and private rooms?', answer: 'Transit hotels offer full hotel rooms, while private rooms are smaller and usually rented hourly.' },
  { question: 'Which airports have transit hotels?', answer: 'Major airports like Doha, Dubai, Singapore, London, and Istanbul have transit hotel options.' },
];

export default function TransitHotelsPage() {
  const [facilities, setFacilities] = useState<AirportFacility[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<AirportFacility[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchFacilities();
    updatePageMeta(
      'Transit Hotels in Airports Worldwide (2026 Guide) | RestInAirport.com',
      'Discover transit hotel facilities at 100+ airports worldwide. Full hotel rooms inside terminals, no visa required. Compare airside hotels for overnight layovers.',
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

  const faqItems = TRANSIT_HOTELS_FAQ;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <Helmet>
        <title>Transit Hotels in Airports Worldwide (2026 Guide) | RestInAirport.com</title>
        <meta name="description" content="Discover transit hotel facilities at 100+ airports worldwide. Full hotel rooms inside terminals, no visa required. Compare airside hotels for overnight layovers." />
        <link rel="canonical" href="https://restinairport.com/transit-hotels" />
        <meta property="og:title" content="Transit Hotels in Airports Worldwide (2026 Guide) | RestInAirport.com" />
        <meta property="og:description" content="Discover transit hotel facilities at 100+ airports worldwide. Full hotel rooms inside terminals, no visa required." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://restinairport.com/transit-hotels" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Transit Hotels in Airports Worldwide (2026 Guide) | RestInAirport.com" />
        <meta name="twitter:description" content="Discover transit hotel facilities at 100+ airports worldwide. Full hotel rooms inside terminals, no visa required." />
      </Helmet>
      <Header />

      <main className="flex-1">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Transit Hotels in Airports Worldwide (2026 Guide)</h1>

            <div className="flex flex-wrap gap-6 mt-8">
              <div className="flex items-center space-x-2">
                <Hotel className="w-6 h-6" />
                <div>
                  <div className="text-2xl font-bold">{transitHotelFacilities.length}</div>
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
              Transit hotels in airports are full-service hotel rooms located inside or directly connected to airport terminals, allowing travelers to rest during layovers without leaving the airport. Many are located airside, meaning you can stay without{' '}
              <a href="https://www.visainfoguide.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-sky-700 hover:text-sky-600 underline underline-offset-2">passing immigration</a>,
              making them ideal for long layovers and overnight stays.
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
              <SearchResults facilities={transitHotelFacilities} query="" />
            </>
          )}

          <div className="mt-16 space-y-12">
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Global Coverage</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                This page focuses specifically on transit hotel facilities within a global dataset of 200+ airport rest facilities across 100+ airports worldwide.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                Transit hotels are available in major international hubs across Asia, the Middle East, Europe, and North America. You can explore all{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/airports'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  airports
                </a>{' '}
                or navigate directly through each listing above.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Each facility includes terminal location, access requirements, pricing estimates, and whether the hotel is accessible without immigration.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">What Are Transit Hotels in Airports?</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Transit hotels are full hotel-style accommodations located inside airport terminals or directly connected to them. Unlike{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  sleep pods
                </a>{' '}
                or{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  private rooms
                </a>, transit hotels offer complete rooms with beds, bathrooms, and full privacy.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                They are designed for travelers who need proper rest during long layovers without leaving the airport environment.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                Typical features include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                <li>Full-size beds</li>
                <li>Private bathrooms and showers</li>
                <li>Room service or hotel amenities</li>
                <li>Soundproof rooms</li>
                <li>Secure and private access</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Who Should Use Transit Hotels?</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Transit hotels are ideal for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
                <li>Layovers longer than 8 hours</li>
                <li>Overnight airport stays</li>
                <li>Travelers needing full rest and comfort</li>
                <li>Families or couples</li>
                <li>Travelers with luggage or extended transit time</li>
              </ul>
              <p className="text-slate-700 leading-relaxed">
                If your goal is real sleep and recovery, transit hotels are the best option compared to{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  sleep pods
                </a>,{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  private rooms
                </a>, or{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/lounge-sleep'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  lounge sleep
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Can You Use Transit Hotels Without a Visa?</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                In many airports, yes.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                Airside transit hotels allow travelers to stay within the secure transit area without passing immigration or requiring a visa.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                However:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
                <li>Some hotels are landside and require entry into the country</li>
                <li>Some terminals restrict access depending on airline or ticket</li>
              </ul>
              <p className="text-slate-700 leading-relaxed">
                Always verify location before booking. If you cannot pass immigration, consider only airside transit hotels or compare with{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  sleep pods
                </a>{' '}
                as a fallback.
              </p>

              <div className="mt-6 bg-sky-50 border border-sky-200 rounded-xl p-5 flex gap-4 items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <p className="font-semibold text-sky-900 mb-1">Planning a long layover abroad?</p>
                  <p className="text-sky-800 text-sm leading-relaxed">
                    Whether you can leave the airport depends on your nationality and the transit country.{' '}
                    <a href="https://www.visainfoguide.com" target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-2 hover:text-sky-600">
                      Verify your entry options at visainfoguide.com
                    </a>
                    {' '}before booking a landside hotel.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Transit Hotels vs Other Airport Sleep Options</h2>

              <div className="space-y-4">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Transit Hotels</h3>
                  <p className="text-slate-700 leading-relaxed">
                    Best for full sleep, overnight stays, and maximum comfort.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                      Private Rooms
                    </a>
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                    Better for medium-length rest with less commitment.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                      Sleep Pods
                    </a>
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                    Best for short naps and quick rest.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/lounge-sleep'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                      Lounge Sleep
                    </a>
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                    Suitable only for light rest, not full sleep.
                  </p>
                </div>
              </div>

              <p className="text-slate-700 leading-relaxed mt-4">
                Transit hotels provide the highest level of comfort compared to{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  sleep pods
                </a>,{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  private rooms
                </a>, and{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/lounge-sleep'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  lounge sleep
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">How Much Do Transit Hotels Cost?</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Typical pricing:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
                <li>80 to 120 USD for short stays (6–8 hours)</li>
                <li>120 to 250 USD for overnight stays</li>
                <li>Premium hotels may exceed this range</li>
              </ul>
              <p className="text-slate-700 leading-relaxed">
                Some hotels offer flexible hourly packages, while others operate like standard hotels with fixed check-in times.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Best Airports for Transit Hotels</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Airports known for strong transit hotel options include Doha, Dubai, Singapore Changi, London Heathrow, and Istanbul.
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
              <h2 className="text-3xl font-bold text-slate-900 mb-4">When Should You Use a Transit Hotel?</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Use a transit hotel if:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
                <li>Your layover exceeds 8 hours</li>
                <li>You need proper sleep</li>
                <li>You want privacy and comfort</li>
                <li>You are traveling overnight</li>
              </ul>
              <p className="text-slate-700 leading-relaxed">
                For shorter layovers, consider{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  sleep pods
                </a>{' '}
                or{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  private rooms
                </a>{' '}
                instead.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Tips for Booking Transit Hotels</h2>
              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                <li>Always confirm if the hotel is airside or landside.</li>
                <li>Check check-in policies and minimum stay requirements.</li>
                <li>Book early in high-demand airports.</li>
                <li>Confirm whether immigration clearance is required.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">How to Choose the Right Sleep Option</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                For layovers under 4 hours,{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/lounge-sleep'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  lounges
                </a>{' '}
                may be sufficient.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                For 4 to 8 hours,{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  sleep pods
                </a>{' '}
                or{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  private rooms
                </a>{' '}
                are more efficient.
              </p>
              <p className="text-slate-700 leading-relaxed">
                For long layovers or overnight stays, transit hotels provide the best experience.
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
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Final Thoughts on Transit Hotels in Airports</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Transit hotels in airports offer the highest level of comfort and privacy for travelers during long layovers. Unlike{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  sleep pods
                </a>{' '}
                or{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  private rooms
                </a>, transit hotels provide full hotel-style rooms with beds, bathrooms, and complete separation from the busy airport environment.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                They are the best choice for overnight stays, long transit times, and travelers who need proper rest before their next flight. If your layover exceeds several hours or spans overnight, transit hotels deliver a level of comfort that other options cannot match.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                However, they are not always necessary. For shorter layovers,{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  sleep pods
                </a>{' '}
                or{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  private rooms
                </a>{' '}
                may be more efficient and cost-effective. If your goal is simply to relax for a short period,{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/lounge-sleep'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  lounge sleep
                </a>{' '}
                can also be a suitable option.
              </p>
              <p className="text-slate-700 leading-relaxed">
                The key is choosing the right level of comfort based on your travel duration and needs.
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
                Choosing the right airport sleep solution depends primarily on your layover duration and comfort expectations.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
                <li>
                  For short layovers under 4 hours,{' '}
                  <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/lounge-sleep'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                    lounge sleep
                  </a>{' '}
                  is often sufficient
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
                  provide efficient rest
                </li>
                <li>
                  For long layovers or overnight stays,{' '}
                  <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                    transit hotels
                  </a>{' '}
                  are the best option
                </li>
              </ul>
              <p className="text-slate-700 leading-relaxed">
                Transit hotels sit at the top of the comfort scale, offering a full rest experience compared to{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  sleep pods
                </a>,{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  private rooms
                </a>, and{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/lounge-sleep'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  lounge sleep
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
