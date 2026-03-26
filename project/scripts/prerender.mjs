import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

config({ path: path.join(root, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const LOCATION_SUFFIX_PATTERNS = [
  /\s+Terminal\s+\d+$/i,
  /\s+Terminal\s+[A-Z]$/i,
  /\s*\(Terminal\s*\)\s*$/i,
  /\s*\(Terminal\s+\d+[^)]*\)\s*$/i,
  /\s*\(Terminal\s+[A-Z][^)]*\)\s*$/i,
  /\s*\(T\d+[^)]*\)\s*$/i,
  /\s*\(Concourse\s+[^)]+\)\s*$/i,
  /\s*\(Gate\s+[^)]+\)\s*$/i,
  /\s*\(Satellite\s+[^)]+\)\s*$/i,
  /\s*\(North[^)]*\)\s*$/i,
  /\s*\(South[^)]*\)\s*$/i,
  /\s*\(East[^)]*\)\s*$/i,
  /\s*\(West[^)]*\)\s*$/i,
  /\s*\(Arrivals[^)]*\)\s*$/i,
  /\s*\(Departures[^)]*\)\s*$/i,
  /\s*\(International[^)]*\)\s*$/i,
  /\s*\(Domestic[^)]*\)\s*$/i,
  /\s*\(Intl[^)]*\)\s*$/i,
  /\s*\(Schengen[^)]*\)\s*$/i,
  /\s*\(Non-Schengen[^)]*\)\s*$/i,
  /\s*\(KLIA\d*[^)]*\)\s*$/i,
  /\s*\(Jewel[^)]*\)\s*$/i,
  /\s*\(Atrium[^)]*\)\s*$/i,
  /\s*\(Airside[^)]*\)\s*$/i,
  /\s*\(Landside[^)]*\)\s*$/i,
  /\s*\(Mezzanine[^)]*\)\s*$/i,
  /\s*\(No\.\s*\d+[^)]*\)\s*$/i,
  /\s*\([^)]*Pier[^)]*\)\s*$/i,
  /\s*\([^)]*Node[^)]*\)\s*$/i,
  /\s*\([A-Z]\)\s*$/,
];

const STANDALONE_GENERIC_PATTERN = /^(Transit Hotel|Airport Hotel|Day Rooms?)\s+\(.*\)$/i;

const BRAND_ALIAS_MAP = {
  'Encalm Lounge': 'Encalm',
  'Encalm Sleep Pods': 'Encalm',
  'Encalm Transit Hotel': 'Encalm',
  'Encalm Lounge / Sleep Facility': 'Encalm',
  'Miracle Business Class Lounge': 'Miracle',
  'Miracle First & Business Lounge': 'Miracle',
  'Miracle First Class Lounge': 'Miracle',
  'Miracle Lounge': 'Miracle',
  'Miracle Transit': 'Miracle',
  'Coral Executive Lounge': 'Coral Executive Lounge',
  'Coral Finest Business Lounge': 'Coral Executive Lounge',
  'Coral First Class Lounge': 'Coral Executive Lounge',
  'Coral Cocoon Lounge': 'Coral Executive Lounge',
  'Coral Cosmo Lounge': 'Coral Executive Lounge',
  'Plaza Premium Lounge': 'Plaza Premium',
  'Plaza Premium First': 'Plaza Premium',
  'Saphire - Plaza Premium First': 'Plaza Premium',
  'Saphire - Plaza Premium Lounge': 'Plaza Premium',
  'BLOSSOM - SATS & Plaza Premium Lounge': 'Plaza Premium',
  'GoSleep Lounge': 'GoSleep',
  'GoSleep Pods': 'GoSleep',
  'Sleepover Pods': 'Sleepover',
  'Sky Hub Lounge West': 'Skyhub Lounge',
  'Matina Gold': 'Matina Lounge',
  'Ambassador Transit Hotel Terminal 2': 'Ambassador Transit',
  'Ambassador Transit Hotel Terminal 3': 'Ambassador Transit',
  'Ambassador Transit Lounge': 'Ambassador Transit',
  'Napcabs XL': 'Napcabs',
};

