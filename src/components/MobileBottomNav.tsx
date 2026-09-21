import React from 'react';
import { Home, Search, HelpCircle, PhoneCall } from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: 'home' | 'track' | 'faq' | 'contact';
  onNavigate: (tab: 'home' | 'track' | 'faq' | 'contact') => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentTab, onNavigate }) => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0E1116]/95 backdrop-blur-lg border-t border-[#1E232F] px-4 py-2">
      <div className="flex items-center justify-around">
        <button
          id="mobile-bottom-home"
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center gap-1 py-1 px-2 transition-colors ${
            currentTab === 'home' ? 'text-[#FFE600]' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[11px] font-semibold">Home</span>
        </button>

        <button
          id="mobile-bottom-track"
          onClick={() => onNavigate('track')}
          className={`flex flex-col items-center gap-1 py-1 px-2 transition-colors ${
            currentTab === 'track' ? 'text-[#FFE600]' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[11px] font-semibold">Track</span>
        </button>

        <button
          id="mobile-bottom-faq"
          onClick={() => onNavigate('faq')}
          className={`flex flex-col items-center gap-1 py-1 px-2 transition-colors ${
            currentTab === 'faq' ? 'text-[#FFE600]' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <HelpCircle className="w-5 h-5" />
          <span className="text-[11px] font-semibold">FAQ</span>
        </button>

        <button
          id="mobile-bottom-contact"
          onClick={() => onNavigate('contact')}
          className={`flex flex-col items-center gap-1 py-1 px-2 transition-colors ${
            currentTab === 'contact' ? 'text-[#FFE600]' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <PhoneCall className="w-5 h-5" />
          <span className="text-[11px] font-semibold">Contact</span>
        </button>
      </div>
    </div>
  );
};

