import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import BackNavigation from './BackNavigation';
import {
  ArrowLeft,
  MapPin,
  Hotel,
  ShieldCheck,
  DollarSign,
  Plane,
  Users,
  CreditCard,
  Navigation,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { AirportFacility } from '../lib/database.types';
import { updatePageMeta, generateFacilityStructuredData, generateBreadcrumbStructuredData } from '../lib/seo';
import Header from './Header';
import Footer from './Footer';
import { navigateTo } from '../lib/navigation';

interface FacilityPageProps {
  facilitySlug: string;
}

export default function FacilityPage({ facilitySlug }: FacilityPageProps) {
  const [facility, setFacility] = useState<AirportFacility | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedFacilities, setRelatedFacilities] = useState<AirportFacility[]>([]);

  useEffect(() => {
    fetchFacility();
  }, [facilitySlug]);

  async function fetchFacility() {
    setLoading(true);

    const { data: facilityData, error } = await supabase
      .from('airport_facilities')
      .select('*')
      .eq('slug', facilitySlug)
      .maybeSingle();

    if (error) {
      console.error('Error fetching facility:', error);
      setLoading(false);
      return;
    }

    if (!facilityData) {
      setLoading(false);
      return;
    }

    const data: AirportFacility = facilityData;
    setFacility(data);

    updatePageMeta(
      `${data.facility} at ${data.airport} - RestInAirport.com`,
      `${data.type} located at ${data.location}. ${data.transit_safe ? 'No immigration required.' : 'Immigration required.'} Price: ${data.price}`,
      `${window.location.origin}/facility/${data.slug}`,
      generateFacilityStructuredData(data)
    );

    const breadcrumbs = generateBreadcrumbStructuredData([
      { name: 'Home', url: window.location.origin },
      {
        name: data.airport,
        url: `${window.location.origin}/airport/${data.airport_code.toLowerCase()}`,
      },
      {
        name: data.facility,
        url: `${window.location.origin}/facility/${data.slug}`,
      },
    ]);

    let scriptElement = document.querySelector('script[type="application/ld+json"][data-breadcrumb]');
    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.setAttribute('type', 'application/ld+json');
      scriptElement.setAttribute('data-breadcrumb', 'true');
      document.head.appendChild(scriptElement);
    }
    scriptElement.textContent = JSON.stringify(breadcrumbs);

    const { data: related } = await supabase
      .from('airport_facilities')
      .select('*')
      .eq('airport_code', data.airport_code)
      .neq('id', data.id)
      .limit(5);

    if (related) {
      setRelatedFacilities(related);
    }

    setLoading(false);
  }

  if (loading) {
    const slugTitle = facilitySlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
        <Helmet>
          <title>{slugTitle} - Airport Rest Facility | RestInAirport.com</title>
          <meta name="description" content={`Find details, pricing, and location information for ${slugTitle} at RestInAirport.com.`} />
          <link rel="canonical" href={`https://restinairport.com/facility/${facilitySlug}`} />
          <meta property="og:title" content={`${slugTitle} - Airport Rest Facility | RestInAirport.com`} />
          <meta property="og:description" content={`Find details, pricing, and location information for ${slugTitle}.`} />
          <meta property="og:url" content={`https://restinairport.com/facility/${facilitySlug}`} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={`${slugTitle} - Airport Rest Facility | RestInAirport.com`} />
          <meta name="twitter:description" content={`Find details, pricing, and location information for ${slugTitle}.`} />
        </Helmet>
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-300 border-t-slate-700"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!facility) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl text-slate-600">Facility not found</p>
            <a href="/" onClick={(e) => { e.preventDefault(); navigateTo('/'); }} className="text-slate-700 hover:text-slate-900 mt-4 inline-block">
              Return to Home
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <Helmet>
        <title>{facility.facility} at {facility.airport} - RestInAirport.com</title>
        <meta name="description" content={`${facility.type} located at ${facility.location}. ${facility.transit_safe ? 'No immigration required.' : 'Immigration required.'} Price: ${facility.price}`} />
        <link rel="canonical" href={`https://restinairport.com/facility/${facility.slug}`} />
        <meta property="og:title" content={`${facility.facility} at ${facility.airport} - RestInAirport.com`} />
        <meta property="og:description" content={`${facility.type} at ${facility.airport}. Find location, pricing, and amenities.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://restinairport.com/facility/${facility.slug}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${facility.facility} at ${facility.airport} - RestInAirport.com`} />
        <meta name="twitter:description" content={`${facility.type} at ${facility.airport}. Find location, pricing, and amenities.`} />
      </Helmet>
      <Header />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackNavigation
          fallbackUrl="/"
          label="Back to Search"
          className="inline-flex items-center text-slate-700 hover:text-slate-900 mb-6 transition-colors"
        />

        <article className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white px-8 py-12">
            <div className="flex items-center mb-4">
              <Plane className="w-8 h-8 mr-3" />
              <h1 className="text-4xl font-bold">{facility.facility}</h1>
            </div>
            <p className="text-xl text-slate-200">{facility.airport}</p>
          </div>

          <div className="p-8">
            {facility.summary && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Summary</h2>
                <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-line">{facility.summary}</p>
              </div>
            )}

            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Details</h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  {facility.capacity && (
                    <div className="flex items-start">
                      <Users className="w-5 h-5 mr-3 text-slate-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">Capacity</h3>
                        <p className="text-slate-700 text-sm">{facility.capacity}</p>
                      </div>
                    </div>
                  )}

                  {facility.pricing_details && (
                    <div className="flex items-start">
                      <DollarSign className="w-5 h-5 mr-3 text-slate-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">Pricing</h3>
                        <p className="text-slate-700 text-sm">{facility.pricing_details}</p>
                      </div>
                    </div>
                  )}

                  {facility.access_details && (
                    <div className="flex items-start">
                      <Navigation className="w-5 h-5 mr-3 text-slate-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">Access</h3>
                        <p className="text-slate-700 text-sm">{facility.access_details}</p>
                      </div>
                    </div>
                  )}

                  {facility.amenities && (
                    <div className="flex items-start">
                      <Hotel className="w-5 h-5 mr-3 text-slate-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">Amenities</h3>
                        <p className="text-slate-700 text-sm">{facility.amenities}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 mr-3 text-slate-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Location</h3>
                      <p className="text-slate-700 text-sm">{facility.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Hotel className="w-5 h-5 mr-3 text-slate-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Facility Type</h3>
                      <p className="text-slate-700 text-sm">{facility.type}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <ShieldCheck className="w-5 h-5 mr-3 text-slate-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Immigration</h3>
                      <p className="text-slate-700 text-sm">{facility.immigration}</p>
                      {facility.transit_safe && (
                        <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          Transit Safe
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Navigation className="w-5 h-5 mr-3 text-slate-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Zone</h3>
                      <p className="text-slate-700 text-sm">{facility.zone}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <CreditCard className="w-5 h-5 mr-3 text-slate-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Accepted Cards</h3>
                      <p className="text-slate-700 text-sm">{facility.cards || 'None'}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 mr-3 text-slate-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">Connectivity</h3>
                      <p className="text-slate-700 text-sm">{facility.connectivity}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {facility.website_url && (
              <div className="mb-8">
                <a
                  href={facility.website_url.startsWith('http') ? facility.website_url : `https://${facility.website_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Visit Official Website
                  <ExternalLink className="w-5 h-5 ml-2" />
                </a>
              </div>
            )}

            {facility.full_description && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">About The Facility</h2>
                <div className="max-w-none">
                  <div className="text-slate-700 leading-relaxed space-y-6">
                    {(() => {
                      const lines = facility.full_description.split('\n');
                      const elements: JSX.Element[] = [];
                      let i = 0;

                      while (i < lines.length) {
                        const line = lines[i].trim();

                        // Skip empty lines
                        if (line === '') {
                          i++;
                          continue;
                        }

                        // Check if this is a header: short, no ending punctuation
                        const isHeader = line.length < 80 &&
                          line.length > 0 &&
                          !line.endsWith('.') &&
                          !line.endsWith('?') &&
                          !line.endsWith('!') &&
                          !line.endsWith(',') &&
                          !line.endsWith(';');

                        if (isHeader) {
                          elements.push(
                            <h3 key={`h3-${i}`} className="text-xl font-bold text-slate-900 mt-8 first:mt-0 mb-3">
                              {line}
                            </h3>
                          );
                          i++;
                        } else {
                          // Collect paragraph lines
                          let paragraphText = line;
                          i++;
                          while (i < lines.length && lines[i].trim() !== '') {
                            const nextLine = lines[i].trim();
                            // Stop if we hit another header
                            if (nextLine.length < 80 &&
                                !nextLine.endsWith('.') &&
                                !nextLine.endsWith('?') &&
                                !nextLine.endsWith('!') &&
                                !nextLine.endsWith(',') &&
                                !nextLine.endsWith(';')) {
                              break;
                            }
                            paragraphText += ' ' + nextLine;
                            i++;
                          }
                          elements.push(
                            <p key={`p-${i}`} className="text-base leading-relaxed">
                              {paragraphText}
                            </p>
                          );
                        }
                      }

                      return elements;
                    })()}
                  </div>
                </div>
              </div>
            )}

          </div>
        </article>

        {relatedFacilities.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Other Facilities at {facility.airport}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedFacilities.map((related) => (
                <a
                  key={related.id}
                  href={`/facility/${related.slug}`}
                  onClick={(e) => { e.preventDefault(); navigateTo(`/facility/${related.slug}`); }}
                  className="bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">{related.facility}</h3>
                  <p className="text-slate-600 text-sm mb-3">{related.location}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">{related.type}</span>
                    <span className="text-sm font-medium text-slate-900">{related.price}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