const BRAND_TYPE_MAP = {
  'Aerotel': 'Transit Hotel',
  'Encalm': 'Mixed',
  'GoSleep': 'Sleep Pods',
  'izZzleep': 'Sleep Pods',
  'Kepler Club': 'Lounge Network',
  'Minute Suites': 'Sleep Pods',
  'Miracle': 'Lounge Network',
  'Napcabs': 'Sleep Pods',
  'Plaza Premium': 'Lounge Network',
  'SH Premium Lounge': 'Lounge Network',
  'Skyhub Lounge': 'Lounge Network',
  'Sleepover': 'Sleep Pods',
  "Wait N' Rest": 'Sleep Pods',
  'YOTELAIR': 'Transit Hotel',
  'ZZZleepandGo': 'Sleep Pods',
};

function normalizeFacilityName(rawName) {
  if (STANDALONE_GENERIC_PATTERN.test(rawName)) return rawName;
  let name = rawName;
  for (const pattern of LOCATION_SUFFIX_PATTERNS) {
    name = name.replace(pattern, '');
  }
  return name.trim() || rawName;
}

function getCanonicalBrandName(normalizedName) {
  return BRAND_ALIAS_MAP[normalizedName] ?? normalizedName;
}

function getBrandSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const GENERIC_EXCLUSIONS = new Set([
  'Airport Hotel', 'AUHotel', 'Day Rooms', 'Transit Hotel',
  'Transit Hotel (Gates B/D)', 'Transit Hotel (Terminal 1)', 'Transit Hotel (Terminal 2)',
  'Sleep Pods (Airport Hotel)', 'Dubai Intl Hotel', 'Holiday Inn Express',
  'Mercure Transit', 'My Cloud Transit Hotel', 'Oryx Airport Hotel',
  'Royal Park Transit', 'Serenediva Transit Hotel', 'Skylight Transit',
  'TRYP by Wyndham', '080 Transit Hotel', 'Apricot Business Lounge',
  'Aviserv Lounge', 'CIP Lounge', 'Concordia Lounge', 'Extime Business Lounge',
  'Jasmine Halal Lounge', 'Lounge Annex Rokko', 'Lounge TIME International',
  'Manaia Lounge', 'marhaba Lounge', 'Maslin Lounge', 'MTB Air Lounge',
  'Pearl Exclusive Lounge', 'Rose Business Lounge', 'SASCO SleepZone',
  'SATS Premier Lounge', 'SENS Leisure Lounge', 'SkyTeam Lounge',
  'Sun Coast Lounge', 'UCB Lounge', 'VATC Sleep Pods', 'Wassan Pods',
  'CapsuleTransit', 'Sama-Sama', 'Saphire Lounge', 'Ambassador Transit',
  'Matina Lounge', '9h nine hours', 'GettSleep', 'JetQuay Sleeping Suite',
  'Niranta Transit Hotel Mumbai', 'No1 Lounge Pod Bedrooms',
  'Coral Executive Lounge',
]);

const KNOWN_SINGLE_AIRPORT_BRANDS = new Set(['izZzleep']);
const MULTI_AIRPORT_OVERRIDES = new Set(['Skyhub Lounge']);

function isPrimaryBrand(name, airportCount) {
  if (MULTI_AIRPORT_OVERRIDES.has(name)) return true;
  if (GENERIC_EXCLUSIONS.has(name)) return false;
  if (KNOWN_SINGLE_AIRPORT_BRANDS.has(name)) return true;
  return airportCount >= 2;
}

