import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { MapPin, Hotel, ArrowLeft, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { AirportFacility } from '../lib/database.types';
import SearchResults from './SearchResults';
import Header from './Header';
import Footer from './Footer';
import { AirportSEOContent } from './AirportSEOContent';
import { updatePageMeta, generateBreadcrumbStructuredData } from '../lib/seo';
import { navigateTo } from '../lib/navigation';
import BackNavigation from './BackNavigation';

interface AirportDetailPageProps {
  airportSlug: string;
}

export default function AirportDetailPage({ airportSlug }: AirportDetailPageProps) {
  const [facilities, setFacilities] = useState<AirportFacility[]>([]);
  const [loading, setLoading] = useState(true);
  const [airportInfo, setAirportInfo] = useState<{ name: string; code: string } | null>(null);

  useEffect(() => {
    fetchAirportFacilities();
  }, [airportSlug]);

  async function fetchAirportFacilities() {
    setLoading(true);

    const airportCode = airportSlug.split('-').pop()?.toUpperCase() || '';

    const airportCodes = airportCode === 'BKK' ? ['BKK', 'DMK'] : [airportCode];

    const { data, error } = await supabase
      .from('airport_facilities')
      .select('*')
      .in('airport_code', airportCodes)
      .order('facility', { ascending: true });

    if (error) {
      console.error('Error fetching facilities:', error);
    } else if (data && data.length > 0) {
      setFacilities(data);
      setAirportInfo({
        name: data[0].airport,
        code: data[0].airport_code
      });

      const pageUrl = `${window.location.origin}/airport/${airportSlug}`;
      updatePageMeta(
        `${data[0].airport} Sleep Facilities | RestInAirport.com`,
        `Explore sleep pods, transit hotels, lounges, and private rooms available at ${data[0].airport}. Find the perfect rest option for your layover.`,
        pageUrl,
        generateBreadcrumbStructuredData([
          { name: 'Home', url: window.location.origin },
          { name: 'Airports', url: `${window.location.origin}/airports` },
          { name: data[0].airport, url: pageUrl },
        ])
      );
    }
    setLoading(false);
  }

  if (loading) {
    const slugTitle = airportSlug
      .replace(/-[a-z]{3}$/, '')
      .split('-')
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
        <Helmet>
          <title>{slugTitle} Airport Sleep Facilities | RestInAirport.com</title>
          <meta name="description" content={`Explore sleep pods, transit hotels, lounges, and private rooms available at ${slugTitle} Airport. Find the perfect rest option for your layover.`} />
          <link rel="canonical" href={`https://restinairport.com/airport/${airportSlug}`} />
          <meta property="og:title" content={`${slugTitle} Airport Sleep Facilities | RestInAirport.com`} />
          <meta property="og:description" content={`Explore sleep pods, transit hotels, lounges, and private rooms at ${slugTitle} Airport.`} />
          <meta property="og:url" content={`https://restinairport.com/airport/${airportSlug}`} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={`${slugTitle} Airport Sleep Facilities | RestInAirport.com`} />
          <meta name="twitter:description" content={`Explore sleep pods, transit hotels, lounges, and private rooms at ${slugTitle} Airport.`} />
        </Helmet>
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader className="inline-block animate-spin w-12 h-12 text-slate-700" />
            <p className="mt-4 text-slate-600">Loading airport details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!airportInfo || facilities.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-slate-600 mb-4">Airport not found</p>
            <BackNavigation fallbackUrl="/airports" fallbackLabel="Airports" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <Helmet>
        <title>{airportInfo.name} Sleep Facilities | RestInAirport.com</title>
        <meta name="description" content={`Explore sleep pods, transit hotels, lounges, and private rooms available at ${airportInfo.name}. Find the perfect rest option for your layover.`} />
        <link rel="canonical" href={`https://restinairport.com/airport/${airportSlug}`} />
        <meta property="og:title" content={`${airportInfo.name} Sleep Facilities | RestInAirport.com`} />
        <meta property="og:description" content={`Explore sleep pods, transit hotels, lounges, and private rooms available at ${airportInfo.name}.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://restinairport.com/airport/${airportSlug}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${airportInfo.name} Sleep Facilities | RestInAirport.com`} />
        <meta name="twitter:description" content={`Explore sleep pods, transit hotels, lounges, and private rooms available at ${airportInfo.name}.`} />
      </Helmet>
      <Header />

      <main className="flex-1">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <BackNavigation
              fallbackUrl="/airports"
              fallbackLabel="Airports"
              className="inline-flex items-center text-slate-200 hover:text-white mb-6 transition-colors"
            />

            <div className="flex items-center mb-4">
              <MapPin className="w-10 h-10 mr-3" />
              <h1 className="text-4xl md:text-5xl font-bold">{airportInfo.name}</h1>
            </div>

            <p className="text-xl text-slate-200 max-w-3xl mb-8">
              Explore sleep pods, transit hotels, lounges, and private rooms available at {airportInfo.name}.
            </p>

            <div className="flex items-center space-x-2">
              <Hotel className="w-6 h-6" />
              <div>
                <div className="text-2xl font-bold">{facilities.length}</div>
                <div className="text-sm text-slate-300">Rest Facilities</div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <SearchResults facilities={facilities} query="" />
        </div>

        <AirportSEOContent
          airportName={airportInfo.name}
          airportCode={airportInfo.code}
          facilities={facilities}
        />
      </main>

      <Footer />
    </div>
  );
}
