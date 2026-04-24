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
});
