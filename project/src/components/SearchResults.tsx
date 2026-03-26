import { useState } from 'react';
import { Hotel, MapPin, DollarSign, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import type { AirportFacility } from '../lib/database.types';
import { navigateTo } from '../lib/navigation';

interface SearchResultsProps {
  facilities: AirportFacility[];
  query: string;
}

const ITEMS_PER_PAGE = 12;

export default function SearchResults({ facilities, query }: SearchResultsProps) {
  const [currentPage, setCurrentPage] = useState(1);

  if (facilities.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 shadow-lg border border-slate-200 text-center">
        <p className="text-xl text-slate-600">
          {query ? `No facilities found for "${query}"` : 'No facilities match your filters'}
        </p>
        <p className="text-slate-500 mt-2">
          {query ? 'Try searching for a different airport or city name.' : 'Try adjusting your filter criteria.'}
        </p>
      </div>
    );
  }

  const totalPages = Math.ceil(facilities.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedFacilities = facilities.slice(startIndex, endIndex);

  const uniqueAirports = new Set(facilities.map((f) => f.airport_code)).size;

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900">
          {facilities.length} {facilities.length === 1 ? 'Facility' : 'Facilities'} at {uniqueAirports}{' '}
          {uniqueAirports === 1 ? 'Airport' : 'Airports'}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {paginatedFacilities.map((facility) => (
          <a
            key={facility.id}
            href={`/facility/${facility.slug}`}
            onClick={(e) => { e.preventDefault(); navigateTo(`/facility/${facility.slug}`); }}
            className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow flex flex-col"
          >
            <div className="bg-gradient-to-r from-slate-700 to-slate-600 text-white px-4 py-3">
              <div className="text-xs font-medium opacity-90 mb-1">{facility.airport}</div>
              <h3 className="font-bold text-lg leading-tight">{facility.facility}</h3>
            </div>

            <div className="p-4 flex-1 flex flex-col">
              <div className="space-y-2 flex-1">
                <div className="flex items-start text-sm">
                  <MapPin className="w-4 h-4 mr-2 text-slate-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">{facility.location}</span>
                </div>

                <div className="flex items-start text-sm">
                  <Hotel className="w-4 h-4 mr-2 text-slate-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">{facility.type}</span>
                </div>

                <div className="flex items-start text-sm">
                  <ShieldCheck className="w-4 h-4 mr-2 text-slate-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">
                    {facility.transit_safe ? 'No Immigration' : 'Immigration Req.'}
                  </span>
                </div>

                <div className="flex items-start text-sm">
                  <DollarSign className="w-4 h-4 mr-2 text-slate-500 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 font-semibold">{facility.price}</span>
                </div>
              </div>

              {facility.transit_safe && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Transit Safe
                  </span>
                </div>
              )}
            </div>
          </a>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md border border-slate-200 hover:shadow-lg hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Previous</span>
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg font-medium transition-all ${
                  currentPage === page
                    ? 'bg-slate-700 text-white shadow-lg'
                    : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md border border-slate-200 hover:shadow-lg hover:border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-md transition-all"
          >
            <span className="font-medium">Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
