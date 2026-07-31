// Advisor ("para asesores") premium report option — Mejora 15.
// Pure, environment-agnostic helpers so they can be unit-tested in Node.
// The UI reads the flag and the price id from import.meta.env (Vite) and
// passes them here; the backend resolves the actual Stripe Price from the
// server-only STRIPE_ADVISOR_PRICE_ID variable.

export const ADVISOR_LOGO_MAX_BYTES = 500 * 1024; // 500 KB
export const ADVISOR_LOGO_ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
export const ADVISOR_LOGO_ACCEPT_ATTR = 'image/png,image/jpeg,image/webp';

/**
 * The advisor option is only usable when the feature flag is enabled AND an
 * advisor Price has been created in Stripe (its id documented in
 * VITE_ADVISOR_PRICE_ID). Otherwise the UI must show the option disabled.
 *
 * @param {{ VITE_ADVISOR_ENABLED?: string, VITE_ADVISOR_PRICE_ID?: string }} env
 */
export function isAdvisorCheckoutAvailable(env = {}) {
  return env.VITE_ADVISOR_ENABLED === 'true' && Boolean(env.VITE_ADVISOR_PRICE_ID);
}

/**
 * Validates an advisor logo picked through a file input.
 *
 * @param {{ size?: number, type?: string } | null | undefined} file
 * @returns {null | 'invalidType' | 'tooLarge'} null when the file is valid.
 */
export function validateAdvisorLogo(file) {
  if (!file) return 'invalidType';
  if (!ADVISOR_LOGO_ACCEPTED_TYPES.includes(file.type)) return 'invalidType';
  if (typeof file.size !== 'number' || file.size > ADVISOR_LOGO_MAX_BYTES) return 'tooLarge';
  return null;
}

const DATA_URL_PDF_FORMATS = { png: 'PNG', jpeg: 'JPEG', jpg: 'JPEG', webp: 'WEBP' };

/**
 * Maps an image data URL to the jsPDF addImage format token. Returns null for
 * unsupported or malformed sources so callers skip rendering instead of
 * throwing inside jsPDF.
 *
 * @param {string | null | undefined} dataUrl
 * @returns {null | 'PNG' | 'JPEG' | 'WEBP'}
 */
export function logoDataUrlToPdfFormat(dataUrl) {
  const match = /^data:image\/([a-z0-9+.-]+);/i.exec(String(dataUrl || ''));
  return match ? (DATA_URL_PDF_FORMATS[match[1].toLowerCase()] ?? null) : null;
}

/**
 * Sanitizes the advisor branding payload that travels in sessionStorage
 * (never to any server) and into the premium PDF header. Returns null when
 * there is no usable firm name, so callers can skip the advisor block.
 *
 * @param {{ name?: string, logo?: string } | null | undefined} advisor
 */
export function sanitizeAdvisorBranding(advisor) {
  const name = String(advisor?.name ?? '').trim().slice(0, 120);
  if (!name) return null;

  const logo = typeof advisor?.logo === 'string' && advisor.logo.startsWith('data:image/')
    ? advisor.logo
    : null;

  return { name, logo };
}
