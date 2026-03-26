import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Coffee, MapPin, Loader, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { AirportFacility } from '../lib/database.types';
import SearchResults from './SearchResults';
import FacilityFilters from './FacilityFilters';
import Header from './Header';
import Footer from './Footer';
import { updatePageMeta, generateFAQStructuredData } from '../lib/seo';
import { navigateTo } from '../lib/navigation';

const LOUNGE_SLEEP_FAQ = [
  { question: 'Can you sleep in airport lounges?', answer: 'Yes, but most lounges are designed for relaxation rather than full sleep. They provide seating and quiet areas.' },
  { question: 'Are airport lounges good for sleeping?', answer: 'They are suitable for light rest but not ideal for deep or overnight sleep.' },
  { question: 'Do airport lounges have beds?', answer: 'Most do not, although some premium lounges offer nap areas or resting zones.' },
  { question: 'How much does lounge access cost?', answer: 'Typically between 30 and 70 USD, or free with eligible memberships or credit cards.' },
  { question: 'Can you stay overnight in an airport lounge?', answer: 'Some lounges allow extended stays, but many have time limits or closing hours.' },
  { question: 'Is lounge access worth it for sleep?', answer: 'Only for short rest. For proper sleep, sleep pods or private rooms are better options.' },
  { question: 'Do airport lounges have showers?', answer: 'Many lounges offer shower facilities, but availability depends on the airport and lounge type.' },
  { question: 'What is Priority Pass?', answer: 'Priority Pass is a membership program that provides access to airport lounges worldwide.' },
  { question: 'What is the difference between lounge sleep and sleep pods?', answer: 'Lounge sleep uses shared seating, while sleep pods provide private enclosed spaces.' },
  { question: 'Which airports have good lounges for sleeping?', answer: 'Airports like Doha, Dubai, Singapore, and Istanbul offer strong lounge options.' },
];

