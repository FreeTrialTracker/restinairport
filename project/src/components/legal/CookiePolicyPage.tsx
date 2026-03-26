import { useEffect } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import { updatePageMeta } from '../../lib/seo';
import { navigateTo } from '../../lib/navigation';

export default function CookiePolicyPage() {
  useEffect(() => {
    updatePageMeta(
      'Cookie Policy | RestInAirport.com',
      'Cookie Policy for RestInAirport.com. Learn about how we use cookies and similar technologies.',
      `${window.location.origin}/cookie-policy`
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold">Cookie Policy</h1>
            <p className="text-slate-200 mt-2">Last updated: March 2026</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 md:p-12 prose prose-slate max-w-none">
            <h2 className="font-bold">What Are Cookies</h2>
            <p>
              Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
            </p>

            <h2 className="font-bold mt-8">How We Use Cookies</h2>
            <p>
              RestInAirport.com may use cookies and similar technologies to:
            </p>
            <ul>
              <li>Remember your preferences and settings</li>
              <li>Understand how you use our website</li>
              <li>Improve website functionality and user experience</li>
              <li>Analyze website traffic and usage patterns</li>
            </ul>

            <h2 className="font-bold mt-8">Types of Cookies We Use</h2>

            <h3 className="font-bold mt-6">Essential Cookies</h3>
            <p>
              These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website.
            </p>

            <h3 className="font-bold mt-6">Analytics Cookies</h3>
            <p>
              These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve the website and user experience.
            </p>

            <h3 className="font-bold mt-6">Functional Cookies</h3>
            <p>
              These cookies enable enhanced functionality and personalization, such as remembering your preferences and choices.
            </p>

            <h2 className="font-bold mt-8">Third-Party Cookies</h2>
            <p>
              Some cookies may be placed by third-party services that appear on our pages. We do not control these cookies and recommend reviewing the privacy policies of these third parties.
            </p>

            <h2 className="font-bold mt-8">Managing Cookies</h2>
            <p>
              You can control and manage cookies through your browser settings. Most browsers allow you to:
            </p>
            <ul>
              <li>View what cookies are stored and delete them individually</li>
              <li>Block third-party cookies</li>
              <li>Block all cookies from specific websites</li>
              <li>Delete all cookies when you close your browser</li>
            </ul>
            <p>
              Please note that deleting or blocking cookies may impact your experience on our website and limit certain functionality.
            </p>

            <h2 className="font-bold mt-8">Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.
            </p>

            <h2 className="font-bold mt-8">Contact Us</h2>
            <p>
              If you have questions about our use of cookies, please contact us via our{' '}
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
