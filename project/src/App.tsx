import { useEffect, useState, useMemo } from 'react';
import HomePage from './components/HomePage';
import FacilityPage from './components/FacilityPage';
import CategoryPage from './components/CategoryPage';
import SleepPodsPage from './components/SleepPodsPage';
import PrivateRoomsPage from './components/PrivateRoomsPage';
import TransitHotelsPage from './components/TransitHotelsPage';
import LoungeSleepPage from './components/LoungeSleepPage';
import AirportsPage from './components/AirportsPage';
import AirportDetailPage from './components/AirportDetailPage';
import BrandsPage from './components/BrandsPage';
import BrandDetailPage from './components/BrandDetailPage';
import BrandComparePage from './components/BrandComparePage';
import BlogPage from './components/BlogPage';
import BlogPostPage from './components/BlogPostPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import PrivacyPolicyPage from './components/legal/PrivacyPolicyPage';
import TermsOfUsePage from './components/legal/TermsOfUsePage';
import CookiePolicyPage from './components/legal/CookiePolicyPage';
import DisclaimerPage from './components/legal/DisclaimerPage';
import AffiliateDisclosurePage from './components/legal/AffiliateDisclosurePage';
import { updatePageMeta } from './lib/seo';
import type { CategoryType } from './lib/categories';

export interface SSRBrandData {
  brandName: string;
  brandSlug: string;
  brandType: import('./lib/brandNormalization').BrandType;
  facilityCount: number;
  airportCount: number;
  airportCodes: string[];
  airports: { code: string; name: string }[];
}

interface AppProps {
  ssrUrl?: string;
  ssrBrandData?: SSRBrandData;
}

const mdSlugMap: Record<string, string> = {
  'airport-pods-for-sleeping': 'pillar-3-airport-pods-for-sleeping',
  'airport-hotel-airport': 'pillar-2-airport-hotel-airport',
  'does-houston-airport-have-sleeping-pods': 'pillar-1-houston-airport-sleeping-pods',
  'sleeping-rooms-at-atlanta-airport': 'sub-1-1-sleeping-rooms-atlanta-airport',
  'sleeping-at-seatac': 'sub-1-2-sleeping-at-seatac',
  'sleeping-in-newark-airport': 'sub-1-3-sleeping-in-newark-airport',
  'sleeping-pods-boston-airport': 'sub-1-4-sleeping-pods-boston-airport',
  'closest-airport-to-red-rocks-amphitheatre': 'sub-2-1-closest-airport-to-red-rocks',
  'hourly-hotels-near-me': 'sub-2-2-hourly-hotels-near-me',
};

type Route =
  | { page: 'home' }
  | { page: 'facility'; slug: string }
  | { page: 'category'; categoryId: CategoryType }
  | { page: 'sleep-pods' }
  | { page: 'private-rooms' }
  | { page: 'transit-hotels' }
  | { page: 'lounge-sleep' }
  | { page: 'airports' }
  | { page: 'airport'; slug: string }
  | { page: 'brands' }
  | { page: 'brand'; slug: string }
  | { page: 'compare'; slug: string }
  | { page: 'blog' }
  | { page: 'blog-post'; slug: string }
  | { page: 'about' }
  | { page: 'contact' }
  | { page: 'privacy-policy' }
  | { page: 'terms-of-use' }
  | { page: 'cookie-policy' }
  | { page: 'disclaimer' }
  | { page: 'affiliate-disclosure' };

