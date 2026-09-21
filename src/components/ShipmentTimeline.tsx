import React from 'react';
import { Check, Clock, Truck, Package, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ShipmentStatus, TrackingEvent } from '../types.ts';

interface ShipmentTimelineProps {
  currentStatus: ShipmentStatus;
  history: TrackingEvent[];
}

const ORDERED_STAGES: ShipmentStatus[] = [
  'Shipment Created',
  'Processing',
  'In Transit',
  'Out for Delivery',
  'Delivered',
];

export const ShipmentTimeline: React.FC<ShipmentTimelineProps> = ({ currentStatus, history }) => {
  const currentIndex = ORDERED_STAGES.indexOf(currentStatus);

  // Helper to find recorded date for a stage from history
  const getStageDate = (stage: ShipmentStatus): string | undefined => {
    const event = history.find((e) => e.status === stage);
    return event ? event.date : undefined;
  };

  return (
    <div className="w-full py-4">
      {/* Desktop Horizontal View (hidden on small screens) */}
      <div className="hidden md:block">
        <div className="relative flex items-center justify-between">
          {/* Background Track Line */}
          <div className="absolute top-5 left-8 right-8 h-1 bg-[#252C3B] z-0" />

          {/* Active Progress Bar fill */}
          <div
            className="absolute top-5 left-8 h-1 bg-emerald-500 z-0 transition-all duration-700"
            style={{
              width: `${Math.max(0, Math.min(100, (currentIndex / (ORDERED_STAGES.length - 1)) * 100))}%`,
              maxWidth: 'calc(100% - 4rem)',
            }}
          />

          {ORDERED_STAGES.map((stage, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const isFuture = idx > currentIndex;
            const stageDate = getStageDate(stage);

            return (
              <div key={stage} className="relative z-10 flex flex-col items-center group">
                {/* Node Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted || isCurrent
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 ring-4 ring-[#12151B]'
                      : 'bg-[#1E232F] text-slate-500 border border-[#2B3242] ring-4 ring-[#12151B]'
                  } ${isCurrent ? 'scale-110 font-black ring-emerald-500/30' : ''}`}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  ) : isCurrent ? (
                    <Truck className="w-5 h-5 stroke-[2.5]" />
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                  )}
                </div>

                {/* Text Labels */}
                <div className="text-center mt-3 max-w-[110px]">
                  <p
                    className={`text-xs font-bold leading-tight ${
                      isCurrent
                        ? 'text-emerald-400'
                        : isCompleted
                        ? 'text-white'
                        : 'text-slate-500'
                    }`}
                  >
                    {stage}
                  </p>
                  {stageDate ? (
                    <span className="block text-[11px] text-slate-400 font-mono mt-1">
                      {stageDate}
                    </span>
                  ) : isFuture ? (
                    <span className="block text-[10px] text-slate-600 italic mt-1">
                      Pending
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Vertical View (shown on mobile screens) */}
      <div className="md:hidden space-y-4 relative pl-3">
        {/* Vertical Line */}
        <div className="absolute top-4 bottom-4 left-6 w-1 bg-[#252C3B] z-0" />

        {ORDERED_STAGES.map((stage, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isFuture = idx > currentIndex;
          const stageDate = getStageDate(stage);

          return (
            <div key={stage} className="relative z-10 flex items-start gap-4">
              {/* Node Icon */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  isCompleted || isCurrent
                    ? 'bg-emerald-500 text-white ring-4 ring-[#12151B]'
                    : 'bg-[#1E232F] text-slate-500 border border-[#2B3242] ring-4 ring-[#12151B]'
                } ${isCurrent ? 'ring-emerald-500/30 font-bold' : ''}`}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 stroke-[2.5]" />
                ) : isCurrent ? (
                  <Truck className="w-4 h-4 stroke-[2.5]" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-slate-600" />
                )}
              </div>

              {/* Stage content */}
              <div className="pt-1 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p
                    className={`text-sm font-bold ${
                      isCurrent
                        ? 'text-emerald-400'
                        : isCompleted
                        ? 'text-white'
                        : 'text-slate-500'
                    }`}
                  >
                    {stage}
                  </p>
                  {stageDate && (
                    <span className="text-xs text-slate-400 font-mono shrink-0">
                      {stageDate}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
