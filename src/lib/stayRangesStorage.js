import { normalizeDateRange } from './fiscalSummary.js';

export const STAY_RANGES_STORAGE_KEY = 'taxnomad_stay_ranges';
export const SCENARIO_STORAGE_KEY = 'taxnomad_scenario_state';

function getStorage() {
  try {
    const storage = globalThis.localStorage;
    return storage ?? null;
  } catch {
    return null;
  }
}

function readJson(key, fallback) {
  const storage = getStorage();
  if (!storage) return fallback;

  try {
    const raw = storage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable: persistence is best-effort only.
  }
}

function sanitizeRanges(ranges) {
  if (!Array.isArray(ranges)) return [];

  return ranges.reduce((acc, range) => {
    try {
      acc.push(normalizeDateRange(range));
    } catch {
      // Skip corrupted entries instead of failing the whole load.
    }
    return acc;
  }, []);
}

function serializeRanges(ranges) {
  return sanitizeRanges(ranges).map(({ start, end }) => ({
    start: start.toISOString(),
    end: end.toISOString(),
  }));
}

/**
 * Loads the real stay ranges saved for a fiscal year.
 * Returns normalized ranges with Date start/end, ready for the calculator.
 */
export function loadStayRanges(fiscalYear) {
  const byYear = readJson(STAY_RANGES_STORAGE_KEY, {});
  return sanitizeRanges(byYear?.[fiscalYear]);
}

export function saveStayRanges(fiscalYear, ranges) {
  const byYear = readJson(STAY_RANGES_STORAGE_KEY, {});
  byYear[fiscalYear] = serializeRanges(ranges);
  writeJson(STAY_RANGES_STORAGE_KEY, byYear);
}

/**
 * Loads the hypothetical scenario state (toggle + ranges) for a fiscal year.
 */
export function loadScenarioState(fiscalYear) {
  const byYear = readJson(SCENARIO_STORAGE_KEY, {});
  const entry = byYear?.[fiscalYear];

  return {
    enabled: entry?.enabled === true,
    ranges: sanitizeRanges(entry?.ranges),
  };
}

export function saveScenarioState(fiscalYear, { enabled, ranges }) {
  const byYear = readJson(SCENARIO_STORAGE_KEY, {});
  byYear[fiscalYear] = {
    enabled: enabled === true,
    ranges: serializeRanges(ranges),
  };
  writeJson(SCENARIO_STORAGE_KEY, byYear);
}
