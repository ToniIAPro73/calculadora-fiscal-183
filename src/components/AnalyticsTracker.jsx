import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Tracks page views and custom events in Google Tag Manager.
 * Fires a virtual pageview whenever the route changes,
 * and exposes a global helper `window.taxNomadTrack` for custom events.
 */
const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Expose helper for custom event tracking from any component
    if (typeof window !== 'undefined' && !window.taxNomadTrack) {
      window.taxNomadTrack = (eventName, params = {}) => {
        if (typeof window.dataLayer !== 'undefined') {
          window.dataLayer.push({
            event: eventName,
            ...params,
          });
        }
      };
    }

    // Track virtual pageview on route change
    if (typeof window.dataLayer !== 'undefined') {
      window.dataLayer.push({
        event: 'pageview',
        page_path: location.pathname + location.search,
        page_title: document.title,
      });
    }
  }, [location]);

  return null;
};

export default AnalyticsTracker;
