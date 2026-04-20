import React from 'react';

const logoSources = {
  default: '/logo-calculadora-183-clean-512.png',
};

const LightBrandLogo = ({ className = '', alt }) => (
  <svg
    viewBox="0 0 220 120"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label={alt}
    className={`block ${className}`.trim()}
  >
    <defs>
      <linearGradient id="light-bar" x1="24" y1="0" x2="184" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#1d4ed8" />
        <stop offset="100%" stopColor="#60a5fa" />
      </linearGradient>
    </defs>
    <path d="M26 24h130" stroke="#1e3a8a" strokeOpacity="0.2" strokeWidth="12" strokeLinecap="round" />
    <path d="M26 24h130" stroke="url(#light-bar)" strokeWidth="8" strokeLinecap="round" />
    <path d="M26 94h130" stroke="#1e3a8a" strokeOpacity="0.2" strokeWidth="12" strokeLinecap="round" />
    <path d="M26 94h130" stroke="url(#light-bar)" strokeWidth="8" strokeLinecap="round" />
    <text
      x="92"
      y="74"
      fontFamily="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
      fontSize="56"
      fontWeight="900"
      textAnchor="middle"
      fill="#2563eb"
      stroke="#1e40af"
      strokeWidth="2.2"
      paintOrder="stroke fill"
    >
      183
    </text>
    <path d="M150 12l13 13.5L188 0" fill="none" stroke="#ca8a04" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M150 10l13 13.5L188 -2" fill="none" stroke="#facc15" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BrandLogo = ({ className = '', alt = 'Logo de TaxNomad 183', variant = 'default' }) => {
  if (variant === 'light') {
    return <LightBrandLogo className={className} alt={alt} />;
  }

  return (
    <img
      src={logoSources[variant] ?? logoSources.default}
      alt={alt}
      className={`block object-contain ${className}`.trim()}
      loading="eager"
      decoding="async"
    />
  );
};

export default BrandLogo;
