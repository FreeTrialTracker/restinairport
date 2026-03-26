import { useEffect, useState } from 'react';
import BlogPostWrapper from './BlogPostWrapper';
import BlogPage from './BlogPage';

interface BlogPostPageProps {
  slug: string;
}

const blogPostMeta: Record<string, { title: string; description: string }> = {
  'pillar-3-airport-pods-for-sleeping': {
    title: 'Airport Pods for Sleeping: The Complete USA Guide (2026)',
    description: 'The ultimate guide to airport pods for sleeping in the USA. Find sleep pods at LAX, ORD, JFK, IAH, LGA, SEA and more. Learn costs, locations, and the best airports with sleeping pods.'
  },
  'pillar-2-airport-hotel-airport': {
    title: 'Best Hotels Inside Airports & Airport Hotels: The Ultimate Guide (2026)',
    description: 'Find the best airport hotels worldwide. Compare hotels inside airports, airport hotel offers, and discover which airports have the best on-site hotel options for layovers and transit.'
  },
  'pillar-1-houston-airport-sleeping-pods': {
    title: 'Does Houston Airport Have Sleeping Pods? Minute Suites IAH & All Sleep Options (2026)',
    description: 'Wondering if Houston airport has sleeping pods? Discover Minute Suites at IAH, houston airport sleep pods cost, and the best places to sleep in Houston airport.'
  },
  'sub-1-1-sleeping-rooms-atlanta-airport': {
    title: 'Sleeping Rooms at Atlanta Airport: Minute Suites, Nap Pods & Best Rest Options (2026)',
    description: 'Find sleeping rooms at Atlanta airport including Minute Suites ATL, nap pods, capsule hotels, and the best places to sleep at Hartsfield-Jackson. Updated for 2026.'
  },
  'sub-1-2-sleeping-at-seatac': {
    title: 'Sleeping at SeaTac: Sleep Pods, Showers & Best Rest Options at Seattle Airport (2026)',
    description: 'Complete guide to sleeping at SeaTac airport. Find seatac sleeping pods, Seattle airport shower facilities, places to sleep in Seattle airport, and overnight stay tips.'
  },
  'sub-1-3-sleeping-in-newark-airport': {
    title: 'Sleeping in Newark Airport: EWR Overnight Guide, Minute Suites & Best Rest Spots (2026)',
    description: 'Everything you need to know about sleeping in Newark airport. Find the best spots for sleeping at EWR, Newark airport Minute Suites, and tips for a comfortable overnight stay.'
  },
  'sub-1-4-sleeping-pods-boston-airport': {
    title: 'Sleeping Pods Boston Airport: Logan Airport Sleep Pods, Showers & Overnight Guide (2026)',
    description: 'Find sleeping pods at Boston Logan airport. Covers boston logan airport sleeping pods, airport showers, best places to sleep at Logan, and overnight layover tips for 2026.'
  },
  'sub-2-1-closest-airport-to-red-rocks': {
    title: 'Closest Airport to Red Rocks Amphitheatre: Where to Fly In (2026)',
    description: 'Find the closest airport to Red Rocks Amphitheatre. Compare Denver International and other Colorado airports, distances, and the best way to get to Red Rocks from the airport.'
  },
  'sub-2-2-hourly-hotels-near-me': {
    title: 'Hourly Hotels Near Me: How to Rent a Hotel Room for a Few Hours (2026)',
    description: 'Find hourly hotels near you. Learn how to rent a hotel room for a couple of hours, find short stay hotels near airports, and which platforms offer pay-by-the-hour hotel rooms.'
  },
  'pillar-post-airport-pods': {
    title: 'Airport Pods for Sleeping in the U.S.: Where to Find Them and How Overnight Airport Sleep Works',
    description: 'Discover the best airport sleeping pods across major U.S. airports. Learn how sleep pods work, pricing, locations, and tips for making the most of your layover.'
  },
  'pillar-post-airports': {
    title: 'Best Airports for Sleeping: Top U.S. Airports with Sleep Facilities',
    description: 'Comprehensive guide to the best U.S. airports for sleeping. Compare sleep pods, transit hotels, lounges, and free rest areas at major hubs.'
  },
  'pillar-chicago-ord-lounges': {
    title: 'Best Lounges at Chicago Airport: Relax in Style at ORD',
    description: 'Discover the best lounge at Chicago airport to unwind with comfort and amenities. Explore accessible options like ORD lounges, Centurion partners, and Priority Pass.'
  },
  'subpost-1-jfk-new-york': {
    title: 'Best Places to Sleep at JFK Airport — Pods, Minute Suites, and the TWA Hotel',
    description: 'Complete guide to sleeping at JFK Airport. Find the best free spots, paid Minute Suites, TWA Hotel day rooms, and lounge access for overnight layovers.'
  },
  'subpost-2-lhr-heathrow': {
    title: 'Sleeping at London Heathrow: Sleep Pods, Hotels, and Rest Areas',
    description: 'Navigate sleep options at Europe\'s busiest airport. YOTELAIR sleep pods, transit hotels, lounge access, and free rest zones at LHR.'
  },
  'subpost-3-hourly-hotels': {
    title: 'Hourly Hotels Near Airports: Book Day Rooms and Short Stays',
    description: 'Find hourly hotels and day rooms near major airports. Perfect for short layovers, rest between flights, or quick business stops without full-night booking.'
  },
  'subpost-4-rooms-near-airport': {
    title: 'Rooms Near Airport: Best Hotels for Layovers and Early Flights',
    description: 'Discover the best airport hotels with free shuttle service, early check-in, and late checkout. Perfect for overnight layovers and early departures.'
  },
  'sub-post-jfk-sleeping': {
    title: 'Best Places to Sleep at JFK Airport — Pods, Minute Suites, and the TWA Hotel',
    description: 'Complete guide to sleeping at JFK Airport. Find the best free spots, paid Minute Suites, TWA Hotel day rooms, and lounge access for overnight layovers.'
  },
  'sub-post-phoenix-sleep-pods': {
    title: 'Phoenix Sky Harbor Sleep Pods — Minute Suites PHX Terminal 4 Guide',
    description: 'Everything you need to know about Phoenix Airport sleep pods. Location, pricing, features, and how to book Minute Suites at PHX Terminal 4.'
  },
  'sub-post-orlando-sleep-pods': {
    title: 'Does Orlando Airport Have Sleep Pods? MCO Sleeping Options Explained',
    description: 'Find out where to rest at Orlando International Airport. Minute Suites in Terminal C, Hyatt Regency day rooms, and free quiet zones for budget travelers.'
  },
  'sub-post-atlanta-sleeping-rooms': {
    title: 'Sleeping Rooms at Atlanta Airport — Comfort and Convenience at ATL',
    description: 'Navigate sleeping options at the world\'s busiest airport. Minute Suites locations, pricing, shower access, and free rest zones at Hartsfield-Jackson.'
  },
  'sub-newark-ewr-terminal-c-lounges': {
    title: 'Newark Terminal C Lounges: Best Spots & Access at EWR',
    description: 'Discover the best Newark Terminal C lounges for comfort and convenience. Find out how to access these airport retreats with day passes or credit cards.'
  },
  'sub-las-vegas-airport-lounges': {
    title: 'Las Vegas Airport Lounges: Harry Reid International Top Picks',
    description: 'Discover the best lounge at McCarran Airport for a serene pre-flight experience. Explore premium amenities in Las Vegas airport lounges with a day pass.'
  },
  'sub-austin-aus-airport-lounges': {
    title: 'Austin Airport Lounges: What\'s Available at AUS and How to Access Them',
    description: 'Explore the best Austin airport lounges at AUS with our guide on how to access premium spots. Upgrade your travel experience with ease.'
  },
  'sub-lax-airport-lounges': {
    title: 'LAX International Airport Lounges: Best Picks & Tips',
    description: 'Discover the luxurious and accessible LAX International Airport lounges offering free food, drinks, showers, and more. Unlock comfort on your next layover.'
  },
  'sub-2-3-how-to-get-to-the-airport': {
    title: 'How to Get to the Airport From Here: Every Option Explained (2026)',
    description: 'A complete guide on how to get to the airport from your location. Compare rideshare, taxis, parking, shuttles, and public transit for the smoothest airport journey.'
  },
  'sub-2-4-hotels-near-jfk': {
    title: 'Hotels Near JFK Airport: Best Options for Every Budget (2026)',
    description: 'Find the best hotels near JFK airport. Compare JFK airport hotels with shuttle, cheap hotels near JFK, and discover if JFK has a hotel inside the terminal.'
  },
  'sub-3-1-sleeping-at-lax': {
    title: 'Sleeping at LAX Airport: Sleep Pods, SleepBox & Overnight Guide 2026',
    description: 'Complete guide to sleeping at LAX. Find SleepBox Suites LAX Terminal 5, lax sleep pods, lax nap pods, and the best places to sleep at Los Angeles airport overnight.'
  },
  'sub-3-2-las-vegas-sleeping-pods': {
    title: 'Las Vegas Airport Sleeping Pods: Harry Reid International Sleep Guide 2026',
    description: 'Find sleeping pods at Las Vegas airport. Capsule hotels, sleep rooms at Harry Reid International, las vegas sleeping pods cost, and where to sleep at LAS airport overnight.'
  },
  'sub-3-3-sleep-pods-jfk-terminal-4': {
    title: 'Sleep Pods JFK Terminal 4: JFK Airport Overnight Guide & Showers 2026',
    description: 'Find sleep pods at JFK Terminal 4. Covers JFK airport sleep pods, JFK showers, Minute Suites JFK, overnight lounges, and where to sleep at JFK airport.'
  },
  'sub-3-4-does-orlando-airport-have-sleep-pods': {
    title: 'Does Orlando Airport Have Sleep Pods? MCO Sleep Guide 2026',
    description: 'Find out if Orlando airport has sleep pods. Covers MCO sleep pods, Minute Suites MCO, places to sleep in Orlando airport, and the best overnight options at OIA.'
  }
};

export default function BlogPostPage({ slug }: BlogPostPageProps) {
  const [blogContent, setBlogContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const meta = blogPostMeta[slug];

  useEffect(() => {
    if (!meta) {
      setLoading(false);
      return;
    }
    async function loadBlogPost() {
      try {
        const response = await fetch(`/blog/${slug}.html`);
        const html = await response.text();
        setBlogContent(html);
      } catch (error) {
        console.error('Error loading blog post:', error);
        setBlogContent('<p>Error loading blog post.</p>');
      } finally {
        setLoading(false);
      }
    }
    loadBlogPost();
  }, [slug, meta]);

  if (!meta) {
    return <BlogPage />;
  }

  if (loading) {
    return (
      <BlogPostWrapper
        title={meta.title}
        description={meta.description}
        htmlContent=""
        slug={slug}
      />
    );
  }

  return (
    <BlogPostWrapper
      title={meta.title}
      description={meta.description}
      htmlContent={blogContent}
      slug={slug}
    />
  );
}
