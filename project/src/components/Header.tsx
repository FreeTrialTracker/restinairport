import { useState } from 'react';
import { Plane, Menu, X, ChevronDown } from 'lucide-react';
import { navigateTo } from '../lib/navigation';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sleepOptionsOpen, setSleepOptionsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigateTo('/');
            }}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <Plane className="w-6 h-6 text-slate-700" />
            <span className="text-xl font-bold text-slate-900">RestInAirport.com</span>
          </a>

          <nav className="hidden md:flex items-center space-x-8">
            <div
              className="relative group"
              onMouseEnter={() => setSleepOptionsOpen(true)}
              onMouseLeave={() => setSleepOptionsOpen(false)}
            >
              <button
                className="flex items-center space-x-1 text-slate-700 hover:text-slate-900 font-medium transition-colors py-2"
              >
                <span>Sleep Options</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {sleepOptionsOpen && (
                <div
                  className="absolute top-full left-0 pt-2 pb-2"
                >
                  <div className="w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-2">
                    <a
                      href="/sleep-pods"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo('/sleep-pods');
                      }}
                      className="block px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      Sleep Pods
                    </a>
                    <a
                      href="/private-rooms"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo('/private-rooms');
                      }}
                      className="block px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      Private Rooms
                    </a>
                    <a
                      href="/transit-hotels"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo('/transit-hotels');
                      }}
                      className="block px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      Transit Hotels
                    </a>
                    <a
                      href="/lounge-sleep"
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo('/lounge-sleep');
                      }}
                      className="block px-4 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                      Lounge Sleep
                    </a>
                  </div>
                </div>
              )}
            </div>

            <a
              href="/airports"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/airports');
              }}
              className="text-slate-700 hover:text-slate-900 font-medium transition-colors"
            >
              Airports
            </a>

            <a
              href="/brands"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/brands');
              }}
              className="text-slate-700 hover:text-slate-900 font-medium transition-colors"
            >
              Brands
            </a>

            <a
              href="/blog"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/blog');
              }}
              className="text-slate-700 hover:text-slate-900 font-medium transition-colors"
            >
              Blog
            </a>
          </nav>

          <button
            className="md:hidden text-slate-700 hover:text-slate-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200">
          <div className="px-4 py-4 space-y-3">
            <div>
              <button
                onClick={() => setSleepOptionsOpen(!sleepOptionsOpen)}
                className="flex items-center justify-between w-full text-slate-700 font-medium py-2"
              >
                <span>Sleep Options</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${sleepOptionsOpen ? 'rotate-180' : ''}`} />
              </button>

              {sleepOptionsOpen && (
                <div className="pl-4 mt-2 space-y-2">
                  <a
                    href="/sleep-pods"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('/sleep-pods');
                      setMobileMenuOpen(false);
                    }}
                    className="block py-2 text-slate-600 hover:text-slate-900"
                  >
                    Sleep Pods
                  </a>
                  <a
                    href="/private-rooms"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('/private-rooms');
                      setMobileMenuOpen(false);
                    }}
                    className="block py-2 text-slate-600 hover:text-slate-900"
                  >
                    Private Rooms
                  </a>
                  <a
                    href="/transit-hotels"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('/transit-hotels');
                      setMobileMenuOpen(false);
                    }}
                    className="block py-2 text-slate-600 hover:text-slate-900"
                  >
                    Transit Hotels
                  </a>
                  <a
                    href="/lounge-sleep"
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo('/lounge-sleep');
                      setMobileMenuOpen(false);
                    }}
                    className="block py-2 text-slate-600 hover:text-slate-900"
                  >
                    Lounge Sleep
                  </a>
                </div>
              )}
            </div>

            <a
              href="/airports"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/airports');
                setMobileMenuOpen(false);
              }}
              className="block text-slate-700 hover:text-slate-900 font-medium py-2"
            >
              Airports
            </a>

            <a
              href="/brands"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/brands');
                setMobileMenuOpen(false);
              }}
              className="block text-slate-700 hover:text-slate-900 font-medium py-2"
            >
              Brands
            </a>

            <a
              href="/blog"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/blog');
                setMobileMenuOpen(false);
              }}
              className="block text-slate-700 hover:text-slate-900 font-medium py-2"
            >
              Blog
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
