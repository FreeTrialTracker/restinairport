import { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from './Header';
import Footer from './Footer';
import { updatePageMeta, generateBreadcrumbStructuredData } from '../lib/seo';
import BackNavigation from './BackNavigation';

interface BlogPostWrapperProps {
  title: string;
  description: string;
  htmlContent: string;
  slug?: string;
}

export default function BlogPostWrapper({ title, description, htmlContent, slug }: BlogPostWrapperProps) {
  const articleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pageUrl = `${window.location.origin}${window.location.pathname}`;
    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description,
      url: pageUrl,
      datePublished: '2026-03-19',
      dateModified: '2026-03-25',
      author: {
        '@type': 'Person',
        name: 'Matthew Lin',
        url: 'https://www.linkedin.com/in/matthew-lin-profilepage/',
      },
      publisher: {
        '@type': 'Organization',
        name: 'RestInAirport.com',
        url: 'https://restinairport.com/',
      },
      breadcrumb: generateBreadcrumbStructuredData([
        { name: 'Home', url: window.location.origin },
        { name: 'Blog', url: `${window.location.origin}/blog` },
        { name: title, url: pageUrl },
      ]),
    };
    updatePageMeta(
      `${title} | RestInAirport.com`,
      description,
      pageUrl,
      articleSchema
    );
  }, [title, description]);

  // Scroll to section anchor if present in URL
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('#')) {
      // Extract the section anchor (e.g., from #/blog-post/slug#section get #section)
      const parts = hash.split('#');
      if (parts.length > 2) {
        const sectionId = parts[parts.length - 1];
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 100);
      }
    }
  }, [htmlContent]);

  useEffect(() => {
    // Handle anchor link clicks for table of contents
    const handleAnchorClick = (e: Event) => {
      const target = e.target as HTMLElement;
      const href = target.tagName === 'A' ? target.getAttribute('href') : null;

      if (href && href.startsWith('#')) {
        // Handle route-based cross-references (e.g., #/blog-post/slug#section)
        if (href.includes('/blog-post/')) {
          e.preventDefault();
          window.location.hash = href;
          return;
        }

        // Handle simple hash anchors within the same page
        if (!href.includes('/')) {
          e.preventDefault();
          const id = href.substring(1);
          const element = document.getElementById(id);
          if (element) {
            const headerOffset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }
      }
    };

    const article = articleRef.current;
    if (article) {
      article.addEventListener('click', handleAnchorClick);
      return () => article.removeEventListener('click', handleAnchorClick);
    }
  }, [htmlContent]);

  const pageUrl = slug
    ? `https://restinairport.com/blog-post/${slug}`
    : typeof window !== 'undefined'
    ? `https://restinairport.com${window.location.pathname}`
    : 'https://restinairport.com/blog';

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Helmet>
        <title>{title} | RestInAirport.com</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={`${title} | RestInAirport.com`} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={pageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${title} | RestInAirport.com`} />
        <meta name="twitter:description" content={description} />
      </Helmet>
      <Header />

      <main className="flex-1">
        <div className="bg-slate-50 py-8 border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <BackNavigation
              fallbackUrl="/blog"
              fallbackLabel="Blog"
              className="inline-flex items-center text-slate-600 hover:text-slate-900 transition-colors mb-4"
            />
          </div>
        </div>

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12" ref={articleRef}>
          <div className="mb-8 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <time dateTime="2026-03-19">March 19, 2026</time>
              <span className="text-slate-400">•</span>
              <div className="flex items-center gap-2">
                <span>By</span>
                <a
                  href="https://www.linkedin.com/in/matthew-lin-profilepage/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-900 font-medium hover:text-slate-700 transition-colors"
                >
                  Matthew Lin
                </a>
              </div>
            </div>
          </div>

          <div
            className="prose prose-slate prose-lg max-w-none
              prose-headings:font-bold prose-headings:text-slate-900
              prose-h1:text-4xl prose-h1:mb-8 prose-h1:leading-tight
              prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-4
              prose-a:text-slate-700 prose-a:underline prose-a:decoration-slate-400 hover:prose-a:decoration-slate-700
              prose-strong:text-slate-900 prose-strong:font-semibold
              prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
              prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
              prose-li:text-slate-700 prose-li:my-2
              [&_nav]:bg-slate-50 [&_nav]:rounded-xl [&_nav]:p-6 [&_nav]:border [&_nav]:border-slate-200 [&_nav]:my-8
              [&_nav_h2]:text-xl [&_nav_h2]:font-bold [&_nav_h2]:text-slate-900 [&_nav_h2]:mb-4 [&_nav_h2]:mt-0
              [&_nav_ul]:list-none [&_nav_ul]:pl-0 [&_nav_ul]:my-2
              [&_nav_li]:my-1
              [&_nav_a]:text-slate-700 [&_nav_a]:no-underline hover:[&_nav_a]:text-slate-900"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </article>
      </main>

      <Footer />
    </div>
  );
}
