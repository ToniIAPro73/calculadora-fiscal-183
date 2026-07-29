import {
  calculateFiscalSummary,
  getRiskLevel,
  normalizeDateRange,
} from './fiscalSummary.js';

export const SAVED_SCENARIOS_STORAGE_KEY = 'taxnomad_saved_scenarios';
export const MAX_SAVED_SCENARIOS = 10;
export const MAX_SCENARIO_NAME_LENGTH = 40;

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

function sanitizeName(name) {
  if (typeof name !== 'string') return null;
  const trimmed = name.trim().slice(0, MAX_SCENARIO_NAME_LENGTH);
  return trimmed.length > 0 ? trimmed : null;
}

function sanitizeScenario(entry) {
  const name = sanitizeName(entry?.name);
  const ranges = sanitizeRanges(entry?.ranges);

  if (!name || ranges.length === 0) return null;

  return {
    id: typeof entry?.id === 'string' && entry.id ? entry.id : createScenarioId(),
    name,
    ranges,
  };
}

function createScenarioId() {
  return `scenario-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Loads the named hypothetical scenarios saved for a fiscal year.
 * Returns entries with normalized Date ranges; corrupted entries are skipped.
 * Everything stays in the browser's localStorage, never on a server.
 */
export function loadSavedScenarios(fiscalYear) {
  const byYear = readJson(SAVED_SCENARIOS_STORAGE_KEY, {});
  const entries = byYear?.[fiscalYear];
  if (!Array.isArray(entries)) return [];

  return entries.reduce((acc, entry) => {
    const scenario = sanitizeScenario(entry);
    if (scenario) acc.push(scenario);
    return acc;
  }, []);
}

/**
 * Saves a new named scenario (the current hypothetical ranges) for a fiscal
 * year. Returns a status object instead of throwing so the UI can react:
 * 'saved' | 'invalid-name' | 'empty' | 'limit'.
 */
export function addSavedScenario(fiscalYear, { name, ranges }) {
  const cleanName = sanitizeName(name);
  if (!cleanName) return { status: 'invalid-name', scenario: null };

  const cleanRanges = sanitizeRanges(ranges);
  if (cleanRanges.length === 0) return { status: 'empty', scenario: null };

  const byYear = readJson(SAVED_SCENARIOS_STORAGE_KEY, {});
  const entries = Array.isArray(byYear[fiscalYear]) ? byYear[fiscalYear] : [];
  const existingCount = entries.reduce((count, entry) => count + (sanitizeScenario(entry) ? 1 : 0), 0);

  if (existingCount >= MAX_SAVED_SCENARIOS) return { status: 'limit', scenario: null };

  const scenario = {
    id: createScenarioId(),
    name: cleanName,
    ranges: serializeRanges(cleanRanges),
  };

  byYear[fiscalYear] = [...entries, scenario];
  writeJson(SAVED_SCENARIOS_STORAGE_KEY, byYear);

  return { status: 'saved', scenario: sanitizeScenario(scenario) };
}

export function removeSavedScenario(fiscalYear, scenarioId) {
  const byYear = readJson(SAVED_SCENARIOS_STORAGE_KEY, {});
  const entries = Array.isArray(byYear[fiscalYear]) ? byYear[fiscalYear] : [];
  const nextEntries = entries.filter((entry) => entry?.id !== scenarioId);

  if (nextEntries.length > 0) {
    byYear[fiscalYear] = nextEntries;
  } else {
    delete byYear[fiscalYear];
  }

  writeJson(SAVED_SCENARIOS_STORAGE_KEY, byYear);
}

/**
 * Builds the comparison table rows: the current situation plus each saved
 * scenario projected on top of the real stays (overlapping days count once).
 */
export function buildScenarioComparison(currentRanges = [], scenarios = [], options = {}) {
  const current = calculateFiscalSummary(currentRanges, options);

  return {
    current: {
      totalDays: current.totalDays,
      remainingDays: current.remainingDays,
      riskLevel: getRiskLevel(current.totalDays, current.warningThreshold, current.limit),
    },
    rows: scenarios.map((scenario) => {
      const projected = calculateFiscalSummary([...currentRanges, ...(scenario?.ranges ?? [])], options);

      return {
        id: scenario?.id ?? null,
        name: scenario?.name ?? '',
        totalDays: projected.totalDays,
        remainingDays: projected.remainingDays,
        riskLevel: getRiskLevel(projected.totalDays, projected.warningThreshold, projected.limit),
      };
    }),
  };
}
