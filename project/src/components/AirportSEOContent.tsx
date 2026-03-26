import { useState, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from './Link';

interface Facility {
  name: string;
  category: string;
  terminal?: string;
  airside_landside?: string;
}

interface AirportSEOContentProps {
  airportName: string;
  airportCode: string;
  facilities: Facility[];
}

interface AirportTier {
  label: string;
  description: string;
  tone: 'premium' | 'moderate' | 'limited';
}

export function AirportSEOContent({ airportName, airportCode, facilities }: AirportSEOContentProps) {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const facilityAnalysis = useMemo(() => {
    const sleepPods = facilities.filter(f => f.category === 'Sleep Pod');
    const transitHotels = facilities.filter(f => f.category === 'Transit Hotel');
    const lounges = facilities.filter(f => f.category === 'Lounge');
    const privateRooms = facilities.filter(f => f.category === 'Private Room');

    const airsidePods = sleepPods.filter(f => f.airside_landside === 'Airside');
    const airsideHotels = transitHotels.filter(f => f.airside_landside === 'Airside');
    const airsideLounges = lounges.filter(f => f.airside_landside === 'Airside');
    const airsideRooms = privateRooms.filter(f => f.airside_landside === 'Airside');

    const landsidePods = sleepPods.filter(f => f.airside_landside === 'Landside');
    const landsideHotels = transitHotels.filter(f => f.airside_landside === 'Landside');
    const landsideLounges = lounges.filter(f => f.airside_landside === 'Landside');
    const landsideRooms = privateRooms.filter(f => f.airside_landside === 'Landside');

    return {
      sleepPods,
      transitHotels,
      lounges,
      privateRooms,
      airsidePods,
      airsideHotels,
      airsideLounges,
      airsideRooms,
      landsidePods,
      landsideHotels,
      landsideLounges,
      landsideRooms,
      hasSleepPods: sleepPods.length > 0,
      hasTransitHotels: transitHotels.length > 0,
      hasLounges: lounges.length > 0,
      hasPrivateRooms: privateRooms.length > 0,
      hasAirsideOptions: airsidePods.length > 0 || airsideHotels.length > 0 || airsideLounges.length > 0 || airsideRooms.length > 0,
      hasLandsideOptions: landsidePods.length > 0 || landsideHotels.length > 0 || landsideLounges.length > 0 || landsideRooms.length > 0,
      totalFacilities: facilities.length,
      totalAirside: airsidePods.length + airsideHotels.length + airsideLounges.length + airsideRooms.length,
      totalLandside: landsidePods.length + landsideHotels.length + landsideLounges.length + landsideRooms.length
    };
  }, [facilities]);

  const airportTier = useMemo((): AirportTier => {
    const count = facilityAnalysis.totalFacilities;

    if (count > 8) {
      return {
        label: 'World-Class Sleep Airport',
        description: 'world-class airport for sleep with extensive rest infrastructure',
        tone: 'premium'
      };
    } else if (count >= 3) {
      return {
        label: 'Moderate Sleep Options',
        description: 'moderate sleep options suitable for most layover scenarios',
        tone: 'moderate'
      };
    } else {
      return {
        label: 'Limited Sleep Options',
        description: 'limited sleep options requiring careful planning',
        tone: 'limited'
      };
    }
  }, [facilityAnalysis.totalFacilities]);

  const transitAccess = useMemo(() => {
    const { totalAirside, totalLandside, totalFacilities } = facilityAnalysis;
    if (totalFacilities === 0) return { label: 'No Paid Facilities', color: 'text-red-700', detail: 'Free terminal sleeping only' };
    if (totalAirside === 0) return { label: 'Landside Only', color: 'text-orange-700', detail: `All ${totalLandside} ${totalLandside === 1 ? 'facility requires' : 'facilities require'} immigration clearance` };
    if (totalLandside === 0) return { label: 'Full Airside Access', color: 'text-green-700', detail: `All ${totalAirside} ${totalAirside === 1 ? 'facility is' : 'facilities are'} airside — no visa needed` };
    return { label: 'Partial Airside Access', color: 'text-blue-700', detail: `${totalAirside} airside (visa-free) + ${totalLandside} landside (immigration required)` };
  }, [facilityAnalysis]);

  const transitFriendly = transitAccess.label !== 'Landside Only' && transitAccess.label !== 'No Paid Facilities';

  const dominantFacilityType = useMemo(() => {
    const { sleepPods, transitHotels, lounges, privateRooms } = facilityAnalysis;
    const counts = [
      { type: 'Sleep Pods', count: sleepPods.length, link: '/sleep-pods' },
      { type: 'Transit Hotels', count: transitHotels.length, link: '/transit-hotels' },
      { type: 'Lounges', count: lounges.length, link: '/lounge-sleep' },
      { type: 'Private Rooms', count: privateRooms.length, link: '/private-rooms' },
    ];
    return counts.sort((a, b) => b.count - a.count)[0];
  }, [facilityAnalysis]);

  const infrastructureBreakdown = useMemo(() => {
    const items = [];

    if (facilityAnalysis.sleepPods.length > 0) {
      items.push({
        category: 'Sleep Pods',
        total: facilityAnalysis.sleepPods.length,
        airside: facilityAnalysis.airsidePods.length,
        landside: facilityAnalysis.landsidePods.length,
        examples: facilityAnalysis.sleepPods.slice(0, 2).map(f => f.name),
        link: '/sleep-pods'
      });
    }

    if (facilityAnalysis.transitHotels.length > 0) {
      items.push({
        category: 'Transit Hotels',
        total: facilityAnalysis.transitHotels.length,
        airside: facilityAnalysis.airsideHotels.length,
        landside: facilityAnalysis.landsideHotels.length,
        examples: facilityAnalysis.transitHotels.slice(0, 2).map(f => f.name),
        link: '/transit-hotels'
      });
    }

    if (facilityAnalysis.lounges.length > 0) {
      items.push({
        category: 'Lounges with Sleep Facilities',
        total: facilityAnalysis.lounges.length,
        airside: facilityAnalysis.airsideLounges.length,
        landside: facilityAnalysis.landsideLounges.length,
        examples: facilityAnalysis.lounges.slice(0, 2).map(f => f.name),
        link: '/lounge-sleep'
      });
    }

    if (facilityAnalysis.privateRooms.length > 0) {
      items.push({
        category: 'Private Rest Rooms',
        total: facilityAnalysis.privateRooms.length,
        airside: facilityAnalysis.airsideRooms.length,
        landside: facilityAnalysis.landsideRooms.length,
        examples: facilityAnalysis.privateRooms.slice(0, 2).map(f => f.name),
        link: '/private-rooms'
      });
    }

    return items;
  }, [facilityAnalysis]);

  const bestOption = useMemo(() => {
    const { airsidePods, airsideHotels, airsideRooms, airsideLounges, sleepPods, transitHotels, privateRooms, lounges } = facilityAnalysis;

    if (airsidePods.length > 0) {
      return {
        type: 'Sleep Pod',
        name: airsidePods[0].name,
        terminal: airsidePods[0].terminal,
        location: 'airside',
        reason: 'airside sleep pods offer visa-free access, hourly flexibility, and private rest spaces without leaving the secure zone',
        link: '/sleep-pods'
      };
    }

    if (airsideHotels.length > 0) {
      return {
        type: 'Transit Hotel',
        name: airsideHotels[0].name,
        terminal: airsideHotels[0].terminal,
        location: 'airside',
        reason: 'airside transit hotels provide full beds, showers, and soundproof rooms accessible without immigration clearance',
        link: '/transit-hotels'
      };
    }

    if (airsideRooms.length > 0) {
      return {
        type: 'Private Room',
        name: airsideRooms[0].name,
        terminal: airsideRooms[0].terminal,
        location: 'airside',
        reason: 'airside private rooms deliver hotel-quality rest without visa requirements or terminal exits',
        link: '/private-rooms'
      };
    }

    if (airsideLounges.length > 0) {
      return {
        type: 'Lounge',
        name: airsideLounges[0].name,
        terminal: airsideLounges[0].terminal,
        location: 'airside',
        reason: 'airside lounges combine rest facilities with food, showers, and work spaces in the secure zone',
        link: '/lounge-sleep'
      };
    }

    if (sleepPods.length > 0) {
      return {
        type: 'Sleep Pod',
        name: sleepPods[0].name,
        terminal: sleepPods[0].terminal,
        location: 'landside',
        reason: 'sleep pods balance privacy, affordability, and convenience for short-to-medium layovers',
        link: '/sleep-pods'
      };
    }

    if (transitHotels.length > 0) {
      return {
        type: 'Transit Hotel',
        name: transitHotels[0].name,
        terminal: transitHotels[0].terminal,
        location: 'landside',
        reason: 'transit hotels offer complete rest packages with beds, bathrooms, and hourly booking flexibility',
        link: '/transit-hotels'
      };
    }

    if (privateRooms.length > 0) {
      return {
        type: 'Private Room',
        name: privateRooms[0].name,
        terminal: privateRooms[0].terminal,
        location: 'landside',
        reason: 'private rooms provide secure, quiet environments ideal for quality sleep during layovers',
        link: '/private-rooms'
      };
    }

    if (lounges.length > 0) {
      return {
        type: 'Lounge',
        name: lounges[0].name,
        terminal: lounges[0].terminal,
        location: 'landside',
        reason: 'lounges offer comfortable seating, refreshments, and shower access for resting travelers',
        link: '/lounge-sleep'
      };
    }

    return null;
  }, [facilityAnalysis]);

  const { hasSleepPods, hasTransitHotels, hasLounges, hasPrivateRooms, totalFacilities, hasAirsideOptions, totalAirside, totalLandside } = facilityAnalysis;

  const facilityConstraints = useMemo(() => {
    const { hasSleepPods, hasTransitHotels, hasLounges, hasPrivateRooms, totalFacilities, totalAirside, totalLandside, sleepPods, transitHotels, lounges, airsidePods, airsideHotels } = facilityAnalysis;
    const hasAny = totalFacilities > 0;
    const isLandsideOnly = totalAirside === 0 && totalLandside > 0;
    const isFullAirside = totalAirside > 0 && totalLandside === 0;
    const isPartialAirside = totalAirside > 0 && totalLandside > 0;
    const singleFacility = totalFacilities === 1;
    const primaryName = bestOption?.name ?? null;
    const primaryTerminal = bestOption?.terminal ?? null;
    const visaNote = isLandsideOnly ? 'Visa or entry permit required — confirm eligibility before booking.' : isPartialAirside ? `${totalAirside} options skip immigration; ${totalLandside} require it.` : '';
    return { hasSleepPods, hasTransitHotels, hasLounges, hasPrivateRooms, hasAny, isLandsideOnly, isFullAirside, isPartialAirside, singleFacility, primaryName, primaryTerminal, visaNote, sleepPods, transitHotels, lounges, airsidePods, airsideHotels };
  }, [facilityAnalysis, bestOption]);

  const contentVariations = useMemo(() => {
    const variation = totalFacilities % 3;
    return { variation };
  }, [totalFacilities]);

  const allAirportData = useMemo(() => [
    { airportName: 'Singapore Changi', airportCode: 'SIN', slug: 'singapore-changi-sin', facilities: 11, region: 'Asia' },
    { airportName: 'Doha Hamad', airportCode: 'DOH', slug: 'doha-hamad-doh', facilities: 4, region: 'Middle East' },
    { airportName: 'Istanbul', airportCode: 'IST', slug: 'istanbul-ist', facilities: 3, region: 'Europe' },
    { airportName: 'Seoul Incheon', airportCode: 'ICN', slug: 'seoul-incheon-icn', facilities: 11, region: 'Asia' },
    { airportName: 'Munich', airportCode: 'MUC', slug: 'munich-muc', facilities: 4, region: 'Europe' },
    { airportName: 'Amsterdam Schiphol', airportCode: 'AMS', slug: 'amsterdam-schiphol-ams', facilities: 3, region: 'Europe' },
    { airportName: 'Helsinki', airportCode: 'HEL', slug: 'helsinki-hel', facilities: 1, region: 'Europe' },
    { airportName: 'Dubai', airportCode: 'DXB', slug: 'dubai-dxb', facilities: 6, region: 'Middle East' },
    { airportName: 'Hong Kong', airportCode: 'HKG', slug: 'hong-kong-hkg', facilities: 1, region: 'Asia' },
    { airportName: 'Zurich', airportCode: 'ZRH', slug: 'zurich-zrh', facilities: 1, region: 'Europe' },
    { airportName: 'Bangkok Suvarnabhumi', airportCode: 'BKK', slug: 'bangkok-suvarnabhumi-bkk', facilities: 3, region: 'Asia' },
    { airportName: 'London Heathrow', airportCode: 'LHR', slug: 'london-heathrow-lhr', facilities: 2, region: 'Europe' },
    { airportName: 'Tokyo Narita', airportCode: 'NRT', slug: 'tokyo-narita-nrt', facilities: 2, region: 'Asia' },
  ], []);

  const comparisonAirports = useMemo(() => {
    const filtered = allAirportData.filter(a => a.airportCode !== airportCode);
    const hash = airportCode.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const startIndex = hash % Math.max(1, filtered.length - 2);
    return filtered.slice(startIndex, startIndex + 3);
  }, [airportCode, allAirportData]);

  const strongerAlternatives = useMemo(() => {
    return allAirportData
      .filter(a => a.airportCode !== airportCode && a.facilities > totalFacilities)
      .sort((a, b) => b.facilities - a.facilities)
      .slice(0, 3);
  }, [airportCode, allAirportData, totalFacilities]);

  const smartComparisonAirports = useMemo(() => {
    if (airportTier.tone === 'limited' || totalFacilities <= 2) {
      return strongerAlternatives.length >= 2 ? strongerAlternatives.slice(0, 3) : comparisonAirports;
    }
    return comparisonAirports;
  }, [airportTier.tone, totalFacilities, strongerAlternatives, comparisonAirports]);

  const faqs = useMemo(() => [
    {
      question: `Can I sleep overnight at ${airportName} without booking ${totalFacilities > 0 ? bestOption ? `the ${bestOption.name}` : 'paid facilities' : 'an external hotel'}?`,
      answer: (
        <>
          Yes, overnight sleeping at {airportCode} is permitted for transit passengers and those with early departures.{" "}
          {totalFacilities > 0 ? (
            <>
              The airport provides {totalFacilities} dedicated rest facilities including{" "}
              {hasSleepPods && (
                <>
                  <strong>
                    <Link to="/sleep-pods">sleep pods</Link>
                  </strong>{" "}
                  for private naps
                </>
              )}
              {hasSleepPods && hasTransitHotels && ", "}
              {hasTransitHotels && (
                <>
                  <strong>
                    <Link to="/transit-hotels">transit hotels</Link>
                  </strong>{" "}
                  with full beds
                </>
              )}
              {(hasSleepPods || hasTransitHotels) && hasLounges && ", and "}
              {hasLounges && (
                <>
                  <strong>
                    <Link to="/lounge-sleep">airport lounges</Link>
                  </strong>{" "}
                  with recliners
                </>
              )}
              . Free terminal sleeping remains available for budget travelers.
            </>
          ) : (
            "Free seating areas and gate zones accommodate budget travelers willing to sleep on benches."
          )}{" "}
          {airportTier.tone === 'limited' ? (
            <>
              For better-equipped layover airports, see{" "}
              {smartComparisonAirports.slice(0, 2).map((airport, idx) => (
                <span key={airport.airportCode}>
                  <Link to={`/airport/${airport.slug}`}>{airport.airportName}</Link> ({airport.facilities} facilities)
                  {idx === 0 && " or "}
                </span>
              ))}.
            </>
          ) : (
            <>
              Compare against other airports in our{" "}
              <strong><Link to="/airports">complete airports directory</Link></strong>.
            </>
          )}
        </>
      )
    },
    {
      question: `Does ${airportCode} have ${facilityAnalysis.sleepPods.length > 0 ? `${facilityAnalysis.sleepPods[0].name.includes('Minute') ? 'Minute Suites' : facilityAnalysis.sleepPods[0].name.includes('GoSleep') ? 'GoSleep pods' : facilityAnalysis.sleepPods[0].name.includes('YOTEL') ? 'YOTELAIR capsules' : 'sleep pods'}` : 'sleep pods or nap rooms'}${facilityAnalysis.sleepPods[0]?.terminal ? ` in ${facilityAnalysis.sleepPods[0].terminal}` : ''}?`,
      answer: hasSleepPods ? (
        <>
          Yes, {airportName} operates {facilityAnalysis.sleepPods.length} sleep pod location{facilityAnalysis.sleepPods.length > 1 ? 's' : ''} including <strong>{facilityAnalysis.sleepPods[0].name}</strong>
          {facilityAnalysis.sleepPods[0].terminal && ` in ${facilityAnalysis.sleepPods[0].terminal}`}.{" "}
          {facilityAnalysis.airsidePods.length > 0
            ? `${facilityAnalysis.airsidePods.length === facilityAnalysis.sleepPods.length ? 'All pods are' : `${facilityAnalysis.airsidePods.length} ${facilityAnalysis.airsidePods.length === 1 ? 'is' : 'are'}`} accessible airside, eliminating visa concerns for international transit passengers.`
            : "Verify terminal locations to ensure convenient access during your layover."}{" "}
          Compare with pod networks at{" "}
          {comparisonAirports.filter(a => ['SIN', 'DOH', 'DXB', 'HEL'].includes(a.airportCode)).slice(0, 2).map((airport, idx) => (
            <span key={airport.airportCode}>
              <Link to={`/airport/${airport.slug}`}>{airport.airportName}</Link>
              {idx === 0 && " and "}
            </span>
          ))}{" "}
          through our{" "}
          <strong>
            <Link to="/sleep-pods">global sleep pods directory</Link>
          </strong>.
        </>
      ) : (
        <>
          No, {airportName} currently lacks dedicated sleep pod installations.{" "}
          {hasTransitHotels ? (
            <>
              The airport's{" "}
              <strong>
                <Link to="/transit-hotels">transit hotels</Link>
              </strong>{" "}
              like <strong>{facilityAnalysis.transitHotels[0].name}</strong> provide similar privacy benefits with full rooms
            </>
          ) : hasLounges ? (
            <>
              <strong>
                <Link to="/lounge-sleep">Lounge facilities</Link>
              </strong>{" "}
              like <strong>{facilityAnalysis.lounges[0].name}</strong> offer comfortable rest alternatives
            </>
          ) : (
            "free sleeping zones throughout terminals accommodate budget-conscious travelers"
          )}
          . Pod-equipped airports like{" "}
          {comparisonAirports.filter(a => ['SIN', 'DOH', 'DXB', 'IST'].includes(a.airportCode)).slice(0, 2).map((airport, idx) => (
            <span key={airport.airportCode}>
              <Link to={`/airport/${airport.slug}`}>{airport.airportName}</Link>
              {idx === 0 && " or "}
            </span>
          ))}{" "}
          offer superior layover rest infrastructure—explore our{" "}
          <strong>
            <Link to="/sleep-pods">sleep pods directory</Link>
          </strong>{" "}
          to find alternatives along your typical routes.
        </>
      )
    },
    {
      question: `Do I need a visa to access ${bestOption && totalAirside > 0 ? `${bestOption.name}` : 'sleeping facilities'} at ${airportCode}?`,
      answer: hasAirsideOptions ? (
        <>
          No visa required for airside facilities at {airportCode}. {airportName} offers{" "}
          {totalAirside} rest {totalAirside === 1 ? 'option' : 'options'} accessible after security without immigration clearance{" "}
          {bestOption && bestOption.location === 'airside' && (
            <>
              including our recommended <strong>{bestOption.name}</strong>
              {bestOption.terminal && ` in ${bestOption.terminal}`}
            </>
          )}. This includes{" "}
          {facilityAnalysis.airsidePods.length > 0 && (
            <>
              {facilityAnalysis.airsidePods.length}{" "}
              <strong>
                <Link to="/sleep-pods">sleep pod</Link>
              </strong>{" "}
              {facilityAnalysis.airsidePods.length > 1 ? 'locations' : 'location'}
            </>
          )}
          {facilityAnalysis.airsidePods.length > 0 && (facilityAnalysis.airsideHotels.length > 0 || facilityAnalysis.airsideRooms.length > 0) && ", "}
          {facilityAnalysis.airsideHotels.length > 0 && (
            <>
              {facilityAnalysis.airsideHotels.length}{" "}
              <strong>
                <Link to="/transit-hotels">transit hotel</Link>
              </strong>{" "}
              {facilityAnalysis.airsideHotels.length > 1 ? 'facilities' : 'facility'}
            </>
          )}
          {(facilityAnalysis.airsidePods.length > 0 || facilityAnalysis.airsideHotels.length > 0) && facilityAnalysis.airsideRooms.length > 0 && ", and "}
          {facilityAnalysis.airsideRooms.length > 0 && (
            <>
              {facilityAnalysis.airsideRooms.length}{" "}
              <strong>
                <Link to="/private-rooms">private room</Link>
              </strong>{" "}
              {facilityAnalysis.airsideRooms.length > 1 ? 'options' : 'option'}
            </>
          )}
          {facilityAnalysis.airsideLounges.length > 0 && (
            <>
              {(facilityAnalysis.airsidePods.length > 0 || facilityAnalysis.airsideHotels.length > 0 || facilityAnalysis.airsideRooms.length > 0) && ", plus "}
              {facilityAnalysis.airsideLounges.length}{" "}
              <strong>
                <Link to="/lounge-sleep">lounge</Link>
              </strong>{" "}
              {facilityAnalysis.airsideLounges.length > 1 ? 'facilities' : 'facility'}
            </>
          )}
          .
          {totalLandside > 0 && (
            <>
              {" "}An additional {totalLandside} landside {totalLandside === 1 ? 'facility requires' : 'facilities require'} passing through immigration—{" "}
              <a href="https://www.visainfoguide.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:opacity-80">
                check transit visa requirements for your nationality
              </a>
              {" "}before booking.
            </>
          )}{" "}
          Compare visa-free transit infrastructure against{" "}
          {comparisonAirports.filter(a => ['SIN', 'DOH', 'IST', 'ICN'].includes(a.airportCode)).slice(0, 2).map((airport, idx) => (
            <span key={airport.airportCode}>
              <Link to={`/airport/${airport.slug}`}>{airport.airportName}</Link>
              {idx === 0 && " and "}
            </span>
          ))}{" "}
          in our{" "}
          <strong>
            <Link to="/airports">airports database</Link>
          </strong>.
        </>
      ) : (
        <>
          Visa requirements for sleeping at {airportCode} depend on facility locations.{" "}
          {totalFacilities > 0
            ? `${totalLandside > 0 ? `All ${totalLandside}` : 'Most'} ${airportName} rest facilities sit landside, requiring immigration clearance and appropriate entry visas based on your nationality.`
            : "Free terminal sleeping works only if you remain airside throughout your layover."}{" "}
          <a href="https://www.visainfoguide.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:opacity-80">
            Check your transit visa requirements at visainfoguide.com
          </a>.{" "}
          For visa-free transit sleeping, reroute through airports like{" "}
          {comparisonAirports.filter(a => ['SIN', 'DOH', 'IST', 'MUC'].includes(a.airportCode)).slice(0, 2).map((airport, idx) => (
            <span key={airport.airportCode}>
              <Link to={`/airport/${airport.slug}`}>{airport.airportName}</Link>
              {idx === 0 && " or "}
            </span>
          ))}{" "}
          with extensive{" "}
          <strong>
            <Link to="/transit-hotels">airside transit hotels</Link>
          </strong>{" "}
          and{" "}
          <strong>
            <Link to="/sleep-pods">sleep pods</Link>
          </strong>.
        </>
      )
    },
    {
      question: `Which terminal at ${airportCode} has the best sleeping facilities?`,
      answer: (
        <>
          {bestOption?.terminal ? (
            <>
              <strong>{bestOption.terminal}</strong> at {airportName} houses the recommended <strong>{bestOption.name}</strong>, our top-rated {bestOption.location} rest facility.{" "}
              {totalFacilities > 1 ? (
                <>
                  {airportCode} distributes {totalFacilities} total facilities across terminals—{totalAirside > 0 && `${totalAirside} airside (no visa), `}{totalLandside > 0 && `${totalLandside} landside (visa required)`}.{" "}
                  {airportTier.tone === 'premium' ? (
                    <>This extensive infrastructure places {airportCode} among elite global sleep hubs.</>
                  ) : airportTier.tone === 'moderate' ? (
                    <>This moderate selection covers basic layover needs but lacks the density found at Singapore (11 facilities) or Seoul Incheon (11 facilities).</>
                  ) : (
                    <>Compared to world-class airports like Singapore Changi (11 facilities) or Seoul Incheon (11 facilities), {airportCode} offers significantly fewer options.</>
                  )}{" "}
                  Review our{" "}
                  <strong>
                    <Link to={`/airports/${airportCode.toLowerCase()}`}>complete {airportCode} terminal map</Link>
                  </strong>{" "}
                  to locate facilities nearest your gate.
                </>
              ) : (
                <>
                  {airportTier.tone === 'limited' && (
                    <>
                      Unlike major hubs like{" "}
                      {comparisonAirports.filter(a => a.facilities > 8).slice(0, 2).map((airport, idx) => (
                        <span key={airport.airportCode}>
                          <Link to={`/airport/${airport.slug}`}>{airport.airportName}</Link>
                          {idx === 0 && " and "}
                        </span>
                      ))}{" "}
                      with 10+ facilities per terminal, {airportCode} operates minimal infrastructure.{" "}
                    </>
                  )}
                  Explore{" "}
                  <strong>
                    <Link to={bestOption.link}>similar facilities at better-equipped airports</Link>
                  </strong>{" "}
                  when planning future routes.
                </>
              )}
            </>
          ) : (
            <>
              {totalFacilities > 0 ? (
                <>
                  Rest facilities at {airportName} distribute across terminals without a single dominant sleep hub. Our{" "}
                  <strong>
                    <Link to={`/airports/${airportCode.toLowerCase()}`}>detailed {airportCode} guide</Link>
                  </strong>{" "}
                  maps all {totalFacilities} options by terminal, airside/landside status, and gate proximity.{" "}
                  {airportTier.tone === 'premium' ? (
                    <>With {totalFacilities} facilities, {airportCode} rivals world-leading sleep airports.</>
                  ) : airportTier.tone === 'moderate' ? (
                    <>This moderate infrastructure handles typical layover scenarios but doesn't match Singapore's 11-facility network or Seoul's extensive terminal coverage.</>
                  ) : (
                    <>Airports like Singapore Changi (11 facilities) and Seoul Incheon (11 facilities) offer 3-10x more options per terminal.</>
                  )}
                </>
              ) : (
                <>
                  Without dedicated facilities, terminal quality at {airportCode} varies significantly. International zones typically provide quieter overnight environments with 24-hour food courts and power outlets. Contrast this with world-class airports like{" "}
                  {comparisonAirports.filter(a => a.facilities > 8).slice(0, 2).map((airport, idx) => (
                    <span key={airport.airportCode}>
                      <Link to={`/airport/${airport.slug}`}>{airport.airportName}</Link>
                      {idx === 0 && " and "}
                    </span>
                  ))}{" "}
                  featuring 8-15 dedicated sleep zones per terminal with clear directional signage.
                </>
              )}
            </>
          )}
        </>
      )
    },
    {
      question: `Can I access transit hotels at ${airportCode} without clearing customs and immigration?`,
      answer: facilityAnalysis.airsideHotels.length > 0 ? (
        <>
          Yes. {airportCode} operates {facilityAnalysis.airsideHotels.length} airside{" "}
          <strong>
            <Link to="/transit-hotels">transit hotel</Link>
          </strong>{" "}
          {facilityAnalysis.airsideHotels.length === 1 ? 'facility' : 'facilities'} including <strong>{facilityAnalysis.airsideHotels[0].name}</strong>
          {facilityAnalysis.airsideHotels[0].terminal && ` in ${facilityAnalysis.airsideHotels[0].terminal}`}, accessible after security without passing through immigration. This eliminates visa requirements for international transit passengers—book directly through the secure zone.{" "}
          {facilityAnalysis.landsideHotels.length > 0 && (
            <>An additional {facilityAnalysis.landsideHotels.length} landside transit {facilityAnalysis.landsideHotels.length === 1 ? 'hotel requires' : 'hotels require'} immigration clearance. </>
          )}
          {airportTier.tone === 'premium' ? (
            <>This airside infrastructure places {airportCode} among global leaders for visa-free layover sleeping.</>
          ) : (
            <>Compare against airports with more extensive airside networks like Singapore Changi (4 airside hotels) and Doha Hamad (2 airside hotels).</>
          )}
        </>
      ) : facilityAnalysis.landsideHotels.length > 0 ? (
        <>
          No. {airportName}'s {facilityAnalysis.landsideHotels.length}{" "}
          <strong>
            <Link to="/transit-hotels">transit hotel</Link>
          </strong>{" "}
          {facilityAnalysis.landsideHotels.length === 1 ? 'operates' : 'operate'} landside, requiring immigration clearance and appropriate visas for your nationality. For visa-free transit sleeping, reroute through airports like{" "}
          {comparisonAirports.filter(a => ['SIN', 'DOH', 'IST', 'MUC'].includes(a.airportCode)).slice(0, 2).map((airport, idx) => (
            <span key={airport.airportCode}>
              <Link to={`/airport/${airport.slug}`}>{airport.airportName}</Link>
              {idx === 0 && " or "}
            </span>
          ))}{" "}
          with extensive airside hotel infrastructure.
        </>
      ) : (
        <>
          {airportCode} lacks{" "}
          <strong>
            <Link to="/transit-hotels">transit hotels</Link>
          </strong>{" "}
          entirely. For visa-free airside sleeping, consider{" "}
          {facilityAnalysis.airsidePods.length > 0 ? (
            <>
              the airport's {facilityAnalysis.airsidePods.length} airside{" "}
              <strong>
                <Link to="/sleep-pods">sleep pod</Link>
              </strong>{" "}
              {facilityAnalysis.airsidePods.length === 1 ? 'location' : 'locations'}
            </>
          ) : (
            <>
              routing through airports like{" "}
              {comparisonAirports.filter(a => ['SIN', 'DOH', 'DXB'].includes(a.airportCode)).slice(0, 2).map((airport, idx) => (
                <span key={airport.airportCode}>
                  <Link to={`/airport/${airport.slug}`}>{airport.airportName}</Link>
                  {idx === 0 && " or "}
                </span>
              ))}{" "}
              with multiple airside transit hotels
            </>
          )}.
        </>
      )
    },
    {
      question: `How much does ${bestOption ? `${bestOption.name} at ${airportCode}` : `airport sleeping at ${airportName}`} cost per hour?`,
      answer: (
        <>
          {bestOption ? (
            <>
              {bestOption.type === 'Sleep Pod' && (
                <>
                  <strong>{bestOption.name}</strong> charges approximately $20-40 per hour with typical 1-2 hour minimums. A 3-hour booking runs $60-120, ideal for power naps during short {airportCode} layovers.{" "}
                </>
              )}
              {bestOption.type === 'Transit Hotel' && (
                <>
                  <strong>{bestOption.name}</strong> operates on 3-6 hour minimum blocks ($75-200 typical). Extended 8-hour overnight stays run $200-300, delivering full hotel amenities without leaving {airportName}.{" "}
                </>
              )}
              {bestOption.type === 'Lounge' && (
                <>
                  <strong>{bestOption.name}</strong> day passes cost $40-80 for unlimited duration. This includes food, showers, WiFi, and comfortable seating at {airportCode}.{" "}
                </>
              )}
              {bestOption.type === 'Private Room' && (
                <>
                  <strong>{bestOption.name}</strong> charges hourly or by block ($30-60 per hour typical). Minimum bookings start at 2-3 hours for {airportName} layover rest.{" "}
                </>
              )}
            </>
          ) : (
            <>
              Pricing at {airportCode} varies by facility type.{" "}
            </>
          )}
          {hasSleepPods && !(bestOption?.name?.toLowerCase().includes('sleep') || bestOption?.name?.toLowerCase().includes('pod')) && (
            <>
              <strong>
                <Link to="/sleep-pods">Sleep pods</Link>
              </strong>{" "}
              charge $15-40/hour ({facilityAnalysis.sleepPods.length} available).{" "}
            </>
          )}
          {hasTransitHotels && bestOption?.type !== 'Transit Hotel' && (
            <>
              <strong>
                <Link to="/transit-hotels">Transit hotels</Link>
              </strong>{" "}
              run $50-150 for 3-6 hour blocks ({facilityAnalysis.transitHotels.length} on-site).{" "}
            </>
          )}
          {hasLounges && bestOption?.type !== 'Lounge' && (
            <>
              <strong>
                <Link to="/lounge-sleep">Lounge</Link>
              </strong>{" "}
              day passes cost $30-80 ({facilityAnalysis.lounges.length} operating).{" "}
            </>
          )}
          Compare pricing against premium sleep airports like{" "}
          {comparisonAirports.slice(0, 2).map((airport, idx) => (
            <span key={airport.airportCode}>
              <Link to={`/airport/${airport.slug}`}>{airport.airportName}</Link>
              {idx === 0 && " and "}
            </span>
          ))}{" "}
          through our{" "}
          <strong>
            <Link to="/airports">airports directory</Link>
          </strong>.
        </>
      )
    },
    {
      question: `Is ${bestOption ? `${bestOption.name}` : 'overnight sleeping'} safe for solo travelers at ${airportCode}?`,
      answer: (
        <>
          {airportName} maintains strong security standards with 24/7 surveillance, regular patrols, and well-lit terminal areas suitable for overnight stays. Solo travelers maximize safety by{" "}
          {bestOption ? (
            <>
              booking <strong>{bestOption.name}</strong>
              {bestOption.terminal && ` in ${bestOption.terminal}`} which provides locking doors and private enclosed space
            </>
          ) : (
            "staying in high-traffic zones near security desks"
          )}
          , avoiding isolated corridors, and securing luggage with cable locks.{" "}
          {hasPrivateRooms || hasSleepPods ? (
            <>
              The {facilityAnalysis.sleepPods.length + facilityAnalysis.privateRooms.length}{" "}
              <strong>
                <Link to={hasSleepPods ? "/sleep-pods" : "/private-rooms"}>
                  {hasSleepPods ? "sleep pod" : "private room"}
                </Link>
              </strong>{" "}
              {facilityAnalysis.sleepPods.length + facilityAnalysis.privateRooms.length > 1 ? 'options' : 'facility'} at {airportCode} {facilityAnalysis.sleepPods.length + facilityAnalysis.privateRooms.length > 1 ? 'offer' : 'offers'} enhanced security versus public terminal seating.
            </>
          ) : hasTransitHotels ? (
            <>
              {facilityAnalysis.transitHotels.length}{" "}
              <strong>
                <Link to="/transit-hotels">transit hotel</Link>
              </strong>{" "}
              {facilityAnalysis.transitHotels.length > 1 ? 'provide' : 'provides'} secure enclosed rooms for maximum peace of mind.
            </>
          ) : (
            <>
              For enhanced security, consider connecting through airports like{" "}
              {comparisonAirports.slice(0, 2).map((airport, idx) => (
                <span key={airport.airportCode}>
                  <Link to={`/airport/${airport.slug}`}>{airport.airportName}</Link>
                  {idx === 0 && " or "}
                </span>
              ))}{" "}
              with extensive{" "}
              <strong>
                <Link to="/sleep-pods">private sleeping facilities</Link>
              </strong>.
            </>
          )}
        </>
      )
    },
    {
      question: hasLounges
        ? `How do I access ${facilityAnalysis.lounges[0].name}${facilityAnalysis.lounges[0].terminal ? ` in ${facilityAnalysis.lounges[0].terminal}` : ''} at ${airportCode} without business class tickets?`
        : `Can I access airport lounges at ${airportName} without flying business class?`,
      answer: hasLounges ? (
        <>
          <strong>{facilityAnalysis.lounges[0].name}</strong> and {airportName}'s {facilityAnalysis.lounges.length - 1 === 0 ? 'this' : `${facilityAnalysis.lounges.length - 1} other`}{" "}
          <strong>
            <Link to="/lounge-sleep">lounge {facilityAnalysis.lounges.length > 1 ? 'facilities' : 'facility'}</Link>
          </strong>{" "}
          accept Priority Pass, LoungeKey, premium credit cards (AmEx Platinum, Chase Sapphire Reserve, Capital One Venture X), or direct day pass purchases ($30-80).{" "}
          {facilityAnalysis.airsideLounges.length > 0 && (
            <>
              {facilityAnalysis.airsideLounges.length} {facilityAnalysis.airsideLounges.length === 1 ? 'operates' : 'operate'} airside at {airportCode}, accessible for international transit without visa requirements.{" "}
            </>
          )}
          {airportTier.tone === 'premium' ? (
            <>This extensive lounge network rivals premium hubs worldwide.</>
          ) : airportTier.tone === 'moderate' ? (
            <>While adequate, this selection pales compared to Singapore Changi (15+ lounges) or Istanbul (20+ lounges) which offer multiple lounges per terminal.</>
          ) : (
            <>Contrast this with lounge-rich airports like Singapore (15+ options) or Istanbul (20+ options) featuring multiple branded lounges per concourse.</>
          )}{" "}
          Explore our{" "}
          <strong>
            <Link to="/brands">brands directory</Link>
          </strong>{" "}
          to find specific lounge operators.
        </>
      ) : (
        <>
          {airportName} has limited lounge infrastructure. Consider{" "}
          {hasTransitHotels ? (
            <>
              booking{" "}
              <strong>
                <Link to="/transit-hotels">transit hotel</Link>
              </strong>{" "}
              rooms like <strong>{facilityAnalysis.transitHotels[0].name}</strong>
            </>
          ) : hasSleepPods ? (
            <>
              renting{" "}
              <strong>
                <Link to="/sleep-pods">sleep pods</Link>
              </strong>{" "}
              like <strong>{facilityAnalysis.sleepPods[0].name}</strong>
            </>
          ) : (
            "exploring nearby airport hotels"
          )}{" "}
          as alternatives. Airports with extensive lounge networks like{" "}
          {comparisonAirports.filter(a => ['SIN', 'ICN', 'DOH', 'IST'].includes(a.airportCode)).slice(0, 2).map((airport, idx) => (
            <span key={airport.airportCode}>
              <Link to={`/airport/${airport.slug}`}>{airport.airportName}</Link>
              {idx === 0 && " or "}
            </span>
          ))}{" "}
          offer 10-15{" "}
          <strong>
            <Link to="/lounge-sleep">lounge options</Link>
          </strong>{" "}
          each—research our{" "}
          <strong>
            <Link to="/airports">airports database</Link>
          </strong>{" "}
          for route planning.
        </>
      )
    },
    {
      question: hasLounges || hasTransitHotels
        ? `Which ${airportCode} facilities have showers${bestOption ? ` near ${bestOption.name}` : ''}?`
        : `Are there showers available at ${airportCode} for layover passengers?`,
      answer: (
        <>
          Shower access at {airportName} comes through{" "}
          {hasLounges ? (
            <>
              <strong>
                <Link to="/lounge-sleep">airport lounges</Link>
              </strong>{" "}
              like <strong>{facilityAnalysis.lounges[0].name}</strong> ({facilityAnalysis.lounges.length} total available)
            </>
          ) : hasTransitHotels ? (
            <>
              <strong>
                <Link to="/transit-hotels">transit hotel</Link>
              </strong>{" "}
              rooms like <strong>{facilityAnalysis.transitHotels[0].name}</strong> with ensuite bathrooms
            </>
          ) : (
            "limited facilities"
          )}
          {hasPrivateRooms && (
            <>
              ,{" "}
              <strong>
                <Link to="/private-rooms">private rest rooms</Link>
              </strong>{" "}
              including <strong>{facilityAnalysis.privateRooms[0].name}</strong> ({facilityAnalysis.privateRooms.length} locations)
            </>
          )}
          {hasSleepPods && facilityAnalysis.sleepPods.some(p => p.name.toLowerCase().includes('minute suite') || p.name.toLowerCase().includes('yotel')) && (
            <>
              , and select premium{" "}
              <strong>
                <Link to="/sleep-pods">sleep pod operators</Link>
              </strong>{" "}
              like{" "}
              {facilityAnalysis.sleepPods.filter(p => p.name.toLowerCase().includes('minute suite') || p.name.toLowerCase().includes('yotel'))[0]?.name}
            </>
          )}
          . Standalone shower costs range $10-25 when not included. Shower-equipped airports like{" "}
          {comparisonAirports.slice(0, 2).map((airport, idx) => (
            <span key={airport.airportCode}>
              <Link to={`/airport/${airport.slug}`}>{airport.airportName}</Link>
              {idx === 0 && " and "}
            </span>
          ))}{" "}
          offer more extensive facilities—review our{" "}
          <strong>
            <Link to="/brands">brands directory</Link>
          </strong>{" "}
          to plan shower access across your typical routes.
        </>
      )
    },
    {
      question: bestOption
        ? `Should I book ${bestOption.name} for a 6-hour ${airportCode} layover${bestOption.terminal ? ` in ${bestOption.terminal}` : ''}?`
        : `What's the best ${airportName} sleeping strategy for a 6-hour layover?`,
      answer: totalFacilities > 0 ? (
        <>
          {bestOption ? (
            <>
              Yes. For 6-hour layovers, book <strong>{bestOption.name}</strong> for 3-4 hours of actual sleep time{" "}
              {bestOption.type === 'Sleep Pod' && "($60-120), leaving 2 hours for meals and boarding"}
              {bestOption.type === 'Transit Hotel' && "($100-200) with ensuite bathroom and wake-up service"}
              {bestOption.type === 'Lounge' && "(day pass $40-80) with unlimited stay, showers, and complimentary food"}
              {bestOption.type === 'Private Room' && "($90-180) balancing privacy with hourly flexibility"}. This beats free terminal sleeping which sacrifices rest quality.{" "}
            </>
          ) : (
            <>
              For 6-hour layovers at {airportCode},{" "}
              {hasSleepPods ? (
                <>
                  <strong>
                    <Link to="/sleep-pods">sleep pods</Link>
                  </strong>{" "}
                  like <strong>{facilityAnalysis.sleepPods[0].name}</strong> offer optimal value—book 3-4 hours ($45-120)
                </>
              ) : hasTransitHotels ? (
                <>
                  <strong>
                    <Link to="/transit-hotels">transit hotels</Link>
                  </strong>{" "}
                  like <strong>{facilityAnalysis.transitHotels[0].name}</strong> provide 3-4 hour bookings ($75-150)
                </>
              ) : hasLounges ? (
                <>
                  <strong>
                    <Link to="/lounge-sleep">lounge day passes</Link>
                  </strong>{" "}
                  for <strong>{facilityAnalysis.lounges[0].name}</strong> ($40-80) maximize value
                </>
              ) : (
                "free terminal seating minimizes costs"
              )}.{" "}
            </>
          )}
          {facilityAnalysis.sleepPods.length + facilityAnalysis.transitHotels.length > 1
            ? `Compare all ${totalFacilities} ${airportCode} facilities`
            : `Compare against superior layover airports like ${comparisonAirports.map(a => a.airportName).slice(0, 2).join(' and ')}`}{" "}
          through our{" "}
          <strong>
            <Link to="/airports">airports directory</Link>
          </strong>.
        </>
      ) : (
        <>
          With limited dedicated facilities at {airportCode}, 6-hour layovers work best using free terminal rest zones. Budget $50-100 for nearby airport hotels if shower access matters. Better-equipped airports like{" "}
          {comparisonAirports.slice(0, 3).map((airport, idx) => (
            <span key={airport.airportCode}>
              <Link to={`/airport/${airport.slug}`}>{airport.airportName}</Link>
              {idx < 2 && (idx === 1 ? ', and ' : ', ')}
            </span>
          ))}{" "}
          offer extensive{" "}
          <strong>
            <Link to="/sleep-pods">sleep pods</Link>
          </strong>{" "}
          and{" "}
          <strong>
            <Link to="/transit-hotels">transit hotels</Link>
          </strong>{" "}
          for future connections—explore our{" "}
          <strong>
            <Link to="/airports">comprehensive database</Link>
          </strong>.
        </>
      )
    },
    {
      question: bestOption
        ? `Where exactly is ${bestOption.name} located at ${airportCode}${bestOption.terminal ? ` in ${bestOption.terminal}` : ''}?`
        : `Where can I find detailed terminal maps for ${airportCode} sleeping areas?`,
      answer: (
        <>
          {bestOption ? (
            <>
              <strong>{bestOption.name}</strong> operates{" "}
              {bestOption.terminal ? (
                <>
                  in <strong>{bestOption.terminal}</strong> at {airportName}
                </>
              ) : (
                <>
                  at {airportName}
                </>
              )}
              {bestOption.location === 'airside' && (
                <>, accessible airside after security screening without immigration processing</>
              )}
              {bestOption.location === 'landside' && (
                <>, located landside which requires clearing immigration and obtaining appropriate visas</>
              )}.{" "}
            </>
          ) : (
            <>
              {totalFacilities > 0 && `All ${totalFacilities} ${airportCode} facilities are mapped in `}
            </>
          )}
          Our{" "}
          <strong>
            <Link to={`/airports/${airportCode.toLowerCase()}`}>dedicated {airportName} page</Link>
          </strong>{" "}
          provides{" "}
          {totalFacilities > 0
            ? "current pricing, exact locations, operating hours, airside/landside status, and direct booking links"
            : "terminal layouts, free sleeping zones, and 24-hour amenity locations"}.{" "}
          {totalFacilities > 3 && "Use filters to narrow by category, price, and terminal location. "}
          Compare {airportCode} against world-class sleep airports like{" "}
          {comparisonAirports.slice(0, 3).map((airport, idx) => (
            <span key={airport.airportCode}>
              <Link to={`/airport/${airport.slug}`}>{airport.airportName}</Link>
              {idx < 2 && (idx === 1 ? ', and ' : ', ')}
            </span>
          ))}{" "}
          in our{" "}
          <strong>
            <Link to="/airports">airports database</Link>
          </strong>, then subscribe to our{" "}
          <strong>
            <Link to="/blog">airport sleep blog</Link>
          </strong>{" "}
          for terminal-specific tips and traveler reviews.
        </>
      )
    }
  ], [airportName, airportCode, hasSleepPods, hasTransitHotels, hasLounges, hasPrivateRooms, totalFacilities, facilityAnalysis, bestOption, hasAirsideOptions, comparisonAirports, smartComparisonAirports, totalAirside, totalLandside, airportTier]);

  const isMinimalAirport = totalFacilities <= 1;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      <section className="prose prose-lg max-w-none">
        <h2 className="text-3xl font-bold mb-6">Sleeping at {airportName}: Your Complete Rest Guide</h2>

        <div className="bg-gray-50 border-l-4 border-gray-300 p-6 mb-8 rounded-r-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Can you sleep in {airportName}?</h3>
          <div className="space-y-2 text-gray-800 leading-relaxed">
            <p>
              <strong>Availability:</strong>{" "}
              {totalFacilities > 0
                ? `Yes — ${totalFacilities} paid rest ${totalFacilities === 1 ? 'facility' : 'facilities'} on-site${infrastructureBreakdown.length > 1 ? ` (${infrastructureBreakdown.map(i => i.category).join(', ')})` : ''}.`
                : `No paid facilities. Free terminal sleeping permitted in public seating areas.`}
            </p>
            {bestOption && (
              <p>
                <strong>Best option:</strong>{" "}
                <strong>{bestOption.name}</strong>{bestOption.terminal ? ` — ${bestOption.terminal}` : ''}, {bestOption.location}.{" "}
                {bestOption.reason.charAt(0).toUpperCase() + bestOption.reason.slice(1)}.
              </p>
            )}
            <p>
              <strong>Key limitation:</strong>{" "}
              {totalFacilities === 0
                ? `No paid rest infrastructure. Free sleeping zones are your only option — quality varies significantly by terminal.`
                : transitAccess.label === 'Landside Only'
                ? `All ${totalFacilities} ${totalFacilities === 1 ? 'facility is' : 'facilities are'} landside — international transit passengers must clear immigration and hold a valid entry visa.`
                : transitAccess.label === 'Partial Airside Access'
                ? `${totalLandside} of ${totalFacilities} facilities require immigration clearance. Stick to the ${totalAirside} airside ${totalAirside === 1 ? 'option' : 'options'} to avoid visa complications.`
                : totalFacilities === 1
                ? `Single facility — if fully booked, no paid fallback exists. Book in advance and identify a free-sleeping backup zone.`
                : airportTier.tone === 'limited'
                ? `Only ${totalFacilities} options available. Inventory fills fast during peak travel; always book ahead.`
                : `${transitAccess.label} — ${totalAirside} visa-free ${totalAirside === 1 ? 'option' : 'options'} available.`}
            </p>
            {isMinimalAirport && strongerAlternatives.length > 0 && (
              <p className="text-sm text-gray-600">
                <strong>Stronger alternatives:</strong>{" "}
                {strongerAlternatives.slice(0, 2).map((a, idx) => (
                  <span key={a.airportCode}>
                    <Link to={`/airport/${a.slug}`}>{a.airportName}</Link> ({a.facilities} facilities)
                    {idx === 0 && strongerAlternatives.length > 1 ? ', ' : ''}
                  </span>
                ))}.
              </p>
            )}
          </div>
        </div>

        {airportTier.tone === 'limited' && totalFacilities < 3 && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-5 mb-6 rounded-r-lg">
            <p className="font-bold text-amber-900 mb-1">
              {totalFacilities === 0 ? 'No paid sleep facilities at this airport' : `Only ${totalFacilities} paid sleep ${totalFacilities === 1 ? 'facility' : 'facilities'} here`}
            </p>
            <p className="text-amber-800 text-sm leading-relaxed">
              {totalFacilities === 0
                ? `${airportName} has no dedicated rest options. Bring a travel pillow and neck support, arrive early to claim padded bench seating near quiet gates, and set phone alarms—terminal announcements continue overnight.`
                : `Inventory fills fast. Book ${bestOption ? bestOption.name : 'the available facility'} in advance—during peak seasons, a single sold-out option leaves no paid fallback. Have a free-sleeping backup zone identified before arrival.`
              }{" "}
              {strongerAlternatives.length > 0 && (
                <>
                  For consistent rest quality, route future connections through{" "}
                  {strongerAlternatives.slice(0, 2).map((a, idx) => (
                    <span key={a.airportCode}>
                      <Link to={`/airport/${a.slug}`}>{a.airportName}</Link>{idx === 0 && strongerAlternatives.length > 1 ? ' or ' : ''}
                    </span>
                  ))} ({strongerAlternatives[0].facilities}+ facilities).
                </>
              )}
            </p>
          </div>
        )}

        {airportTier.tone === 'premium' && totalFacilities > 8 && (
          <div className="bg-green-50 border-l-4 border-green-600 p-5 mb-6 rounded-r-lg">
            <p className="font-bold text-green-900 mb-1">World-class layover sleep infrastructure</p>
            <p className="text-green-800 text-sm leading-relaxed">
              {airportName} ranks among the top global airports for in-terminal rest. With {totalFacilities} facilities{transitFriendly ? ` (${totalAirside} visa-free airside)` : ''}, redundancy is built in—if your preferred option is fully booked, alternatives exist within the same terminals.{" "}
              Optimize your stay: match facility type to layover length ({hasSleepPods ? 'pods for under 4 hours' : 'private rooms for short stays'}, {hasTransitHotels ? 'transit hotels for 6+ hour overnights' : 'lounges for extended waits'}), book at least 24 hours ahead during peak seasons, and use airside options to skip immigration queues entirely.
            </p>
          </div>
        )}

        {totalFacilities > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-blue-900 mb-4">
              {airportCode} Sleep Infrastructure Overview
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-blue-200">
                <span className="font-semibold text-gray-900">Classification:</span>
                <span className={`font-bold ${airportTier.tone === 'premium' ? 'text-green-700' : airportTier.tone === 'moderate' ? 'text-blue-700' : 'text-orange-700'}`}>
                  {airportTier.label}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-blue-200">
                <span className="font-semibold text-gray-900">Total Facilities:</span>
                <span className="font-bold text-gray-900">{totalFacilities}</span>
              </div>
              <div className="pb-2 border-b border-blue-200">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Transit Access:</span>
                  <span className={`font-bold ${transitAccess.color}`}>{transitAccess.label}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{transitAccess.detail}</p>
              </div>
              {dominantFacilityType.count > 0 && (
                <div className="flex items-center justify-between pb-2 border-b border-blue-200">
                  <span className="font-semibold text-gray-900">Primary Facility Type:</span>
                  <span className="font-bold text-blue-800">
                    <Link to={dominantFacilityType.link}>{dominantFacilityType.type}</Link>
                  </span>
                </div>
              )}
              {bestOption && (
                <div className="flex items-center justify-between pb-2 border-b border-blue-200">
                  <span className="font-semibold text-gray-900">Top Recommendation:</span>
                  <span className="font-bold text-gray-900">{bestOption.name}{bestOption.location === 'airside' ? ' (airside)' : ''}</span>
                </div>
              )}
              {totalAirside > 0 && (
                <div className="flex items-center justify-between pb-2 border-b border-blue-200">
                  <span className="font-semibold text-gray-900">Airside Options:</span>
                  <span className="font-bold text-green-700">{totalAirside} (visa-free)</span>
                </div>
              )}
              {totalLandside > 0 && (
                <div className="flex items-center justify-between pb-2 border-b border-blue-200">
                  <span className="font-semibold text-gray-900">Landside Options:</span>
                  <span className="font-bold text-orange-700">{totalLandside} (immigration required)</span>
                </div>
              )}

              {infrastructureBreakdown.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="font-semibold text-gray-900 mb-2">Facility Breakdown:</p>
                  <ul className="space-y-2 ml-4">
                    {infrastructureBreakdown.map((item) => (
                      <li key={item.category} className="text-gray-800">
                        <strong>
                          <Link to={item.link}>{item.category}</Link>
                        </strong>: {item.total} total
                        {item.airside > 0 && <span className="text-green-700"> • {item.airside} airside</span>}
                        {item.landside > 0 && <span className="text-orange-700"> • {item.landside} landside</span>}
                        <div className="text-sm text-gray-600 ml-2">
                          {item.examples.join(', ')}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {bestOption && (
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8 rounded-r-lg">
            <h3 className="text-xl font-bold text-blue-900 mb-3">Best Place to Sleep at {airportCode}</h3>
            <p className="text-gray-800 leading-relaxed mb-2">
              <strong>{bestOption.name}</strong>
              {bestOption.terminal && ` (${bestOption.terminal}, ${bestOption.location})`} ranks as the optimal sleeping choice at {airportName} because {bestOption.reason}.{" "}
              {totalFacilities > 1
                ? `While ${airportCode} operates ${totalFacilities} total rest facilities, this option balances accessibility, comfort, and value for most transit scenarios.`
                : "This facility stands as the primary professional rest solution at this airport."}{" "}
              {facilityAnalysis.airsidePods.length + facilityAnalysis.airsideHotels.length + facilityAnalysis.airsideRooms.length > 1 ? (
                <>
                  Compare all{" "}
                  <strong>
                    <Link to={`/airports/${airportCode.toLowerCase()}`}>airside sleeping options at {airportCode}</Link>
                  </strong>{" "}
                  to match your specific layover duration and budget.
                </>
              ) : airportTier.tone === 'limited' ? (
                <>
                  Airports with stronger infrastructure:{" "}
                  {smartComparisonAirports.slice(0, 2).map((airport, idx) => (
                    <span key={airport.airportCode}>
                      <Link to={`/airport/${airport.slug}`}>{airport.airportName}</Link> ({airport.facilities} facilities)
                      {idx === 0 && ", "}
                    </span>
                  ))}.
                </>
              ) : (
                <>
                  Browse the full{" "}
                  <strong><Link to={bestOption.link}>{bestOption.type.toLowerCase()} directory</Link></strong>{" "}
                  for similar options at other airports.
                </>
              )}
            </p>
          </div>
        )}

        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">Layover Strategy Guide: {airportCode}</h3>
          {facilityConstraints.visaNote && (
            <p className="text-sm text-orange-800 bg-orange-50 border border-orange-200 rounded px-4 py-2 mb-4">
              <strong>Visa note:</strong> {facilityConstraints.visaNote}{' '}
              <a href="https://www.visainfoguide.com" target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-2 hover:text-orange-600">
                Check visa requirements at visainfoguide.com
              </a>.
            </p>
          )}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className={`rounded-lg p-5 border ${!facilityConstraints.hasAny ? 'bg-gray-50 border-gray-200' : facilityConstraints.hasSleepPods || facilityConstraints.hasPrivateRooms ? 'bg-sky-50 border-sky-200' : 'bg-gray-50 border-gray-200'}`}>
              <p className="font-bold text-gray-900 mb-1 text-sm uppercase tracking-wide">Under 4 Hours</p>
              <p className="text-gray-700 text-sm leading-relaxed">
                {facilityConstraints.hasSleepPods ? (
                  <>
                    Book <strong>{facilityConstraints.sleepPods[0].name}</strong>{facilityConstraints.sleepPods[0].terminal ? ` in ${facilityConstraints.sleepPods[0].terminal}` : ''} for 1–3 hours ($20–80).{" "}
                    {facilityConstraints.airsidePods.length > 0 ? 'Located airside — no immigration needed.' : facilityConstraints.isLandsideOnly ? 'Landside — confirm visa before booking.' : ''}{" "}
                    Best short-layover option at {airportCode}: private, hourly, and walkable from most gates.
                  </>
                ) : facilityConstraints.hasLounges ? (
                  <>
                    Use <strong>{facilityConstraints.lounges[0].name}</strong>{facilityConstraints.lounges[0].terminal ? ` (${facilityConstraints.lounges[0].terminal})` : ''} — day pass $30–60.{" "}
                    {facilityConstraints.isLandsideOnly ? 'Requires clearing immigration first.' : 'Accessible after security.'}{" "}
                    {facilityConstraints.hasTransitHotels ? `Skip the transit hotel for under 4h — minimum block pricing makes it poor value at this window.` : `No sleep pods at ${airportCode}; lounge recliners are your best private rest option.`}
                  </>
                ) : facilityConstraints.hasTransitHotels ? (
                  <>
                    <strong>{facilityConstraints.transitHotels[0].name}</strong> requires a 3h minimum block ($75–120).{" "}
                    {facilityConstraints.isLandsideOnly ? 'Landside access — visa required.' : facilityConstraints.airsideHotels.length > 0 ? 'Airside — no immigration needed.' : ''}{" "}
                    {facilityConstraints.singleFacility ? `Only paid option at ${airportCode}; worthwhile for genuine sleep before tight connections.` : `Only transit hotels available — minimum block pricing is steep for under 4h.`}
                  </>
                ) : (
                  <>No paid facilities at {airportCode} for this window. Arrive early to claim padded bench seating near quiet departure gates. Bring eye mask and earplugs — PA announcements and terminal lights run overnight.</>
                )}
              </p>
            </div>
            <div className={`rounded-lg p-5 border ${!facilityConstraints.hasAny ? 'bg-gray-50 border-gray-200' : facilityConstraints.hasTransitHotels || facilityConstraints.hasLounges ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'}`}>
              <p className="font-bold text-gray-900 mb-1 text-sm uppercase tracking-wide">4–8 Hours</p>
              <p className="text-gray-700 text-sm leading-relaxed">
                {facilityConstraints.hasTransitHotels ? (
                  <>
                    Book <strong>{facilityConstraints.transitHotels[0].name}</strong>{facilityConstraints.transitHotels[0].terminal ? ` (${facilityConstraints.transitHotels[0].terminal})` : ''} for 4–6h ($100–200).{" "}
                    {facilityConstraints.airsideHotels.length > 0 ? 'Airside — skip immigration entirely.' : facilityConstraints.isLandsideOnly ? 'Landside — entry visa required.' : ''}{" "}
                    Full bed, private bathroom, walk back to gates in under 5 minutes. Optimal window for this facility type at {airportCode}.
                  </>
                ) : facilityConstraints.hasLounges ? (
                  <>
                    <strong>{facilityConstraints.lounges[0].name}</strong> day pass ($40–80) covers this full window — eat, shower, and recline without hourly billing.{" "}
                    {facilityConstraints.hasSleepPods ? `Combine with a ${facilityConstraints.sleepPods[0].name} pod block if you need private horizontal sleep on top of the lounge amenities.` : `No sleep pods at ${airportCode} — lounge recliners are your deepest available rest option.`}{" "}
                    {facilityConstraints.isLandsideOnly ? 'Visa required to access.' : ''}
                  </>
                ) : facilityConstraints.hasSleepPods ? (
                  <>
                    Book <strong>{facilityConstraints.sleepPods[0].name}</strong> for a 3–4h block ($60–120).{" "}
                    {facilityConstraints.airsidePods.length > 0 ? 'No immigration needed.' : 'Landside — verify visa.'}{" "}
                    No transit hotel at {airportCode}, so pods are the ceiling for private rest quality at this duration. Reserve ahead — limited units sell out during peak hours.
                  </>
                ) : (
                  <>No paid facilities at {airportCode} for extended layovers. International gate zones are typically quieter than domestic. Secure a charging station spot early and rotate between rest and walking every 90 minutes to manage fatigue.</>
                )}
              </p>
            </div>
            <div className={`rounded-lg p-5 border ${!facilityConstraints.hasAny ? 'bg-gray-50 border-gray-200' : facilityConstraints.hasTransitHotels ? 'bg-slate-50 border-slate-200' : 'bg-gray-50 border-gray-200'}`}>
              <p className="font-bold text-gray-900 mb-1 text-sm uppercase tracking-wide">Overnight (8+ Hours)</p>
              <p className="text-gray-700 text-sm leading-relaxed">
                {facilityConstraints.hasTransitHotels ? (
                  <>
                    Book <strong>{facilityConstraints.transitHotels[0].name}</strong>{facilityConstraints.transitHotels[0].terminal ? ` (${facilityConstraints.transitHotels[0].terminal})` : ''} for a full overnight block (8h, $150–300).{" "}
                    {facilityConstraints.airsideHotels.length > 0 ? 'Airside — no visa needed, walk from arrival gate directly.' : facilityConstraints.isLandsideOnly ? 'Landside — factor immigration time into your schedule.' : ''}{" "}
                    {facilityConstraints.singleFacility ? `This is the only paid option at ${airportCode} — book early, especially during peak travel seasons.` : `${totalFacilities} facilities available; transit hotel is the best-quality choice for overnight rest at ${airportCode}.`}
                  </>
                ) : facilityConstraints.hasSleepPods && facilityConstraints.hasLounges ? (
                  <>
                    No transit hotel at {airportCode}. Best overnight strategy: book <strong>{facilityConstraints.sleepPods[0].name}</strong> for 5–6h sleep, then use <strong>{facilityConstraints.lounges[0].name}</strong> for morning shower and meal before departure.{" "}
                    {facilityConstraints.isLandsideOnly ? 'Both require immigration clearance.' : facilityConstraints.isPartialAirside ? 'Check individual airside/landside status before booking.' : ''}
                  </>
                ) : facilityConstraints.hasLounges ? (
                  <>
                    No transit hotel or sleep pods at {airportCode}. <strong>{facilityConstraints.lounges[0].name}</strong> day pass covers food, shower, and recliner rest for the full overnight — sleep quality is lighter than a hotel bed but better than open terminal seating.{" "}
                    {facilityConstraints.isLandsideOnly ? 'Visa required to access.' : ''}
                  </>
                ) : facilityConstraints.hasSleepPods ? (
                  <>
                    No transit hotel at {airportCode}. Book <strong>{facilityConstraints.sleepPods[0].name}</strong> for the longest available block.{" "}
                    {facilityConstraints.airsidePods.length > 0 ? 'Airside — no immigration.' : 'Landside — verify visa.'}{" "}
                    For the remaining time, secure a quiet gate zone with power outlets. This is the infrastructure ceiling at {airportCode} for overnight stays.
                  </>
                ) : (
                  <>No paid facilities at {airportCode} for overnight stays. Use landside international zones — quieter after midnight. Carry a compact blanket and luggage lock. Security will not remove sleeping passengers. Set multiple phone alarms.</>
                )}
              </p>
            </div>
          </div>
        </div>

        {!isMinimalAirport && <p>
          {contentVariations.variation === 0 ? (
            <>
              Facing an overnight layover at {airportName} ({airportCode})? Strategic travelers know that quality rest between flights doesn't require leaving the airport or booking overpriced nearby hotels. {totalFacilities > 0 ? (
                <>
                  This hub features {totalFacilities} dedicated sleeping {totalFacilities === 1 ? 'facility' : 'facilities'}{" "}
                  {bestOption && (
                    <>
                      led by <strong>{bestOption.name}</strong>
                      {bestOption.terminal && ` in ${bestOption.terminal}`}
                    </>
                  )},{" "}
                  {hasAirsideOptions && `with ${totalAirside} accessible airside for visa-free transit sleeping.`}
                  {" "}{airportTier.tone === 'premium' ? (
                    <>This positions {airportCode} as a world-class sleep airport rivaling Singapore and Seoul.</>
                  ) : airportTier.tone === 'moderate' ? (
                    <>This moderate selection handles typical layovers but doesn't match Singapore's 11-facility ecosystem or Seoul's extensive terminal-specific infrastructure.</>
                  ) : (
                    <>Compared to world-class hubs like Singapore Changi (11 facilities) or Seoul Incheon (11 facilities), {airportCode} offers substantially fewer professional rest options.</>
                  )}
                </>
              ) : (
                <>This major airport accommodates transit passengers but lacks dedicated rest infrastructure. Unlike Singapore (11 sleep facilities across all terminals) or Seoul Incheon (11 dedicated zones with clear wayfinding), {airportCode} relies on free public seating.</>
              )}{" "}
              {totalFacilities > 0 ? (
                <>
                  Options range from{" "}
                  {hasSleepPods ? (
                    <>
                      cutting-edge{" "}
                      <strong>
                        <Link to="/sleep-pods">sleep pods</Link>
                      </strong>{" "}
                      with climate control
                    </>
                  ) : (
                    "comfortable terminal rest zones"
                  )} to{" "}
                  {hasTransitHotels ? (
                    <>
                      full-service{" "}
                      <strong>
                        <Link to="/transit-hotels">transit hotels</Link>
                      </strong>{" "}
                      with actual beds
                    </>
                  ) : hasLounges ? (
                    <>
                      premium{" "}
                      <strong>
                        <Link to="/lounge-sleep">lounges</Link>
                      </strong>{" "}
                      offering recliners
                    </>
                  ) : (
                    "free sleeping areas"
                  )}.
                </>
              ) : (
                <>Compare against better-equipped hubs in our airports database to optimize future routing.</>
              )}{" "}
              Understanding where and how to sleep at {airportCode} transforms exhausting layovers into productive rest periods.
            </>
          ) : contentVariations.variation === 1 ? (
            <>
              Airport sleeping at {airportName} ({airportCode}) has evolved far beyond camping on hard benches near departure gates.{" "}
              {totalFacilities > 0 ? (
                <>
                  With {totalFacilities} purpose-built rest {totalFacilities === 1 ? 'facility' : 'facilities'} now operating{" "}
                  {bestOption?.terminal ? (
                    <>
                      across terminals including <strong>{bestOption.name}</strong> in {bestOption.terminal}
                    </>
                  ) : (
                    "across terminals"
                  )}
                  {hasAirsideOptions && (
                    <>
                      , transit passengers access {totalAirside} visa-free airside options
                    </>
                  )}
                  {airportTier.tone === 'premium' ? (
                    <>, {airportCode} ranks among the world's elite for layover sleeping, comparable to Singapore and Doha</>
                  ) : airportTier.tone === 'moderate' ? (
                    <>, {airportCode} provides adequate coverage but lacks the terminal-specific redundancy seen at top-tier airports like Dubai (6 facilities) or Seoul (11 facilities)</>
                  ) : (
                    <>, {airportCode}'s minimal infrastructure falls short of world-class standards set by Singapore (11 facilities, multiple per terminal) and Seoul (11 facilities, distributed strategically)</>
                  )}
                </>
              ) : (
                "While dedicated facilities remain limited compared to global leaders like Singapore Changi (sleep pods in every terminal) or Doha Hamad (4 airside hotels)"
              )}, transit passengers can access{" "}
              {hasSleepPods ? (
                <>
                  private{" "}
                  <strong>
                    <Link to="/sleep-pods">sleep pods</Link>
                  </strong>{" "}
                  for quick power naps
                </>
              ) : (
                "quiet rest areas"
              )},{" "}
              {hasTransitHotels ? (
                <>
                  hourly-rate{" "}
                  <strong>
                    <Link to="/transit-hotels">transit hotels</Link>
                  </strong>{" "}
                  eliminating check-in hassles
                </>
              ) : (
                "nearby accommodations"
              )},{" "}
              {hasLounges ? (
                <>
                  and premium{" "}
                  <strong>
                    <Link to="/lounge-sleep">lounges</Link>
                  </strong>{" "}
                  combining comfort with amenities
                </>
              ) : (
                "or comfortable public seating zones"
              )}. Whether you're budget-focused or prioritizing maximum rest quality, {airportCode} provides legitimate sleeping solutions that beat suffering through red-eye connections in metal airport chairs.
            </>
          ) : (
            <>
              Planning sleep during a {airportName} ({airportCode}) layover requires understanding your options before arrival. This international airport{" "}
              {totalFacilities > 0 ? (
                <>
                  supports travelers with {totalFacilities} professional rest {totalFacilities === 1 ? 'facility' : 'facilities'}{" "}
                  {bestOption && (
                    <>
                      including <strong>{bestOption.name}</strong>
                      {bestOption.terminal && ` in ${bestOption.terminal}`}
                    </>
                  )},{" "}
                  {hasAirsideOptions && `${totalAirside} positioned airside for visa-free transit access,`}
                  {airportTier.tone === 'premium' ? (
                    <> establishing {airportCode} as a premier global layover hub with sleep infrastructure matching the world's best</>
                  ) : airportTier.tone === 'moderate' ? (
                    <> providing moderate coverage that handles most scenarios but doesn't achieve the facility density of premier hubs like Singapore (11 facilities distributed across 4 terminals) or Doha (4 airside hotels in centralized location)</>
                  ) : (
                    <> though this falls significantly short of world-class airports like Singapore Changi (11 facilities with multiple pods per terminal) or Seoul Incheon (11 facilities spanning all concourses)</>
                  )}
                </>
              ) : (
                <>allows overnight terminal access but lacks dedicated infrastructure found at leading airports. For context, Singapore Changi operates sleep pods in every terminal, Doha Hamad features 4 airside transit hotels, and Munich provides 3 dedicated sleep zones—{airportCode} offers none of these professional options</>
              )}{" "}
              including{" "}
              {hasSleepPods ? (
                <>
                  modern{" "}
                  <strong>
                    <Link to="/sleep-pods">sleep pod technology</Link>
                  </strong>{" "}
                  offering privacy
                </>
              ) : (
                "designated rest zones"
              )},{" "}
              {hasTransitHotels ? (
                <>
                  convenient{" "}
                  <strong>
                    <Link to="/transit-hotels">transit hotels</Link>
                  </strong>{" "}
                  with flexible booking
                </>
              ) : hasPrivateRooms ? (
                <>
                  <strong>
                    <Link to="/private-rooms">private sleeping rooms</Link>
                  </strong>{" "}
                  with secure access
                </>
              ) : (
                "free sleeping alternatives"
              )}, and{" "}
              {hasLounges ? (
                <>
                  <strong>
                    <Link to="/lounge-sleep">lounge networks</Link>
                  </strong>{" "}
                  providing recliners and showers
                </>
              ) : (
                "various seating configurations"
              )}. Smart layover management at {airportCode} means matching facility type to your connection duration, budget constraints, and visa status.
            </>
          )}
        </p>}

        {!isMinimalAirport && (
        <><h3 className="text-2xl font-semibold mt-8 mb-4">
          {hasTransitHotels ? "Transit Hotels: Premium Rest Without Leaving the Airport" : "Transit Hotel Alternatives at This Airport"}
        </h3>

        <p>
          {hasTransitHotels ? (
            contentVariations.variation === 0 ? (
              <>
                {airportName} operates {facilityAnalysis.transitHotels.length}{" "}
                <strong>
                  <Link to="/transit-hotels">transit hotel</Link>
                </strong>{" "}
                {facilityAnalysis.transitHotels.length > 1 ? "facilities" : "facility"} including <strong>{facilityAnalysis.transitHotels[0].name}</strong>
                {facilityAnalysis.transitHotels[0].terminal && ` in ${facilityAnalysis.transitHotels[0].terminal}`},{" "}
                {facilityAnalysis.airsideHotels.length > 0
                  ? `${facilityAnalysis.airsideHotels.length === facilityAnalysis.transitHotels.length ? 'all' : `${facilityAnalysis.airsideHotels.length}`} strategically positioned airside for visa-free access`
                  : `${facilityAnalysis.landsideHotels.length} positioned landside requiring immigration clearance`}. These establishments revolutionize airport sleeping by offering legitimate hotel rooms—private spaces with actual mattresses, blackout curtains, temperature control, soundproofing, and ensuite bathrooms—charged by the hour rather than full nights. Book 3-hour minimums ($75-150) for short connections or 6-8 hour blocks ($150-250) for extended layovers, avoiding the expense and hassle of traditional city hotels requiring baggage reclaim, security re-screening, and uncertain shuttle timing.{" "}
                {airportTier.tone === 'premium' ? (
                  <>This positions {airportCode} alongside premier layover hubs—contrast this against limited airports lacking any hotel infrastructure.</>
                ) : airportTier.tone === 'moderate' ? (
                  <>While functional, this modest selection doesn't match Singapore Changi's multiple branded transit hotels (YOTELAIR, Ambassador Transit Hotel, Aerotel) distributed across terminals for gate-proximity optimization.</>
                ) : (
                  <>Contrast this single option against Singapore Changi (3 airside transit hotels across terminals), Doha Hamad (multiple hotel brands with 24-hour reception), or Istanbul (2 landside hotels with dedicated shuttle service from every concourse).</>
                )}{" "}
                {facilityAnalysis.transitHotels.length > 1 ? (
                  <>
                    Compare {airportCode}'s multiple{" "}
                    <strong>
                      <Link to="/transit-hotels">transit hotel options</Link>
                    </strong>{" "}
                    by terminal location and amenities.
                  </>
                ) : (
                  <>
                    Research similar facilities at better-equipped airports like{" "}
                    {comparisonAirports.filter(a => ['SIN', 'DOH', 'IST', 'AMS'].includes(a.airportCode)).slice(0, 2).map((airport, idx) => (
                      <span key={airport.airportCode}>
                        <Link to={`/airport/${airport.slug}`}>{airport.airportName}</Link>
                        {idx === 0 && " and "}
                      </span>
                    ))}{" "}
                    in our{" "}
                    <strong>
                      <Link to="/airports">airports directory</Link>
                    </strong>.
                  </>
                )}
              </>
            ) : contentVariations.variation === 1 ? (
              <>
                Transit hotel infrastructure at {airportCode} includes {facilityAnalysis.transitHotels.length} dedicated facility location{facilityAnalysis.transitHotels.length > 1 ? "s" : ""} like <strong>{facilityAnalysis.transitHotels[0].name}</strong>
                {facilityAnalysis.transitHotels[0].terminal && ` in ${facilityAnalysis.transitHotels[0].terminal}`},{" "}
                {facilityAnalysis.airsideHotels.length > 0
                  ? `${facilityAnalysis.airsideHotels.length === facilityAnalysis.transitHotels.length ? 'all' : `${facilityAnalysis.airsideHotels.length}`} positioned after security for visa-free international transit`
                  : `all located landside requiring immigration processing and visa eligibility`}. Unlike conventional hotels demanding full-night bookings, minimum stays, and time-consuming commutes,{" "}
                <strong>
                  <Link to="/transit-hotels">transit hotels at airports</Link>
                </strong>{" "}
                operate on flexible hourly pricing (typically 3-6 hour blocks). Pay only for actual sleep time needed during {airportName} layovers—ideal for 4-10 hour connections where traditional accommodation options waste valuable rest hours on transportation logistics.{" "}
                {airportTier.tone === 'premium' ? (
                  <>This extensive hotel coverage matches elite global standards.</>
                ) : airportTier.tone === 'moderate' ? (
                  <>This modest infrastructure works for basic needs but pales against Singapore's 3 transit hotels (YOTELAIR Terminal 1 near gates A1-A20, Ambassador Transit Hotel Terminal 3 post-security, Crowne Plaza Changi Terminal 3 within walking tubes) offering location redundancy.</>
                ) : (
                  <>Contrast this minimal offering against Doha Hamad (multiple transit hotels including Oryx Airport Hotel with direct terminal integration), Istanbul (YOTEL and ISG Airport Hotel spanning both international piers), or even smaller hubs like Munich (3 distinct sleep zones including Napcabs and My Cloud Transit Hotel).</>
                )}{" "}
                {facilityAnalysis.transitHotels.length > 1 ? (
                  <>
                    Review specific amenities and pricing for each {airportCode} location through our{" "}
                    <strong>
                      <Link to={`/airports/${airportCode.toLowerCase()}`}>detailed facility breakdown</Link>
                    </strong>.
                  </>
                ) : (
                  <>
                    Compare against airports with extensive transit hotel networks like{" "}
                    {comparisonAirports.filter(a => ['SIN', 'DOH', 'IST', 'ICN'].includes(a.airportCode)).slice(0, 2).map((airport, idx) => (
                      <span key={airport.airportCode}>
                        <Link to={`/airport/${airport.slug}`}>{airport.airportName}</Link>
                        {idx === 0 && " and "}
                      </span>
                    ))}{" "}
                    through our{" "}
                    <strong>
                      <Link to="/airports">comprehensive guide</Link>
                    </strong>.
                  </>
                )}
              </>
            ) : (
              <>
                When most travelers imagine airport hotels, they picture off-site properties requiring shuttle buses, security re-entry, and minimum overnight charges. {airportCode}'s {facilityAnalysis.transitHotels.length}{" "}
                <strong>
                  <Link to="/transit-hotels">in-terminal transit hotel</Link>
                </strong>{" "}
                {facilityAnalysis.transitHotels.length > 1 ? 'locations' : 'facility'} like <strong>{facilityAnalysis.transitHotels[0].name}</strong>
                {facilityAnalysis.transitHotels[0].terminal && ` (${facilityAnalysis.transitHotels[0].terminal})`} operate differently: walk directly from your arrival gate, book exactly the hours you need (3-hour minimums common), and return to departures in minutes. Rooms include everything you'd expect from mid-range business hotels—comfortable beds with fresh linens, private bathrooms with toiletries, climate control, blackout curtains, alarm service, and WiFi—minus the commute, baggage hassle, and inflated overnight pricing.{" "}
                {facilityAnalysis.airsideHotels.length > 0
                  ? `Located ${facilityAnalysis.airsideHotels.length === facilityAnalysis.transitHotels.length ? 'entirely' : 'partially'} airside, ${facilityAnalysis.airsideHotels.length === facilityAnalysis.transitHotels.length ? 'all facilities eliminate' : 'some options eliminate'} visa barriers for international transit passengers.`
                  : "All facilities require clearing immigration, making visa status crucial for international transit passengers."}{" "}
                {airportTier.tone === 'premium' ? (
                  <>This matches or exceeds infrastructure at renowned sleep airports worldwide.</>
                ) : airportTier.tone === 'moderate' ? (
                  <>While serviceable, this setup doesn't achieve the convenience density of Singapore Changi (3 branded transit hotels, each near different gate clusters for minimized walking) or Doha (centrally located with elevator access from all concourses).</>
                ) : (
                  <>Compare against Singapore's distributed approach (YOTELAIR post-security Terminal 1, Ambassador Transit Hotel connecting terminals 2-3, Crowne Plaza attached to Terminal 3) or Doha's centralized Oryx Hotel accessible from any gate within 5 minutes—{airportCode} operates at a fraction of this scale.</>
                )}
              </>
            )
          ) : (
            <>
              {airportName} lacks dedicated{" "}
              <strong>
                <Link to="/transit-hotels">transit hotels</Link>
              </strong>{" "}
              inside terminal buildings—a significant gap for layover travelers seeking quality rest. Transit hotels revolutionize airport sleeping by offering hourly hotel rooms you can walk to directly from your gate: no shuttles, no baggage reclaim, no wasted commute time. Book exactly the sleep hours needed (typically 3-6 hour blocks, $75-200), use the ensuite bathroom and shower, set the room alarm, and return to your departure gate refreshed.{" "}
              {hasSleepPods ? (
                <>
                  {airportCode} does feature {facilityAnalysis.sleepPods.length}{" "}
                  <strong>
                    <Link to="/sleep-pods">sleep pod</Link>
                  </strong>{" "}
                  {facilityAnalysis.sleepPods.length > 1 ? 'locations' : 'location'} offering similar privacy benefits at lower price points.
                </>
              ) : hasLounges ? (
                <>
                  Alternative rest comes via {facilityAnalysis.lounges.length}{" "}
                  <strong>
                    <Link to="/lounge-sleep">lounge</Link>
                  </strong>{" "}
                  {facilityAnalysis.lounges.length > 1 ? 'facilities' : 'facility'} with reclining chairs and shower access, though these lack the enclosed sleeping rooms and soundproofing of proper transit hotels.
                </>
              ) : (
                <>Free sleeping requires using terminal benches and public zones, which pale against the convenience and rest quality of dedicated hotel infrastructure.</>
              )}{" "}
              Airports leading in transit hotel innovation include{" "}
              {comparisonAirports.filter(a => ['SIN', 'DOH', 'IST', 'MUC'].includes(a.airportCode)).slice(0, 3).map((airport, idx) => (
                <span key={airport.airportCode}>
                  <Link to={`/airport/${airport.slug}`}>{airport.airportName}</Link>
                  {idx < 2 && (idx === 1 ? ', and ' : ', ')}
                </span>
              ))}—explore our{" "}
              <strong>
                <Link to="/airports">airports database</Link>
              </strong>{" "}
              to find these options along your typical routes for future trip optimization.
            </>
          )}
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">
          {hasSleepPods ? "Sleep Pods and Private Nap Rooms" : "Airport Sleep Pod Availability"}
        </h3>

        <p>
          {hasSleepPods ? (
            contentVariations.variation === 0 ? (
              <>
                Modern sleep pod technology arrives at {airportCode} through {facilityAnalysis.sleepPods.length}{" "}
                <strong>
                  <Link to="/sleep-pods">dedicated installations</Link>
                </strong>{" "}
                including <strong>{facilityAnalysis.sleepPods[0].name}</strong>
                {facilityAnalysis.sleepPods[0].terminal && ` (${facilityAnalysis.sleepPods[0].terminal})`}. These compact private capsules deliver maximum rest efficiency: fully reclining seats or beds, sound insulation, climate controls, USB charging, and secure luggage storage, all bookable by the hour ($15-40 typical) without hefty minimum stays. Unlike traditional hotels demanding full nights and off-airport commutes, or lounges forcing you to rest in semi-public spaces, sleep pods optimize the 2-6 hour layover window where you need genuine sleep but lack time for external accommodations.{" "}
                {facilityAnalysis.airsidePods.length > 0
                  ? `${facilityAnalysis.airsidePods.length === facilityAnalysis.sleepPods.length ? 'All' : `${facilityAnalysis.airsidePods.length}`} ${facilityAnalysis.sleepPods.length > 1 ? 'operate' : 'operates'} airside at {airportName}, accessible without visa requirements—critical for international transit passengers.`
                  : `Located landside, these require clearing immigration and appropriate visas.`}{" "}
                {airportTier.tone === 'premium' ? (
                  <>This pod infrastructure rivals world-class airports.</>
                ) : airportTier.tone === 'moderate' ? (
                  <>While functional, this modest deployment doesn't achieve the coverage density of Singapore Changi (GoSleep pods in Terminals 1, 2, and 3) or Helsinki (16 GoSleep pods distributed strategically near gates).</>
                ) : (
                  <>Contrast {airportCode}'s limited selection against Singapore Changi (GoSleep pods in 3 terminals plus Ambassador Transit Hotel capsules), Helsinki (16 GoSleep pods spread across concourses), or Dubai (multiple sleep pod zones in Terminal 3 near Emirates gates).</>
                )}{" "}
                Typical use cases: 3-hour nap between morning connections ($45-80), overnight 6-hour sleep during red-eyes ($90-180), or quick 1-hour power rest during delays ($20-40).
              </>
            ) : contentVariations.variation === 1 ? (
              <>
                Sleep pods at {airportName} solve the layover rest equation through focused engineering: private capsules designed exclusively for quality sleep without traditional hotel overhead. {airportCode}'s {facilityAnalysis.sleepPods.length} installation{facilityAnalysis.sleepPods.length > 1 ? 's' : ''} include <strong>{facilityAnalysis.sleepPods[0].name}</strong>
                {facilityAnalysis.sleepPods[0].terminal && ` in ${facilityAnalysis.sleepPods[0].terminal}`}, offering{" "}
                {facilityAnalysis.sleepPods.some(p => p.name.toLowerCase().includes('gosleep'))
                  ? "reclined ergonomic chairs with leather padding, adjustable reading lights, and pull-down privacy shades"
                  : facilityAnalysis.sleepPods.some(p => p.name.toLowerCase().includes('minute suite'))
                  ? "full private suites with daybed sofas, work desks, and attached bathrooms"
                  : "enclosed rest spaces with controlled lighting and charging capabilities"}. Pricing runs hourly or in short blocks, matching your exact connection window rather than forcing 8-12 hour minimum bookings.{" "}
                {facilityAnalysis.airsidePods.length > 0
                  ? `${facilityAnalysis.airsidePods.length === facilityAnalysis.sleepPods.length ? 'Complete' : 'Partial'} airside placement at {airportCode} means no customs lines, no visa stress, no terminal exits—walk from your arrival gate, sleep 2-4 hours, and proceed directly to departures.`
                  : "These pods sit landside, requiring visa eligibility and immigration processing that may not suit tight international connections."}{" "}
                {airportTier.tone === 'premium' ? (
                  <>This extensive pod network establishes {airportCode} as a leader for efficient layover sleeping.</>
                ) : airportTier.tone === 'moderate' ? (
                  <>This basic coverage handles typical needs but lacks redundancy—if pods are fully booked, alternatives diminish. Compare against Singapore (multiple pod brands across terminals ensuring availability) or Helsinki (16 GoSleep units providing high availability even during rush periods).</>
                ) : (
                  <>Major sleep airports deploy pods systematically: Singapore Changi (GoSleep in 3 terminals, positioned near popular gate clusters), Helsinki (16 pods distributed to minimize gate walking), Dubai (dedicated sleep zones in high-transit areas). {airportCode}'s minimal infrastructure means booking ahead becomes critical during peak travel seasons.</>
                )}{" "}
                Browse our{" "}
                <strong>
                  <Link to="/sleep-pods">comprehensive sleep pods guide</Link>
                </strong>{" "}
                to understand which pod brands suit your preferences.
              </>
            ) : (
              <>
                The {facilityAnalysis.sleepPods.length} sleep pod {facilityAnalysis.sleepPods.length > 1 ? 'installations' : 'installation'} at {airportName}, led by <strong>{facilityAnalysis.sleepPods[0].name}</strong>
                {facilityAnalysis.sleepPods[0].terminal && ` (${facilityAnalysis.sleepPods[0].terminal})`}, represent the sweet spot between free terminal sleeping and full-service transit hotels. These capsules provide genuine privacy—enclosed spaces where you control lighting, temperature, and noise—without the premium pricing of hotel rooms. Most travelers book 2-4 hour sessions: arrive exhausted from a long-haul flight, retreat to your pre-booked pod, set your phone alarm, and emerge refreshed for the next connection leg.{" "}
                {facilityAnalysis.airsidePods.length > 0 && (
                  <>
                    {facilityAnalysis.airsidePods.length === facilityAnalysis.sleepPods.length ? 'Complete airside positioning' : `${facilityAnalysis.airsidePods.length} airside option${facilityAnalysis.airsidePods.length > 1 ? 's' : ''}`} at {airportCode} {facilityAnalysis.airsidePods.length === facilityAnalysis.sleepPods.length ? 'means' : 'mean'} international passengers avoid visa complications entirely—book and access without immigration processing.{" "}
                  </>
                )}
                {airportTier.tone === 'premium' ? (
                  <>This infrastructure rivals global leaders in layover rest solutions.</>
                ) : airportTier.tone === 'moderate' ? (
                  <>Adequate for most scenarios, though this doesn't achieve the scale of Singapore (pods in every terminal with multiple units per concourse) or Helsinki (16 GoSleep units ensuring high availability even during Nordic travel peaks).</>
                ) : (
                  <>World-class sleep airports deploy 5-15 pod units: Singapore Changi (GoSleep across 3 terminals, Ambassador capsules in Terminal 3), Helsinki (16 GoSleep pods positioned by gates), Dubai (sleep lounge zones in Terminal 3). {airportCode} operates at a fraction of this capacity, making advance booking essential.</>
                )}{" "}
                Explore{" "}
                <strong>
                  <Link to={`/airports/${airportCode.toLowerCase()}`}>all pod locations at {airportCode}</Link>
                </strong>{" "}
                or compare against{" "}
                <strong>
                  <Link to="/airports">better pod-equipped airports</Link>
                </strong>{" "}
                for future routing optimization.
              </>
            )
          ) : (
            <>
              {airportName} currently operates without{" "}
              <strong>
                <Link to="/sleep-pods">sleep pod infrastructure</Link>
              </strong>—a notable absence for an international airport in the modern era. Sleep pods revolutionize layover rest by providing private capsules with beds or recliners, climate control, soundproofing, and hourly booking flexibility. Major airports deploy these strategically: Singapore Changi features GoSleep pods in Terminals 1, 2, and 3 near gate clusters, Helsinki positions 16 GoSleep units across concourses for maximum availability, Dubai maintains dedicated sleep lounges in high-transit zones. The pod advantage over free sleeping? Actual horizontal rest in darkness and quiet, versus trying to sleep upright on metal benches under fluorescent lighting and gate announcements.{" "}
              {hasTransitHotels ? (
                <>
                  {airportCode} offers {facilityAnalysis.transitHotels.length}{" "}
                  <strong>
                    <Link to="/transit-hotels">transit hotel</Link>
                  </strong>{" "}
                  {facilityAnalysis.transitHotels.length > 1 ? 'alternatives' : 'alternative'} delivering superior (but pricier) accommodation, and{" "}
                </>
              ) : hasLounges ? (
                <>
                  {facilityAnalysis.lounges.length}{" "}
                  <strong>
                    <Link to="/lounge-sleep">lounge</Link>
                  </strong>{" "}
                  {facilityAnalysis.lounges.length > 1 ? 'facilities provide' : 'facility provides'} semi-private rest in recliners (less privacy than pods but more amenities included), and{" "}
                </>
              ) : (
                "Rest infrastructure defaults to"
              )}{" "}
              free sleeping in terminal public areas remains your fallback for budget layovers. To experience proper pod sleeping, route future connections through{" "}
              {comparisonAirports.filter(a => ['SIN', 'HEL', 'DXB', 'IST'].includes(a.airportCode)).slice(0, 3).map((airport, idx) => (
                <span key={airport.airportCode}>
                  <Link to={`/airport/${airport.slug}`}>{airport.airportName}</Link>
                  {idx < 2 && (idx === 1 ? ', or ' : ', ')}
                </span>
              ))}—our{" "}
              <strong>
                <Link to="/sleep-pods">global sleep pods directory</Link>
              </strong>{" "}
              maps installations at 100+ airports worldwide to optimize your typical travel routes.
            </>
          )}
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">
          {hasLounges ? "Airport Lounges for Sleeping and Rest" : "Lounge Sleeping Options"}
        </h3>

        <p>
          {hasLounges ? (
            contentVariations.variation === 0 ? (
              <>
                {airportCode} operates {facilityAnalysis.lounges.length}{" "}
                <strong>
                  <Link to="/lounge-sleep">airport lounge</Link>
                </strong>{" "}
                {facilityAnalysis.lounges.length > 1 ? 'facilities' : 'facility'} including <strong>{facilityAnalysis.lounges[0].name}</strong>
                {facilityAnalysis.lounges[0].terminal && ` (${facilityAnalysis.lounges[0].terminal})`}, accessible via Priority Pass memberships, premium credit cards (AmEx Platinum, Chase Sapphire Reserve, Capital One Venture X), airline status, or day pass purchase ($30-80 typical). While primarily designed for pre-flight relaxation with complimentary food, drinks, WiFi, and shower facilities, these spaces double as sleeping environments through comfortable recliners, quiet zones, and dimmed lighting in designated rest areas. The value proposition: unlimited-duration access for a single day pass fee versus hourly charges at sleep pods, making lounges economical for 4+ hour layovers where you'll also eat meals and refresh.{" "}
                {facilityAnalysis.airsideLounges.length > 0
                  ? `${facilityAnalysis.airsideLounges.length === facilityAnalysis.lounges.length ? 'All' : `${facilityAnalysis.airsideLounges.length}`} ${facilityAnalysis.lounges.length > 1 ? 'operate' : 'operates'} airside at {airportName}, eliminating visa concerns for international transit passengers.`
                  : `Located landside, access requires immigration clearance.`}{" "}
                {airportTier.tone === 'premium' ? (
                  <>This extensive lounge network places {airportCode} among elite global hubs for layover comfort.</>
                ) : airportTier.tone === 'moderate' ? (
                  <>This moderate selection provides basic lounge access but doesn't match Istanbul (20+ lounges across terminals), Singapore (15+ lounge brands), or Seoul (10+ facilities spanning all concourses) for choice and availability.</>
                ) : (
                  <>Major international hubs deploy 10-20 lounges: Istanbul leads with 20+ options (Turkish Airlines, IGA, Priority Pass networks), Singapore operates 15+ branded lounges (Plaza Premium, SATS Premier, Blossom), Seoul features 10+ across terminals. {airportCode}'s limited infrastructure means less flexibility during peak periods.</>
                )}{" "}
                Lounges beat sleep pods when: you need showers + food + rest combined, your layover exceeds 5 hours making flat fees more economical than hourly rates, or your credit card already provides free access. Pods win when: you prioritize sleep quality over amenities, need guaranteed horizontal rest, or have short 2-3 hour windows where lounge day passes waste money. Review our{" "}
                <strong>
                  <Link to={`/airports/${airportCode.toLowerCase()}`}>complete {airportCode} guide</Link>
                </strong>{" "}
                to compare specific facilities.
              </>
            ) : contentVariations.variation === 1 ? (
              <>
                Airport lounges at {airportName} merge rest capabilities with premium amenities that separate travelers from basic airport seating. The {facilityAnalysis.lounges.length} lounge{facilityAnalysis.lounges.length > 1 ? 's' : ''} at {airportCode}, including <strong>{facilityAnalysis.lounges[0].name}</strong>
                {facilityAnalysis.lounges[0].terminal && ` located in ${facilityAnalysis.lounges[0].terminal}`}, typically feature dedicated quiet zones with plush recliners, shower suites with premium toiletries, complimentary buffets and full bars, high-speed WiFi, business centers with printing, and sometimes even dedicated nap rooms or sleep pods within the lounge itself. Access comes bundled: Priority Pass memberships (included with many premium credit cards), airline elite status (Gold/Platinum tiers with Star Alliance, oneworld, SkyTeam), or direct day pass purchases at the lounge entrance.{" "}
                {facilityAnalysis.airsideLounges.length > 0 && (
                  <>
                    {facilityAnalysis.airsideLounges.length === facilityAnalysis.lounges.length ? 'Operating entirely airside' : `With ${facilityAnalysis.airsideLounges.length} airside`}, these lounges support visa-free international transit.{" "}
                  </>
                )}
                The sleep trade-off: lounges provide superior amenities and social environments but lack the complete privacy and sound isolation of pods or transit hotels—you're resting in recliners within shared spaces, not behind closed doors in your own room. This works brilliantly for 4-10 hour layovers where you\'ll eat 1-2 meals, shower, work online, and grab 2-3 hours of reclined sleep.{" "}
                {airportTier.tone === 'premium' ? (
                  <>Extensive lounge infrastructure positions {airportCode} competitively for comprehensive layover comfort.</>
                ) : airportTier.tone === 'moderate' ? (
                  <>This basic selection covers essentials but doesn't offer the brand diversity or terminal redundancy of premium hubs—Istanbul provides 5+ lounge options per major terminal, Singapore features competing lounge brands for price/amenity comparison.</>
                ) : (
                  <>Premium sleep airports deploy lounges strategically: Singapore (15+ lounges including Plaza Premium, SATS, Blossom, each with distinct positioning and pricing), Istanbul (20+ lounges with Turkish Airlines dominating but competition from IGA and Priority Pass networks), Doha (Al Mourjan spanning entire terminal with clear zones for sleeping vs dining vs working). {airportCode} operates at dramatically smaller scale.</>
                )}{" "}
                Research specific{" "}
                <strong>
                  <Link to="/lounge-sleep">lounge brands and locations</Link>
                </strong>{" "}
                through our directory.
              </>
            ) : (
              <>
                Lounge sleeping at {airportCode} centers around {facilityAnalysis.lounges.length} {facilityAnalysis.lounges.length > 1 ? 'facilities' : 'facility'} like <strong>{facilityAnalysis.lounges[0].name}</strong>
                {facilityAnalysis.lounges[0].terminal && ` in ${facilityAnalysis.lounges[0].terminal}`}. The lounge value proposition differs fundamentally from sleep pods or transit hotels: rather than paying purely for private sleeping space, you're accessing comprehensive layover infrastructure—food buffets, full bars, shower suites, business facilities, plus comfortable rest areas—under a single day pass ($40-80) or via existing memberships (Priority Pass, premium credit cards, airline status). This bundles everything together: your 6-hour layover includes breakfast, a shower, 3 hours of recliner sleep, afternoon snacks, WiFi for work, and departure gate convenience, all for less than a transit hotel room alone.{" "}
                {facilityAnalysis.airsideLounges.length > 0
                  ? `${facilityAnalysis.airsideLounges.length === facilityAnalysis.lounges.length ? 'All' : `${facilityAnalysis.airsideLounges.length}`} lounge${facilityAnalysis.lounges.length > 1 ? 's' : ''} at {airportName} ${facilityAnalysis.airsideLounges.length === facilityAnalysis.lounges.length ? 'sit' : 'sits'} airside, supporting visa-free transit.`
                  : "Landside placement requires immigration clearance for international travelers."}{" "}
                The sleeping downside: shared environments lack complete privacy and soundproofing—you're reclining in a chair within a populated room, not isolated in your own pod or hotel space. Lounges optimize when: you already hold Priority Pass or status access (marginal cost becomes zero), your layover spans 5+ hours needing multiple services beyond sleep, or all pod/hotel inventory sells out.{" "}
                {airportTier.tone === 'premium' ? (
                  <>Strong lounge infrastructure supports diverse layover preferences at {airportCode}.</>
                ) : airportTier.tone === 'moderate' ? (
                  <>Functional but not comprehensive—airports like Singapore (multiple lounge brands per terminal creating competition and ensuring availability), Istanbul (20+ lounges meaning you'll find space even during rush hours), or Seoul (10+ options distributed by alliance and gate area) provide superior backup and choice.</>
                ) : (
                  <>Compare against lounge-dense airports: Istanbul Airport (20+ lounges including massive Turkish Airlines CIP, IGA Lounge, multiple Priority Pass options), Singapore Changi (15+ spanning Plaza Premium, SATS, Dnata, airline-specific clubs), Seoul Incheon (10+ distributed across terminals and alliances). These airports ensure availability through redundancy—{airportCode} offers limited fallbacks if your target lounge reaches capacity.</>
                )}{" "}
                Map all lounge options through our{" "}
                <strong>
                  <Link to="/lounge-sleep">lounge sleeping directory</Link>
                </strong>.
              </>
            )
          ) : (
            <>
              {airportName} lacks dedicated{" "}
              <strong>
                <Link to="/lounge-sleep">airport lounge facilities</Link>
              </strong>—a significant gap limiting layover comfort compared to well-equipped international hubs. Lounges deliver bundled value: comfortable seating (often recliners in quiet zones), shower facilities, complimentary food and beverages, high-speed WiFi, and extended hours under a single day pass ($40-80) or via existing memberships like Priority Pass. The best lounge experiences include designated sleep areas with dimmed lighting, lie-flat recliners, and even enclosed nap rooms—transforming layovers from endurance tests into productive rest periods.{" "}
              {hasTransitHotels ? (
                <>
                  While {airportCode} offers {facilityAnalysis.transitHotels.length}{" "}
                  <strong>
                    <Link to="/transit-hotels">transit hotel</Link>
                  </strong>{" "}
                  {facilityAnalysis.transitHotels.length > 1 ? 'alternatives' : 'alternative'} providing superior sleep privacy, these lack the included food/shower/work amenities making lounges economical for longer stays.
                </>
              ) : hasSleepPods ? (
                <>
                  {facilityAnalysis.sleepPods.length}{" "}
                  <strong>
                    <Link to="/sleep-pods">sleep pod</Link>
                  </strong>{" "}
                  {facilityAnalysis.sleepPods.length > 1 ? 'options exist' : 'facility exists'} offering better sleep privacy than lounges could provide, though without complimentary food and extended amenity access.
                </>
              ) : (
                <>Rest infrastructure defaults to free terminal seating and public areas—functional but far from the premium experiences at lounge-equipped airports.</>
              )}{" "}
              Leading airports in lounge infrastructure: Istanbul Airport (20+ lounges including Turkish Airlines' 5-star CIP facilities spanning multiple floors), Singapore Changi (15+ branded options from Plaza Premium to SATS Premier to airline clubs), Seoul Incheon (10+ lounges distributed by alliance with shower facilities standard), Amsterdam Schiphol (multiple Privium and airline lounges throughout terminals). For travelers with Priority Pass or premium credit cards providing lounge access, routing through these airports transforms that membership benefit into genuine layover sleeping solutions. Explore our{" "}
              <strong>
                <Link to="/lounge-sleep">lounge sleeping guide</Link>
              </strong>{" "}
              and{" "}
              <strong>
                <Link to="/airports">airports database</Link>
              </strong>{" "}
              to identify lounge-rich hubs along your typical routes.
            </>
          )}
        </p>
        </>)}

        <h3 className="text-2xl font-semibold mt-8 mb-4">Free Sleeping at {airportName}</h3>

        <p>
          Budget-conscious travelers and those facing unexpected delays can sleep free at {airportCode} using terminal public areas without booking paid facilities. {airportName} permits overnight stays—security won't wake or remove passengers resting in seating zones, gate areas, or designated quiet spaces during transit or pre-departure waiting. The free sleeping reality: you're working with whatever the terminal architecture provides—padded bench seating (increasingly rare), armrest-free metal chairs (more common), carpeted gate zones allowing floor sleeping with yoga mats or sleeping bags, and occasionally dedicated rest areas with reclining seats.{" "}
          {totalFacilities > 0 ? (
            <>
              While {airportCode} operates {totalFacilities} paid rest {totalFacilities === 1 ? 'facility' : 'facilities'}, free sleeping saves $50-200 at the cost of comfort, privacy, and sleep quality. Most budget sleepers report getting 2-4 hours of broken sleep in terminals versus 4-6 hours of restorative rest in paid pods or hotels.
            </>
          ) : (
            <>
              Without dedicated paid facilities, free terminal sleeping becomes your primary option. International terminals typically offer the quietest overnight environments with 24-hour cafes, charging stations, and bathrooms remaining accessible.
            </>
          )}{" "}
          {airportTier.tone === 'premium' ? (
            <>Despite {airportCode}'s extensive paid infrastructure ({airportTier.description}), many travelers still choose free sleeping during short layovers under 4 hours where facility booking overhead isn't justified.</>
          ) : airportTier.tone === 'moderate' ? (
            <>With {airportTier.description}, {airportCode} provides fallback paid options when free sleeping proves too uncomfortable—a luxury absent at poorly-equipped airports forcing everyone to sleep on hard seating regardless of willingness to pay.</>
          ) : (
            <>{airportCode}'s {airportTier.description} mean free sleeping often becomes necessary even for travelers willing to pay for better rest—limited paid capacity fills quickly during peak transit periods.</>
          )}{" "}
          Tips for {airportName} free sleeping: arrive at your rest spot early (best areas claim quickly), pack eye masks and earplugs (lighting and announcements continue overnight), bring layers (terminal temperatures fluctuate dramatically), use luggage as makeshift pillows or leg elevation, position near (but not blocking) power outlets, stay in populated areas for security, and set multiple phone alarms for departure time. Better-equipped airports for free sleeping include {comparisonAirports.slice(0, 2).map((airport, idx) => (
            <span key={airport.airportCode}>
              <Link to={`/airport/${airport.slug}`}>{airport.airportName}</Link>
              {idx === 0 && " and "}
            </span>
          ))}{" "}
          which combine extensive paid facilities with superior free sleeping areas, reducing competition for prime spots—research through our{" "}
          <strong>
            <Link to="/airports">comprehensive airports guide</Link>
          </strong>.
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">How {airportCode} Compares for Layover Sleep</h3>

        <p>
          {airportTier.tone === 'premium' ? (
            <>
              {airportName} ranks among the world's top airports for in-terminal sleep infrastructure. With {totalFacilities} facilities{transitFriendly ? `, ${totalAirside} of them visa-free airside,` : ''} the airport delivers genuine redundancy: if one facility sells out or closes temporarily, alternatives exist within the same terminals. Benchmarks for context: Singapore Changi (11 facilities across 3 terminals), Seoul Incheon (11 facilities distributed by gate cluster), Dubai DXB (6 facilities in Terminal 3). {airportCode}{totalFacilities >= 9 ? ' matches or exceeds these standards' : ' approaches elite status while still building toward full-terminal coverage'}.{" "}
              Infrastructure diversity at {airportName}: {infrastructureBreakdown.length > 0 ? infrastructureBreakdown.map((item, idx) => (
                <span key={item.category}>
                  {item.total} <Link to={item.link}>{item.category.toLowerCase()}</Link>
                  {idx < infrastructureBreakdown.length - 1 && ', '}
                </span>
              )) : 'extensive multi-category coverage'}. This supports every traveler profile — budget pod users, transit hotel guests, and lounge members — without competing for the same limited inventory.
            </>
          ) : airportTier.tone === 'moderate' ? (
            <>
              {airportName}'s {totalFacilities} facilities cover basic layover needs but fall short of redundancy. If your target facility fully books or sits in a distant terminal, backup options are limited.{" "}
              {hasAirsideOptions
                ? `${totalAirside} airside options at ${airportCode} eliminate visa barriers — a real advantage over landside-only airports.`
                : `All ${totalLandside} facilities require immigration clearance, which cuts off visa-free transit passengers entirely.`
              }{" "}
              For comparison: Doha Hamad (4 airside transit hotels accessible from every gate), Munich (4 facilities including pods and hotels), Amsterdam (3 facilities with YOTELAIR airside). {airportCode}'s {totalFacilities > 0 ? `${totalFacilities} ${totalFacilities === 1 ? 'option' : 'options'}` : 'limited infrastructure'} work for straightforward layovers but require booking ahead during peak travel periods.{" "}
              {strongerAlternatives.length > 0 && (
                <>
                  For routes where rest quality is critical, consider connecting through{" "}
                  {strongerAlternatives.slice(0, 2).map((a, idx) => (
                    <span key={a.airportCode}>
                      <Link to={`/airport/${a.slug}`}>{a.airportName} ({a.facilities} facilities)</Link>
                      {idx === 0 && strongerAlternatives.length > 1 ? ' or ' : ''}
                    </span>
                  ))} instead — both offer more inventory and category diversity.
                </>
              )}
            </>
          ) : (
            <>
              {airportName} has {totalFacilities > 0 ? `only ${totalFacilities} dedicated rest ${totalFacilities === 1 ? 'facility' : 'facilities'}` : 'no dedicated rest facilities'}, placing it in the bottom tier for layover sleep infrastructure globally.{" "}
              {totalFacilities > 0 && (
                <>
                  {hasAirsideOptions ? `${totalAirside} of these are airside (visa-free), which helps international transit passengers.` : `All facilities are landside, requiring immigration clearance — a barrier for international transit passengers.`}{" "}
                  Inventory is thin: {infrastructureBreakdown.map(item => `${item.total} ${item.category.toLowerCase()}`).join(', ')}. A single sold-out booking leaves no paid fallback.{" "}
                </>
              )}
              {strongerAlternatives.length > 0 ? (
                <>
                  If your route allows flexibility, these airports offer significantly more infrastructure:{" "}
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    {strongerAlternatives.map(a => (
                      <li key={a.airportCode}>
                        <Link to={`/airport/${a.slug}`}><strong>{a.airportName} ({a.airportCode})</strong></Link> — {a.facilities} facilities
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  For consistent rest quality, route future connections through airports with 4+ facilities — explore our{" "}
                  <strong><Link to="/airports">airports directory</Link></strong> to compare options along your routes.
                </>
              )}
            </>
          )}
        </p>

        <h3 className="text-2xl font-semibold mt-8 mb-4">Frequently Asked Questions About Sleeping at {airportCode}</h3>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                className="w-full text-left px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors flex justify-between items-center"
              >
                <span className="font-semibold text-gray-900">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    openFAQ === index ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              {openFAQ === index && (
                <div className="px-6 py-4 bg-white">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-3">{airportCode} Sleep: Key Takeaways</h3>
          <ul className="space-y-2 text-gray-700 text-sm leading-relaxed mb-4">
            <li>
              <strong>Infrastructure:</strong>{" "}
              {totalFacilities > 0
                ? `${totalFacilities} paid ${totalFacilities === 1 ? 'facility' : 'facilities'} — ${airportTier.label.toLowerCase()}.`
                : `No paid facilities. Free terminal sleeping only.`}
            </li>
            {transitFriendly && (
              <li><strong>Transit-friendly:</strong> {totalAirside} airside {totalAirside === 1 ? 'option' : 'options'} require no visa or immigration clearance.</li>
            )}
            {!transitFriendly && totalFacilities > 0 && (
              <li><strong>Visa required:</strong> All facilities are landside — international transit passengers must clear immigration.</li>
            )}
            {bestOption && (
              <li><strong>Best option:</strong> {bestOption.name}{bestOption.terminal ? ` (${bestOption.terminal})` : ''} — {bestOption.location}, {bestOption.type.toLowerCase()}.</li>
            )}
            <li>
              <strong>Booking advice:</strong>{" "}
              {airportTier.tone === 'limited'
                ? totalFacilities > 0 ? 'Book in advance — single-facility airports sell out fast during peak periods.' : 'No paid options to book. Identify free sleeping areas near power outlets before arrival.'
                : airportTier.tone === 'moderate'
                ? 'Book 24–48 hours ahead during holidays or peak departure periods.'
                : 'Redundant options reduce urgency, but advance booking still recommended for preferred facility types.'}
            </li>
          </ul>
          <p className="text-gray-600 text-sm">
            Browse all {airportCode} facilities in our{" "}
            <strong><Link to={`/airports/${airportCode.toLowerCase()}`}>{airportCode} airport guide</Link></strong>,
            compare across categories via{" "}
            <strong><Link to="/sleep-pods">sleep pods</Link></strong>,{" "}
            <strong><Link to="/transit-hotels">transit hotels</Link></strong>,{" "}
            <strong><Link to="/lounge-sleep">lounge sleeping</Link></strong>, and{" "}
            <strong><Link to="/private-rooms">private rooms</Link></strong> directories,
            or find brand-specific options in our{" "}
            <strong><Link to="/brands">brands guide</Link></strong>.
          </p>
        </div>
      </section>
    </div>
  );
}
