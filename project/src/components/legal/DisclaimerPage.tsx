import { useEffect } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import { updatePageMeta } from '../../lib/seo';
import { navigateTo } from '../../lib/navigation';

export default function DisclaimerPage() {
  useEffect(() => {
    updatePageMeta(
      'Disclaimer | RestInAirport.com',
      'Disclaimer for RestInAirport.com. Important information about the use of our website and content.',
      `${window.location.origin}/disclaimer`
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold">Disclaimer</h1>
            <p className="text-slate-200 mt-2">Last updated: March 2026</p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 md:p-12 prose prose-slate max-w-none">
            <h2 className="font-bold">Information Accuracy</h2>
            <p>
              RestInAirport.com provides information about airport sleep facilities as a convenience to travelers. While we make reasonable efforts to ensure the information is accurate and current, we make no warranties or guarantees about:
            </p>
            <ul>
              <li>The accuracy, completeness, or timeliness of facility information</li>
              <li>Pricing, hours of operation, or availability</li>
              <li>Facility amenities, features, or conditions</li>
              <li>Terminal locations or access requirements</li>
            </ul>
            <p>
              Information may change without notice. Always verify details directly with the facility, airport, or service provider before making decisions or bookings.
            </p>

            <h2 className="font-bold mt-8">Not an Official Source</h2>
            <p>
              RestInAirport.com is an independent information directory and is not affiliated with, endorsed by, or sponsored by any airport, airline, facility, or service provider mentioned on this website.
            </p>

            <h2 className="font-bold mt-8">Immigration and Access</h2>
            <p>
              Information about immigration requirements, visa rules, transit access, and terminal zones is provided for general guidance only. Visa and immigration regulations vary by nationality, travel purpose, and jurisdiction.
            </p>
            <p>
              It is your responsibility to verify visa requirements, immigration rules, and airport access conditions with official sources before traveling. RestInAirport.com is not responsible for any immigration or access issues you may encounter.
            </p>

            <h2 className="font-bold mt-8">Lounge Access and Membership</h2>
            <p>
              Information about lounge access, Priority Pass, LoungeKey, DragonPass, and credit card benefits is subject to change. Access conditions, participating locations, and membership benefits are determined by the respective providers.
            </p>
            <p>
              Always verify your eligibility and access rights directly with your membership provider or credit card issuer.
            </p>

            <h2 className="font-bold mt-8">Booking and Reservations</h2>
            <p>
              RestInAirport.com does not handle bookings or reservations. Any bookings you make are directly with the facility or through third-party booking platforms. We are not responsible for booking issues, cancellations, refunds, or disputes.
            </p>

            <h2 className="font-bold mt-8">Pricing Information</h2>
            <p>
              Prices listed on RestInAirport.com are approximate and may not reflect current rates. Prices are subject to change, seasonal variations, promotional offers, and currency fluctuations. Always confirm pricing directly with the facility before booking.
            </p>

            <h2 className="font-bold mt-8">Third-Party Content and Links</h2>
            <p>
              Our website may contain links to third-party websites and services. We do not control, endorse, or assume responsibility for third-party content, practices, or policies. Your interactions with third parties are at your own risk.
            </p>

            <h2 className="font-bold mt-8">No Professional Advice</h2>
            <p>
              The information on RestInAirport.com is for informational purposes only and should not be considered professional, legal, or travel advice. You should consult appropriate professionals for specific guidance related to your travel needs.
            </p>

            <h2 className="font-bold mt-8">Limitation of Liability</h2>
            <p>
              RestInAirport.com and its operators are not liable for any direct, indirect, incidental, consequential, or special damages arising from your use of this website or reliance on the information provided. This includes but is not limited to missed flights, booking issues, access problems, or financial losses.
            </p>

            <h2 className="font-bold mt-8">User Responsibility</h2>
            <p>
              You acknowledge that:
            </p>
            <ul>
              <li>You are responsible for verifying all information before acting on it</li>
              <li>Travel involves inherent risks and uncertainties</li>
              <li>You should have appropriate travel insurance and documentation</li>
              <li>You must comply with all applicable laws and regulations</li>
            </ul>

            <h2 className="font-bold mt-8">Contact Us</h2>
            <p>
              If you have questions about this disclaimer, please contact us via our{' '}
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
