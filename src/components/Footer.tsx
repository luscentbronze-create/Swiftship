import React from 'react';
import { SwiftShipLogo } from './SwiftShipLogo.tsx';

interface FooterProps {
  onNavigate: (tab: 'home' | 'track' | 'faq') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#0B1118] text-slate-300 border-t border-[#1A2230] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 pb-10 border-b border-[#1A2230]">
          {/* Brand & Slogan */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <SwiftShipLogo className="w-7 h-7" />
              <span className="text-xl font-bold tracking-tight text-white">
                SwiftShip
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              Moving your world, one shipment at a time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3.5">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('track')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Track Shipment
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('faq')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  FAQ & Help
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3.5">
              Support
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('faq')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Knowledge Base
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('faq')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  FAQs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('track')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Track shipment
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex items-center justify-between text-xs text-slate-400">
          <p>© 2026 SwiftShip. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
