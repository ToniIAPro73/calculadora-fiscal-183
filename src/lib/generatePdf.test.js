import { describe, expect, it } from 'vitest';
import { generateTaxReport } from './generatePdf.js';

const transparentPng =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAFgwJ/luzZkwAAAABJRU5ErkJggg==';

function buildManyShortRanges(count) {
  return Array.from({ length: count }, (_, index) => ({
    start: new Date(2026, 0, index + 1),
    end: new Date(2026, 0, index + 1),
    days: 999,
  }));
}

describe('generateTaxReport', () => {
  it('paginates long period tables and recalculates day counts from ranges', async () => {
    const doc = await generateTaxReport({
      name: 'Alex Rivera',
      taxId: 'X1234567Z',
      totalDays: 999,
      fiscalYear: 2026,
      ranges: buildManyShortRanges(60),
      brandLogoDataUrl: transparentPng,
    });

    expect(doc.getNumberOfPages()).toBeGreaterThan(1);
  });

  it('renders report copy in the requested language', async () => {
    const doc = await generateTaxReport({
      name: 'Alex Rivera',
      taxId: 'X1234567Z',
      fiscalYear: 2026,
      language: 'en',
      ranges: [{ start: new Date(2026, 0, 1), end: new Date(2026, 0, 1) }],
      brandLogoDataUrl: transparentPng,
    });

    const output = doc.output();

    expect(output).toContain('FISCAL RESIDENCY REPORT');
    expect(output).toContain('TAXPAYER DETAILS');
    expect(output).not.toContain('INFORME DE RESIDENCIA FISCAL');
  });

  it('includes the economic interests section when the questionnaire is complete', async () => {
    const doc = await generateTaxReport({
      name: 'Alex Rivera',
      taxId: 'X1234567Z',
      fiscalYear: 2026,
      ranges: [{ start: new Date(2026, 0, 1), end: new Date(2026, 0, 10) }],
      brandLogoDataUrl: transparentPng,
      economicInterests: {
        family: 'abroad',
        income: 'abroad',
        home: 'mixed',
        activity: 'abroad',
      },
    });

    const output = doc.output();

    expect(output).toContain('CENTRO DE INTERESES ECONÓMICOS');
    expect(output).toContain('ART. 9 LEY 35/2006');
    expect(output).toContain('EVALUACIÓN ORIENTATIVA');
    expect(output).toContain('VÍNCULOS DÉBILES');
  });

  it('renders the economic interests section in English', async () => {
    const doc = await generateTaxReport({
      name: 'Alex Rivera',
      taxId: 'X1234567Z',
      fiscalYear: 2026,
      language: 'en',
      ranges: [{ start: new Date(2026, 0, 1), end: new Date(2026, 0, 10) }],
      brandLogoDataUrl: transparentPng,
      economicInterests: {
        family: 'spain',
        income: 'spain',
        home: 'spain',
        activity: 'spain',
      },
    });

    const output = doc.output();

    expect(output).toContain('CENTRE OF ECONOMIC INTERESTS');
    expect(output).toContain('ART. 9 LAW 35/2006');
    expect(output).toContain('STRONG TIES');
  });

  it('omits the economic interests section without answers', async () => {
    const doc = await generateTaxReport({
      name: 'Alex Rivera',
      taxId: 'X1234567Z',
      fiscalYear: 2026,
      ranges: [{ start: new Date(2026, 0, 1), end: new Date(2026, 0, 10) }],
      brandLogoDataUrl: transparentPng,
    });

    expect(doc.output()).not.toContain('CENTRO DE INTERESES ECONÓMICOS');
  });

  it('omits the economic interests section when the questionnaire is incomplete', async () => {
    const doc = await generateTaxReport({
      name: 'Alex Rivera',
      taxId: 'X1234567Z',
      fiscalYear: 2026,
      ranges: [{ start: new Date(2026, 0, 1), end: new Date(2026, 0, 10) }],
      brandLogoDataUrl: transparentPng,
      economicInterests: { family: 'spain', income: 'abroad' },
    });

    expect(doc.output()).not.toContain('CENTRO DE INTERESES ECONÓMICOS');
  });
});
