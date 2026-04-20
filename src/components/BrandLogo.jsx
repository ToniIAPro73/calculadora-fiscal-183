import React from 'react';

const logoSources = {
  dark: '/logo-calculadora-183-clean-512.png',
  light: '/logo-calculadora-183-clean-light-512.png',
};

const BrandLogo = ({
  className = '',
  alt = 'Logo de TaxNomad 183',
  variant = 'light',
}) => {
  return (
    <img
      src={variant === 'dark' ? logoSources.dark : logoSources.light}
      alt={alt}
      className={`block object-contain ${className}`.trim()}
      loading="eager"
      decoding="async"
    />
  );
};

export default BrandLogo;
