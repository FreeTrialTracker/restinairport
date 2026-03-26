import { useEffect } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import { updatePageMeta } from '../../lib/seo';
import { navigateTo } from '../../lib/navigation';

export default function AffiliateDisclosurePage() {
  useEffect(() => {
    updatePageMeta(
      'Affiliate Disclosure | RestInAirport.com',
      'Affiliate Disclosure for RestInAirport.com. Learn about our affiliate relationships and compensation.',
      `${window.location.origin}/affiliate-disclosure`
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold">Affiliate Disclosure</h1>
            <p className="text-slate-200 mt-2">Last updated: March 2026</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 md:p-12 prose prose-slate max-w-none">
            <h2 className="font-bold">Affiliate Relationships</h2>
            <p>
              RestInAirport.com may participate in affiliate marketing programs. This means we may earn commissions from qualifying purchases or actions made through links on our website.
            </p>

            <h2 className="font-bold mt-8">How Affiliate Links Work</h2>
            <p>
              When you click on certain links on our website and make a purchase or booking, we may receive a commission from the merchant or service provider. This comes at no additional cost to you.
            </p>
            <p>
              Affiliate links help support the operation and maintenance of RestInAirport.com, allowing us to continue providing free information about airport sleep facilities worldwide.
            </p>

            <h2 className="font-bold mt-8">Our Commitment to Integrity</h2>
            <p>
              We are committed to providing honest, unbiased information. Our affiliate relationships do not influence our editorial content or recommendations. We only recommend facilities and services that we believe may be valuable to travelers.
            </p>
            <p>
              The presence of an affiliate link does not indicate endorsement, and the absence of an affiliate link does not indicate a negative opinion. Our goal is to provide comprehensive, accurate information regardless of affiliate relationships.
            </p>

            <h2 className="font-bold mt-8">Types of Affiliate Programs</h2>
            <p>
              We may participate in affiliate programs with:
            </p>
            <ul>
              <li>Hotel and accommodation booking platforms</li>
              <li>Travel services and providers</li>
              <li>Airport facility operators</li>
              <li>Other travel-related businesses</li>
            </ul>

            <h2 className="font-bold mt-8">Your Choices</h2>
            <p>
              You are never obligated to use any links on our website. You can always:
            </p>
            <ul>
              <li>Navigate directly to a provider website</li>
              <li>Search for alternative options</li>
              <li>Compare prices across multiple platforms</li>
              <li>Book directly with facilities</li>
            </ul>

            <h2 className="font-bold mt-8">Pricing and Availability</h2>
            <p>
              Prices, availability, and terms are determined by the service providers, not by RestInAirport.com. We recommend comparing options and reviewing terms carefully before making any booking decisions.
            </p>

            <h2 className="font-bold mt-8">No Guarantee of Earnings</h2>
            <p>
              The information on our website is for informational purposes only. We make no guarantees about potential savings, benefits, or outcomes from using any links or services mentioned on our website.
            </p>

            <h2 className="font-bold mt-8">FTC Compliance</h2>
            <p>
              This disclosure is provided in accordance with the Federal Trade Commission guidelines on endorsements and testimonials. We believe in transparency and want our visitors to understand our business model.
            </p>

            <h2 className="font-bold mt-8">Updates to This Disclosure</h2>
            <p>
              We may update this Affiliate Disclosure from time to time to reflect changes in our affiliate relationships or business practices. Changes will be posted on this page with an updated revision date.
            </p>

            <h2 className="font-bold mt-8">Questions</h2>
            <p>
              If you have questions about our affiliate relationships or this disclosure, please contact us via our{' '}
              <a href="/contact" onClick={(e) => { e.preventDefault(); navigateTo('/contact'); }} className="text-slate-700 hover:text-slate-900 underline">
                Contact page
              </a>
              .
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
