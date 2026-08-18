import { describe, expect, it } from 'vitest';
import {
  FAQ_ITEMS,
  FAQ_PAGE_IDS,
  buildFaqSchema,
  getLocalizedFaq,
} from './faqData.js';
import { LEGAL_REF_IDS } from './legalRefs.js';

describe('FAQ_ITEMS catalogue', () => {
  it('has unique ids', () => {
    const ids = FAQ_ITEMS.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('covers 8–10 questions per page', () => {
    for (const page of FAQ_PAGE_IDS) {
      const count = FAQ_ITEMS.filter((item) => item.pages.includes(page)).length;
      expect(count).toBeGreaterThanOrEqual(8);
      expect(count).toBeLessThanOrEqual(10);
    }
  });

  it.each(FAQ_ITEMS.map((item) => [item.id, item]))(
    'entry %s has question and answer in ES and EN',
    (_id, item) => {
      for (const lang of ['es', 'en']) {
        expect(typeof item.question[lang]).toBe('string');
        expect(item.question[lang].length).toBeGreaterThan(0);
        expect(typeof item.answer[lang]).toBe('string');
        expect(item.answer[lang].length).toBeGreaterThan(0);
      }
    },
  );

  it.each(FAQ_ITEMS.map((item) => [item.id, item]))(
    'entry %s is plain text (JSON-LD safe, no HTML)',
    (_id, item) => {
      for (const lang of ['es', 'en']) {
        expect(item.question[lang]).not.toMatch(/<[^>]+>/);
        expect(item.answer[lang]).not.toMatch(/<[^>]+>/);
      }
    },
  );

  it.each(FAQ_ITEMS.map((item) => [item.id, item]))(
    'entry %s flags only known pages',
    (_id, item) => {
      expect(item.pages.length).toBeGreaterThan(0);
      for (const page of item.pages) {
        expect(FAQ_PAGE_IDS).toContain(page);
      }
    },
  );

  it.each(
    FAQ_ITEMS.filter((item) => item.legalRefId).map((item) => [item.id, item]),
  )('entry %s references an existing legal ref', (_id, item) => {
    expect(LEGAL_REF_IDS).toContain(item.legalRefId);
  });
});

describe('getLocalizedFaq', () => {
  it('returns the Spanish copy filtered by page', () => {
    const items = getLocalizedFaq('es', 'home');
    expect(items.length).toBeGreaterThanOrEqual(8);
    expect(items.every((item) => FAQ_ITEMS.find((f) => f.id === item.id).pages.includes('home'))).toBe(true);
    expect(items[0].question).toContain('¿');
  });

  it('returns the English copy for en', () => {
    const items = getLocalizedFaq('en', 'guide');
    expect(items.some((item) => item.question === 'Do sporadic absences count as days in Spain?')).toBe(true);
  });

  it('falls back to Spanish for unsupported languages', () => {
    const items = getLocalizedFaq('fr', 'home');
    expect(items[0].question).toContain('¿');
  });

  it('excludes items not flagged for the page', () => {
    const homeIds = getLocalizedFaq('es', 'home').map((item) => item.id);
    const guideIds = getLocalizedFaq('es', 'guide').map((item) => item.id);
    expect(homeIds).toContain('exceed-183');
    expect(guideIds).not.toContain('exceed-183');
    expect(guideIds).toContain('economic-interests');
    expect(homeIds).not.toContain('economic-interests');
  });
});

describe('buildFaqSchema', () => {
  it('builds a FAQPage schema from the same localized items (parity)', () => {
    const items = getLocalizedFaq('es', 'home');
    const schema = buildFaqSchema(items);

    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('FAQPage');
    expect(schema.mainEntity).toHaveLength(items.length);

    schema.mainEntity.forEach((entity, index) => {
      expect(entity['@type']).toBe('Question');
      expect(entity.name).toBe(items[index].question);
      expect(entity.acceptedAnswer['@type']).toBe('Answer');
      expect(entity.acceptedAnswer.text).toBe(items[index].answer);
    });
  });

  it('serializes to valid JSON', () => {
    const schema = buildFaqSchema(getLocalizedFaq('en', 'guide'));
    expect(() => JSON.parse(JSON.stringify(schema))).not.toThrow();
  });
});
