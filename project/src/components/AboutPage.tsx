import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plane, MapPin, Users, Globe, FileText } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { updatePageMeta } from '../lib/seo';

export default function AboutPage() {
  useEffect(() => {
    updatePageMeta(
      'About Us | RestInAirport.com',
      'Learn about RestInAirport.com, your comprehensive directory for airport sleep facilities including pods, transit hotels, private rooms, and lounges worldwide.',
      `${window.location.origin}/about`
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <Helmet>
        <title>About Us | RestInAirport.com</title>
        <meta name="description" content="Learn about RestInAirport.com, your comprehensive directory for airport sleep facilities including pods, transit hotels, private rooms, and lounges worldwide." />
        <link rel="canonical" href="https://restinairport.com/about" />
        <meta property="og:title" content="About Us | RestInAirport.com" />
        <meta property="og:description" content="Learn about RestInAirport.com, your comprehensive directory for airport sleep facilities worldwide." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://restinairport.com/about" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Us | RestInAirport.com" />
        <meta name="twitter:description" content="Learn about RestInAirport.com, your comprehensive directory for airport sleep facilities worldwide." />
      </Helmet>
      <Header />

      <main className="flex-1">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About RestInAirport.com</h1>
            <p className="text-xl text-slate-200 max-w-3xl">
              Your comprehensive guide to airport sleep facilities worldwide
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 md:p-12 mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
            <p className="text-slate-700 text-lg leading-relaxed mb-6">
              RestInAirport.com helps travelers find airport sleep options including pods, transit hotels, private rooms, and lounges worldwide. Whether you have a long layover, an early morning flight, or arrive late at night, we provide comprehensive information to help you rest comfortably without leaving the airport.
            </p>
            <p className="text-slate-700 text-lg leading-relaxed">
              We understand that travel can be exhausting. Our mission is to make it easier for passengers to discover and compare rest facilities at airports around the world, with detailed information about pricing, location, amenities, and transit safety.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 text-center">
              <div className="bg-slate-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-slate-700" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Global Coverage</h3>
              <p className="text-slate-600 text-sm">
                Facilities at major airports across all continents
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 text-center">
              <div className="bg-slate-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Plane className="w-8 h-8 text-slate-700" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Detailed Information</h3>
              <p className="text-slate-600 text-sm">
                Pricing, amenities, location, and transit safety details
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 text-center">
              <div className="bg-slate-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-slate-700" />
              </div>
              <h3 className="font-bold text-slate-900 mb-2">Traveler Focused</h3>
              <p className="text-slate-600 text-sm">
                Built to help passengers make informed decisions
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 md:p-12 mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Travel Resource Network</h2>
            <p className="text-slate-600 text-base leading-relaxed mb-6">
              RestInAirport.com is part of a network of travel information sites. Whether you need help understanding transit visa rules or planning a longer move abroad, our sister sites cover topics beyond the airport.
            </p>
            <div className="grid md:grid-cols-2 gap-5">
              <a
                href="https://www.visainfoguide.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 bg-sky-50 border border-sky-200 rounded-xl p-5 hover:bg-sky-100 transition-colors group"
              >
                <div className="bg-sky-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 group-hover:bg-sky-200 transition-colors">
                  <Globe className="w-6 h-6 text-sky-700" />
                </div>
                <div>
                  <h3 className="font-bold text-sky-900 mb-1">visainfoguide.com</h3>
                  <p className="text-sky-800 text-sm leading-relaxed">
                    Transit visa guides, airside vs landside rules, and country entry requirements for international travelers.
                  </p>
                </div>
              </a>
              <a
                href="https://www.immigrationinfoguide.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 bg-emerald-50 border border-emerald-200 rounded-xl p-5 hover:bg-emerald-100 transition-colors group"
              >
                <div className="bg-emerald-100 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-200 transition-colors">
                  <FileText className="w-6 h-6 text-emerald-700" />
                </div>
                <div>
                  <h3 className="font-bold text-emerald-900 mb-1">immigrationinfoguide.com</h3>
                  <p className="text-emerald-800 text-sm leading-relaxed">
                    Moving abroad guides, expat resources, and long-term visa and relocation planning.
                  </p>
                </div>
              </a>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 md:p-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">What We Cover</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-slate-700 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-4 mt-1">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Sleep Pods</h3>
                  <p className="text-slate-600">
                    Compact, private capsules perfect for quick naps and short rest periods during layovers.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-slate-700 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-4 mt-1">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Private Rooms</h3>
                  <p className="text-slate-600">
                    Spacious suites with beds, workspaces, and private bathrooms for longer layovers.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-slate-700 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-4 mt-1">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Transit Hotels</h3>
                  <p className="text-slate-600">
                    Full-service hotels located inside airport terminals with convenient access.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-slate-700 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-4 mt-1">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Lounge Sleep</h3>
                  <p className="text-slate-600">
                    Airport lounges with rest areas, often accessible with Priority Pass or premium cards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
