import React, { useState } from 'react';
import { Phone, Mail, ExternalLink, Copy, Check, Clock, MessageSquare, Send, ShieldCheck } from 'lucide-react';

interface ContactViewProps {
  onTrackNavigate?: () => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onTrackNavigate }) => {
  const contactPhone = '+1 (878) 216-9518';
  const contactEmail = 'support@tracecargo.com';
  const [copied, setCopied] = useState(false);
  
  // Quick message builder that redirects directly to email / Gmail
  const [trackingCode, setTrackingCode] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contactEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getEmailSubject = () => {
    if (subject.trim()) {
      return trackingCode.trim()
        ? `[TraceCargo - ${trackingCode.trim()}] ${subject.trim()}`
        : `[TraceCargo] ${subject.trim()}`;
    }
    return trackingCode.trim()
      ? `[TraceCargo] Inquiry for Shipment ${trackingCode.trim()}`
      : 'Inquiry - TraceCargo Shipment';
  };

  const getEmailBody = () => {
    let body = message.trim();
    if (trackingCode.trim()) {
      body = `Tracking Code: ${trackingCode.trim()}\n\n${body}`;
    }
    return body;
  };

  const mailtoUrl = `mailto:${contactEmail}?subject=${encodeURIComponent(getEmailSubject())}&body=${encodeURIComponent(getEmailBody())}`;
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(contactEmail)}&su=${encodeURIComponent(getEmailSubject())}&body=${encodeURIComponent(getEmailBody())}`;

  return (
    <div className="w-full bg-white text-slate-900 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF9C3] border border-[#FEF08A] text-[#854D0E] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Dedicated Customer Support</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Contact Us
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Need help with a consignment or dispatch update? Reach out directly by phone or email, and our logistics coordinators will assist you immediately.
          </p>
        </div>

        {/* 2 Primary Direct Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Phone */}
          <div
            id="contact-phone-card"
            className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FEF9C3] border border-[#FEF08A] flex items-center justify-center text-[#854D0E]">
                <Phone className="w-6 h-6 stroke-[2]" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Phone Support
                </span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                  {contactPhone}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Direct dispatch line for real-time shipment updates, expedited routing, and delivery assistance.
                </p>
              </div>
            </div>

            <div className="pt-6">
              <a
                href={`tel:${contactPhone.replace(/[^+\d]/g, '')}`}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm text-[#0E1116] bg-[#FFE600] hover:bg-[#F2D900] active:scale-[0.99] transition-all shadow-sm cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Call {contactPhone}</span>
              </a>
            </div>
          </div>

          {/* Card 2: Email & Gmail */}
          <div
            id="contact-email-card"
            className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-all"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#FEF9C3] border border-[#FEF08A] flex items-center justify-center text-[#854D0E]">
                  <Mail className="w-6 h-6 stroke-[2]" />
                </div>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Copy email address to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Email</span>
                    </>
                  )}
                </button>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Email Support
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1 break-all">
                  {contactEmail}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Click to open directly in your preferred email client or launch Gmail with a single click.
                </p>
              </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row gap-2.5">
              <a
                href={mailtoUrl}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-[#0B1118] hover:bg-[#1A2332] transition-colors cursor-pointer text-center"
              >
                <Mail className="w-4 h-4" />
                <span>Default Email</span>
              </a>
              <a
                href={gmailUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm text-slate-900 bg-white border border-slate-300 hover:bg-slate-100 transition-colors cursor-pointer text-center"
              >
                <span>Open in Gmail</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </a>
            </div>
          </div>
        </div>

        {/* Quick Email Inquiry Helper (Lightweight & Clean) */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700">
              <MessageSquare className="w-5 h-5 text-[#854D0E]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Send a Message via Email
              </h3>
              <p className="text-xs text-slate-500">
                Type your inquiry below to open your email or Gmail pre-filled and ready to send.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contact-tracking-code" className="block text-xs font-bold text-slate-700 mb-1">
                Tracking Code (Optional)
              </label>
              <input
                id="contact-tracking-code"
                type="text"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value.toUpperCase().slice(0, 11))}
                placeholder="e.g. TRK7A92X4B1"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#FFE600] uppercase font-mono"
              />
            </div>
            <div>
              <label htmlFor="contact-subject" className="block text-xs font-bold text-slate-700 mb-1">
                Subject
              </label>
              <input
                id="contact-subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Delivery Status Inquiry"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#FFE600]"
              />
            </div>
          </div>

          <div>
            <label htmlFor="contact-message" className="block text-xs font-bold text-slate-700 mb-1">
              Your Message
            </label>
            <textarea
              id="contact-message"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your question or shipment concern..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-[#FFE600] resize-none"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <span>24/7 Global Freight & Dispatch Monitoring</span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a
                href={gmailUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-white text-slate-900 border border-slate-300 hover:bg-slate-100 transition-colors shadow-xs"
              >
                <span>Compose in Gmail</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </a>
              <a
                href={mailtoUrl}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#FFE600] text-slate-900 hover:bg-[#F2D900] transition-colors shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send via Mail</span>
              </a>
            </div>
          </div>
        </div>

        {/* Quick redirect to Tracking */}
        {onTrackNavigate && (
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onTrackNavigate}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 underline underline-offset-4 transition-colors cursor-pointer"
            >
              Looking to track a package instead? Go to Track Shipment &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
