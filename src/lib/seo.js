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

  const safeLanguage = LANGUAGES.includes(language) ? language : 'es';
  const normalizedRoute = isHome ? '/' : `/${route.replace(/^\/+|\/+$/g, '')}/`;

  return `${APP_ORIGIN}/${safeLanguage}${normalizedRoute === '/' ? '/' : normalizedRoute}`;
}

export function getDefaultUrl() {
  return `${APP_ORIGIN}/es/`;
}