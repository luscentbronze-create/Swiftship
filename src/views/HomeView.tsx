import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  Globe,
  Headphones,
  ArrowRight,
  AlertCircle,
  Loader2,
  Plane,
  Ship,
  ChevronDown,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import { validateTrackingCode } from '../services/trackingService.ts';

interface HomeViewProps {
  onTrack: (code: string) => void;
  isLoading?: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({ onTrack, isLoading }) => {
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // FAQ accordion state - default first two items open as they directly address user query
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateTrackingCode(code);
    if (!validation.isValid || !validation.normalizedCode) {
      setErrorMessage(
        validation.error || 'Please enter a valid 11-character alphanumeric tracking code.'
      );
      return;
    }
    setErrorMessage(null);
    onTrack(validation.normalizedCode);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const cleaned = rawVal.replace(/[^a-zA-Z0-9]/g, '').slice(0, 11).toUpperCase();
    setCode(cleaned);
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  const handleSampleClick = (sampleCode: string) => {
    setCode(sampleCode);
    setErrorMessage(null);
    onTrack(sampleCode);
  };

  // 5 FAQ Questions specified by user
  const faqs = [
    {
      question: 'How do I track my shipment?',
      shortAnswer: 'Locate your 11-character alphanumeric tracking code and search above.',
      content: (
        <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
          <p>
            Tracking your package with TraceCargo is fast and direct. Follow these quick steps:
          </p>
          <ol className="list-decimal pl-5 space-y-2 text-slate-600 text-xs sm:text-sm">
            <li>
              <strong className="text-slate-900">Locate your tracking code:</strong> Find the 11-character alphanumeric code (e.g., <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-mono border border-slate-200 font-semibold">TRK7A92X4B1</code>) on your shipping receipt, consignment invoice, or email notification.
            </li>
            <li>
              <strong className="text-slate-900">Enter the code:</strong> Type or paste the 11 characters into the search box on the homepage or the Track Shipment page.
            </li>
            <li>
              <strong className="text-slate-900">Click "Track Shipment":</strong> You will instantly view your real-time shipment status, live timeline progress, origin/destination hubs, estimated delivery schedule, and past checkpoint scans.
            </li>
          </ol>
        </div>
      ),
    },
    {
      question: "What does 'In Transit' and each shipment status mean?",
      shortAnswer: 'An overview of the 5 progressive milestones from creation to final delivery.',
      content: (
        <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
          <p>
            Your package progresses through 5 official stages. Here is what each status represents:
          </p>
          <div className="grid grid-cols-1 gap-2.5 pt-1">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200 mb-1">
                1. Shipment Created
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                The shipping order has been generated and the tracking number logged in the dispatch database. The merchant or sender is packaging the item.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-blue-200/80 shadow-xs">
              <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-200 mb-1">
                2. Processing
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                The parcel has been physically received at the primary sorting center, weighed, safety-screened, and sorted onto the assigned transport manifest.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-yellow-300 shadow-xs">
              <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase bg-yellow-50 text-yellow-800 border border-yellow-300 mb-1">
                3. In Transit
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                The package is actively traveling between logistical terminals, whether via line-haul freight trucks, commercial cargo aircraft, or ocean shipping vessels.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-amber-200/80 shadow-xs">
              <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase bg-amber-50 text-amber-800 border border-amber-200 mb-1">
                4. Out for Delivery
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                The package has reached the local delivery depot in your town or district and has been loaded onto the courier driver's vehicle for final drop-off today.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-emerald-200/80 shadow-xs">
              <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 mb-1">
                5. Delivered
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                The parcel has safely reached the destination address and has been signed for or placed in a secure location by the courier.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      question: "What should I do if my tracking code shows 'Tracking Code Not Found'?",
      shortAnswer: 'Verify code format or allow system synchronization time.',
      content: (
        <div className="space-y-2 text-slate-600 text-xs sm:text-sm leading-relaxed">
          <p>
            If your code returns a not-found error, please check the following:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
            <li>Ensure the tracking code is exactly <strong>11 characters</strong> with both numbers and letters (e.g., <span className="bg-slate-100 px-1 py-0.5 rounded text-slate-900 font-mono font-semibold">TRK7A92X4B1</span>).</li>
            <li>Check for accidental spaces, hyphens, or transposed characters like the number 0 and letter O.</li>
            <li>If your order was placed within the last 30 minutes, the carrier may still be finalizing the electronic manifest. Please allow a brief interval and retry.</li>
          </ul>
        </div>
      ),
    },
    {
      question: "Why are some sender or receiver addresses hidden?",
      shortAnswer: 'Administrative privacy controls protect sensitive client information.',
      content: (
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
          To comply with commercial privacy and data protection standards, TraceCargo system administrators can designate specific fields—such as direct contact numbers, residential street addresses, or cargo valuations—as private. Even with protected contact details, your public milestone timeline and location scans remain 100% visible and accurate.
        </p>
      ),
    },
    {
      question: 'Can I change my delivery address or schedule while in transit?',
      shortAnswer: 'Address adjustments can be requested prior to the out-for-delivery milestone.',
      content: (
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
          Yes. If your package is still in the <em className="text-slate-800">Shipment Created</em>, <em className="text-slate-800">Processing</em>, or <em className="text-slate-800">In Transit</em> stages, you can request an address correction or hold for pickup by contacting our 24/7 customer support desk with your 11-character tracking code and proof of identity. Once a shipment is marked <em className="text-slate-800">Out for Delivery</em>, re-routing is no longer possible for that delivery cycle.
        </p>
      ),
    },
  ];

  return (
    <div className="w-full flex flex-col">
      {/* Hero Section matching image.png - Fills the page viewport gracefully */}
      <section className="relative min-h-[calc(100vh-5rem)] min-h-[640px] flex items-center overflow-hidden bg-[#0B1118]">
        {/* Cinematic Background Image: Highway, Semi-truck & Airplane at Sunset */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/home_hero_highway_truck_1789732054438.jpg"
            alt="Cargo logistics truck on highway with freight airplane at sunset"
            className="w-full h-full object-cover object-right md:object-[75%_center] lg:object-[85%_center] filter brightness-95 contrast-105"
          />
          {/* Gradients to ensure pristine contrast on the left and full visibility of truck/plane on the right */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1118] via-[#0B1118]/85 md:via-[#0B1118]/65 to-transparent/10" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B1118]/70 via-transparent to-[#0B1118]/60" />
        </div>

        {/* Hero Content - Centered vertically within viewport, with balanced refined proportions and professional spacing */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 flex items-center">
          <div className="max-w-xl lg:max-w-2xl text-left">
            {/* Tagline / Eyebrow */}
            <p className="inline-flex items-center gap-2.5 sm:gap-3 text-xs sm:text-sm font-semibold tracking-[0.25em] text-slate-300 uppercase mb-5">
              <span>FAST</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" aria-hidden="true" />
              <span>SAFE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white shrink-0" aria-hidden="true" />
              <span>RELIABLE</span>
            </p>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-6 sm:mb-7">
              Track Your <span className="text-[#FFE600]">Shipment</span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base md:text-lg text-slate-300 font-normal leading-relaxed mb-9 sm:mb-10 max-w-xl">
              Enter your 11-character alphanumeric tracking code to view your shipment information and delivery status.
            </p>

            {/* Search Input and Button Form - Side by Side on Desktop */}
            <form onSubmit={handleSubmit} className="w-full max-w-xl lg:max-w-2xl space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch gap-3.5 sm:gap-4">
                {/* Crisp White Input */}
                <div className="relative flex-1">
                  <input
                    id="hero-tracking-input"
                    type="text"
                    value={code}
                    onChange={handleInputChange}
                    placeholder="Enter 11-character tracking code (e.g. TRK7A92X4B1)"
                    maxLength={11}
                    autoComplete="off"
                    spellCheck="false"
                    className="w-full h-13 sm:h-14 px-5 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 text-sm sm:text-base font-normal tracking-wide shadow-lg border border-transparent focus:border-[#FFE600] focus:outline-none uppercase"
                  />
                  {code.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setCode('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 text-sm"
                      aria-label="Clear input"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Bright Yellow Button */}
                <button
                  type="submit"
                  id="hero-track-submit-btn"
                  disabled={isLoading}
                  className="h-13 sm:h-14 px-6 sm:px-7 rounded-lg font-bold text-sm sm:text-base text-[#0E1116] bg-[#FFE600] hover:bg-[#F2D900] active:scale-[0.99] transition-all cursor-pointer shadow-lg shadow-[#FFE600]/15 flex items-center justify-center gap-2 whitespace-nowrap shrink-0 disabled:opacity-60"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <span>Track Shipment</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </div>

              {/* Error validation message */}
              {errorMessage && (
                <div
                  id="hero-tracking-error-msg"
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-red-500/20 border border-red-500/40 text-red-200 text-xs sm:text-sm font-medium"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Sample test code quick chips */}
              <div className="pt-2.5 flex items-center gap-2.5 flex-wrap text-xs text-slate-400">
                <span>Quick demo:</span>
                <button
                  type="button"
                  onClick={() => handleSampleClick('TRK7A92X4B1')}
                  className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-200 font-mono text-xs transition-colors cursor-pointer"
                >
                  TRK7A92X4B1 (In Transit)
                </button>
                <button
                  type="button"
                  onClick={() => handleSampleClick('8F2K91M7Q4Z')}
                  className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-slate-200 font-mono text-xs transition-colors cursor-pointer"
                >
                  8F2K91M7Q4Z (Out for Delivery)
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section - Clean Crisp White Background matching image.png */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-slate-100">
            {/* Feature 1: Safe & Secure */}
            <div
              id="feature-card-safe"
              className="flex flex-col items-center text-center px-4 sm:px-6 py-2"
            >
              <div className="w-14 h-14 rounded-full bg-[#FEF9C3] flex items-center justify-center text-[#92400E] mb-5 shadow-sm">
                <ShieldCheck className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Safe &amp; Secure
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-[230px]">
                Your information is protected with industry-standard security.
              </p>
            </div>

            {/* Feature 2: Real-Time Updates */}
            <div
              id="feature-card-updates"
              className="flex flex-col items-center text-center px-4 sm:px-6 py-2"
            >
              <div className="w-14 h-14 rounded-full bg-[#FEF9C3] flex items-center justify-center text-[#92400E] mb-5 shadow-sm">
                <Truck className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Real-Time Updates
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-[230px]">
                Get the latest status on your shipment.
              </p>
            </div>

            {/* Feature 3: Global Coverage */}
            <div
              id="feature-card-coverage"
              className="flex flex-col items-center text-center px-4 sm:px-6 py-2"
            >
              <div className="w-14 h-14 rounded-full bg-[#FEF9C3] flex items-center justify-center text-[#92400E] mb-5 shadow-sm">
                <Globe className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Global Coverage
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-[230px]">
                We deliver across multiple countries.
              </p>
            </div>

            {/* Feature 4: 24/7 Support */}
            <div
              id="feature-card-support"
              className="flex flex-col items-center text-center px-4 sm:px-6 py-2"
            >
              <div className="w-14 h-14 rounded-full bg-[#FEF9C3] flex items-center justify-center text-[#92400E] mb-5 shadow-sm">
                <Headphones className="w-6 h-6 stroke-[2]" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                24/7 Support
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-[230px]">
                Our team is always here to help you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: Freight Modes Image Gallery (Air, Land, Sea) */}
      <section id="freight-services-gallery" className="py-20 lg:py-24 bg-[#0E1116] border-b border-[#1E232F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Centered Header with Title & Description */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#FFE600] inline-block mb-3">
              GLOBAL LOGISTICS NETWORK
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Multimodal Transport Solutions
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-3.5 leading-relaxed">
              Whether by air, land, or sea, TraceCargo synchronizes every parcel movement with continuous location checkpoints and reliable dispatch monitoring.
            </p>
          </div>

          {/* 3-Column Image Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Gallery Card 1: Air Shipping */}
            <div
              id="gallery-card-air"
              className="bg-[#151921] border border-[#1E232F] rounded-3xl overflow-hidden shadow-xl flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
                <img
                  src="/images/air_freight_cargo_1789732257120.jpg"
                  alt="Air freight cargo airplane on runway loading containers"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#151921] via-transparent to-transparent opacity-80" />
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E1116]/85 backdrop-blur-md border border-white/10 text-xs font-bold text-white shadow-md">
                  <Plane className="w-3.5 h-3.5 text-[#FFE600]" />
                  <span>Air Shipping</span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Air Freight Express
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Fast worldwide routing with priority tarmac handling, dedicated airport cargo hubs, and accelerated customs transit.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-[#1E232F] flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>Transit: 24 - 72 Hours</span>
                  <span className="text-[#FFE600] font-semibold">Priority Scans</span>
                </div>
              </div>
            </div>

            {/* Gallery Card 2: Land Shipping */}
            <div
              id="gallery-card-land"
              className="bg-[#151921] border border-[#1E232F] rounded-3xl overflow-hidden shadow-xl flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
                <img
                  src="/images/land_shipping_trucks_1789732269599.jpg"
                  alt="Land shipping commercial semi freight trucks on highway"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#151921] via-transparent to-transparent opacity-80" />
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E1116]/85 backdrop-blur-md border border-white/10 text-xs font-bold text-white shadow-md">
                  <Truck className="w-3.5 h-3.5 text-[#FFE600]" />
                  <span>Land Shipping</span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Ground &amp; Trucking
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Reliable intercity freight haulage, door-to-door ground distribution, and temperature-regulated logistics fleets.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-[#1E232F] flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>Transit: 2 - 5 Days</span>
                  <span className="text-[#FFE600] font-semibold">Regional Corridors</span>
                </div>
              </div>
            </div>

            {/* Gallery Card 3: Sea Shipping */}
            <div
              id="gallery-card-sea"
              className="bg-[#151921] border border-[#1E232F] rounded-3xl overflow-hidden shadow-xl flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
                <img
                  src="/images/sea_ocean_freight_1789732279678.jpg"
                  alt="Sea ocean freight container ship on deep blue waters"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#151921] via-transparent to-transparent opacity-80" />
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E1116]/85 backdrop-blur-md border border-white/10 text-xs font-bold text-white shadow-md">
                  <Ship className="w-3.5 h-3.5 text-[#FFE600]" />
                  <span>Sea Shipping</span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Ocean Maritime Freight
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    Economical high-volume intermodal container shipping connecting key maritime seaports across international waters.
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-[#1E232F] flex items-center justify-between text-xs text-slate-400 font-medium">
                  <span>Transit: 10 - 24 Days</span>
                  <span className="text-[#FFE600] font-semibold">Bulk Container</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: FAQ Section (Exactly 5 Questions) - Crisp White Theme */}
      <section id="faq-section" className="py-20 lg:py-24 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Centered Header with Title & Description */}
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#92400E] bg-[#FEF9C3] px-3.5 py-1 rounded-full inline-block mb-3.5">
              GOT QUESTIONS?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 text-sm sm:text-base mt-3.5 leading-relaxed">
              Find instant answers to common questions about tracking procedures, shipping milestone statuses, and delivery options.
            </p>
          </div>

          {/* 5 FAQ Accordion Cards */}
          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  id={`faq-item-${idx + 1}`}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'bg-slate-50/80 border-slate-300 shadow-md ring-1 ring-[#FFE600]/40'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 shadow-xs'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 transition-colors ${
                          isOpen
                            ? 'bg-[#FFE600] text-[#0E1116]'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        0{idx + 1}
                      </div>
                      <div>
                        <h3
                          className={`text-base sm:text-lg font-bold transition-colors ${
                            isOpen ? 'text-slate-900' : 'text-slate-800 hover:text-slate-900'
                          }`}
                        >
                          {faq.question}
                        </h3>
                        {!isOpen && (
                          <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                            {faq.shortAnswer}
                          </p>
                        )}
                      </div>
                    </div>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen
                          ? 'bg-[#FEF9C3] text-[#854D0E] rotate-180'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-slate-200">
                      <div className="pt-3">{faq.content}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Quick Help Footer Box */}
          <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#FEF9C3] flex items-center justify-center text-[#854D0E] shrink-0">
                <HelpCircle className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Still have questions?</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Our customer logistics specialists are on standby 24/7.
                </p>
              </div>
            </div>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                // If App has tab navigation, click contact tab
                const contactBtn = document.getElementById('nav-link-contact');
                if (contactBtn) contactBtn.click();
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#FFE600] text-[#0E1116] hover:bg-[#F2D900] transition-all cursor-pointer whitespace-nowrap shadow-sm"
            >
              <span>Contact Support</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
