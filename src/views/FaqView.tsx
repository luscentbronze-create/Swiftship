import React, { useState, useMemo } from 'react';
import {
  Search,
  HelpCircle,
  ChevronDown,
  Clock,
  MapPin,
  CheckCircle2,
  Package,
  Truck,
  Plane,
  Ship,
  ShieldCheck,
  AlertCircle,
  Phone,
  Mail,
  ArrowRight,
} from 'lucide-react';

interface FaqItem {
  id: string;
  category: 'tracking' | 'delivery' | 'shipping' | 'support';
  question: string;
  shortSummary: string;
  content: React.ReactNode;
}

interface FaqViewProps {
  onTrackNavigate?: () => void;
}

export const FaqView: React.FC<FaqViewProps> = ({ onTrackNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'track-code': true,
    'milestone-meaning': true,
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    const allOpen: Record<string, boolean> = {};
    faqList.forEach((item) => {
      allOpen[item.id] = true;
    });
    setOpenItems(allOpen);
  };

  const collapseAll = () => {
    setOpenItems({});
  };

  const faqList: FaqItem[] = [
    {
      id: 'track-code',
      category: 'tracking',
      question: 'Where do I find my 11-character tracking code?',
      shortSummary: 'Found in your booking confirmation email, SMS alert, or shipping dispatch bill.',
      content: (
        <div className="space-y-3 text-slate-600 text-sm leading-relaxed">
          <p>
            Every SwiftShip shipment is assigned a unique <strong className="text-slate-900">11-character alphanumeric code</strong> (for example, <code className="px-2 py-0.5 rounded bg-slate-100 font-mono text-slate-900 font-bold text-xs border border-slate-200">TRK7A92X4B1</code> or <code className="px-2 py-0.5 rounded bg-slate-100 font-mono text-slate-900 font-bold text-xs border border-slate-200">8F2K91M7Q4Z</code>).
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="font-bold text-slate-900 block mb-1">1. Confirmation Email</span>
              Look in the subject line or receipt header sent right after cargo booking.
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="font-bold text-slate-900 block mb-1">2. SMS Dispatch Alert</span>
              Sent to the sender or receiver phone number once scanned at departure.
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <span className="font-bold text-slate-900 block mb-1">3. Airway Bill / Receipt</span>
              Printed directly beneath the top barcode on your paper consignment note.
            </div>
          </div>
          {onTrackNavigate && (
            <div className="pt-2">
              <button
                type="button"
                onClick={onTrackNavigate}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#854D0E] hover:text-[#92400E] bg-[#FEF9C3] hover:bg-[#FEF08A] px-3.5 py-1.5 rounded-lg border border-[#FEF08A] transition-colors cursor-pointer"
              >
                <span>Track a Shipment Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'milestone-meaning',
      category: 'tracking',
      question: 'What do the 5 milestone shipment statuses mean?',
      shortSummary: 'Shipment Created → Processing → In Transit → Out for Delivery → Delivered.',
      content: (
        <div className="space-y-3.5 text-sm text-slate-600">
          <p className="leading-relaxed">
            SwiftShip tracks packages across 5 standardized milestone stages:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
              <div>
                <strong className="text-slate-900 block text-xs">1. Shipment Created</strong>
                <span className="text-xs text-slate-500">Shipping documentation generated; consignment logged in database.</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <div>
                <strong className="text-slate-900 block text-xs">2. Processing</strong>
                <span className="text-xs text-slate-500">Parcel inspected, barcoded, weighed, and sorted at origin depot.</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <div>
                <strong className="text-slate-900 block text-xs">3. In Transit</strong>
                <span className="text-xs text-slate-500">Active conveyance via road freight, air cargo line, or sea vessel.</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFE600] ring-1 ring-amber-400 mt-1.5 shrink-0" />
              <div>
                <strong className="text-slate-900 block text-xs">4. Out for Delivery</strong>
                <span className="text-xs text-slate-500">Dispatched into courier van for same-day recipient handover.</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 sm:col-span-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <div>
                <strong className="text-slate-900 block text-xs">5. Delivered</strong>
                <span className="text-xs text-slate-500">Successfully handed over and signed for by consignee or agent.</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'not-updating',
      category: 'tracking',
      question: 'Why has my tracking status not updated in the last 24 hours?',
      shortSummary: 'Long-haul legs (such as sea shipping or international customs) scan at checkpoint ports.',
      content: (
        <div className="space-y-2.5 text-sm text-slate-600 leading-relaxed">
          <p>
            Tracking scans occur whenever a parcel passes through an optical sorting scanner, distribution hub, or customs station. During cross-country highway transit or intermodal ocean journeys, there may be periods of 24–48 hours between physical barcode scans.
          </p>
          <p>
            Rest assured, your estimated delivery date remains accurate. If a milestone shows no scan for more than 4 business days, please contact our dispatch desk.
          </p>
        </div>
      ),
    },
    {
      id: 'not-found-error',
      category: 'tracking',
      question: 'What should I do if the portal says "Tracking Code Not Found"?',
      shortSummary: 'Double-check character spacing and verify that the booking was created in the last 6 months.',
      content: (
        <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
          <p>
            If your code returns a not-found notice, check the following common causes:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
            <li><strong>Exact length:</strong> Codes must be exactly 11 characters (no dashes, spaces, or slashes).</li>
            <li><strong>Similar characters:</strong> Check for common mix-ups between the letter <code className="text-slate-900 font-bold font-mono">O</code> and zero <code className="text-slate-900 font-bold font-mono">0</code>, or the letter <code className="text-slate-900 font-bold font-mono">I</code> and number <code className="text-slate-900 font-bold font-mono">1</code>.</li>
            <li><strong>Processing latency:</strong> Newly generated consignments can take 15–30 minutes to propagate to the public lookup gateway.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'change-address',
      category: 'delivery',
      question: 'Can I change my delivery address while a shipment is in transit?',
      shortSummary: 'Address reroutes are permitted while the shipment is in Processing or early In Transit stages.',
      content: (
        <div className="space-y-2.5 text-sm text-slate-600 leading-relaxed">
          <p>
            Yes. Address modifications can be requested while the shipment status is <strong className="text-slate-900">Shipment Created</strong>, <strong className="text-slate-900">Processing</strong>, or <strong className="text-slate-900">In Transit</strong> prior to arriving at the final city depot.
          </p>
          <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
            Note: Once a parcel is <strong className="text-slate-800">Out for Delivery</strong>, it is on an active driver route and cannot be rerouted until a delivery attempt is completed or returned to the hub.
          </p>
        </div>
      ),
    },
    {
      id: 'missed-delivery',
      category: 'delivery',
      question: 'What happens if no one is available to receive the delivery?',
      shortSummary: 'The courier will make up to 3 delivery attempts or hold the item at a nearby service point.',
      content: (
        <div className="space-y-2.5 text-sm text-slate-600 leading-relaxed">
          <p>
            If the recipient is absent, our delivery partner will:
          </p>
          <ol className="list-decimal pl-5 space-y-1 text-xs text-slate-600">
            <li>Leave a digital missed-delivery notice via SMS and email.</li>
            <li>Schedule a complimentary re-delivery attempt on the next business morning.</li>
            <li>Alternatively, hold the package for up to 7 calendar days at the nearest regional pickup hub.</li>
          </ol>
        </div>
      ),
    },
    {
      id: 'shipping-methods',
      category: 'shipping',
      question: 'What is the speed difference between Air Express and Ocean Freight?',
      shortSummary: 'Air Express delivers in 1–3 business days; Ocean Maritime Freight takes 10–24 days.',
      content: (
        <div className="space-y-3 text-sm text-slate-600">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                <Plane className="w-3.5 h-3.5 text-amber-600" />
                <span>Air Express</span>
              </div>
              <p className="text-slate-500">1 - 3 Business Days. High-priority, temperature-monitored, fastest delivery.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                <Truck className="w-3.5 h-3.5 text-blue-600" />
                <span>Road Freight</span>
              </div>
              <p className="text-slate-500">3 - 7 Business Days. Reliable nationwide door-to-door network with live fleet GPS.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                <Ship className="w-3.5 h-3.5 text-emerald-600" />
                <span>Ocean Maritime</span>
              </div>
              <p className="text-slate-500">10 - 24 Days. Cost-effective volume shipping connecting major international container ports.</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'damaged-missing',
      category: 'support',
      question: 'What should I do if my shipment arrives damaged?',
      shortSummary: 'Take photos of exterior and contents, preserve all packaging, and submit a claim within 7 days.',
      content: (
        <div className="space-y-2.5 text-sm text-slate-600 leading-relaxed">
          <p>
            In the rare event of transit damage or missing contents:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
            <li>Note the damage with the courier driver prior to signing if possible.</li>
            <li>Take clear, well-lit photos of the shipping label, carton exterior, and damaged goods.</li>
            <li>Contact SwiftShip claims support within 7 business days for rapid claim resolution.</li>
          </ul>
        </div>
      ),
    },
    {
      id: 'proof-of-delivery',
      category: 'support',
      question: 'How do I download a Proof of Delivery (POD) receipt?',
      shortSummary: 'Once your status changes to "Delivered", the tracking page enables a 1-click POD download.',
      content: (
        <div className="space-y-2 text-sm text-slate-600 leading-relaxed">
          <p>
            When a shipment achieves the final <strong className="text-slate-900">Delivered</strong> milestone, a formal PDF receipt containing delivery timestamp, receiver signature confirmation, and package weight is made available for instant download or printing on the tracking result page.
          </p>
        </div>
      ),
    },
  ];

  // Filter items by category and query
  const filteredFaqs = useMemo(() => {
    return faqList.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.shortSummary.toLowerCase().includes(q);

      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="w-full bg-white text-slate-900">
      {/* Top Banner / Hero */}
      <section className="bg-slate-50 border-b border-slate-200 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF9C3] text-[#854D0E] border border-[#FEF08A] text-xs font-extrabold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Help Center & Knowledge Base</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about tracking your shipment, delivery timeframes, cargo handling, and customer support.
          </p>

          {/* Quick Search Bar */}
          <div className="pt-4 max-w-xl mx-auto">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions (e.g., tracking code, transit time, damage)..."
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-300 rounded-2xl text-slate-900 text-sm placeholder:text-slate-400 shadow-sm focus:outline-none focus:border-[#FFE600] focus:ring-2 focus:ring-[#FFE600]/30 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700 bg-slate-100 px-2 py-1 rounded-md"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main FAQ Content Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Category Filters + Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-8 border-b border-slate-200">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'All Questions' },
              { id: 'tracking', label: 'Tracking & Codes' },
              { id: 'delivery', label: 'Delivery & Time' },
              { id: 'shipping', label: 'Freight Methods' },
              { id: 'support', label: 'Claims & Help' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 justify-end text-xs text-slate-500">
            <button
              type="button"
              onClick={expandAll}
              className="hover:text-slate-900 font-medium px-2 py-1 rounded hover:bg-slate-100 transition-colors"
            >
              Expand all
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={collapseAll}
              className="hover:text-slate-900 font-medium px-2 py-1 rounded hover:bg-slate-100 transition-colors"
            >
              Collapse all
            </button>
          </div>
        </div>

        {/* Results count if filtering */}
        {(searchQuery || selectedCategory !== 'all') && (
          <div className="pt-6 pb-2 text-xs text-slate-500 flex items-center justify-between">
            <span>
              Showing <strong>{filteredFaqs.length}</strong> matching questions
            </span>
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="text-amber-700 font-semibold hover:underline"
              >
                Reset filters
              </button>
            )}
          </div>
        )}

        {/* FAQ Accordion List */}
        <div className="pt-6 space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-16 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800">No questions found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                We couldn't find any questions matching "{searchQuery}". Try a different search term or browse all topics.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-[#FFE600] text-slate-900 hover:bg-[#F2D900] transition-colors"
              >
                Clear Search
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq, index) => {
              const isOpen = !!openItems[faq.id];
              return (
                <div
                  key={faq.id}
                  id={`faq-${faq.id}`}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'bg-slate-50/80 border-slate-300 shadow-sm ring-1 ring-[#FFE600]/30'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/40 shadow-xs'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(faq.id)}
                    className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 transition-colors ${
                          isOpen
                            ? 'bg-[#FFE600] text-slate-900 shadow-xs'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {String(index + 1).padStart(2, '0')}
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
                            {faq.shortSummary}
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
            })
          )}
        </div>

        {/* Still Have Questions Box */}
        <div className="mt-16 p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-bold text-slate-900">
              Still have questions about your cargo?
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md leading-relaxed">
              Our regional logistics support team is ready to answer questions regarding tracking anomalies, custom manifests, or route schedules.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a
              href="mailto:support@swiftship.com"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold bg-white text-slate-800 border border-slate-200 hover:bg-slate-100 transition-colors shadow-xs"
            >
              <Mail className="w-4 h-4 text-slate-600" />
              <span>Email Support</span>
            </a>
            <a
              href="tel:+15551234567"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold bg-[#FFE600] text-slate-900 hover:bg-[#F2D900] transition-colors shadow-sm"
            >
              <Phone className="w-4 h-4" />
              <span>+1 (555) 123-4567</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
