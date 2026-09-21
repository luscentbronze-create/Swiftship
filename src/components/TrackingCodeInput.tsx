import React, { useState, useEffect } from 'react';
import { ArrowRight, X, AlertCircle, Info, Loader2 } from 'lucide-react';
import { validateTrackingCode } from '../services/trackingService.ts';

interface TrackingCodeInputProps {
  initialValue?: string;
  onTrack: (code: string) => void;
  isLoading?: boolean;
  variant?: 'hero' | 'standalone' | 'compact';
  autoFocus?: boolean;
}

export const TrackingCodeInput: React.FC<TrackingCodeInputProps> = ({
  initialValue = '',
  onTrack,
  isLoading = false,
  variant = 'standalone',
  autoFocus = false,
}) => {
  const [code, setCode] = useState(initialValue);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (initialValue) {
      setCode(initialValue.toUpperCase());
    }
  }, [initialValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    // Strip non-alphanumeric characters immediately, enforce max 11
    const cleaned = rawVal.replace(/[^a-zA-Z0-9]/g, '').slice(0, 11).toUpperCase();
    setCode(cleaned);

    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  const handleClear = () => {
    setCode('');
    setErrorMessage(null);
    setTouched(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    const validation = validateTrackingCode(code);
    if (!validation.isValid || !validation.normalizedCode) {
      setErrorMessage(validation.error || 'Please enter a valid 11-character alphanumeric tracking code.');
      return;
    }

    setErrorMessage(null);
    onTrack(validation.normalizedCode);
  };

  const handleSampleClick = (sampleCode: string) => {
    setCode(sampleCode);
    setErrorMessage(null);
    setTouched(true);
    onTrack(sampleCode);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="w-full space-y-3">
        {/* Label only on standalone / hero if appropriate */}
        {variant !== 'compact' && (
          <div className="flex items-center justify-between">
            <label
              htmlFor="tracking-code-input"
              className={`block text-xs font-bold uppercase tracking-wider ${
                variant === 'hero' ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              Tracking Code
            </label>
            <span
              className={`text-xs font-mono font-medium ${
                code.length === 11
                  ? variant === 'hero' ? 'text-[#FFE600]' : 'text-amber-600 font-bold'
                  : code.length > 0
                  ? variant === 'hero' ? 'text-slate-400' : 'text-slate-600'
                  : variant === 'hero' ? 'text-slate-600' : 'text-slate-400'
              }`}
            >
              {code.length}/11 chars
            </span>
          </div>
        )}

        {/* Input + Action Button wrapper */}
        <div
          className={`relative flex flex-col sm:flex-row items-stretch gap-2 sm:gap-2 p-1.5 rounded-2xl transition-all ${
            variant === 'hero'
              ? 'bg-[#151921]/90 backdrop-blur-md border border-[#2B3242] shadow-2xl focus-within:border-[#FFE600]/70 focus-within:ring-2 focus-within:ring-[#FFE600]/20'
              : 'bg-slate-50 border border-slate-300 shadow-sm focus-within:border-[#FFE600] focus-within:ring-2 focus-within:ring-[#FFE600]/30'
          }`}
        >
          <div className="relative flex-1 flex items-center">
            <input
              id="tracking-code-input"
              type="text"
              value={code}
              onChange={handleChange}
              placeholder="Enter 11-character tracking code"
              autoFocus={autoFocus}
              maxLength={11}
              autoComplete="off"
              spellCheck="false"
              className={`w-full px-4 py-3.5 bg-transparent font-mono text-base md:text-lg font-bold tracking-wider placeholder:font-sans placeholder:text-sm placeholder:font-normal placeholder:text-slate-400 focus:outline-none uppercase ${
                variant === 'hero' ? 'text-white' : 'text-slate-900'
              }`}
            />
            {code.length > 0 && (
              <button
                type="button"
                id="clear-tracking-input-btn"
                onClick={handleClear}
                className={`p-1.5 mr-2 rounded-full transition-colors cursor-pointer ${
                  variant === 'hero'
                    ? 'text-slate-400 hover:text-white hover:bg-white/10'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
                }`}
                title="Clear input"
                aria-label="Clear tracking code input"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="submit"
            id="track-shipment-submit-btn"
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-[#0E1116] bg-[#FFE600] hover:bg-[#F2D900] active:scale-[0.99] transition-all cursor-pointer shadow-md shadow-[#FFE600]/20 disabled:opacity-60 disabled:cursor-not-allowed shrink-0"
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

        {/* Validation Error Message */}
        {errorMessage && (
          <div
            id="tracking-input-error-msg"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs font-medium animate-in fade-in"
          >
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Helper Example & Format Rules */}
        <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-medium text-slate-500">Try example:</span>
            <button
              type="button"
              onClick={() => handleSampleClick('TRK7A92X4B1')}
              className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold border transition-colors cursor-pointer ${
                variant === 'hero'
                  ? 'bg-[#1E232F] text-[#FFE600] hover:bg-[#2B3242] border-[#2B3242]'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-200'
              }`}
              title="Laptop shipment in transit"
            >
              TRK7A92X4B1
            </button>
            <button
              type="button"
              onClick={() => handleSampleClick('8F2K91M7Q4Z')}
              className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold border transition-colors cursor-pointer ${
                variant === 'hero'
                  ? 'bg-[#1E232F] text-slate-300 hover:text-white hover:bg-[#2B3242] border-[#2B3242]'
                  : 'bg-slate-100 text-slate-800 hover:bg-slate-200 border-slate-200'
              }`}
              title="Medical shipment out for delivery"
            >
              8F2K91M7Q4Z
            </button>
          </div>
        </div>

        {/* Format notice banner */}
        {variant === 'standalone' && (
          <div className="mt-4 flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
            <div className="p-1 rounded-lg bg-[#FEF9C3] text-[#854D0E] shrink-0 mt-0.5">
              <Info className="w-4 h-4" />
            </div>
            <p className="leading-relaxed">
              Your tracking code is <strong className="text-slate-900">11 characters</strong> and can include both letters and numbers (e.g. <span className="font-mono text-slate-900 font-semibold">TRK7A92X4B1</span>).
            </p>
          </div>
        )}
      </form>
    </div>
  );
};
