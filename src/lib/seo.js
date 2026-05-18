import { translations } from './translations.js';

export const APP_ORIGIN = 'https://www.regla183.com';

export const LANGUAGES = ['es', 'en'];

export function getLanguageFromPath(pathname = '') {
  const firstSegment = pathname.split('/').filter(Boolean)[0];
  return LANGUAGES.includes(firstSegment) ? firstSegment : undefined;
}

export function getCanonicalUrl(language = 'es', route = '/') {
  const isHome = route === '/' || route === '';

  // For the home page, if language is null or undefined, we return the absolute root
  if (isHome && !language) {
    return `${APP_ORIGIN}/`;
  }

  // If language is provided but it's the default 'es' for home, we might want root as well
  if (isHome && language === 'es') {
    return `${APP_ORIGIN}/`;
  }

  const safeLanguage = LANGUAGES.includes(language) ? language : 'es';
  
  // Clean path without trailing slash (except for root)
  const cleanRoute = isHome ? '' : `/${route.replace(/^\/+|\/+$/g, '')}`;

  return `${APP_ORIGIN}/${safeLanguage}${cleanRoute}`;
}

export function getSeoMetadata(lang, pageKey, path = '') {
  const t = translations[lang] || translations.es;
  
  // Elimina la barra diagonal final si existe (excepto para la raíz "/")
  const cleanPath = path === '/' ? '/' : path.replace(/\/$/, '');
  const canonical = `https://www.regla183.com${cleanPath}`;

  const meta = t.meta || {};

  return {
    title: meta.title,
    description: meta.description,
    canonical
  };
}

export function getDefaultUrl() {
  return `${APP_ORIGIN}/`;
}
