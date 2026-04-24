import {
  differenceInCalendarDays,
  eachDayOfInterval,
  format,
  isBefore,
  isValid,
  max,
  startOfDay,
} from 'date-fns';

export const DEFAULT_FISCAL_LIMIT = 183;
export const DEFAULT_WARNING_THRESHOLD = 150;

export function normalizeDate(date) {
  const normalized = startOfDay(date instanceof Date ? date : new Date(date));

  if (!isValid(normalized)) {
    throw new Error('Invalid date provided.');
  }

  return normalized;
}

export function calculateRangeDays(start, end) {
  const normalizedStart = normalizeDate(start);
  const normalizedEnd = normalizeDate(end);

  if (isBefore(normalizedEnd, normalizedStart)) {
    throw new Error('Date range end cannot be before start.');
  }

  return differenceInCalendarDays(normalizedEnd, normalizedStart) + 1;
}

export function normalizeDateRange(range) {
  const start = normalizeDate(range?.start);
  const end = normalizeDate(range?.end);

  return {
    start,
    end,
    days: calculateRangeDays(start, end),
  };
}

export function toDayKey(date) {
  return format(normalizeDate(date), 'yyyy-MM-dd');
}

export function mergeDateRanges(ranges = []) {
  if (!Array.isArray(ranges) || ranges.length === 0) {
    return { merged: [], hasOverlap: false, annotatedRanges: [] };
  }

  const normalizedRanges = ranges.map(normalizeDateRange);
  const sortedRanges = [...normalizedRanges].sort((a, b) => a.start.getTime() - b.start.getTime());
  const merged = [{ ...sortedRanges[0] }];
  let hasOverlap = false;

  for (let index = 1; index < sortedRanges.length; index += 1) {
    const current = sortedRanges[index];
    const lastMerged = merged[merged.length - 1];

    if (current.start <= lastMerged.end) {
      hasOverlap = true;
      lastMerged.end = max([lastMerged.end, current.end]);
      lastMerged.days = calculateRangeDays(lastMerged.start, lastMerged.end);
    } else {
      merged.push({ ...current });
    }
  }

  const dayUsage = new Map();
  normalizedRanges.forEach((range) => {
    eachDayOfInterval({ start: range.start, end: range.end }).forEach((day) => {
      const key = toDayKey(day);
      dayUsage.set(key, (dayUsage.get(key) ?? 0) + 1);
    });
  });

  const annotatedRanges = normalizedRanges.map((range) => {
    const overlapDays = eachDayOfInterval({ start: range.start, end: range.end }).reduce((count, day) => {
      return count + ((dayUsage.get(toDayKey(day)) ?? 0) > 1 ? 1 : 0);
    }, 0);

    return { ...range, overlapDays };
  });

  return { merged, hasOverlap, annotatedRanges };
}

export function calculateUniqueDays(ranges = []) {
  return ranges.map(normalizeDateRange).reduce((sum, range) => sum + range.days, 0);
}

export function getFiscalStatus(totalDays, warningThreshold = DEFAULT_WARNING_THRESHOLD, limit = DEFAULT_FISCAL_LIMIT) {
  if (totalDays > limit) return 'destructive';
  if (totalDays > warningThreshold) return 'warning';
  return 'safe';
}

export function calculateFiscalSummary(ranges = [], options = {}) {
  const limit = options.limit ?? DEFAULT_FISCAL_LIMIT;
  const warningThreshold = options.warningThreshold ?? DEFAULT_WARNING_THRESHOLD;
  const { merged, hasOverlap, annotatedRanges } = mergeDateRanges(ranges);
  const totalDays = calculateUniqueDays(merged);

  return {
    limit,
    warningThreshold,
    totalDays,
    remainingDays: Math.max(limit - totalDays, 0),
    exceededDays: Math.max(totalDays - limit, 0),
    percentageUsed: Math.min((totalDays / limit) * 100, 100),
    hasOverlap,
    status: getFiscalStatus(totalDays, warningThreshold, limit),
    mergedRanges: merged,
    annotatedRanges,
  };
}
