export function updatePageMeta(
  title: string,
  description: string,
  canonical?: string,
  structuredData?: object
) {
  document.title = title;

  const updateOrCreateMeta = (name: string, content: string, property?: boolean) => {
    const attr = property ? 'property' : 'name';
    let element = document.querySelector(`meta[${attr}="${name}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attr, name);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  updateOrCreateMeta('description', description);
  updateOrCreateMeta('og:title', title, true);
  updateOrCreateMeta('og:description', description, true);
  updateOrCreateMeta('og:type', 'website', true);
  updateOrCreateMeta('twitter:card', 'summary_large_image');
  updateOrCreateMeta('twitter:title', title);
  updateOrCreateMeta('twitter:description', description);

  if (canonical) {
    let linkElement = document.querySelector('link[rel="canonical"]');
    if (!linkElement) {
      linkElement = document.createElement('link');
      linkElement.setAttribute('rel', 'canonical');
      document.head.appendChild(linkElement);
    }
    linkElement.setAttribute('href', canonical);
    updateOrCreateMeta('og:url', canonical, true);
  }

  if (structuredData) {
    let scriptElement = document.querySelector('script[type="application/ld+json"]');
    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptElement);
    }
    scriptElement.textContent = JSON.stringify(structuredData);
  }
}

export function generateFacilityStructuredData(facility: {
  id: string;
  airport: string;
  facility: string;
  location: string;
  type: string;
  price: string;
  notes: string | null;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: facility.facility,
    description: `${facility.type} at ${facility.airport} - ${facility.location}`,
    priceRange: facility.price,
    address: {
      '@type': 'PostalAddress',
      addressLocality: facility.location,
    },
  };
}

export function generateFAQStructuredData(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function generateBreadcrumbStructuredData(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
