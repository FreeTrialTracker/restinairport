import { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import type { AirportFacility } from '../lib/database.types';

interface FacilityFiltersProps {
  facilities: AirportFacility[];
  onFilterChange: (filtered: AirportFacility[]) => void;
}

export default function FacilityFilters({ facilities, onFilterChange }: FacilityFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAirport, setSelectedAirport] = useState('all');
  const [selectedFacility, setSelectedFacility] = useState('all');
  const [selectedTransitSafe, setSelectedTransitSafe] = useState('all');
  const [selectedZone, setSelectedZone] = useState('all');
  const [selectedImmigration, setSelectedImmigration] = useState('all');
  const [selectedConnectivity, setSelectedConnectivity] = useState('all');
  const [selectedEligibility, setSelectedEligibility] = useState('all');
  const [selectedCards, setSelectedCards] = useState('all');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const uniqueAirports = Array.from(new Set(facilities.map(f => f.airport_code)))
    .sort()
    .map(code => {
      const facility = facilities.find(f => f.airport_code === code);
      return { code, name: facility?.airport || code };
    });

  const uniqueFacilities = Array.from(new Set(facilities.map(f => f.facility))).sort();

  useEffect(() => {
    let filtered = [...facilities];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        f =>
          f.airport.toLowerCase().includes(query) ||
          f.airport_code.toLowerCase().includes(query) ||
          f.facility.toLowerCase().includes(query) ||
          f.location.toLowerCase().includes(query) ||
          f.country?.toLowerCase().includes(query)
      );
    }

    if (selectedAirport !== 'all') {
      filtered = filtered.filter(f => f.airport_code === selectedAirport);
    }

    if (selectedFacility !== 'all') {
      filtered = filtered.filter(f => f.facility === selectedFacility);
    }

    if (selectedTransitSafe !== 'all') {
      const isTransitSafe = selectedTransitSafe === 'yes';
      filtered = filtered.filter(f => f.transit_safe === isTransitSafe);
    }

    onFilterChange(filtered);
  }, [
    searchQuery,
    selectedAirport,
    selectedFacility,
    selectedTransitSafe,
    selectedZone,
    selectedImmigration,
    selectedConnectivity,
    selectedEligibility,
    selectedCards,
    facilities,
    onFilterChange
  ]);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedAirport('all');
    setSelectedFacility('all');
    setSelectedTransitSafe('all');
    setSelectedZone('all');
    setSelectedImmigration('all');
    setSelectedConnectivity('all');
    setSelectedEligibility('all');
    setSelectedCards('all');
  };

  return (
    <div className="space-y-6 mb-8">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by airport, region, facility, or country (e.g., Singapore, BKK, Tokyo)..."
            className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-slate-900 placeholder:text-slate-500"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-700 font-semibold mb-3">
            <Filter className="w-5 h-5" />
            <span>Filters</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="airport" className="block text-sm font-medium text-slate-700 mb-1">
                Airport
              </label>
              <select
                id="airport"
                value={selectedAirport}
                onChange={(e) => setSelectedAirport(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-slate-900 bg-white"
              >
                <option value="all">All Airports</option>
                {uniqueAirports.map(airport => (
                  <option key={airport.code} value={airport.code}>
                    {airport.name} ({airport.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="facility" className="block text-sm font-medium text-slate-700 mb-1">
                Facility Name
              </label>
              <select
                id="facility"
                value={selectedFacility}
                onChange={(e) => setSelectedFacility(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-slate-900 bg-white"
              >
                <option value="all">All Facilities</option>
                {uniqueFacilities.map(facility => (
                  <option key={facility} value={facility}>
                    {facility}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="transit-safe" className="block text-sm font-medium text-slate-700 mb-1">
                Transit Safe
              </label>
              <select
                id="transit-safe"
                value={selectedTransitSafe}
                onChange={(e) => setSelectedTransitSafe(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-slate-900 bg-white"
              >
                <option value="all">All</option>
                <option value="yes">Yes - No Immigration</option>
                <option value="no">No - Immigration Required</option>
              </select>
            </div>

            <div>
              <label htmlFor="zone" className="block text-sm font-medium text-slate-700 mb-1">
                Zone
              </label>
              <select
                id="zone"
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-slate-900 bg-white"
              >
                <option value="all">All Zones</option>
                <option value="airside">Airside</option>
                <option value="landside">Landside</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
            >
              {showAdvanced ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Hide Advanced Filters
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Show Advanced Filters
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Reset All Filters
            </button>
          </div>

          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
              <div>
                <label htmlFor="immigration" className="block text-sm font-medium text-slate-700 mb-1">
                  Immigration
                </label>
                <select
                  id="immigration"
                  value={selectedImmigration}
                  onChange={(e) => setSelectedImmigration(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-slate-900 bg-white"
                >
                  <option value="all">All</option>
                  <option value="required">Required</option>
                  <option value="not-required">Not Required</option>
                </select>
              </div>

              <div>
                <label htmlFor="connectivity" className="block text-sm font-medium text-slate-700 mb-1">
                  Connectivity
                </label>
                <select
                  id="connectivity"
                  value={selectedConnectivity}
                  onChange={(e) => setSelectedConnectivity(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-slate-900 bg-white"
                >
                  <option value="all">All</option>
                  <option value="connected">Connected</option>
                  <option value="separate">Separate</option>
                </select>
              </div>

              <div>
                <label htmlFor="eligibility" className="block text-sm font-medium text-slate-700 mb-1">
                  Eligibility
                </label>
                <select
                  id="eligibility"
                  value={selectedEligibility}
                  onChange={(e) => setSelectedEligibility(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-slate-900 bg-white"
                >
                  <option value="all">All</option>
                  <option value="any-passenger">Any Passenger</option>
                  <option value="priority-pass">Priority Pass</option>
                  <option value="airline-specific">Airline Specific</option>
                </select>
              </div>

              <div>
                <label htmlFor="cards" className="block text-sm font-medium text-slate-700 mb-1">
                  Cards
                </label>
                <select
                  id="cards"
                  value={selectedCards}
                  onChange={(e) => setSelectedCards(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent text-slate-900 bg-white"
                >
                  <option value="all">All</option>
                  <option value="accepted">Accepted</option>
                  <option value="not-accepted">Not Accepted</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
