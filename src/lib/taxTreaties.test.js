import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  AEAT_TREATY_LIST_URL,
  OTHER_COUNTRY_OPTION,
  TAX_TREATY_COUNTRIES,
  TAX_TREATY_STORAGE_KEY,
  TIE_BREAKER_RULES,
  clearSecondCountry,
  getTaxTreatyCountry,
  isValidSecondCountrySelection,
  loadSecondCountry,
  saveSecondCountry,
} from './taxTreaties.js';

describe('TAX_TREATY_COUNTRIES table', () => {
  it('has unique ids', () => {
    const ids = TAX_TREATY_COUNTRIES.map((country) => country.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('covers the most common countries of the target audience', () => {
    const ids = TAX_TREATY_COUNTRIES.map((country) => country.id);
    expect(ids).toEqual(
      expect.arrayContaining([
        'reino-unido',
        'alemania',
        'francia',
        'portugal',
        'paises-bajos',
        'estados-unidos',
        'andorra',
      ]),
    );
  });

  it.each(TAX_TREATY_COUNTRIES.map((country) => [country.id, country]))(
    'country %s has a name in ES and EN',
    (_id, country) => {
      for (const lang of ['es', 'en']) {
        expect(typeof country.name[lang]).toBe('string');
        expect(country.name[lang].length).toBeGreaterThan(0);
      }
    },
  );

  it.each(TAX_TREATY_COUNTRIES.map((country) => [country.id, country]))(
    'country %s points to a stable official HTTPS source',
    (_id, country) => {
      expect(country.sourceUrl).toMatch(/^https:\/\//);
      expect(country.sourceUrl).toMatch(/\.gob\.es|\.boe\.es/);
    },
  );

  it('the generic AEAT treaty listing URL is a stable official HTTPS source', () => {
    expect(AEAT_TREATY_LIST_URL).toMatch(/^https:\/\/sede\.agenciatributaria\.gob\.es\//);
  });
});

describe('TIE_BREAKER_RULES', () => {
  it('follows the Article 4 OECD Model order', () => {
    expect(TIE_BREAKER_RULES.map((rule) => rule.id)).toEqual([
      'permanentHome',
      'vitalInterests',
      'habitualAbode',
      'nationality',
      'mutualAgreement',
    ]);
  });

  it.each(TIE_BREAKER_RULES.map((rule) => [rule.id, rule]))(
    'rule %s has text in ES and EN',
    (_id, rule) => {
      for (const lang of ['es', 'en']) {
        expect(typeof rule[lang]).toBe('string');
        expect(rule[lang].length).toBeGreaterThan(0);
      }
    },
  );
});

describe('getTaxTreatyCountry', () => {
  it('returns the entry for a known id', () => {
    const country = getTaxTreatyCountry('andorra');
    expect(country).not.toBeNull();
    expect(country.id).toBe('andorra');
    expect(country.sourceUrl).toContain('andorra.html');
  });

  it('returns null for an unknown id', () => {
    expect(getTaxTreatyCountry('narnia')).toBeNull();
    expect(getTaxTreatyCountry(OTHER_COUNTRY_OPTION)).toBeNull();
  });
});

describe('isValidSecondCountrySelection', () => {
  it('accepts known country ids and the other-country option', () => {
    expect(isValidSecondCountrySelection('reino-unido')).toBe(true);
    expect(isValidSecondCountrySelection(OTHER_COUNTRY_OPTION)).toBe(true);
  });

  it('rejects unknown ids and non-string values', () => {
    expect(isValidSecondCountrySelection('narnia')).toBe(false);
    expect(isValidSecondCountrySelection('')).toBe(false);
    expect(isValidSecondCountrySelection(null)).toBe(false);
    expect(isValidSecondCountrySelection(42)).toBe(false);
  });
});

function createMemoryStorage() {
  const map = new Map();

  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
    clear: () => map.clear(),
  };
}

describe('second country storage', () => {
  beforeEach(() => {
    globalThis.localStorage = createMemoryStorage();
  });

  afterEach(() => {
    delete globalThis.localStorage;
  });

  it('round-trips a treaty country through localStorage', () => {
    saveSecondCountry('portugal');

    expect(loadSecondCountry()).toBe('portugal');
  });

  it('round-trips the other-country option through localStorage', () => {
    saveSecondCountry(OTHER_COUNTRY_OPTION);

    expect(loadSecondCountry()).toBe(OTHER_COUNTRY_OPTION);
  });

  it('returns null when nothing is stored', () => {
    expect(loadSecondCountry()).toBeNull();
  });

  it('discards corrupted or invalid stored values', () => {
    localStorage.setItem(TAX_TREATY_STORAGE_KEY, '{not json');
    expect(loadSecondCountry()).toBeNull();

    localStorage.setItem(TAX_TREATY_STORAGE_KEY, JSON.stringify('narnia'));
    expect(loadSecondCountry()).toBeNull();
  });

  it('saving an invalid value removes the previous selection', () => {
    saveSecondCountry('francia');
    saveSecondCountry('narnia');

    expect(localStorage.getItem(TAX_TREATY_STORAGE_KEY)).toBeNull();
    expect(loadSecondCountry()).toBeNull();
  });

  it('clears the stored selection', () => {
    saveSecondCountry('alemania');
    clearSecondCountry();

    expect(localStorage.getItem(TAX_TREATY_STORAGE_KEY)).toBeNull();
    expect(loadSecondCountry()).toBeNull();
  });
});
