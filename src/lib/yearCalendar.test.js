import { describe, expect, it } from 'vitest';
import {
  buildYearDayMap,
  groupYearDaysByMonth,
  YEAR_DAY_STATES,
} from './yearCalendar.js';

describe('buildYearDayMap', () => {
  it('marks every day as abroad when there are no ranges (non-leap year)', () => {
    const days = buildYearDayMap(2025);

    expect(days).toHaveLength(365);
    expect(days[0].dayKey).toBe('2025-01-01');
    expect(days[364].dayKey).toBe('2025-12-31');
    expect(days.every((day) => day.state === YEAR_DAY_STATES.ABROAD)).toBe(true);
  });

  it('includes 366 days on leap years', () => {
    const days = buildYearDayMap(2024);

    expect(days).toHaveLength(366);
    expect(days.some((day) => day.dayKey === '2024-02-29')).toBe(true);
  });

  it('marks real stay days as inSpain, inclusive of both ends', () => {
    const days = buildYearDayMap(2025, [{ start: '2025-03-10', end: '2025-03-12' }]);
    const byKey = new Map(days.map((day) => [day.dayKey, day.state]));

    expect(byKey.get('2025-03-09')).toBe(YEAR_DAY_STATES.ABROAD);
    expect(byKey.get('2025-03-10')).toBe(YEAR_DAY_STATES.IN_SPAIN);
    expect(byKey.get('2025-03-11')).toBe(YEAR_DAY_STATES.IN_SPAIN);
    expect(byKey.get('2025-03-12')).toBe(YEAR_DAY_STATES.IN_SPAIN);
    expect(byKey.get('2025-03-13')).toBe(YEAR_DAY_STATES.ABROAD);
  });

  it('marks scenario-only days as hypothetical', () => {
    const days = buildYearDayMap(2025, [], [{ start: '2025-07-01', end: '2025-07-03' }]);
    const byKey = new Map(days.map((day) => [day.dayKey, day.state]));

    expect(byKey.get('2025-07-01')).toBe(YEAR_DAY_STATES.HYPOTHETICAL);
    expect(byKey.get('2025-07-03')).toBe(YEAR_DAY_STATES.HYPOTHETICAL);
    expect(byKey.get('2025-07-04')).toBe(YEAR_DAY_STATES.ABROAD);
  });

  it('lets real stays win over scenario stays on overlapping days', () => {
    const days = buildYearDayMap(
      2025,
      [{ start: '2025-05-01', end: '2025-05-10' }],
      [{ start: '2025-05-05', end: '2025-05-15' }],
    );
    const byKey = new Map(days.map((day) => [day.dayKey, day.state]));

    expect(byKey.get('2025-05-05')).toBe(YEAR_DAY_STATES.IN_SPAIN);
    expect(byKey.get('2025-05-10')).toBe(YEAR_DAY_STATES.IN_SPAIN);
    expect(byKey.get('2025-05-11')).toBe(YEAR_DAY_STATES.HYPOTHETICAL);
    expect(byKey.get('2025-05-15')).toBe(YEAR_DAY_STATES.HYPOTHETICAL);
    expect(byKey.get('2025-05-16')).toBe(YEAR_DAY_STATES.ABROAD);
  });

  it('clamps ranges that spill outside the fiscal year', () => {
    const days = buildYearDayMap(
      2025,
      [{ start: '2024-12-30', end: '2025-01-02' }],
      [{ start: '2025-12-31', end: '2026-01-05' }],
    );
    const byKey = new Map(days.map((day) => [day.dayKey, day.state]));

    expect(days).toHaveLength(365);
    expect(byKey.get('2025-01-01')).toBe(YEAR_DAY_STATES.IN_SPAIN);
    expect(byKey.get('2025-01-02')).toBe(YEAR_DAY_STATES.IN_SPAIN);
    expect(byKey.get('2025-01-03')).toBe(YEAR_DAY_STATES.ABROAD);
    expect(byKey.get('2025-12-31')).toBe(YEAR_DAY_STATES.HYPOTHETICAL);
  });

  it('deduplicates overlapping real ranges without changing states', () => {
    const days = buildYearDayMap(2025, [
      { start: '2025-02-01', end: '2025-02-10' },
      { start: '2025-02-05', end: '2025-02-15' },
    ]);
    const inSpainCount = days.filter((day) => day.state === YEAR_DAY_STATES.IN_SPAIN).length;

    expect(inSpainCount).toBe(15);
  });

  it('rejects invalid fiscal years', () => {
    expect(() => buildYearDayMap('not-a-year')).toThrow('Invalid fiscal year provided.');
    expect(() => buildYearDayMap(1800)).toThrow('Invalid fiscal year provided.');
  });
});

describe('groupYearDaysByMonth', () => {
  it('groups the year into 12 month buckets with correct sizes', () => {
    const months = groupYearDaysByMonth(buildYearDayMap(2025));

    expect(months).toHaveLength(12);
    expect(months.map((month) => month.days.length)).toEqual([
      31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
    ]);
    expect(months[0].days[0].dayKey).toBe('2025-01-01');
    expect(months[11].days[30].dayKey).toBe('2025-12-31');
  });

  it('returns an empty array for empty input', () => {
    expect(groupYearDaysByMonth([])).toEqual([]);
  });
});
