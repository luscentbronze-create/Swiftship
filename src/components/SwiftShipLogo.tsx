import React from 'react';

interface PrimewayLogoProps {
  className?: string;
  size?: number;
}

export const PrimewayLogo: React.FC<PrimewayLogoProps> = ({ className = 'w-8 h-8', size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Clean rounded background container */}
      <rect width="32" height="32" rx="8" fill="#FFE600" />
      
      {/* Bold, modern 'P' letterform */}
      <path
        d="M8.5 24V8h7.2c3.4 0 5.8 2.1 5.8 5s-2.4 5-5.8 5H13"
        stroke="#0B1118"
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Forward express arrow integrated into the design */}
      <path
        d="M18.5 13h5.5M21.5 10.5l2.5 2.5-2.5 2.5"
        stroke="#0B1118"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

// Backwards compatibility alias
export const SwiftShipLogo = PrimewayLogo;
