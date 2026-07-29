import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  SCENARIO_STORAGE_KEY,
  SELECTED_YEAR_STORAGE_KEY,
  STAY_RANGES_STORAGE_KEY,
  loadScenarioState,
  loadSelectedFiscalYear,
  loadStayRanges,
  saveScenarioState,
  saveSelectedFiscalYear,
  saveStayRanges,
} from './stayRangesStorage.js';

function createMemoryStorage() {
  const map = new Map();

  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
    clear: () => map.clear(),
  };
}

describe('stayRangesStorage', () => {
  beforeEach(() => {
    globalThis.localStorage = createMemoryStorage();
  });

  afterEach(() => {
    delete globalThis.localStorage;
  });

  it('round-trips stay ranges per fiscal year as normalized Date ranges', () => {
    saveStayRanges(2026, [
      { start: new Date(2026, 0, 1), end: new Date(2026, 0, 10) },
      { start: '2026-02-01', end: '2026-02-05' },
    ]);
    saveStayRanges(2025, [{ start: '2025-06-01', end: '2025-06-03' }]);

    const ranges2026 = loadStayRanges(2026);
    expect(ranges2026).toHaveLength(2);
    expect(ranges2026[0].start).toBeInstanceOf(Date);
    expect(ranges2026[0].days).toBe(10);
    expect(ranges2026[1].days).toBe(5);

    expect(loadStayRanges(2025)).toHaveLength(1);
    expect(loadStayRanges(2024)).toEqual([]);
  });

  it('skips corrupted entries instead of failing the whole load', () => {
    globalThis.localStorage.setItem(
      STAY_RANGES_STORAGE_KEY,
      JSON.stringify({
        2026: [
          { start: '2026-01-01', end: '2026-01-02' },
          { start: 'not-a-date', end: '2026-01-05' },
          { start: '2026-03-10', end: '2026-03-01' },
          null,
        ],
      }),
    );

    const ranges = loadStayRanges(2026);
    expect(ranges).toHaveLength(1);
    expect(ranges[0].days).toBe(2);
  });

  it('returns empty defaults when storage holds invalid JSON', () => {
    globalThis.localStorage.setItem(STAY_RANGES_STORAGE_KEY, '{broken');
    globalThis.localStorage.setItem(SCENARIO_STORAGE_KEY, '42');

    expect(loadStayRanges(2026)).toEqual([]);
    expect(loadScenarioState(2026)).toEqual({ enabled: false, ranges: [] });
  });

  it('round-trips scenario state (toggle + ranges) per fiscal year', () => {
    saveScenarioState(2026, {
      enabled: true,
      ranges: [{ start: '2026-09-01', end: '2026-09-20' }],
    });

    const state = loadScenarioState(2026);
    expect(state.enabled).toBe(true);
    expect(state.ranges).toHaveLength(1);
    expect(state.ranges[0].days).toBe(20);

    expect(loadScenarioState(2025)).toEqual({ enabled: false, ranges: [] });
  });

  it('stores stays and scenarios under separate keys', () => {
    saveStayRanges(2026, [{ start: '2026-01-01', end: '2026-01-05' }]);
    saveScenarioState(2026, {
      enabled: true,
      ranges: [{ start: '2026-12-01', end: '2026-12-10' }],
    });

    expect(loadStayRanges(2026)).toHaveLength(1);
    expect(loadScenarioState(2026).ranges).toHaveLength(1);
    expect(loadStayRanges(2026)[0].days).toBe(5);
    expect(loadScenarioState(2026).ranges[0].days).toBe(10);
  });

  it('degrades gracefully when localStorage is unavailable', () => {
    delete globalThis.localStorage;

    expect(loadStayRanges(2026)).toEqual([]);
    expect(loadScenarioState(2026)).toEqual({ enabled: false, ranges: [] });
    expect(loadSelectedFiscalYear(2026)).toBe(2026);
    expect(() => saveStayRanges(2026, [{ start: '2026-01-01', end: '2026-01-02' }])).not.toThrow();
    expect(() => saveScenarioState(2026, { enabled: true, ranges: [] })).not.toThrow();
    expect(() => saveSelectedFiscalYear(2026)).not.toThrow();
  });

  it('round-trips the selected fiscal year', () => {
    const currentYear = new Date().getFullYear();

    saveSelectedFiscalYear(currentYear - 1);
    expect(loadSelectedFiscalYear(currentYear)).toBe(currentYear - 1);
    expect(globalThis.localStorage.getItem(SELECTED_YEAR_STORAGE_KEY)).toBe(String(currentYear - 1));
  });

  it('falls back when the saved fiscal year is missing or out of range', () => {
    const currentYear = new Date().getFullYear();

    expect(loadSelectedFiscalYear(currentYear)).toBe(currentYear);

    globalThis.localStorage.setItem(SELECTED_YEAR_STORAGE_KEY, '1999');
    expect(loadSelectedFiscalYear(currentYear)).toBe(currentYear);

    globalThis.localStorage.setItem(SELECTED_YEAR_STORAGE_KEY, String(currentYear + 5));
    expect(loadSelectedFiscalYear(currentYear)).toBe(currentYear);

    globalThis.localStorage.setItem(SELECTED_YEAR_STORAGE_KEY, 'not-a-year');
    expect(loadSelectedFiscalYear(currentYear)).toBe(currentYear);

    saveSelectedFiscalYear(NaN);
    expect(loadSelectedFiscalYear(currentYear)).toBe(currentYear);
  });
});
