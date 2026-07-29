import { describe, expect, it } from 'vitest';
import { translations } from './translations.js';
import {
  EXAMPLE_PDF_URL,
  PREMIUM_REPORT_ROUTE,
  REPORT_SECTION_IDS,
  getReportContents,
} from './reportContents.js';

describe('REPORT_SECTION_IDS', () => {
  it('has unique ids', () => {
    expect(new Set(REPORT_SECTION_IDS).size).toBe(REPORT_SECTION_IDS.length);
  });

  it('covers the sections rendered by the premium PDF', () => {
    // Mirrors the rendering order of generateTaxReport (src/lib/generatePdf.js).
    expect(REPORT_SECTION_IDS).toEqual([
      'taxpayer',
      'summary',
      'periods',
      'overlap',
      'economicInterests',
      'scenarioComparison',
      'conclusion',
      'legalNotice',
    ]);
  });
});

describe('getReportContents', () => {
  it.each(['es', 'en'])('returns every section with copy in %s', (language) => {
    const contents = getReportContents(language);

    expect(contents.map((section) => section.id)).toEqual(REPORT_SECTION_IDS);
    expect(contents.map((section) => section.number)).toEqual(
      REPORT_SECTION_IDS.map((_, index) => index + 1),
    );

    for (const section of contents) {
      expect(section.title?.length).toBeGreaterThan(0);
      expect(section.description?.length).toBeGreaterThan(0);
      expect(section.previewAlt?.length).toBeGreaterThan(0);
    }
  });

  it('keeps ES and EN section sets in sync', () => {
    const esSections = translations.es.premiumReport.sections;
    const enSections = translations.en.premiumReport.sections;

    expect(Object.keys(enSections).sort()).toEqual(Object.keys(esSections).sort());
    for (const id of REPORT_SECTION_IDS) {
      expect(esSections[id], `missing ES copy for ${id}`).toBeDefined();
      expect(enSections[id], `missing EN copy for ${id}`).toBeDefined();
    }
  });

  it('falls back to Spanish for unknown languages', () => {
    expect(getReportContents('fr')).toEqual(getReportContents('es'));
  });
});

describe('example PDF asset', () => {
  it('points to a root-relative static file', () => {
    expect(EXAMPLE_PDF_URL).toMatch(/^\/[^/].*\.pdf$/);
  });

  it('uses a language-agnostic route slug for the page', () => {
    expect(PREMIUM_REPORT_ROUTE).toBe('premium-report');
  });
});
