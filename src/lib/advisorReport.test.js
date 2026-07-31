import { describe, expect, it } from 'vitest';
import {
  ADVISOR_LOGO_MAX_BYTES,
  isAdvisorCheckoutAvailable,
  sanitizeAdvisorBranding,
  validateAdvisorLogo,
} from './advisorReport.js';

describe('isAdvisorCheckoutAvailable', () => {
  it('is disabled by default (no env)', () => {
    expect(isAdvisorCheckoutAvailable({})).toBe(false);
    expect(isAdvisorCheckoutAvailable()).toBe(false);
  });

  it('requires both the flag and an advisor price id', () => {
    expect(isAdvisorCheckoutAvailable({ VITE_ADVISOR_ENABLED: 'true' })).toBe(false);
    expect(isAdvisorCheckoutAvailable({ VITE_ADVISOR_PRICE_ID: 'price_abc' })).toBe(false);
    expect(
      isAdvisorCheckoutAvailable({ VITE_ADVISOR_ENABLED: 'false', VITE_ADVISOR_PRICE_ID: 'price_abc' }),
    ).toBe(false);
  });

  it('is enabled only with flag=true and a price id', () => {
    expect(
      isAdvisorCheckoutAvailable({ VITE_ADVISOR_ENABLED: 'true', VITE_ADVISOR_PRICE_ID: 'price_abc' }),
    ).toBe(true);
  });
});

describe('validateAdvisorLogo', () => {
  it('accepts PNG, JPEG and WebP within the size limit', () => {
    expect(validateAdvisorLogo({ type: 'image/png', size: 1024 })).toBeNull();
    expect(validateAdvisorLogo({ type: 'image/jpeg', size: ADVISOR_LOGO_MAX_BYTES })).toBeNull();
    expect(validateAdvisorLogo({ type: 'image/webp', size: 1024 })).toBeNull();
  });

  it('rejects other mime types', () => {
    expect(validateAdvisorLogo({ type: 'image/svg+xml', size: 1024 })).toBe('invalidType');
    expect(validateAdvisorLogo({ type: 'application/pdf', size: 1024 })).toBe('invalidType');
  });

  it('rejects files over the size limit', () => {
    expect(validateAdvisorLogo({ type: 'image/png', size: ADVISOR_LOGO_MAX_BYTES + 1 })).toBe('tooLarge');
  });

  it('rejects missing or malformed files', () => {
    expect(validateAdvisorLogo(null)).toBe('invalidType');
    expect(validateAdvisorLogo({ type: 'image/png' })).toBe('tooLarge');
  });
});

describe('sanitizeAdvisorBranding', () => {
  it('trims the firm name and keeps a valid data-url logo', () => {
    expect(
      sanitizeAdvisorBranding({ name: '  Despacho López  ', logo: 'data:image/png;base64,AAAA' }),
    ).toEqual({ name: 'Despacho López', logo: 'data:image/png;base64,AAAA' });
  });

  it('drops logos that are not image data urls', () => {
    expect(sanitizeAdvisorBranding({ name: 'Despacho', logo: 'https://evil.example/x.png' }))
      .toEqual({ name: 'Despacho', logo: null });
  });

  it('returns null without a usable firm name', () => {
    expect(sanitizeAdvisorBranding(null)).toBeNull();
    expect(sanitizeAdvisorBranding({ name: '   ' })).toBeNull();
  });

  it('caps the firm name length', () => {
    const result = sanitizeAdvisorBranding({ name: 'x'.repeat(200) });
    expect(result.name).toHaveLength(120);
  });
});
