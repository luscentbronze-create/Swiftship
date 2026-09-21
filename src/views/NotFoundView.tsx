import React from 'react';
import { PackageX, ArrowLeft, HelpCircle } from 'lucide-react';
import { TrackingCodeInput } from '../components/TrackingCodeInput.tsx';

interface NotFoundViewProps {
  attemptedCode: string;
  onTrack: (code: string) => void;
  onBackToHome: () => void;
  isLoading?: boolean;
}

export const NotFoundView: React.FC<NotFoundViewProps> = ({
  attemptedCode,
  onTrack,
  onBackToHome,
  isLoading,
}) => {
  return (
    <div className="w-full min-h-[calc(100vh-18rem)] py-14 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-[#0E1116]">
      <div className="w-full max-w-xl">
        <div
          id="tracking-not-found-card"
          className="bg-[#151921] border border-[#1E232F] rounded-3xl p-6 sm:p-10 shadow-2xl text-center space-y-6"
        >
          {/* Packaging Box with X icon matching the mockup */}
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            {/* Base box */}
            <div className="w-18 h-18 rounded-2xl bg-[#1E232F] border border-[#2B3242] flex items-center justify-center text-slate-400 shadow-inner">
              <PackageX className="w-10 h-10 stroke-[1.8]" />
            </div>
            {/* Small yellow badge with X */}
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#FFE600] text-[#0E1116] flex items-center justify-center font-extrabold text-sm shadow-md border-2 border-[#151921]">
              ✕
            </div>
          </div>

          {/* Heading and Description */}
          <div className="space-y-2">
            <h2
              id="not-found-heading"
              className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
            >
              Tracking Code Not Found
            </h2>
            <p
              id="not-found-description"
              className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed"
            >
              We couldn't find a shipment associated with this tracking code. Please check the code and try again.
            </p>
            {attemptedCode && (
              <div className="inline-block mt-2 px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 font-mono text-xs">
                Queried Code: <span className="font-bold">{attemptedCode}</span>
              </div>
            )}
          </div>

          {/* Re-entry Input Form */}
          <div className="pt-2 text-left">
            <TrackingCodeInput
              variant="compact"
              onTrack={onTrack}
              isLoading={isLoading}
              autoFocus
            />
          </div>

          {/* Back to Home Action */}
          <div className="pt-4 border-t border-[#1E232F]">
            <button
              id="back-to-home-btn"
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
