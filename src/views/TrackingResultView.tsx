import React, { useState } from 'react';
import {
  CheckCircle2,
  Copy,
  Check,
  Plane,
  Truck,
  Ship,
  Zap,
  Package,
  Calendar,
  Lock,
  ArrowLeft,
  Search,
  ExternalLink,
} from 'lucide-react';
import { CustomerShipmentView } from '../types.ts';
import { ShipmentTimeline } from '../components/ShipmentTimeline.tsx';
import { TrackingCodeInput } from '../components/TrackingCodeInput.tsx';

interface TrackingResultViewProps {
  shipment: CustomerShipmentView;
  onTrackNew: (code: string) => void;
  onBackToSearch: () => void;
}

export const TrackingResultView: React.FC<TrackingResultViewProps> = ({
  shipment,
  onTrackNew,
  onBackToSearch,
}) => {
  const [copied, setCopied] = useState(false);
  const [showSearchBox, setShowSearchBox] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(shipment.trackingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Transportation icon helper
  const getTransportIcon = (method?: string) => {
    switch (method?.toLowerCase()) {
      case 'air':
        return <Plane className="w-3.5 h-3.5 text-sky-400" />;
      case 'ocean':
      case 'sea':
        return <Ship className="w-3.5 h-3.5 text-blue-400" />;
      case 'express':
        return <Zap className="w-3.5 h-3.5 text-[#FFE600]" />;
      default:
        return <Truck className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  // Safely format package weight without placeholder dashes or null rendering
  const formattedWeight = (() => {
    const raw = shipment?.details?.weight;
    if (raw === undefined || raw === null) return null;
    const str = String(raw).trim();
    if (!str || str.toLowerCase() === 'null' || str === '-' || str === 'undefined') return null;
    if (/^\d+(\.\d+)?$/.test(str)) {
      return `${str} kg`;
    }
    return str;
  })();

  // Safely format dimensions (L × W) without placeholder dashes or null rendering
  const formattedDimensions = (() => {
    const dims = shipment?.details?.dimensions;
    if (dims && typeof dims === 'string') {
      const clean = dims.trim();
      if (clean && clean.toLowerCase() !== 'null' && clean !== '-' && clean !== 'undefined') {
        return clean;
      }
    }

    const rawL = shipment?.details?.length;
    const rawW = shipment?.details?.width;
    const l = rawL !== undefined && rawL !== null ? String(rawL).trim() : '';
    const w = rawW !== undefined && rawW !== null ? String(rawW).trim() : '';

    const validL = l && l.toLowerCase() !== 'null' && l !== '-' && l !== 'undefined' ? l : null;
    const validW = w && w.toLowerCase() !== 'null' && w !== '-' && w !== 'undefined' ? w : null;

    if (validL && validW) {
      return `${validL} × ${validW}`;
    }
    if (validL) {
      return validL;
    }
    if (validW) {
      return validW;
    }
    return null;
  })();

  return (
    <div className="w-full bg-[#0E1116] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation & Secondary Actions */}
        <div className="flex items-center justify-between">
          <button
            id="back-to-home-link-btn"
            onClick={onBackToSearch}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Track Another Shipment</span>
          </button>

          <button
            id="toggle-search-input-btn"
            onClick={() => setShowSearchBox(!showSearchBox)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-[#151921] border border-[#2B3242] hover:text-white hover:border-[#FFE600]/50 transition-colors cursor-pointer"
          >
            <Search className="w-3.5 h-3.5 text-[#FFE600]" />
            <span>{showSearchBox ? 'Close Search' : 'New Lookup'}</span>
          </button>
        </div>

        {/* Collapsible New Lookup Input */}
        {showSearchBox && (
          <div className="p-4 rounded-2xl bg-[#151921] border border-[#2B3242] animate-in fade-in">
            <TrackingCodeInput
              variant="compact"
              onTrack={(code) => {
                setShowSearchBox(false);
                onTrackNew(code);
              }}
            />
          </div>
        )}

        {/* Green Top Alert Banner: "Shipment Found" */}
        <div
          id="shipment-found-banner"
          className="flex items-center gap-3.5 px-5 py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-white shadow-lg"
        >
          <div className="w-9 h-9 rounded-full bg-emerald-500 text-[#0E1116] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-emerald-300">Shipment Found</h3>
            <p className="text-xs text-slate-300">
              Here is your shipment information and current status.
            </p>
          </div>
        </div>

        {/* Main Tracking Details & Timeline Card */}
        <div className="bg-[#151921] border border-[#1E232F] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-8">
          {/* Header Row: Tracking Code & Status Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1E232F]">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Tracking Code
              </span>
              <div className="flex items-center gap-3 mt-1">
                <h1
                  id="tracking-result-code-display"
                  className="text-2xl sm:text-3xl md:text-4xl font-black font-mono tracking-wider text-white"
                >
                  {shipment.trackingCode}
                </h1>
                <button
                  id="copy-tracking-code-btn"
                  onClick={handleCopy}
                  className="p-2 rounded-xl bg-[#1E232F] hover:bg-[#2B3242] text-slate-300 hover:text-white transition-colors cursor-pointer border border-[#2B3242]"
                  title="Copy tracking code"
                  aria-label="Copy tracking code"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                {copied && (
                  <span className="text-xs font-semibold text-emerald-400 animate-in fade-in">
                    Copied!
                  </span>
                )}
              </div>
            </div>

            {/* Status Pill Badge */}
            <div className="self-start sm:self-center">
              <span
                id="current-shipment-status-badge"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-inner"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                {shipment.status}
              </span>
            </div>
          </div>

          {/* Visual Timeline (Horizontal on Desktop, Vertical on Mobile) */}
          <div>
            <ShipmentTimeline
              currentStatus={shipment.status}
              history={shipment.history}
            />
          </div>
        </div>

        {/* 3 Detail Cards: Shipment Details, Sender Info, Receiver Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Shipment Details */}
          <div
            id="shipment-details-card"
            className="bg-[#151921] border border-[#1E232F] rounded-2xl p-6 shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#1E232F] pb-3 flex-wrap gap-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Package className="w-4 h-4 text-[#FFE600]" />
                <span>Shipment Details</span>
              </h4>
              <div className="flex items-center gap-1.5 flex-wrap">
                {formattedWeight && (
                  <span
                    id="tag-package-weight"
                    className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#1E232F] text-amber-300 border border-amber-400/20"
                    title="Package Weight"
                  >
                    {formattedWeight}
                  </span>
                )}
                {formattedDimensions && (
                  <span
                    id="tag-dimensions"
                    className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[#1E232F] text-sky-300 border border-sky-400/20"
                    title="Dimensions (L × W)"
                  >
                    {formattedDimensions}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-3 text-xs">
              {shipment.details.product && (
                <div className="flex justify-between items-center py-1 border-b border-[#1E232F]/60">
                  <span className="text-slate-400">Product</span>
                  <span className="font-semibold text-white">{shipment.details.product}</span>
                </div>
              )}
              {shipment.details.quantity && (
                <div className="flex justify-between items-center py-1 border-b border-[#1E232F]/60">
                  <span className="text-slate-400">Quantity</span>
                  <span className="font-semibold text-white">{shipment.details.quantity}</span>
                </div>
              )}
              {shipment.details.transportationMethod && (
                <div className="flex justify-between items-center py-1 border-b border-[#1E232F]/60">
                  <span className="text-slate-400">Transportation</span>
                  <span className="font-semibold text-white inline-flex items-center gap-1.5">
                    {getTransportIcon(shipment.details.transportationMethod)}
                    {shipment.details.transportationMethod}
                  </span>
                </div>
              )}
              {formattedWeight && (
                <div id="row-package-weight" className="flex justify-between items-center py-1 border-b border-[#1E232F]/60">
                  <span className="text-slate-400">Package Weight</span>
                  <span className="font-semibold text-white font-mono">{formattedWeight}</span>
                </div>
              )}
              {formattedDimensions && (
                <div id="row-dimensions" className="flex justify-between items-center py-1 border-b border-[#1E232F]/60">
                  <span className="text-slate-400">Dimensions (L × W)</span>
                  <span className="font-semibold text-white font-mono">{formattedDimensions}</span>
                </div>
              )}
              {shipment.details.departureDate && (
                <div className="flex justify-between items-center py-1 border-b border-[#1E232F]/60">
                  <span className="text-slate-400">Departure Date</span>
                  <span className="font-semibold text-white font-mono">{shipment.details.departureDate}</span>
                </div>
              )}
              {shipment.details.estimatedDelivery && (
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-400">Estimated Delivery</span>
                  <span className="font-bold text-[#FFE600] font-mono">{shipment.details.estimatedDelivery}</span>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Sender Information (Admin-Controlled Visibility) */}
          <div
            id="sender-info-card"
            className="bg-[#151921] border border-[#1E232F] rounded-2xl p-6 shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#1E232F] pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#FFE600]" />
                <span>Sender Information</span>
              </h4>
            </div>

            <div className="space-y-3 text-xs">
              <div className="py-1">
                <span className="block text-slate-400 mb-1">Name</span>
                <span className="font-semibold text-white text-sm">
                  {shipment.sender.name || 'Not specified'}
                </span>
              </div>

              {shipment.sender.address && (
                <div className="py-1 border-t border-[#1E232F]/60">
                  <span className="block text-slate-400 mb-1">Address</span>
                  <span className="text-slate-200">{shipment.sender.address}</span>
                </div>
              )}

              {shipment.sender.email && (
                <div className="py-1 border-t border-[#1E232F]/60">
                  <span className="block text-slate-400 mb-1">Email</span>
                  <span className="text-slate-200">{shipment.sender.email}</span>
                </div>
              )}

              {/* Admin privacy protection note */}
              {shipment.sender.hasHiddenFields && (
                <div className="pt-2 flex items-center gap-1.5 text-[11px] text-slate-500 italic">
                  <Lock className="w-3 h-3 text-slate-500 shrink-0" />
                  <span>(other fields hidden by sender privacy policy)</span>
                </div>
              )}
            </div>
          </div>

          {/* Card 3: Receiver Information (Admin-Controlled Visibility) */}
          <div
            id="receiver-info-card"
            className="bg-[#151921] border border-[#1E232F] rounded-2xl p-6 shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-[#1E232F] pb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FFE600]" />
                <span>Receiver Information</span>
              </h4>
            </div>

            <div className="space-y-3 text-xs">
              <div className="py-1">
                <span className="block text-slate-400 mb-1">Name</span>
                <span className="font-semibold text-white text-sm">
                  {shipment.receiver.name || 'Not specified'}
                </span>
              </div>

              {shipment.receiver.address && (
                <div className="py-1 border-t border-[#1E232F]/60">
                  <span className="block text-slate-400 mb-1">Address</span>
                  <span className="text-slate-200">{shipment.receiver.address}</span>
                </div>
              )}

              {shipment.receiver.email && (
                <div className="py-1 border-t border-[#1E232F]/60">
                  <span className="block text-slate-400 mb-1">Email</span>
                  <span className="text-slate-200">{shipment.receiver.email}</span>
                </div>
              )}

              {/* Admin privacy protection note */}
              {shipment.receiver.hasHiddenFields && (
                <div className="pt-2 flex items-center gap-1.5 text-[11px] text-slate-500 italic">
                  <Lock className="w-3 h-3 text-slate-500 shrink-0" />
                  <span>(other fields hidden by receiver privacy policy)</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lower Section: Tracking History + Visual Illustration Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tracking History (Left 2 cols) */}
          <div
            id="tracking-history-card"
            className="lg:col-span-2 bg-[#151921] border border-[#1E232F] rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-[#1E232F] pb-4 mb-5">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#FFE600]" />
                <span>Tracking History</span>
              </h4>
              <span className="text-xs text-slate-400">
                {shipment.history.length} Event{shipment.history.length === 1 ? '' : 's'} recorded
              </span>
            </div>

            {shipment.history.length > 0 ? (
              <div className="space-y-6 relative pl-3">
                {/* Vertical connecting line */}
                <div className="absolute top-3 bottom-3 left-5 w-0.5 bg-[#252C3B]" />

                {shipment.history.map((event, index) => (
                  <div key={index} className="relative flex items-start gap-4">
                    {/* Event Status Dot */}
                    <div className="w-5 h-5 rounded-full bg-[#151921] border-2 border-emerald-400 flex items-center justify-center shrink-0 z-10 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    </div>

                    {/* Event Details */}
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="text-xs font-mono font-bold text-white">
                          {event.date}
                        </span>
                        {event.time && (
                          <span className="text-[11px] text-slate-400 font-mono">
                            • {event.time}
                          </span>
                        )}
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#1E232F] text-emerald-400 border border-[#2B3242]">
                          {event.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed font-medium">
                        {event.description}
                      </p>
                      {event.location && (
                        <p className="text-[11px] text-slate-500 flex items-center gap-1">
                          <span>Location:</span>
                          <span className="text-slate-400 font-medium">{event.location}</span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No tracking events recorded yet.</p>
            )}
          </div>

          {/* Visual Shipment Status Banner Card (Right 1 col) */}
          <div
            id="shipment-visual-card"
            className="bg-[#151921] border border-[#1E232F] rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between"
          >
            <div className="relative h-44 w-full overflow-hidden">
              <img
                src="/images/transit_card_img_1789731655568.jpg"
                alt="Freight transport in transit"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#151921] via-transparent to-black/20" />
            </div>

            <div className="p-6 pt-2 space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#FFE600]">
                <Zap className="w-3.5 h-3.5" />
                <span>Active Transit Guarantee</span>
              </div>
              <h4 className="text-lg font-bold text-white">
                Your shipment is on its way!
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our logistics network monitors this cargo 24/7. Estimated arrival date is synchronized with current route conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
