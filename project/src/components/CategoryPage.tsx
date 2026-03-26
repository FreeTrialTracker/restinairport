import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Hotel, MapPin, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { AirportFacility } from '../lib/database.types';
import { categories, getCategoryStats, type CategoryType } from '../lib/categories';
import SearchResults from './SearchResults';
import Header from './Header';
import Footer from './Footer';
import { updatePageMeta } from '../lib/seo';

interface CategoryPageProps {
  categoryId: CategoryType;
}

export default function CategoryPage({ categoryId }: CategoryPageProps) {
  const [facilities, setFacilities] = useState<AirportFacility[]>([]);
  const [loading, setLoading] = useState(true);

  const category = categories[categoryId];

  useEffect(() => {
    fetchFacilities();
  }, [categoryId]);

  useEffect(() => {
    if (category) {
      updatePageMeta(
        `${category.title} | RestInAirport.com`,
        category.description,
        `${window.location.origin}/${categoryId}`
      );
    }
  }, [categoryId, category]);

  async function fetchFacilities() {
    setLoading(true);
    const { data, error } = await supabase
      .from('airport_facilities')
      .select('*')
      .order('airport', { ascending: true });

    if (error) {
      console.error('Error fetching facilities:', error);
    } else {
      setFacilities(data || []);
    }
    setLoading(false);
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />
        <div className="flex items-center justify-center py-20">
          <p className="text-xl text-slate-600">Category not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  const stats = getCategoryStats(categoryId, facilities);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <Helmet>
        <title>{category.title} | RestInAirport.com</title>
        <meta name="description" content={category.description} />
        <link rel="canonical" href={`https://restinairport.com/${categoryId}`} />
        <meta property="og:title" content={`${category.title} | RestInAirport.com`} />
        <meta property="og:description" content={category.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://restinairport.com/${categoryId}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${category.title} | RestInAirport.com`} />
        <meta name="twitter:description" content={category.description} />
      </Helmet>
      <Header />

      <main className="flex-1">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{category.title}</h1>
            <p className="text-xl text-slate-200 max-w-3xl">{category.description}</p>

            <div className="flex flex-wrap gap-6 mt-8">
              <div className="flex items-center space-x-2">
                <Hotel className="w-6 h-6" />
                <div>
                  <div className="text-2xl font-bold">{stats.facilityCount}</div>
                  <div className="text-sm text-slate-300">Facilities</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-6 h-6" />
                <div>
                  <div className="text-2xl font-bold">{stats.airportCount}</div>
                  <div className="text-sm text-slate-300">Airports</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="text-center py-20">
              <Loader className="inline-block animate-spin w-12 h-12 text-slate-700" />
              <p className="mt-4 text-slate-600">Loading facilities...</p>
            </div>
          ) : (
            <SearchResults facilities={stats.facilities} query="" />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
