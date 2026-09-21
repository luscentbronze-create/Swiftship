import React from 'react';
import { PackageSearch, Search } from 'lucide-react';
import { TrackingCodeInput } from '../components/TrackingCodeInput.tsx';

interface TrackViewProps {
  onTrack: (code: string) => void;
  isLoading?: boolean;
}

export const TrackView: React.FC<TrackViewProps> = ({ onTrack, isLoading }) => {
  return (
    <div className="w-full min-h-[calc(100vh-14rem)] py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-white border-b border-slate-200">
      <div className="w-full max-w-xl">
        {/* Main Card - Crisp White Theme */}
        <div
          id="dedicated-track-card"
          className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden"
        >
          {/* Subtle accent glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#FFE600]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Title Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#FEF9C3] border border-[#FEF08A] flex items-center justify-center text-[#854D0E]">
              <PackageSearch className="w-7 h-7 stroke-[2]" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Track Your Shipment
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
              Enter your 11-character alphanumeric tracking code to view your shipment information and delivery status.
            </p>
          </div>

          {/* Input component */}
          <TrackingCodeInput
            variant="standalone"
            onTrack={onTrack}
            isLoading={isLoading}
            autoFocus
          />
        </div>
      </div>
    </div>
  );
};
