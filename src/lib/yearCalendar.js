import { eachDayOfInterval, endOfYear, max, min, startOfYear } from 'date-fns';
import { normalizeDateRange, toDayKey } from './fiscalSummary.js';

/**
 * Day states used by the annual calendar heatmap. A day is:
 * - 'inSpain': covered by a real stay range.
 * - 'hypothetical': covered only by a scenario (what-if) stay range.
 * - 'abroad': covered by nothing.
 * Real stays win over scenario stays on overlapping days, matching how
 * calculateScenarioComparison counts shared days only once.
 */
export const YEAR_DAY_STATES = Object.freeze({
  ABROAD: 'abroad',
  IN_SPAIN: 'inSpain',
  HYPOTHETICAL: 'hypothetical',
});

function collectDayKeys(ranges, yearStart, yearEnd) {
  const keys = new Set();

  ranges.forEach((range) => {
    const { start, end } = normalizeDateRange(range);
    // Clamp to the fiscal year so stray dates never leak into the map.
    const clampedStart = max([start, yearStart]);
    const clampedEnd = min([end, yearEnd]);

    if (clampedStart.getTime() > clampedEnd.getTime()) return;

    eachDayOfInterval({ start: clampedStart, end: clampedEnd }).forEach((day) => {
      keys.add(toDayKey(day));
    });
  });

  return keys;
}

/**
 * Builds the day -> state map for every day of the given fiscal year.
 * Runs fully in the browser; no data leaves the client.
 */
export function buildYearDayMap(fiscalYear, realRanges = [], scenarioRanges = []) {
  const year = Number(fiscalYear);

  if (!Number.isInteger(year) || year < 1970 || year > 9999) {
    throw new Error('Invalid fiscal year provided.');
  }

  const yearStart = startOfYear(new Date(year, 0, 1));
  const yearEnd = endOfYear(yearStart);
  const realDays = collectDayKeys(realRanges, yearStart, yearEnd);
  const scenarioDays = collectDayKeys(scenarioRanges, yearStart, yearEnd);

  return eachDayOfInterval({ start: yearStart, end: yearEnd }).map((date) => {
    const dayKey = toDayKey(date);
    let state = YEAR_DAY_STATES.ABROAD;

    if (realDays.has(dayKey)) {
      state = YEAR_DAY_STATES.IN_SPAIN;
    } else if (scenarioDays.has(dayKey)) {
      state = YEAR_DAY_STATES.HYPOTHETICAL;
    }

    return { date, dayKey, state };
  });
}

/**
 * Groups a year day map into 12 month buckets for rendering.
 */
export function groupYearDaysByMonth(days = []) {
  return days.reduce((months, day) => {
    const monthIndex = day.date.getMonth();

    if (!months[monthIndex]) {
      months[monthIndex] = { monthIndex, days: [] };
    }

    months[monthIndex].days.push(day);
    return months;
  }, []).filter(Boolean);
}
