import { addDays } from 'date-fns';
import {
  DEFAULT_FISCAL_LIMIT,
  mergeDateRanges,
  normalizeDate,
} from './fiscalSummary.js';

const ICS_LINE_LIMIT = 74; // RFC 5545 recommends 75 octets per line; stay below
const ICS_CRLF = '\r\n';

/** Escapes a text value for ICS content lines (RFC 5545 §3.3.11). */
export function escapeIcsText(value) {
  return String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r\n|\r|\n/g, '\\n');
}

/** Formats a date as an all-day ICS date (YYYYMMDD). */
export function formatIcsDate(date) {
  const normalized = normalizeDate(date);
  const pad = (number) => String(number).padStart(2, '0');
  return `${normalized.getFullYear()}${pad(normalized.getMonth() + 1)}${pad(normalized.getDate())}`;
}

/** Formats a date as a UTC ICS timestamp (YYYYMMDDTHHMMSSZ), used for DTSTAMP. */
export function formatIcsDateTimeUtc(date = new Date()) {
  const pad = (number) => String(number).padStart(2, '0');
  return (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
  );
}

/** Folds a content line to the RFC 5545 limit; continuations start with a space. */
export function foldIcsLine(line, limit = ICS_LINE_LIMIT) {
  if (line.length <= limit) return [line];

  const parts = [];
  let rest = line;
  let chunkLength = limit;

  while (rest.length > 0) {
    let chunk = rest.slice(0, chunkLength);
    // Do not split a UTF-16 surrogate pair at the fold boundary
    const lastCode = chunk.charCodeAt(chunk.length - 1);
    if (lastCode >= 0xd800 && lastCode <= 0xdbff && rest.length > chunkLength) {
      chunk = chunk.slice(0, -1);
    }
    parts.push(parts.length === 0 ? chunk : ` ${chunk}`);
    rest = rest.slice(chunk.length);
    chunkLength = limit - 1; // continuation lines reserve one char for the leading space
  }

  return parts;
}

/**
 * Returns the calendar date on which the Nth unique day of presence occurs
 * (N = limit), or null when the stays do not reach the limit.
 */
export function findLimitDayDate(ranges = [], limit = DEFAULT_FISCAL_LIMIT) {
  const { merged } = mergeDateRanges(ranges);
  let cumulative = 0;

  for (const range of merged) {
    if (cumulative + range.days >= limit) {
      return addDays(range.start, limit - cumulative - 1);
    }
    cumulative += range.days;
  }

  return null;
}

function buildEventLines({ uid, stamp, startDate, endDate, summary }) {
  const lines = [
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${formatIcsDate(startDate)}`,
    `DTEND;VALUE=DATE:${formatIcsDate(endDate)}`,
    `SUMMARY:${escapeIcsText(summary)}`,
    'END:VEVENT',
  ];

  return lines.flatMap((line) => foldIcsLine(line));
}

/**
 * Builds an RFC 5545 calendar (ICS text, CRLF line endings) with one all-day
 * event per stay range and, when the day-183 date is projectable, a reminder
 * event `reminderLeadDays` days before it. Returns null when there are no ranges.
 */
export function buildIcsCalendar({
  ranges = [],
  eventSummary,
  reminderSummary,
  fiscalYear,
  limit = DEFAULT_FISCAL_LIMIT,
  reminderLeadDays = 30,
  now = new Date(),
}) {
  if (!Array.isArray(ranges) || ranges.length === 0) {
    return null;
  }

  const stamp = formatIcsDateTimeUtc(now);
  const normalizedRanges = ranges
    .map((range) => ({ start: normalizeDate(range?.start), end: normalizeDate(range?.end) }))
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  const body = [];

  normalizedRanges.forEach((range) => {
    body.push(
      ...buildEventLines({
        uid: `taxnomad-stay-${fiscalYear}-${formatIcsDate(range.start)}-${formatIcsDate(range.end)}@regla183.com`,
        stamp,
        startDate: range.start,
        endDate: addDays(range.end, 1), // DTEND is exclusive for all-day events
        summary: eventSummary,
      }),
    );
  });

  const limitDay = findLimitDayDate(ranges, limit);
  if (limitDay) {
    const reminderDate = addDays(limitDay, -reminderLeadDays);
    body.push(
      ...buildEventLines({
        uid: `taxnomad-reminder-${fiscalYear}-${formatIcsDate(reminderDate)}@regla183.com`,
        stamp,
        startDate: reminderDate,
        endDate: addDays(reminderDate, 1),
        summary: reminderSummary,
      }),
    );
  }

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//regla183.com//Tax Nomad Calculator//ES',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    ...body,
    'END:VCALENDAR',
  ];

  return lines.join(ICS_CRLF) + ICS_CRLF;
}
