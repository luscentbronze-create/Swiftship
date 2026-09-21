import React from 'react';

interface SwiftShipLogoProps {
  className?: string;
  size?: number;
}

export const SwiftShipLogo: React.FC<SwiftShipLogoProps> = ({ className = 'w-8 h-8', size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer Hexagon with yellow background */}
      <polygon
        points="18,2 33,10.5 33,27.5 18,36 3,27.5 3,10.5"
        fill="#FFE600"
      />
      {/* 3D Isometric cube lines inside */}
      {/* Top face outline */}
      <polygon
        points="18,5 30,12 18,19 6,12"
        fill="#FFE600"
        stroke="#0E1116"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Left face outline */}
      <polygon
        points="6,13 18,20 18,33 6,26"
        fill="#E6CF00"
        stroke="#0E1116"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Right face outline */}
      <polygon
        points="18,20 30,13 30,26 18,33"
        fill="#D4BD00"
        stroke="#0E1116"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
};
