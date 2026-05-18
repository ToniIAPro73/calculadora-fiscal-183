import React, { createContext, useState, useEffect } from 'react';
import { translations } from '@/lib/translations.js';
import { getLanguageFromPath } from '@/lib/seo.js';

export const LanguageContext = createContext();

const isSupportedLanguage = (value) => value === 'es' || value === 'en';

export const LanguageProvider = ({ children, initialLanguage }) => {
  const [language, setLanguage] = useState(() => {
    // Priority 1: initialLanguage prop
    if (isSupportedLanguage(initialLanguage)) {
      return initialLanguage;
    }

    // Priority 2: URL path detection
    const urlLang = getLanguageFromPath(window.location.pathname);
    if (isSupportedLanguage(urlLang)) {
      return urlLang;
    }

    // Priority 3: localStorage
    const savedLang = localStorage.getItem('language');
    return isSupportedLanguage(savedLang) ? savedLang : 'es';
  });

  useEffect(() => {
    if (isSupportedLanguage(initialLanguage)) {
      setLanguage(initialLanguage);
    }
  }, [initialLanguage]);

  const updateLanguage = (nextLanguage) => {
    if (isSupportedLanguage(nextLanguage)) {
      setLanguage(nextLanguage);
    }
  };

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language === 'es' ? 'es' : 'en';
  }, [language]);

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        return key;
      }
    }
    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: updateLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
