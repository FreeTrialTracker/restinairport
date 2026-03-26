import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: facilities, error } = await supabase
      .from('airport_facilities')
      .select('id, facility, updated_at')
      .order('updated_at', { ascending: false });

    if (error) {
      throw error;
    }

    const baseUrl = 'https://restinairport.com';
    const currentDate = new Date().toISOString().split('T')[0];

    let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    sitemap += '  <url>\n';
    sitemap += `    <loc>${baseUrl}/</loc>\n`;
    sitemap += `    <lastmod>${currentDate}</lastmod>\n`;
    sitemap += '    <changefreq>daily</changefreq>\n';
    sitemap += '    <priority>1.0</priority>\n';
    sitemap += '  </url>\n';

    const staticPages = [
      { path: '/#/blog', priority: '0.9', changefreq: 'weekly' },
      { path: '/#/airports', priority: '0.9', changefreq: 'weekly' },
      { path: '/#/brands', priority: '0.8', changefreq: 'monthly' },
      { path: '/#/about', priority: '0.7', changefreq: 'monthly' },
      { path: '/#/contact', priority: '0.7', changefreq: 'monthly' },
    ];

    for (const page of staticPages) {
      sitemap += '  <url>\n';
      sitemap += `    <loc>${baseUrl}${page.path}</loc>\n`;
      sitemap += `    <lastmod>${currentDate}</lastmod>\n`;
      sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
      sitemap += `    <priority>${page.priority}</priority>\n`;
      sitemap += '  </url>\n';
    }

    const blogPosts = [
      // Sleep Posts - Pillar
      { slug: 'pillar-post-airport-pods', priority: '0.9' },
      { slug: 'pillar-post-airports', priority: '0.9' },

      // Lounge Posts - Pillar
      { slug: 'pillar-chicago-ord-lounges', priority: '0.9' },

      // Sleep Posts - Airport Specific
      { slug: 'subpost-1-jfk-new-york', priority: '0.8' },
      { slug: 'subpost-2-lhr-heathrow', priority: '0.8' },
      { slug: 'subpost-3-hourly-hotels', priority: '0.8' },
      { slug: 'subpost-4-rooms-near-airport', priority: '0.8' },
      { slug: 'sub-post-jfk-sleeping', priority: '0.8' },
      { slug: 'sub-post-phoenix-sleep-pods', priority: '0.8' },
      { slug: 'sub-post-orlando-sleep-pods', priority: '0.8' },
      { slug: 'sub-post-atlanta-sleeping-rooms', priority: '0.8' },

      // Lounge Posts - Airport Specific
      { slug: 'sub-newark-ewr-terminal-c-lounges', priority: '0.8' },
      { slug: 'sub-las-vegas-airport-lounges', priority: '0.8' },
      { slug: 'sub-austin-aus-airport-lounges', priority: '0.8' },
      { slug: 'sub-lax-airport-lounges', priority: '0.8' },
    ];

    for (const post of blogPosts) {
      sitemap += '  <url>\n';
      sitemap += `    <loc>${baseUrl}/#/blog-post/${post.slug}</loc>\n`;
      sitemap += `    <lastmod>${currentDate}</lastmod>\n`;
      sitemap += '    <changefreq>monthly</changefreq>\n';
      sitemap += `    <priority>${post.priority}</priority>\n`;
      sitemap += '  </url>\n';
    }

    const brandMap = new Map<string, Date>();

    if (facilities) {
      for (const facility of facilities) {
        const lastmod = facility.updated_at
          ? new Date(facility.updated_at).toISOString().split('T')[0]
          : currentDate;

        sitemap += '  <url>\n';
        sitemap += `    <loc>${baseUrl}/#/facility/${facility.id}</loc>\n`;
        sitemap += `    <lastmod>${lastmod}</lastmod>\n`;
        sitemap += '    <changefreq>monthly</changefreq>\n';
        sitemap += '    <priority>0.8</priority>\n';
        sitemap += '  </url>\n';

        const brandName = facility.facility.replace(/\s*\([^)]*\)$/, '').trim();
        const brandSlug = brandName
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_]+/g, '-')
          .replace(/^-+|-+$/g, '');

        const facilityDate = facility.updated_at ? new Date(facility.updated_at) : new Date();
        if (!brandMap.has(brandSlug) || (brandMap.get(brandSlug)! < facilityDate)) {
          brandMap.set(brandSlug, facilityDate);
        }
      }
    }

    for (const [brandSlug, lastModDate] of brandMap.entries()) {
      const lastmod = lastModDate.toISOString().split('T')[0];
      sitemap += '  <url>\n';
      sitemap += `    <loc>${baseUrl}/#/brand/${brandSlug}</loc>\n`;
      sitemap += `    <lastmod>${lastmod}</lastmod>\n`;
      sitemap += '    <changefreq>monthly</changefreq>\n';
      sitemap += '    <priority>0.7</priority>\n';
      sitemap += '  </url>\n';
    }

    sitemap += '</urlset>';

    return new Response(sitemap, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate sitemap' }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
