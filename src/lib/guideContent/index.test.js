import { describe, expect, it } from 'vitest';
import {
  GUIDES,
  GUIDE_SLUGS,
  buildArticleSchema,
  buildBreadcrumbSchema,
  getCalculatorPath,
  getGuideBySlug,
  getGuideHubPath,
  getGuidePath,
  getGuideWordCount,
  getLocalizedGuide,
} from './index.js';
import { LEGAL_REF_IDS } from '../legalRefs.js';

const LANGS = ['es', 'en'];

// Collects every legalRef block refId used in a guide's sections.
const collectLegalRefIds = (guide) => {
  const ids = [];
  const walk = (blocks) => {
    for (const block of blocks) {
      if (block.type === 'legalRef') ids.push(block.refId);
      if (block.type === 'subsection') walk(block.blocks);
    }
  };
  for (const section of guide.sections) walk(section.blocks);
  return ids;
};

describe('guideContent catalogue', () => {
  it('exposes the four profile guides', () => {
    expect(GUIDES).toHaveLength(4);
  });

  it('has unique, URL-safe slugs', () => {
    expect(new Set(GUIDE_SLUGS).size).toBe(GUIDE_SLUGS.length);
    for (const slug of GUIDE_SLUGS) {
      expect(slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });

  it('covers the expected topics', () => {
    expect(GUIDE_SLUGS).toEqual(
      expect.arrayContaining([
        'digital-nomad-visa-183-days',
        'beckham-law-vs-183-days',
        'counting-days-arrival-departure',
        'sporadic-absences-tax-treaties',
      ]),
    );
  });

  it.each(GUIDES.map((guide) => [guide.slug, guide]))(
    'guide %s has title, shortTitle, description and excerpt in ES and EN',
    (_slug, guide) => {
      for (const lang of LANGS) {
        for (const field of ['title', 'shortTitle', 'description', 'excerpt']) {
          expect(typeof guide[field][lang]).toBe('string');
          expect(guide[field][lang].length).toBeGreaterThan(0);
        }
      }
    },
  );

  it.each(GUIDES.map((guide) => [guide.slug, guide]))(
    'guide %s has at least 800 words of editorial body per language',
    (_slug, guide) => {
      for (const lang of LANGS) {
        expect(getGuideWordCount(guide, lang)).toBeGreaterThanOrEqual(800);
      }
    },
  );

  it.each(GUIDES.map((guide) => [guide.slug, guide]))(
    'guide %s has an intro and sections with H2 headings in both languages',
    (_slug, guide) => {
      expect(guide.intro.length).toBeGreaterThan(0);
      expect(guide.sections.length).toBeGreaterThanOrEqual(3);
      for (const lang of LANGS) {
        for (const paragraph of guide.intro) {
          expect(paragraph[lang].length).toBeGreaterThan(0);
        }
        for (const section of guide.sections) {
          expect(section.heading[lang].length).toBeGreaterThan(0);
          expect(section.blocks.length).toBeGreaterThan(0);
        }
      }
    },
  );

  it.each(GUIDES.map((guide) => [guide.slug, guide]))(
    'guide %s is plain text (no HTML tags in any localized field)',
    (_slug, guide) => {
      const plain = JSON.stringify([guide.intro, guide.sections]);
      expect(plain).not.toMatch(/<[^>]+>/);
    },
  );

  it.each(GUIDES.map((guide) => [guide.slug, guide]))(
    'guide %s cites at least one legal ref and all refs exist in the catalogue',
    (_slug, guide) => {
      const ids = collectLegalRefIds(guide);
      expect(ids.length).toBeGreaterThan(0);
      for (const id of ids) {
        expect(LEGAL_REF_IDS).toContain(id);
      }
    },
  );

  it.each(GUIDES.map((guide) => [guide.slug, guide]))(
    'guide %s cross-links to existing guides (and not to itself)',
    (slug, guide) => {
      expect(guide.related.length).toBeGreaterThanOrEqual(2);
      for (const related of guide.related) {
        expect(related).not.toBe(slug);
        expect(GUIDE_SLUGS).toContain(related);
      }
    },
  );

  it.each(GUIDES.map((guide) => [guide.slug, guide]))(
    'guide %s has SEO-safe meta descriptions (40–170 chars per language)',
    (_slug, guide) => {
      for (const lang of LANGS) {
        expect(guide.description[lang].length).toBeGreaterThanOrEqual(40);
        expect(guide.description[lang].length).toBeLessThanOrEqual(170);
      }
    },
  );
});

describe('getGuideBySlug / getLocalizedGuide', () => {
  it('returns the guide for a known slug and null for unknown ones', () => {
    expect(getGuideBySlug('beckham-law-vs-183-days')).not.toBeNull();
    expect(getGuideBySlug('no-existe')).toBeNull();
  });

  it('localizes content per language with Spanish fallback', () => {
    const es = getLocalizedGuide('beckham-law-vs-183-days', 'es');
    const en = getLocalizedGuide('beckham-law-vs-183-days', 'en');
    const fallback = getLocalizedGuide('beckham-law-vs-183-days', 'fr');

    expect(es.title).toContain('impatriados');
    expect(en.title).toContain('impatriate');
    expect(fallback.title).toBe(es.title);
    expect(getLocalizedGuide('no-existe', 'es')).toBeNull();
  });

  it('localizes nested blocks (lists and subsections)', () => {
    const guide = getLocalizedGuide('sporadic-absences-tax-treaties', 'en');
    const list = guide.sections
      .flatMap((section) => section.blocks)
      .find((block) => block.type === 'list');
    expect(list.items[0]).toMatch(/permanent home/i);

    const withSubsection = guide.sections.find((section) =>
      section.blocks.some((block) => block.type === 'subsection'),
    );
    const subsection = withSubsection.blocks.find(
      (block) => block.type === 'subsection',
    );
    expect(subsection.heading.length).toBeGreaterThan(0);
    expect(subsection.blocks[0].text.length).toBeGreaterThan(0);
  });
});

describe('route helpers', () => {
  it('builds ES and EN guide paths with the same slug', () => {
    expect(getGuidePath('es', 'x')).toBe('/es/guide/x');
    expect(getGuidePath('en', 'x')).toBe('/en/guide/x');
    expect(getGuideHubPath('es')).toBe('/es/guide');
    expect(getGuideHubPath('en')).toBe('/en/guide');
    expect(getCalculatorPath('es')).toBe('/');
    expect(getCalculatorPath('en')).toBe('/en');
  });
});

describe('JSON-LD builders', () => {
  it('builds an Article schema with published/modified dates', () => {
    const schema = buildArticleSchema('digital-nomad-visa-183-days', 'es', {
      dateModified: '2026-08-01',
    });
    expect(schema['@type']).toBe('Article');
    expect(schema.headline).toContain('183');
    expect(schema.inLanguage).toBe('es');
    expect(schema.datePublished).toBe('2026-07-29');
    expect(schema.dateModified).toBe('2026-08-01');
    expect(schema.mainEntityOfPage).toBe(
      'https://www.regla183.com/es/guide/digital-nomad-visa-183-days',
    );
    expect(() => JSON.parse(JSON.stringify(schema))).not.toThrow();
  });

  it('builds a BreadcrumbList schema Home > Guide > guide', () => {
    const schema = buildBreadcrumbSchema('beckham-law-vs-183-days', 'en');
    expect(schema['@type']).toBe('BreadcrumbList');
    expect(schema.itemListElement).toHaveLength(3);
    expect(schema.itemListElement[0].name).toBe('Home');
    expect(schema.itemListElement[1].item).toBe(
      'https://www.regla183.com/en/guide',
    );
    expect(schema.itemListElement[2].item).toBe(
      'https://www.regla183.com/en/guide/beckham-law-vs-183-days',
    );
  });

  it('returns null for unknown slugs', () => {
    expect(buildArticleSchema('no-existe', 'es')).toBeNull();
    expect(buildBreadcrumbSchema('no-existe', 'es')).toBeNull();
  });
});
