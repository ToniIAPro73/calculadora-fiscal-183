import { describe, expect, it } from 'vitest';
import { generateTaxReport } from './generatePdf.js';

const transparentPng =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAFgwJ/luzZkwAAAABJRU5ErkJggg==';

const tinyWebp =
  'data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA';

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

  it('includes the scenario comparison section with at least two saved scenarios', async () => {
    const doc = await generateTaxReport({
      name: 'Alex Rivera',
      taxId: 'X1234567Z',
      fiscalYear: 2026,
      ranges: [{ start: new Date(2026, 0, 1), end: new Date(2026, 0, 10) }],
      brandLogoDataUrl: transparentPng,
      savedScenarios: [
        {
          name: 'Verano en Mallorca',
          ranges: [{ start: '2026-07-01T00:00:00.000Z', end: '2026-07-20T00:00:00.000Z' }],
        },
        {
          name: 'Invierno largo',
          ranges: [{ start: '2026-10-01T00:00:00.000Z', end: '2026-12-31T00:00:00.000Z' }],
        },
      ],
    });

    const output = doc.output();

    expect(output).toContain('COMPARATIVA DE ESCENARIOS HIPOTÉTICOS');
    expect(output).toContain('Situación actual');
    expect(output).toContain('Verano en Mallorca');
    expect(output).toContain('Invierno largo');
  });

  it('renders the scenario comparison section in English', async () => {
    const doc = await generateTaxReport({
      name: 'Alex Rivera',
      taxId: 'X1234567Z',
      fiscalYear: 2026,
      language: 'en',
      ranges: [{ start: new Date(2026, 0, 1), end: new Date(2026, 0, 10) }],
      brandLogoDataUrl: transparentPng,
      savedScenarios: [
        {
          name: 'Summer in Mallorca',
          ranges: [{ start: '2026-07-01T00:00:00.000Z', end: '2026-07-20T00:00:00.000Z' }],
        },
        {
          name: 'Long winter',
          ranges: [{ start: '2026-10-01T00:00:00.000Z', end: '2026-12-31T00:00:00.000Z' }],
        },
      ],
    });

    const output = doc.output();

    expect(output).toContain('HYPOTHETICAL SCENARIO COMPARISON');
    expect(output).toContain('Current situation');
    expect(output).toContain('Summer in Mallorca');
  });

  it('omits the scenario comparison section with fewer than two scenarios', async () => {
    const doc = await generateTaxReport({
      name: 'Alex Rivera',
      taxId: 'X1234567Z',
      fiscalYear: 2026,
      ranges: [{ start: new Date(2026, 0, 1), end: new Date(2026, 0, 10) }],
      brandLogoDataUrl: transparentPng,
      savedScenarios: [
        {
          name: 'Solo uno',
          ranges: [{ start: '2026-07-01T00:00:00.000Z', end: '2026-07-20T00:00:00.000Z' }],
        },
      ],
    });

    const output = doc.output();

    expect(output).not.toContain('COMPARATIVA DE ESCENARIOS');
    expect(output).not.toContain('Solo uno');
  });

  it('omits the scenario comparison section without scenarios', async () => {
    const doc = await generateTaxReport({
      name: 'Alex Rivera',
      taxId: 'X1234567Z',
      fiscalYear: 2026,
      ranges: [{ start: new Date(2026, 0, 1), end: new Date(2026, 0, 10) }],
      brandLogoDataUrl: transparentPng,
    });

    expect(doc.output()).not.toContain('COMPARATIVA DE ESCENARIOS');
  });

  it('always ends with a methodology and sources page', async () => {
    const doc = await generateTaxReport({
      name: 'Alex Rivera',
      taxId: 'X1234567Z',
      fiscalYear: 2026,
      ranges: [{ start: new Date(2026, 0, 1), end: new Date(2026, 0, 10) }],
      brandLogoDataUrl: transparentPng,
    });

    const output = doc.output();

    expect(output).toContain('METODOLOGÍA Y FUENTES');
    expect(output).toContain('Fuentes oficiales');
    expect(output).toContain('Art. 9 de la Ley 35/2006');
    expect(output).toContain('boe.es');
    expect(output).toContain('DESCARGO PROFESIONAL');
  });

  it('renders the methodology page in English', async () => {
    const doc = await generateTaxReport({
      name: 'Alex Rivera',
      taxId: 'X1234567Z',
      fiscalYear: 2026,
      language: 'en',
      ranges: [{ start: new Date(2026, 0, 1), end: new Date(2026, 0, 10) }],
      brandLogoDataUrl: transparentPng,
    });

    const output = doc.output();

    expect(output).toContain('METHODOLOGY AND SOURCES');
    expect(output).toContain('Official sources');
    expect(output).toContain('Article 9 of Law 35/2006');
    expect(output).toContain('PROFESSIONAL DISCLAIMER');
  });

  it('brands the header with the advisor firm name and logo', async () => {
    const doc = await generateTaxReport({
      name: 'Alex Rivera',
      taxId: 'X1234567Z',
      fiscalYear: 2026,
      ranges: [{ start: new Date(2026, 0, 1), end: new Date(2026, 0, 10) }],
      brandLogoDataUrl: transparentPng,
      advisor: { name: 'Asesoría López', logo: transparentPng },
    });

    const output = doc.output();

    expect(output).toContain('Informe preparado por');
    expect(output).toContain('Asesoría López');
  });

  it('renders an advisor logo in WebP without distorting it', async () => {
    const doc = await generateTaxReport({
      name: 'Alex Rivera',
      taxId: 'X1234567Z',
      fiscalYear: 2026,
      ranges: [{ start: new Date(2026, 0, 1), end: new Date(2026, 0, 10) }],
      brandLogoDataUrl: transparentPng,
      advisor: { name: 'Asesoría López', logo: tinyWebp },
    });

    const output = doc.output();

    expect(output).toContain('Informe preparado por');
    expect(output).toContain('Asesoría López');
  });

  it('renders the advisor band in English', async () => {
    const doc = await generateTaxReport({
      name: 'Alex Rivera',
      taxId: 'X1234567Z',
      fiscalYear: 2026,
      language: 'en',
      ranges: [{ start: new Date(2026, 0, 1), end: new Date(2026, 0, 10) }],
      brandLogoDataUrl: transparentPng,
      advisor: { name: 'López Tax Advisors' },
    });

    const output = doc.output();

    expect(output).toContain('Report prepared by');
    expect(output).toContain('López Tax Advisors');
  });

  it('ignores advisor branding without a usable firm name', async () => {
    const doc = await generateTaxReport({
      name: 'Alex Rivera',
      taxId: 'X1234567Z',
      fiscalYear: 2026,
      ranges: [{ start: new Date(2026, 0, 1), end: new Date(2026, 0, 10) }],
      brandLogoDataUrl: transparentPng,
      advisor: { name: '   ', logo: transparentPng },
    });

    expect(doc.output()).not.toContain('Informe preparado por');
  });

  it('omits the advisor band in the fictional example report', async () => {
    const doc = await generateTaxReport({
      name: 'Alex Rivera',
      taxId: 'X1234567Z',
      fiscalYear: 2026,
      exampleMode: true,
      ranges: [{ start: new Date(2026, 0, 1), end: new Date(2026, 0, 10) }],
      brandLogoDataUrl: transparentPng,
      advisor: { name: 'Asesoría López', logo: transparentPng },
    });

    expect(doc.output()).not.toContain('Asesoría López');
  });
});
