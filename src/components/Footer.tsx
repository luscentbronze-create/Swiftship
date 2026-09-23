import React from 'react';
import { Mail, Phone, ExternalLink } from 'lucide-react';
import { PrimewayLogo } from './PrimewayLogo.tsx';

interface FooterProps {
  onNavigate: (tab: 'home' | 'track' | 'faq' | 'contact') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const contactPhone = '+1 (878) 216-9518';
  const contactEmail = 'support@primewayexpress.org';
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(contactEmail)}`;

  return (
    <footer className="bg-[#0B1118] text-slate-300 border-t border-[#1A2230] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-[#1A2230]">
          {/* Brand & Slogan */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <PrimewayLogo className="w-7 h-7" />
              <span className="text-xl font-bold tracking-tight text-white">
                Primeway Express
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
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Contact Us
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

          {/* Contact Us - Strictly Phone & Email */}
          <div id="footer-contact-us">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3.5">
              Contact Us
            </h4>
            <ul className="space-y-3 text-xs">
              <li>
                <a
                  href={`tel:${contactPhone.replace(/[^+\d]/g, '')}`}
                  className="inline-flex items-center gap-2.5 text-slate-400 hover:text-[#FFE600] transition-colors group"
                >
                  <Phone className="w-4 h-4 text-[#FFE600] shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{contactPhone}</span>
                </a>
              </li>
              <li className="space-y-1">
                <a
                  href={`mailto:${contactEmail}`}
                  className="inline-flex items-center gap-2.5 text-slate-400 hover:text-[#FFE600] transition-colors group break-all"
                >
                  <Mail className="w-4 h-4 text-[#FFE600] shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{contactEmail}</span>
                </a>
                <div className="pl-6.5 text-[11px]">
                  <a
                    href={gmailComposeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-500 hover:text-[#FFE600] inline-flex items-center gap-1 transition-colors"
                    title="Open compose window directly in Gmail"
                  >
                    <span>Open in Gmail</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© 2026 Primeway Express. All rights reserved.</p>
          <p className="text-slate-500 text-[11px]">Reliable Global Freight & Logistics</p>
        </div>
      </div>
    </footer>
  );
};