function parseRoute(path: string): Route {
  if (path.length > 1) {
    const topSlug = path.slice(1);
    if (mdSlugMap[topSlug]) {
      return { page: 'blog-post', slug: mdSlugMap[topSlug] };
    }
  }

  if (!path || path === '/') {
    return { page: 'home' };
  } else if (path.startsWith('/facility/')) {
    return { page: 'facility', slug: path.split('/')[2] };
  } else if (path === '/sleep-pods') {
    return { page: 'sleep-pods' };
  } else if (path === '/private-rooms') {
    return { page: 'private-rooms' };
  } else if (path === '/transit-hotels') {
    return { page: 'transit-hotels' };
  } else if (path === '/lounge-sleep') {
    return { page: 'lounge-sleep' };
  } else if (path === '/airports') {
    return { page: 'airports' };
  } else if (path.startsWith('/airport/')) {
    return { page: 'airport', slug: path.split('/')[2] };
  } else if (path === '/brands') {
    return { page: 'brands' };
  } else if (path.startsWith('/brand/')) {
    return { page: 'brand', slug: path.split('/')[2] };
  } else if (path.startsWith('/compare/')) {
    return { page: 'compare', slug: path.split('/')[2] };
  } else if (path === '/blog') {
    return { page: 'blog' };
  } else if (path.startsWith('/blog-post/')) {
    return { page: 'blog-post', slug: path.split('/')[2] };
  } else if (path === '/about') {
    return { page: 'about' };
  } else if (path === '/contact') {
    return { page: 'contact' };
  } else if (path === '/privacy-policy') {
    return { page: 'privacy-policy' };
  } else if (path === '/terms-of-use') {
    return { page: 'terms-of-use' };
  } else if (path === '/cookie-policy') {
    return { page: 'cookie-policy' };
  } else if (path === '/disclaimer') {
    return { page: 'disclaimer' };
  } else if (path === '/affiliate-disclosure') {
    return { page: 'affiliate-disclosure' };
  }
  return { page: 'home' };
}

function App({ ssrUrl, ssrBrandData }: AppProps = {}) {
  const initialRoute = useMemo<Route>(() => {
    if (ssrUrl) return parseRoute(ssrUrl);
    if (typeof window !== 'undefined') return parseRoute(window.location.pathname);
    return { page: 'home' };
  }, [ssrUrl]);

  const [currentRoute, setCurrentRoute] = useState<Route>(initialRoute);

  useEffect(() => {
    if (ssrUrl) return;

    const handleRouteChange = () => {
      setCurrentRoute(parseRoute(window.location.pathname));
    };

    handleRouteChange();
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, [ssrUrl]);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (currentRoute.page === 'home') {
      updatePageMeta(
        'RestInAirport.com - Find Airport Lounges, Hotels & Rest Facilities Worldwide',
        'Find the best airport rest facilities worldwide. Compare lounges, pod hotels, sleep pods and transit hotels across major international airports.',
        window.location.origin + '/'
      );
    }
  }, [currentRoute]);

  if (currentRoute.page === 'facility' && currentRoute.slug) {
    return <FacilityPage facilitySlug={currentRoute.slug} />;
  }

  if (currentRoute.page === 'category') {
    return <CategoryPage categoryId={currentRoute.categoryId} />;
  }

  if (currentRoute.page === 'sleep-pods') {
    return <SleepPodsPage />;
  }

  if (currentRoute.page === 'private-rooms') {
    return <PrivateRoomsPage />;
  }

  if (currentRoute.page === 'transit-hotels') {
    return <TransitHotelsPage />;
  }

  if (currentRoute.page === 'lounge-sleep') {
    return <LoungeSleepPage />;
  }

  if (currentRoute.page === 'airports') {
    return <AirportsPage />;
  }

  if (currentRoute.page === 'airport') {
    return <AirportDetailPage airportSlug={currentRoute.slug} />;
  }

  if (currentRoute.page === 'brands') {
    return <BrandsPage />;
  }

  if (currentRoute.page === 'brand') {
    return <BrandDetailPage brandSlug={currentRoute.slug} ssrData={ssrBrandData} />;
  }

  if (currentRoute.page === 'compare') {
    return <BrandComparePage compareSlug={currentRoute.slug} />;
  }

  if (currentRoute.page === 'blog') {
    return <BlogPage />;
  }

  if (currentRoute.page === 'blog-post') {
    return <BlogPostPage slug={currentRoute.slug} />;
  }

  if (currentRoute.page === 'about') {
    return <AboutPage />;
  }

  if (currentRoute.page === 'contact') {
    return <ContactPage />;
  }

  if (currentRoute.page === 'privacy-policy') {
    return <PrivacyPolicyPage />;
  }

  if (currentRoute.page === 'terms-of-use') {
    return <TermsOfUsePage />;
  }

  if (currentRoute.page === 'cookie-policy') {
    return <CookiePolicyPage />;
  }

  if (currentRoute.page === 'disclaimer') {
    return <DisclaimerPage />;
  }

  if (currentRoute.page === 'affiliate-disclosure') {
    return <AffiliateDisclosurePage />;
  }

  return <HomePage />;
}

export default App;
