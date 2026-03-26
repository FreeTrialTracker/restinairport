import { useEffect } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import { updatePageMeta } from '../../lib/seo';
import { navigateTo } from '../../lib/navigation';

export default function TermsOfUsePage() {
  useEffect(() => {
    updatePageMeta(
      'Terms of Use | RestInAirport.com',
      'Terms of Use for RestInAirport.com. Review the terms and conditions for using our website.',
      `${window.location.origin}/terms-of-use`
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold">Terms of Use</h1>
            <p className="text-slate-200 mt-2">Last updated: March 2026</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 md:p-12 prose prose-slate max-w-none">
            <h2 className="font-bold">Acceptance of Terms</h2>
            <p>
              By accessing and using RestInAirport.com, you accept and agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our website.
            </p>

            <h2 className="font-bold mt-8">Use of the Website</h2>
            <p>
              RestInAirport.com provides information about airport sleep facilities including pods, transit hotels, private rooms, and lounges. You may use this website for personal, non-commercial purposes.
            </p>

            <h2 className="font-bold mt-8">Information Accuracy</h2>
            <p>
              While we strive to provide accurate and up-to-date information, we make no warranties or representations about the accuracy, completeness, or reliability of the content on this website. Facility information including pricing, hours, availability, and access conditions may change without notice.
            </p>
            <p>
              You are responsible for verifying all information directly with the facility, airport, or service provider before making any decisions or bookings.
            </p>

            <h2 className="font-bold mt-8">Third-Party Links and Services</h2>
            <p>
              Our website may contain links to third-party websites and services. We are not responsible for the content, accuracy, or practices of these external sites. Your interactions with third parties are solely between you and them.
            </p>

            <h2 className="font-bold mt-8">Intellectual Property</h2>
            <p>
              All content on RestInAirport.com, including text, graphics, logos, and design, is the property of RestInAirport.com or its licensors and is protected by copyright and other intellectual property laws.
            </p>

            <h2 className="font-bold mt-8">User Conduct</h2>
            <p>
              You agree not to:
            </p>
            <ul>
              <li>Use the website for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the website or servers</li>
              <li>Collect or harvest information from the website through automated means</li>
            </ul>

            <h2 className="font-bold mt-8">Limitation of Liability</h2>
            <p>
              RestInAirport.com is provided on an as-is basis. We are not liable for any damages arising from your use of this website or reliance on the information provided. This includes but is not limited to direct, indirect, incidental, consequential, or punitive damages.
            </p>

            <h2 className="font-bold mt-8">Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms of Use at any time. Changes will be effective immediately upon posting to this page. Your continued use of the website constitutes acceptance of any changes.
            </p>

            <h2 className="font-bold mt-8">Governing Law</h2>
            <p>
              These Terms of Use are governed by and construed in accordance with applicable laws. Any disputes shall be resolved in the appropriate courts.
            </p>

            <h2 className="font-bold mt-8">Contact Information</h2>
            <p>
              For questions about these Terms of Use, please contact us via our{' '}
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
