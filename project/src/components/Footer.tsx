import { Plane, Globe, FileText } from 'lucide-react';
import { navigateTo } from '../lib/navigation';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Plane className="w-6 h-6" />
              <span className="text-lg font-bold">RestInAirport.com</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Find airport sleep pods, transit hotels, private rooms, and lounge rest options worldwide.
            </p>
            <div className="space-y-2 text-sm">
              <div>
                <a
                  href="https://www.hotelsinairport.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  www.hotelsinairport.com
                </a>
              </div>
              <div>
                <a
                  href="https://www.airportsleepguide.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  www.airportsleepguide.com
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/sleep-pods" onClick={(e) => { e.preventDefault(); navigateTo('/sleep-pods'); }} className="text-slate-400 hover:text-white transition-colors">
                  Sleep Pods
                </a>
              </li>
              <li>
                <a href="/private-rooms" onClick={(e) => { e.preventDefault(); navigateTo('/private-rooms'); }} className="text-slate-400 hover:text-white transition-colors">
                  Private Rooms
                </a>
              </li>
              <li>
                <a href="/transit-hotels" onClick={(e) => { e.preventDefault(); navigateTo('/transit-hotels'); }} className="text-slate-400 hover:text-white transition-colors">
                  Transit Hotels
                </a>
              </li>
              <li>
                <a href="/lounge-sleep" onClick={(e) => { e.preventDefault(); navigateTo('/lounge-sleep'); }} className="text-slate-400 hover:text-white transition-colors">
                  Lounge Sleep
                </a>
              </li>
              <li>
                <a href="/airports" onClick={(e) => { e.preventDefault(); navigateTo('/airports'); }} className="text-slate-400 hover:text-white transition-colors">
                  Airports
                </a>
              </li>
              <li>
                <a href="/brands" onClick={(e) => { e.preventDefault(); navigateTo('/brands'); }} className="text-slate-400 hover:text-white transition-colors">
                  Brands
                </a>
              </li>
              <li>
                <a href="/blog" onClick={(e) => { e.preventDefault(); navigateTo('/blog'); }} className="text-slate-400 hover:text-white transition-colors">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/about" onClick={(e) => { e.preventDefault(); navigateTo('/about'); }} className="text-slate-400 hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="/contact" onClick={(e) => { e.preventDefault(); navigateTo('/contact'); }} className="text-slate-400 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/matthew-lin-profilepage/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Travel Resources</h3>
            <div className="space-y-4 text-sm">
              <div>
                <a
                  href="https://www.visainfoguide.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 group"
                >
                  <Globe className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-white font-medium group-hover:text-sky-300 transition-colors block">visainfoguide.com</span>
                    <span className="text-slate-400 text-xs leading-relaxed">Transit visa guides, airside vs landside rules, and country entry requirements</span>
                  </div>
                </a>
              </div>
              <div>
                <a
                  href="https://www.immigrationinfoguide.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 group"
                >
                  <FileText className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-white font-medium group-hover:text-emerald-300 transition-colors block">immigrationinfoguide.com</span>
                    <span className="text-slate-400 text-xs leading-relaxed">Moving abroad guides, expat resources, and long-term relocation planning</span>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/privacy-policy" onClick={(e) => { e.preventDefault(); navigateTo('/privacy-policy'); }} className="text-slate-400 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms-of-use" onClick={(e) => { e.preventDefault(); navigateTo('/terms-of-use'); }} className="text-slate-400 hover:text-white transition-colors">
                  Terms of Use
                </a>
              </li>
              <li>
                <a href="/cookie-policy" onClick={(e) => { e.preventDefault(); navigateTo('/cookie-policy'); }} className="text-slate-400 hover:text-white transition-colors">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="/disclaimer" onClick={(e) => { e.preventDefault(); navigateTo('/disclaimer'); }} className="text-slate-400 hover:text-white transition-colors">
                  Disclaimer
                </a>
              </li>
              <li>
                <a href="/affiliate-disclosure" onClick={(e) => { e.preventDefault(); navigateTo('/affiliate-disclosure'); }} className="text-slate-400 hover:text-white transition-colors">
                  Affiliate Disclosure
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-slate-400">
            <p className="mb-4 md:mb-0">
              © {currentYear} RestInAirport.com. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/privacy-policy" onClick={(e) => { e.preventDefault(); navigateTo('/privacy-policy'); }} className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/terms-of-use" onClick={(e) => { e.preventDefault(); navigateTo('/terms-of-use'); }} className="hover:text-white transition-colors">
                Terms of Use
              </a>
              <a href="/cookie-policy" onClick={(e) => { e.preventDefault(); navigateTo('/cookie-policy'); }} className="hover:text-white transition-colors">
                Cookie Policy
              </a>
              <a href="/disclaimer" onClick={(e) => { e.preventDefault(); navigateTo('/disclaimer'); }} className="hover:text-white transition-colors">
                Disclaimer
              </a>
              <a href="/affiliate-disclosure" onClick={(e) => { e.preventDefault(); navigateTo('/affiliate-disclosure'); }} className="hover:text-white transition-colors">
                Affiliate Disclosure
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