const BRAND_KNOWN_META = {
  'aerotel': 'Discover Aerotel, a leading airside transit hotel at Singapore Changi, London Heathrow, and Abu Dhabi. View room options, access rules, pricing, and whether transit passengers can stay without clearing immigration.',
  'gosleep': 'Discover GoSleep, a Finnish-designed sleep pod brand available at airports across Europe and the Middle East. View pod locations, access rules, hourly pricing, and transit passenger eligibility.',
  'yotelair': 'Discover YOTELAIR, a premium transit hotel at Amsterdam Schiphol, London Heathrow, Paris CDG, and New York JFK. View cabin options, pricing, access rules, and whether you can stay airside without clearing immigration.',
  'napcabs': 'Discover Napcabs, a fully enclosed private sleep pod brand at Munich Airport and select international airports. View cabin locations, pricing, access rules, and transit passenger eligibility.',
  'plaza-premium': 'Discover Plaza Premium, a globally independent lounge network available at 100+ airports across Asia, the Middle East, and Europe. View lounge locations, access rules, entry fees, and transit passenger eligibility.',
  'minute-suites': 'Discover Minute Suites, private hourly rest suites at US airports including Atlanta, Philadelphia, Dallas Fort Worth, and Charlotte Douglas. View suite locations, pricing, access rules, and transit eligibility.',
  'miracle': 'Discover Miracle Lounge, the leading independent lounge brand at Bangkok Suvarnabhumi Airport (BKK). View lounge tiers, locations, access rules, pricing, and whether transit passengers can enter without a Thai visa.',
  'izzleep': 'Discover izZzleep, an enclosed private sleep pod brand at select international airports. View pod locations, pricing, access rules, and whether transit passengers can rest without clearing immigration.',
  'encalm': 'Discover Encalm, an all-in-one airport hospitality brand at Delhi Indira Gandhi Airport offering lounges, sleep pods, and transit hotel rooms. View locations, access rules, pricing, and transit passenger eligibility.',
  'zzzleepandgo': "Discover ZZZleepandGo, Italy's leading airport sleep pod brand at Milan Malpensa (MXP) and Rome Fiumicino (FCO). View pod locations, pricing, access rules, and transit passenger eligibility.",
  'kepler-club': 'Discover Kepler Club, a premium airport lounge and transit hotel brand at select Asian and Middle Eastern hub airports. View locations, cabin options, access rules, pricing, and transit passenger eligibility.',
  'wait-n-rest': "Discover Wait N' Rest, a budget-friendly airport sleep pod brand at select international airports. View pod locations, pricing, access rules, and whether transit passengers can rest without clearing immigration.",
  'sh-premium-lounge': 'Discover SH Premium Lounge, an independent airport lounge brand at select international airports. View lounge locations, access rules, entry fees, and whether transit passengers can use it without clearing immigration.',
  'skyhub-lounge': 'Discover Skyhub Lounge, a Korean independent airport lounge brand at Incheon (ICN) and Gimpo (GMP) airports. View lounge locations, access rules, entry fees, and transit passenger eligibility without a Korean visa.',
  'sleepover': 'Discover Sleepover, an enclosed airport sleep pod brand at select international airports. View pod locations, pricing, access rules, and whether transit passengers can rest without clearing immigration.',
};

const REGION_MAP = {
  SIN: 'Asia', BKK: 'Asia', KUL: 'Asia', ICN: 'Asia', GMP: 'Asia', HKG: 'Asia',
  NRT: 'Asia', PEK: 'Asia', DEL: 'Asia', BOM: 'Asia', CGK: 'Asia', MNL: 'Asia',
  LHR: 'Europe', LGW: 'Europe', CDG: 'Europe', AMS: 'Europe', FRA: 'Europe',
  MUC: 'Europe', ZRH: 'Europe', FCO: 'Europe', MXP: 'Europe', MAD: 'Europe',
  DXB: 'Middle East', AUH: 'Middle East', DOH: 'Middle East',
  JFK: 'North America', LAX: 'North America', ORD: 'North America',
  ATL: 'North America', PHL: 'North America', DFW: 'North America',
};

function getBrandMetaDesc(slug, brandName, brandType, airportCodes, airportCount) {
  if (BRAND_KNOWN_META[slug]) return BRAND_KNOWN_META[slug];
  const typeLabel = brandType === 'Transit Hotel' ? 'transit hotel'
    : brandType === 'Sleep Pods' ? 'sleep pod brand'
    : brandType === 'Lounge Network' ? 'airport lounge network'
    : 'airport rest facility';
  const regions = [...new Set(airportCodes.map(c => REGION_MAP[c]).filter(Boolean))];
  const regionText = regions.length > 0 ? ` across ${regions.join(' and ')}` : '';
  return `Discover ${brandName}, an airport ${typeLabel} available at ${airportCount} ${airportCount === 1 ? 'airport' : 'airports'}${regionText}. View locations, access rules, pricing insights, and whether transit passengers can stay without clearing immigration.`;
}

function getBrandMetaTitle(brandName, brandType) {
  const typeLabel = brandType === 'Transit Hotel' ? 'Transit Hotel'
    : brandType === 'Sleep Pods' ? 'Sleep Pod'
    : brandType === 'Lounge Network' ? 'Airport Lounge'
    : 'Airport Rest Facility';
  return `${brandName} – ${typeLabel} in Airports | Locations, Access & Pricing | RestInAirport`;
}

