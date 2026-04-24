import { describe, expect, it } from 'vitest';
import {
  calculateFiscalSummary,
  calculateRangeDays,
  calculateUniqueDays,
  getFiscalStatus,
  mergeDateRanges,
} from './fiscalSummary.js';

function dayOfYearToDate(year, dayOfYear) {
  return new Date(year, 0, dayOfYear + 1);
}

function buildSeededRandom(seed) {
  let state = seed;

  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function calculateUniqueDaysWithOracle(ranges) {
  const occupiedDays = new Set();

  ranges.forEach((range) => {
    const cursor = new Date(range.start.getFullYear(), range.start.getMonth(), range.start.getDate());
    const end = new Date(range.end.getFullYear(), range.end.getMonth(), range.end.getDate());

    while (cursor.getTime() <= end.getTime()) {
      occupiedDays.add(
        `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(cursor.getDate()).padStart(2, '0')}`,
      );
      cursor.setDate(cursor.getDate() + 1);
    }
  });

  return occupiedDays.size;
}

describe('fiscalSummary', () => {
  it('derives days from dates instead of trusting caller-provided days', () => {
    const summary = calculateFiscalSummary([
      { start: '2026-01-01', end: '2026-01-10', days: 999 },
    ]);

    expect(summary.totalDays).toBe(10);
    expect(summary.annotatedRanges[0].days).toBe(10);
  });

  it('rejects inverted and invalid ranges at the domain boundary', () => {
    expect(() => calculateRangeDays('2026-05-10', '2026-05-01')).toThrow(
      'Date range end cannot be before start.',
    );
    expect(() => calculateFiscalSummary([{ start: 'not-a-date', end: '2026-05-01' }])).toThrow(
      'Invalid date provided.',
    );
  });

  it('counts inclusive boundary overlaps only once in the merged total', () => {
    const result = mergeDateRanges([
      { start: new Date('2026-01-01'), end: new Date('2026-01-05') },
      { start: new Date('2026-01-05'), end: new Date('2026-01-10') },
    ]);

    expect(result.hasOverlap).toBe(true);
    expect(result.merged).toHaveLength(1);
    expect(result.merged[0].days).toBe(10);
    expect(result.annotatedRanges[0].overlapDays).toBe(1);
    expect(result.annotatedRanges[1].overlapDays).toBe(1);
    expect(calculateUniqueDays(result.merged)).toBe(10);
  });

  it('handles leap days and threshold statuses explicitly', () => {
    expect(calculateRangeDays('2024-02-28', '2024-03-01')).toBe(3);
    expect(getFiscalStatus(150)).toBe('safe');
    expect(getFiscalStatus(151)).toBe('warning');
    expect(getFiscalStatus(183)).toBe('warning');
    expect(getFiscalStatus(184)).toBe('destructive');
  });

  it('matches an independent unique-day oracle across deterministic generated ranges', () => {
    for (let seed = 1; seed <= 40; seed += 1) {
      const random = buildSeededRandom(seed);
      const ranges = Array.from({ length: 24 }, () => {
        const startDay = Math.floor(random() * 350);
        const length = Math.floor(random() * 20);

        return {
          start: dayOfYearToDate(2026, startDay),
          end: dayOfYearToDate(2026, Math.min(startDay + length, 364)),
        };
      });
      const result = mergeDateRanges(ranges);

      expect(calculateUniqueDays(result.merged)).toBe(calculateUniqueDaysWithOracle(ranges));
    }
  });
});