export default function LoungeSleepPage() {
  const [facilities, setFacilities] = useState<AirportFacility[]>([]);
  const [filteredFacilities, setFilteredFacilities] = useState<AirportFacility[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchFacilities();
    updatePageMeta(
      'Lounge Sleep Options in Airports Worldwide (2026 Guide) | RestInAirport.com',
      'Find airport lounges for rest at 100+ airports worldwide. Compare lounge sleep options, access requirements, and pricing for layovers.',
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

  const faqItems = LOUNGE_SLEEP_FAQ;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <Helmet>
        <title>Lounge Sleep Options in Airports Worldwide (2026 Guide) | RestInAirport.com</title>
        <meta name="description" content="Find airport lounges for rest at 100+ airports worldwide. Compare lounge sleep options, access requirements, and pricing for layovers." />
        <link rel="canonical" href="https://restinairport.com/lounge-sleep" />
        <meta property="og:title" content="Lounge Sleep Options in Airports Worldwide (2026 Guide) | RestInAirport.com" />
        <meta property="og:description" content="Find airport lounges for rest at 100+ airports worldwide. Compare lounge sleep options, access requirements, and pricing." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://restinairport.com/lounge-sleep" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Lounge Sleep Options in Airports Worldwide (2026 Guide) | RestInAirport.com" />
        <meta name="twitter:description" content="Find airport lounges for rest at 100+ airports worldwide. Compare lounge sleep options, access requirements, and pricing." />
      </Helmet>
      <Header />

      <main className="flex-1">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Lounge Sleep Options in Airports Worldwide (2026 Guide)</h1>

            <div className="flex flex-wrap gap-6 mt-8">
              <div className="flex items-center space-x-2">
                <Coffee className="w-6 h-6" />
                <div>
                  <div className="text-2xl font-bold">{loungeFacilities.length}</div>
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
              Lounge sleep options in airports allow travelers to rest in comfortable seating areas, quiet zones, or designated rest spaces inside airport lounges. While most lounges do not offer beds, they provide a quieter and more comfortable environment than public terminals, making them suitable for short layovers and light rest.
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
              <SearchResults facilities={loungeFacilities} query="" />
            </>
          )}

          <div className="mt-16 space-y-12">
            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Global Coverage</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                This page focuses specifically on airport lounge-based rest options within a global dataset of 200+ airport rest facilities across 100+ airports worldwide.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                Lounge sleep options are widely available across major international airports in Asia, the Middle East, Europe, and North America. You can explore all{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/airports'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  airports
                </a>{' '}
                or navigate directly through each listing above.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Each listing includes lounge location, access requirements, pricing estimates, and whether the lounge is accessible during{' '}
                <a href="https://www.visainfoguide.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-sky-700 hover:text-sky-600 underline underline-offset-2">transit without immigration</a>.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">What Is Lounge Sleep in Airports?</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Lounge sleep refers to resting inside airport lounges rather than booking dedicated sleeping facilities like{' '}
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
              <p className="text-slate-700 leading-relaxed mb-4">
                Airport lounges are designed for comfort and relaxation, not full sleep, but many offer reclining chairs, quiet zones, and low-noise environments that make resting easier than in public areas.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                Typical features include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                <li>Reclining chairs or loungers</li>
                <li>Quiet or dimmed rest areas</li>
                <li>Food and beverages</li>
                <li>WiFi and charging stations</li>
              </ul>
              <p className="text-slate-700 leading-relaxed mt-4">
                Some premium lounges may also include nap zones or limited private resting areas.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Who Should Use Lounge Sleep?</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Lounge sleep is ideal for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
                <li>Layovers under 5 hours</li>
                <li>Travelers with lounge access (Priority Pass, airline status)</li>
                <li>Travelers who want comfort without booking a room</li>
                <li>Budget-conscious travelers with access benefits</li>
              </ul>
              <p className="text-slate-700 leading-relaxed">
                If your goal is light rest and comfort, lounges are a good option. For deeper sleep, consider{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  sleep pods
                </a>{' '}
                or{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  private rooms
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Can You Sleep in Airport Lounges Without a Visa?</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                In most cases, yes.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                Most airport lounges are located airside within the transit zone, allowing access without passing immigration.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                However:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
                <li>Some lounges are landside</li>
                <li>Access may depend on airline, ticket class, or lounge program</li>
              </ul>
              <p className="text-slate-700 leading-relaxed">
                Always confirm access requirements before planning your stay. If access is restricted, consider alternatives like{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  sleep pods
                </a>{' '}
                or{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  transit hotels
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Lounge Sleep vs Other Airport Sleep Options</h2>

              <div className="space-y-4">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Lounge Sleep</h3>
                  <p className="text-slate-700 leading-relaxed">
                    Best for light rest and short layovers with shared seating.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                      Sleep Pods
                    </a>
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                    Better for short naps with more privacy.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                      Private Rooms
                    </a>
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                    Better for medium-length rest with higher comfort.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                      Transit Hotels
                    </a>
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                    Best for overnight stays and full sleep.
                  </p>
                </div>
              </div>

              <p className="text-slate-700 leading-relaxed mt-4">
                Lounge sleep is the most accessible option but provides the lowest level of privacy and sleep quality compared to{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  sleep pods
                </a>,{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  private rooms
                </a>, and{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  transit hotels
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">How Much Does Lounge Access Cost?</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Typical access costs include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
                <li>30 to 50 USD for standard lounges</li>
                <li>50 to 70 USD for premium lounges</li>
                <li>Free access via membership programs or eligible credit cards</li>
              </ul>
              <p className="text-slate-700 leading-relaxed">
                Access methods include lounge memberships, airline status, or paid entry.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Best Airports for Lounge Sleep</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Airports known for strong lounge networks include Doha, Dubai, Singapore Changi, Istanbul, and London Heathrow.
              </p>
              <p className="text-slate-700 leading-relaxed">
                You can explore all supported{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/airports'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  airports
                </a>{' '}
                or navigate directly through the listings above.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">When Should You Use Lounge Sleep?</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Use lounge sleep if:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
                <li>Your layover is under 5 hours</li>
                <li>You want food, WiFi, and comfort</li>
                <li>You already have lounge access</li>
              </ul>
              <p className="text-slate-700 leading-relaxed mb-4">
                Avoid lounges if:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
                <li>You need proper sleep</li>
                <li>You have long overnight layovers</li>
              </ul>
              <p className="text-slate-700 leading-relaxed">
                In those cases,{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  sleep pods
                </a>,{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  private rooms
                </a>, or{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  transit hotels
                </a>{' '}
                are better options.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Tips for Sleeping in Airport Lounges</h2>
              <ul className="list-disc pl-6 space-y-2 text-slate-700">
                <li>Choose less crowded lounges whenever possible.</li>
                <li>Look for reclining chairs or designated quiet zones.</li>
                <li>Bring an eye mask and earplugs.</li>
                <li>Avoid peak hours for better comfort.</li>
                <li>Check time limits before entry.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">How to Choose the Right Sleep Option</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                For very short layovers under 3 to 4 hours, lounges are often sufficient.
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
                provide better rest.
              </p>
              <p className="text-slate-700 leading-relaxed">
                For longer or overnight layovers,{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  transit hotels
                </a>{' '}
                offer the best experience.
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
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Final Thoughts on Lounge Sleep in Airports</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Lounge sleep options in airports provide the most accessible and flexible way to rest during a layover. While they do not offer beds or full privacy like{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  sleep pods
                </a>,{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  private rooms
                </a>, or{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  transit hotels
                </a>, they deliver a significant upgrade from standard terminal seating.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                For short layovers, lounges offer a comfortable environment with seating, food, and facilities that make waiting more manageable. They are especially valuable for travelers who already have access through airline status, memberships, or credit cards.
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                However, lounges are not designed for deep or uninterrupted sleep. If your layover requires proper rest,{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  sleep pods
                </a>{' '}
                or{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  private rooms
                </a>{' '}
                will provide better comfort, while{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  transit hotels
                </a>{' '}
                are the best option for overnight stays.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Understanding these differences helps you choose the right solution for your journey.
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
                    Quiet, enclosed rooms offering more space and privacy than lounges. Ideal for medium-length layovers.
                  </p>
                  <button
                    onClick={() => navigateTo('/private-rooms')}
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Explore Private Rooms
                  </button>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Transit Hotels in Airports</h3>
                  <p className="text-slate-700 leading-relaxed mb-4">
                    Full hotel rooms inside airport terminals for overnight stays and maximum comfort.
                  </p>
                  <button
                    onClick={() => navigateTo('/transit-hotels')}
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Explore Transit Hotels
                  </button>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Choosing the Best Airport Sleep Option</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                Choosing the right airport sleep option depends on your layover duration and how much rest you actually need.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-700 mb-4">
                <li>
                  For very short layovers under 3 to 4 hours,{' '}
                  <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/lounge-sleep'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                    lounge sleep
                  </a>{' '}
                  is often enough
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
                  For longer or overnight layovers,{' '}
                  <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                    transit hotels
                  </a>{' '}
                  provide the best experience
                </li>
              </ul>
              <p className="text-slate-700 leading-relaxed">
                Lounge sleep sits at the entry level of airport rest options, offering convenience and comfort but limited privacy compared to{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  sleep pods
                </a>,{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }} className="font-semibold text-slate-900 hover:text-sky-600">
                  private rooms
                </a>, and{' '}
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