const STATIC_PAGE_META = {
  '/': {
    title: 'RestInAirport – Find Airport Rest Facilities Worldwide',
    description: 'Find airport sleep pods, transit hotels, lounge sleep, and other airport rest facilities worldwide. Browse by airport, brand, or category.',
  },
  '/sleep-pods': {
    title: 'Airport Sleep Pods – Find Sleep Pods at Airports Worldwide | RestInAirport',
    description: 'Find airport sleep pods worldwide. Compare pod brands, locations, pricing, and access rules. Discover the best sleep pods for transit passengers at major international airports.',
  },
  '/transit-hotels': {
    title: 'Transit Hotels at Airports – Airside Hotel Rooms for Layovers | RestInAirport',
    description: 'Find transit hotels inside airports worldwide. Compare airside hotel rooms, pricing, and locations. Rest without leaving the terminal during your layover.',
  },
  '/lounge-sleep': {
    title: 'Airport Lounge Sleep – Lounges with Sleep Facilities | RestInAirport',
    description: 'Find airport lounges with sleep and rest facilities. Compare lounge brands with beds, showers, and quiet areas for transit passengers at international airports.',
  },
  '/airports': {
    title: 'Airports with Rest Facilities – Sleep Pods, Hotels & Lounges | RestInAirport',
    description: 'Browse international airports with sleep pods, transit hotels, and lounge rest facilities. Find rest options by airport for your layover.',
  },
  '/brands': {
    title: 'Airport Rest Brands – Compare Sleep Pod & Lounge Brands | RestInAirport',
    description: 'Compare airport rest brands worldwide. Browse sleep pod operators, transit hotel brands, and lounge networks available at international airports.',
  },
  '/private-rooms': {
    title: 'Private Airport Rest Rooms – Hourly Hotel Rooms in Airports | RestInAirport',
    description: 'Find private rooms at airports available by the hour. Compare airside rest rooms, suites, and private spaces at major international airports.',
  },
  '/blog': {
    title: 'Airport Sleep & Travel Guides – RestInAirport Blog',
    description: 'Airport sleep guides, transit tips, and layover advice. Read our guides on sleeping at airports, using sleep pods, and finding rest during long layovers.',
  },
  '/about': {
    title: 'About RestInAirport – Airport Rest Facilities Directory',
    description: 'RestInAirport is a directory of airport rest facilities including sleep pods, transit hotels, and lounges at international airports worldwide.',
  },
  '/contact': {
    title: 'Contact RestInAirport',
    description: 'Contact the RestInAirport team to report incorrect information, suggest new facilities, or get in touch.',
  },
};

