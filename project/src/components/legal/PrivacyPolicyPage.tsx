import { useEffect } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import { updatePageMeta } from '../../lib/seo';
import { navigateTo } from '../../lib/navigation';

export default function PrivacyPolicyPage() {
  useEffect(() => {
    updatePageMeta(
      'Privacy Policy | RestInAirport.com',
      'Privacy Policy for RestInAirport.com. Learn how we collect, use, and protect your information.',
      `${window.location.origin}/privacy-policy`
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
            <p className="text-slate-200 mt-2">Last updated: March 2026</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 md:p-12 prose prose-slate max-w-none">
            <h2 className="font-bold">Introduction</h2>
            <p>
              RestInAirport.com is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard information when you visit our website.
            </p>

            <h2 className="font-bold mt-8">Information We Collect</h2>
            <p>
              When you visit RestInAirport.com, we may collect:
            </p>
            <ul>
              <li>Usage data such as pages visited, time spent on the site, and navigation patterns</li>
              <li>Device information including browser type, operating system, and IP address</li>
              <li>Information you voluntarily provide when contacting us</li>
            </ul>

            <h2 className="font-bold mt-8">How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul>
              <li>Improve and optimize our website</li>
              <li>Analyze user behavior and preferences</li>
              <li>Respond to inquiries and provide support</li>
              <li>Maintain the security and functionality of our services</li>
            </ul>

            <h2 className="font-bold mt-8">Cookies</h2>
            <p>
              RestInAirport.com may use cookies and similar tracking technologies to enhance user experience. You can control cookies through your browser settings.
            </p>

            <h2 className="font-bold mt-8">Third-Party Services</h2>
            <p>
              Our website may contain links to third-party websites and services. We are not responsible for the privacy practices of these external sites. Please review their privacy policies before providing any personal information.
            </p>

            <h2 className="font-bold mt-8">Data Security</h2>
            <p>
              We implement reasonable security measures to protect your information. However, no method of transmission over the internet is completely secure, and we cannot guarantee absolute security.
            </p>

            <h2 className="font-bold mt-8">Your Rights</h2>
            <p>
              You have the right to:
            </p>
            <ul>
              <li>Access the information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt out of certain data collection practices</li>
            </ul>

            <h2 className="font-bold mt-8">Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date.
            </p>

            <h2 className="font-bold mt-8">Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us via our{' '}
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
