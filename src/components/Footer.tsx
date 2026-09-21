import React from 'react';
import { Facebook, Linkedin, Twitter } from 'lucide-react';
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
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 SwiftShip. All rights reserved.</p>

          {/* Social Icons matching image.png */}
          <div className="flex items-center gap-4 text-slate-400">
            <a
              href="#facebook"
              aria-label="Facebook"
              className="hover:text-white transition-colors cursor-pointer"
            >
              <Facebook className="w-4 h-4" />
            </a>
            {/* Globe / Web / Dribbble */}
            <a
              href="#network"
              aria-label="Network"
              className="hover:text-white transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" fill="none" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20M12 2a14.5 14.5 0 0 1 0 20M2 12h20" stroke="currentColor" strokeWidth="1.8" fill="none" />
              </svg>
            </a>
            {/* X / Twitter */}
            <a
              href="#twitter"
              aria-label="X Twitter"
              className="hover:text-white transition-colors cursor-pointer"
            >
              <Twitter className="w-4 h-4" />
            </a>
            {/* LinkedIn */}
            <a
              href="#linkedin"
              aria-label="LinkedIn"
              className="hover:text-white transition-colors cursor-pointer"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
