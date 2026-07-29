import { describe, expect, it } from 'vitest';
import {
  IRPF_REFERENCE_REGIONAL_BRACKETS,
  IRPF_REGIONAL_SCALES,
  IRPF_REGION_KEYS,
  IRPF_STATE_BRACKETS,
  calculateBracketBreakdown,
  calculateIrpfEstimate,
  sanitizeTaxableBase,
} from './irpfBrackets.js';

describe('IRPF_STATE_BRACKETS data', () => {
  it('matches the state scale of art. 63 LIRPF', () => {
    expect(IRPF_STATE_BRACKETS).toEqual([
      { upTo: 12450, rate: 0.095 },
      { upTo: 20200, rate: 0.12 },
      { upTo: 35200, rate: 0.15 },
      { upTo: 60000, rate: 0.185 },
      { upTo: 300000, rate: 0.225 },
      { upTo: null, rate: 0.245 },
    ]);
  });

  it('has strictly increasing bracket bounds ending in an open bracket', () => {
    const bounds = IRPF_STATE_BRACKETS.map((bracket) => bracket.upTo ?? Infinity);
    for (let i = 1; i < bounds.length; i += 1) {
      expect(bounds[i]).toBeGreaterThan(bounds[i - 1]);
    }
    expect(IRPF_STATE_BRACKETS.at(-1).upTo).toBeNull();
  });

  it('regional scales reuse the same bracket boundaries', () => {
    for (const key of IRPF_REGION_KEYS) {
      const regionalBounds = IRPF_REGIONAL_SCALES[key].map((bracket) => bracket.upTo);
      const stateBounds = IRPF_STATE_BRACKETS.map((bracket) => bracket.upTo);
      expect(regionalBounds).toEqual(stateBounds);
    }
    expect(IRPF_REGIONAL_SCALES.otra).toBe(IRPF_REFERENCE_REGIONAL_BRACKETS);
  });
});

describe('sanitizeTaxableBase', () => {
  it.each([
    [0, 0],
    [30000, 30000],
    ['45000.5', 45000.5],
    [-100, 0],
    ['abc', 0],
    [NaN, 0],
    [Infinity, 0],
    [undefined, 0],
    [null, 0],
    ['', 0],
  ])('sanitizeTaxableBase(%j) → %j', (input, expected) => {
    expect(sanitizeTaxableBase(input)).toBe(expected);
  });
});

describe('calculateBracketBreakdown', () => {
  it('returns no brackets for a zero base', () => {
    expect(calculateBracketBreakdown(0)).toEqual([]);
  });

  it('returns no brackets for negative or invalid bases', () => {
    expect(calculateBracketBreakdown(-5000)).toEqual([]);
    expect(calculateBracketBreakdown('nonsense')).toEqual([]);
  });

  it('keeps the whole base in the first bracket when below the first bound', () => {
    const breakdown = calculateBracketBreakdown(10000);
    expect(breakdown).toEqual([
      { from: 0, to: 12450, rate: 0.095, taxable: 10000, tax: 950 },
    ]);
  });

  it('taxes a base exactly on a bracket boundary only up to that bracket', () => {
    const breakdown = calculateBracketBreakdown(12450);
    expect(breakdown).toHaveLength(1);
    expect(breakdown[0].taxable).toBe(12450);
    expect(breakdown[0].tax).toBe(1182.75); // 12.450 × 9,5 %
  });

  it('splits a mid-range base across the brackets it reaches', () => {
    const breakdown = calculateBracketBreakdown(30000);
    expect(breakdown.map((row) => row.taxable)).toEqual([12450, 7750, 9800]);
    expect(breakdown.map((row) => row.rate)).toEqual([0.095, 0.12, 0.15]);
    // 1.182,75 + 930 + 1.470
    expect(breakdown.reduce((sum, row) => sum + row.tax, 0)).toBeCloseTo(3582.75, 2);
  });

  it('covers very high bases with the open top bracket', () => {
    const breakdown = calculateBracketBreakdown(400000);
    expect(breakdown).toHaveLength(6);
    const lastRow = breakdown.at(-1);
    expect(lastRow.to).toBeNull();
    expect(lastRow.rate).toBe(0.245);
    expect(lastRow.taxable).toBe(100000); // 400.000 − 300.000
    expect(lastRow.tax).toBe(24500);
  });

  it('taxable amounts always sum to the base', () => {
    for (const base of [1, 12450, 20200.01, 60000, 300000, 1234567.89]) {
      const breakdown = calculateBracketBreakdown(base);
      const totalTaxable = breakdown.reduce((sum, row) => sum + row.taxable, 0);
      expect(totalTaxable).toBeCloseTo(base, 2);
    }
  });
});

describe('calculateIrpfEstimate', () => {
  it('returns a zeroed estimate for a zero base', () => {
    const estimate = calculateIrpfEstimate(0);
    expect(estimate).toEqual({
      base: 0,
      state: { breakdown: [], total: 0 },
      regional: null,
      total: 0,
      effectiveRate: 0,
    });
  });

  it('applies only the state scale when no region is selected', () => {
    const estimate = calculateIrpfEstimate(30000);
    expect(estimate.regional).toBeNull();
    expect(estimate.state.total).toBeCloseTo(3582.75, 2);
    expect(estimate.total).toBe(estimate.state.total);
    expect(estimate.effectiveRate).toBe(11.94); // 3.582,75 / 30.000
  });

  it('ignores unknown region keys (state scale only)', () => {
    const estimate = calculateIrpfEstimate(30000, 'region-inventada');
    expect(estimate.regional).toBeNull();
    expect(estimate.total).toBe(estimate.state.total);
  });

  it('adds the regional scale when a region is selected', () => {
    const estimate = calculateIrpfEstimate(30000, 'madrid');
    expect(estimate.regional).not.toBeNull();
    // Madrid orientative: 1.182,75 → 12.450×8,5 % = 1.058,25; 7.750×11,2 % = 868; 9.800×13,3 % = 1.303,40
    expect(estimate.regional.total).toBeCloseTo(3229.65, 2);
    expect(estimate.total).toBeCloseTo(6812.4, 2);
    expect(estimate.effectiveRate).toBeCloseTo(22.71, 2);
  });

  it('uses the reference scale for the generic "otra" region', () => {
    const estimate = calculateIrpfEstimate(30000, 'otra');
    expect(estimate.regional.total).toBeCloseTo(3582.75, 2); // same rates as the state scale
    expect(estimate.total).toBeCloseTo(7165.5, 2);
  });

  it('handles very high bases with regional scale', () => {
    const estimate = calculateIrpfEstimate(400000, 'cataluna');
    // State: 1.182,75 + 930 + 2.250 + 4.588 + 54.000 + 24.500
    expect(estimate.state.total).toBeCloseTo(87450.75, 2);
    expect(estimate.regional.total).toBeGreaterThan(0);
    expect(estimate.total).toBeCloseTo(estimate.state.total + estimate.regional.total, 2);
  });

  it('state breakdown and totals stay consistent at boundary bases', () => {
    for (const base of [12450, 20200, 35200, 60000, 300000]) {
      const estimate = calculateIrpfEstimate(base);
      const summed = estimate.state.breakdown.reduce((sum, row) => sum + row.tax, 0);
      expect(estimate.state.total).toBeCloseTo(summed, 2);
      expect(estimate.effectiveRate).toBeCloseTo((estimate.total / base) * 100, 2);
    }
  });
});
