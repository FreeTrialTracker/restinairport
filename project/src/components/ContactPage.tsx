import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, Linkedin } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { updatePageMeta } from '../lib/seo';

export default function ContactPage() {
  useEffect(() => {
    updatePageMeta(
      'Contact Us | RestInAirport.com',
      'Get in touch with RestInAirport.com for partnership inquiries, listing updates, corrections, or general questions.',
      `${window.location.origin}/contact`
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      <Helmet>
        <title>Contact Us | RestInAirport.com</title>
        <meta name="description" content="Get in touch with RestInAirport.com for partnership inquiries, listing updates, corrections, or general questions." />
        <link rel="canonical" href="https://restinairport.com/contact" />
        <meta property="og:title" content="Contact Us | RestInAirport.com" />
        <meta property="og:description" content="Get in touch with RestInAirport.com for partnership inquiries, listing updates, corrections, or general questions." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://restinairport.com/contact" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Us | RestInAirport.com" />
        <meta name="twitter:description" content="Get in touch with RestInAirport.com for partnership inquiries, listing updates, corrections, or general questions." />
      </Helmet>
      <Header />

      <main className="flex-1">
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-slate-200 max-w-3xl">
              Have questions or feedback? We would love to hear from you.
            </p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 md:p-12 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Get In Touch</h2>
            <p className="text-slate-700 leading-relaxed mb-8">
              For partnership inquiries, listing updates, corrections, or general questions, please reach out via LinkedIn.
            </p>

            <div className="space-y-6">
              <div className="flex items-start p-6 bg-slate-50 rounded-xl border border-slate-200">
                <div className="bg-slate-700 text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 mr-4">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-2">Matthew Lin</h3>
                  <p className="text-slate-600 text-sm mb-3">
                    Founder, RestInAirport.com
                  </p>
                  <a
                    href="https://www.linkedin.com/in/matthew-lin-profilepage/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <Linkedin className="w-5 h-5 mr-2" />
                    Connect on LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 md:p-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">What We Can Help With</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-slate-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-4 mt-1">
                  <span className="text-sm font-bold text-slate-700">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Partnership Inquiries</h3>
                  <p className="text-slate-600 text-sm">
                    Interested in partnering with RestInAirport.com? Let us know.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-slate-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-4 mt-1">
                  <span className="text-sm font-bold text-slate-700">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Listing Updates</h3>
                  <p className="text-slate-600 text-sm">
                    Have new information about a facility? Help us keep our data current.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-slate-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-4 mt-1">
                  <span className="text-sm font-bold text-slate-700">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Corrections</h3>
                  <p className="text-slate-600 text-sm">
                    Noticed something incorrect? We appreciate your help in maintaining accuracy.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-slate-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-4 mt-1">
                  <span className="text-sm font-bold text-slate-700">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">General Questions</h3>
                  <p className="text-slate-600 text-sm">
                    Have questions about the site or using our directory? Reach out anytime.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