function escapeAttr(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

const BLOG_SLUGS = [
  'pillar-3-airport-pods-for-sleeping',
  'pillar-2-airport-hotel-airport',
  'pillar-1-houston-airport-sleeping-pods',
  'sub-1-1-sleeping-rooms-atlanta-airport',
  'sub-1-2-sleeping-at-seatac',
  'sub-1-3-sleeping-in-newark-airport',
  'sub-1-4-sleeping-pods-boston-airport',
  'sub-2-1-closest-airport-to-red-rocks',
  'sub-2-2-hourly-hotels-near-me',
  'pillar-post-airport-pods',
  'pillar-post-airports',
  'pillar-chicago-ord-lounges',
  'subpost-1-jfk-new-york',
  'subpost-2-lhr-heathrow',
  'subpost-3-hourly-hotels',
  'subpost-4-rooms-near-airport',
  'sub-post-jfk-sleeping',
  'sub-post-phoenix-sleep-pods',
  'sub-post-orlando-sleep-pods',
  'sub-post-atlanta-sleeping-rooms',
  'sub-newark-ewr-terminal-c-lounges',
  'sub-las-vegas-airport-lounges',
  'sub-austin-aus-airport-lounges',
  'sub-lax-airport-lounges',
  'sub-2-3-how-to-get-to-the-airport',
  'sub-2-4-hotels-near-jfk',
  'sub-3-1-sleeping-at-lax',
  'sub-3-2-las-vegas-sleeping-pods',
  'sub-3-3-sleep-pods-jfk-terminal-4',
  'sub-3-4-does-orlando-airport-have-sleep-pods',
];

const STATIC_ROUTES = [
  '/',
  '/airports',
  '/brands',
  '/sleep-pods',
  '/private-rooms',
  '/transit-hotels',
  '/lounge-sleep',
  '/blog',
  '/about',
  '/contact',
  '/privacy-policy',
  '/terms-of-use',
  '/cookie-policy',
  '/disclaimer',
  '/affiliate-disclosure',
];

async function main() {
  console.log('Fetching all facility data from database...');
  const { data: facilities, error } = await supabase
    .from('airport_facilities')
    .select('airport, airport_code, facility')
    .order('airport', { ascending: true });

  if (error || !facilities) {
    console.error('Error fetching facilities:', error);
    process.exit(1);
  }

  console.log(`Fetched ${facilities.length} facility rows`);

  const seenAirports = new Set();
  const airportRoutes = [];
  for (const row of facilities) {
    const cleanName = row.airport.replace(/\s*\([A-Z]{3}\)\s*$/, '');
    const slug = `${generateSlug(cleanName)}-${row.airport_code.toLowerCase()}`;
    if (!seenAirports.has(slug)) {
      seenAirports.add(slug);
      airportRoutes.push(`/airport/${slug}`);
    }
  }

  const brandMap = new Map();
  for (const f of facilities) {
    let name = f.facility;
    if (!STANDALONE_GENERIC_PATTERN.test(name)) {
      for (const pattern of LOCATION_SUFFIX_PATTERNS) {
        name = name.replace(pattern, '');
      }
      name = name.trim() || f.facility;
    }
    const canonical = BRAND_ALIAS_MAP[name] ?? name;
    const slug = getBrandSlug(canonical);

    if (!brandMap.has(slug)) {
      brandMap.set(slug, {
        name: canonical,
        slug,
        facilityCount: 0,
        airportCodes: new Set(),
        airports: new Map(),
      });
    }
    const brand = brandMap.get(slug);
    brand.facilityCount++;
    brand.airportCodes.add(f.airport_code);
    if (!brand.airports.has(f.airport_code)) {
      const cleanAirportName = f.airport.replace(/\s*\([A-Z]{3}\)\s*$/, '').trim();
      brand.airports.set(f.airport_code, cleanAirportName);
    }
  }

  const brandRoutes = [];
  for (const [slug, brand] of brandMap.entries()) {
    if (isPrimaryBrand(brand.name, brand.airportCodes.size)) {
      brandRoutes.push(`/brand/${slug}`);
    }
  }

  const blogRoutes = BLOG_SLUGS.map(slug => `/blog-post/${slug}`);

  const allRoutes = [
    ...STATIC_ROUTES,
    ...airportRoutes,
    ...brandRoutes,
    ...blogRoutes,
  ];

  console.log(`Total routes to prerender: ${allRoutes.length} (${brandRoutes.length} brand pages)`);

  const serverBundle = path.join(root, 'dist/server/entry-server.js');
  if (!fs.existsSync(serverBundle)) {
    console.error('Server bundle not found at', serverBundle);
    console.error('Run: npm run build:server first');
    process.exit(1);
  }

  const { render } = await import(serverBundle);

  const templatePath = path.join(root, 'dist/client/index.html');
  if (!fs.existsSync(templatePath)) {
    console.error('Client build not found at', templatePath);
    console.error('Run: npm run build first');
    process.exit(1);
  }

  const templateOrigPath = path.join(root, 'dist/client/_template.html');
  let template;

  if (fs.existsSync(templateOrigPath)) {
    template = fs.readFileSync(templateOrigPath, 'utf-8');
  } else {
    template = fs.readFileSync(templatePath, 'utf-8');
    fs.writeFileSync(templateOrigPath, template, 'utf-8');
  }

  const outDir = path.join(root, 'dist/client');

  let successCount = 0;
  let errorCount = 0;

  for (const route of allRoutes) {
    try {
      let ssrBrandData = undefined;

      if (route.startsWith('/brand/')) {
        const slug = route.replace('/brand/', '');
        const brand = brandMap.get(slug);
        if (brand) {
          const airportCount = brand.airportCodes.size;
          const airports = Array.from(brand.airports.entries())
            .map(([code, name]) => ({ code, name }))
            .sort((a, b) => a.name.localeCompare(b.name));

          ssrBrandData = {
            brandName: brand.name,
            brandSlug: slug,
            brandType: BRAND_TYPE_MAP[brand.name] ?? 'Mixed',
            facilityCount: brand.facilityCount,
            airportCount,
            airportCodes: Array.from(brand.airportCodes),
            airports,
          };
        }
      }

      const { html: appHtml, helmet } = render(route, ssrBrandData);

      const helmetTitle = helmet?.title?.toString() || '';
      const helmetMeta = helmet?.meta?.toString() || '';
      const helmetLink = helmet?.link?.toString() || '';
      const helmetScript = helmet?.script?.toString() || '';

      const helmetHasTitle = helmetTitle.includes('<title') && helmetTitle.includes('</title>');
      const helmetHasMeta = helmetMeta.includes('name="description"') || helmetMeta.includes("name='description'");

      let headTags = [helmetTitle, helmetMeta, helmetLink, helmetScript].filter(Boolean).join('\n  ');

      if (!helmetHasTitle || !helmetHasMeta) {
        let fallbackTitle = '';
        let fallbackDesc = '';
        let canonicalHref = `https://restinairport.com${route === '/' ? '' : route}`;

        if (ssrBrandData) {
          fallbackTitle = getBrandMetaTitle(ssrBrandData.brandName, ssrBrandData.brandType);
          fallbackDesc = getBrandMetaDesc(
            ssrBrandData.brandSlug,
            ssrBrandData.brandName,
            ssrBrandData.brandType,
            ssrBrandData.airportCodes,
            ssrBrandData.airportCount
          );
        } else if (STATIC_PAGE_META[route]) {
          fallbackTitle = STATIC_PAGE_META[route].title;
          fallbackDesc = STATIC_PAGE_META[route].description;
        }

        if (fallbackTitle && fallbackDesc) {
          const safetitle = escapeAttr(fallbackTitle);
          const safeDesc = escapeAttr(fallbackDesc);
          const extraTags = [
            !helmetHasTitle ? `<title>${fallbackTitle}</title>` : '',
            !helmetHasMeta ? `<meta name="description" content="${safeDesc}" />` : '',
            !helmetHasMeta ? `<meta property="og:title" content="${safetitle}" />` : '',
            !helmetHasMeta ? `<meta property="og:description" content="${safeDesc}" />` : '',
            `<link rel="canonical" href="${canonicalHref}" />`,
          ].filter(Boolean).join('\n  ');
          headTags = headTags ? headTags + '\n  ' + extraTags : extraTags;
        }
      }

      let finalHtml = template
        .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

      finalHtml = finalHtml
        .replace(/<title>[^<]*<\/title>\s*/g, '')
        .replace(/<meta\s+name="description"[^>]*>\s*/g, '')
        .replace(/<meta\s+property="og:[^"]*"[^>]*>\s*/g, '')
        .replace(/<meta\s+name="twitter:[^"]*"[^>]*>\s*/g, '')
        .replace(/<link\s+rel="canonical"[^>]*>\s*/g, '')
        .replace(/<script\s+type="application\/ld\+json">[\s\S]*?<\/script>\s*/g, '');

      if (headTags) {
        finalHtml = finalHtml.replace('</head>', `  ${headTags}\n</head>`);
      }

      const outPath = route === '/'
        ? path.join(outDir, 'index.html')
        : path.join(outDir, route.slice(1), 'index.html');

      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, finalHtml, 'utf-8');
      console.log(`  ✓ ${route}`);
      successCount++;
    } catch (err) {
      console.error(`  ✗ ${route}: ${err.message}`);
      errorCount++;
    }
  }

  console.log(`\nPrerender complete: ${successCount} succeeded, ${errorCount} failed`);

  const criticalRoutes = ['/', '/brands', '/sleep-pods', '/transit-hotels', '/lounge-sleep', '/airports'];
  const missing = criticalRoutes.filter(route => {
    const p = route === '/'
      ? path.join(outDir, 'index.html')
      : path.join(outDir, route.slice(1), 'index.html');
    return !fs.existsSync(p);
  });

  if (missing.length > 0) {
    console.error('\nBUILD FAILED: Critical prerendered routes are missing:');
    missing.forEach(r => console.error(`  - ${r}`));
    process.exit(1);
  }

  if (successCount < 10) {
    console.error(`\nBUILD FAILED: Only ${successCount} routes prerendered. Expected at least 10. Check Supabase env vars and DB connection.`);
    process.exit(1);
  }

  console.log(`\nAll critical routes verified. Deploy ready from: ${outDir}`);
}

main().catch(err => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
