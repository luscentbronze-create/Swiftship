import React, { useState } from 'react';
import { Globe, Menu, X } from 'lucide-react';
import { PrimewayLogo } from './PrimewayLogo.tsx';

interface NavbarProps {
  currentTab: 'home' | 'track' | 'faq' | 'contact';
  onNavigate: (tab: 'home' | 'track' | 'faq' | 'contact') => void;
  onTrackCode?: (code: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('EN');
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const handleNavClick = (tab: 'home' | 'track' | 'faq' | 'contact') => {
    onNavigate(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B1118]/95 backdrop-blur-md border-b border-[#1A2230]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Name */}
          <button
            id="nav-logo-button"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
          >
            <PrimewayLogo className="w-8 h-8 shrink-0 transition-transform group-hover:scale-105" />
            <span className="text-lg sm:text-xl font-bold tracking-tight text-white whitespace-nowrap">
              Primeway Express
            </span>
          </button>

          {/* Desktop Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              id="nav-link-home"
              onClick={() => handleNavClick('home')}
              className={`text-sm font-medium transition-colors cursor-pointer ${
                currentTab === 'home'
                  ? 'text-white font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Home
            </button>
            <button
              id="nav-link-track"
              onClick={() => handleNavClick('track')}
              className={`text-sm font-medium transition-colors cursor-pointer ${
                currentTab === 'track'
                  ? 'text-white font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Track Shipment
            </button>
            <button
              id="nav-link-faq"
              onClick={() => handleNavClick('faq')}
              className={`text-sm font-medium transition-colors cursor-pointer ${
                currentTab === 'faq'
                  ? 'text-white font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              FAQ
            </button>
            <button
              id="nav-link-contact"
              onClick={() => handleNavClick('contact')}
              className={`text-sm font-medium transition-colors cursor-pointer ${
                currentTab === 'contact'
                  ? 'text-white font-semibold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Contact Us
            </button>
          </nav>

          {/* Right Action: Circular Globe Icon Button */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <button
                id="language-selector-button"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="w-10 h-10 rounded-full border border-slate-700/80 hover:border-slate-500 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#151D29] transition-all cursor-pointer"
                title="Select Language / Region"
                aria-label="Language and Region Settings"
              >
                <Globe className="w-4 h-4 stroke-[1.8]" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-[#151D29] border border-[#243044] rounded-xl shadow-2xl py-1.5 z-50 text-xs">
                  {['EN (English)', 'FR (Français)', 'ES (Español)', 'DE (Deutsch)'].map((lang) => {
                    const code = lang.slice(0, 2);
                    return (
                      <button
                        key={lang}
                        onClick={() => {
                          setSelectedLanguage(code);
                          setLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 hover:bg-[#1F2A3D] transition-colors ${
                          selectedLanguage === code ? 'text-[#FFE600] font-bold' : 'text-slate-300'
                        }`}
                      >
                        {lang}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#151D29] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#101722] border-b border-[#1E293B] px-4 pt-3 pb-5 space-y-2 animate-in fade-in slide-in-from-top-2">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between ${
              currentTab === 'home' ? 'bg-[#FFE600] text-[#0E1116]' : 'text-slate-200 hover:bg-[#1A2332]'
            }`}
          >
            <span>Home</span>
            {currentTab === 'home' && <span className="text-xs font-bold uppercase">Active</span>}
          </button>
          <button
            onClick={() => handleNavClick('track')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between ${
              currentTab === 'track' ? 'bg-[#FFE600] text-[#0E1116]' : 'text-slate-200 hover:bg-[#1A2332]'
            }`}
          >
            <span>Track Shipment</span>
            {currentTab === 'track' && <span className="text-xs font-bold uppercase">Active</span>}
          </button>
          <button
            onClick={() => handleNavClick('faq')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between ${
              currentTab === 'faq' ? 'bg-[#FFE600] text-[#0E1116]' : 'text-slate-200 hover:bg-[#1A2332]'
            }`}
          >
            <span>FAQ</span>
            {currentTab === 'faq' && <span className="text-xs font-bold uppercase">Active</span>}
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between ${
              currentTab === 'contact' ? 'bg-[#FFE600] text-[#0E1116]' : 'text-slate-200 hover:bg-[#1A2332]'
            }`}
          >
            <span>Contact Us</span>
            {currentTab === 'contact' && <span className="text-xs font-bold uppercase">Active</span>}
          </button>

          <div className="pt-2 border-t border-[#1E293B] flex items-center justify-between px-2 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <Globe className="w-3.5 h-3.5 text-[#FFE600]" />
              Language:
            </span>
            <div className="flex gap-1.5">
              {['EN', 'FR', 'ES', 'DE'].map((code) => (
                <button
                  key={code}
                  onClick={() => setSelectedLanguage(code)}
                  className={`px-2 py-1 rounded text-xs font-bold transition-colors ${
                    selectedLanguage === code
                      ? 'bg-[#FFE600] text-black'
                      : 'bg-[#1A2332] text-slate-300 hover:text-white'
                  }`}
                >
                  {code}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
