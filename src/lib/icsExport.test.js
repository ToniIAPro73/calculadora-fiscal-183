import { describe, expect, it } from 'vitest';
import {
  buildIcsCalendar,
  escapeIcsText,
  findLimitDayDate,
  foldIcsLine,
  formatIcsDate,
  formatIcsDateTimeUtc,
} from './icsExport.js';

describe('escapeIcsText', () => {
  it('escapes backslashes first, then commas, semicolons and newlines', () => {
    expect(escapeIcsText('Calle A, B; planta 3\\4')).toBe('Calle A\\, B\\; planta 3\\\\4');
    expect(escapeIcsText('línea 1\nlínea 2\r\nlínea 3')).toBe('línea 1\\nlínea 2\\nlínea 3');
  });

  it('handles nullish input without throwing', () => {
    expect(escapeIcsText(null)).toBe('');
    expect(escapeIcsText(undefined)).toBe('');
  });
});

describe('ICS date formats', () => {
  it('formats all-day dates as YYYYMMDD', () => {
    expect(formatIcsDate(new Date(2026, 0, 5))).toBe('20260105');
    expect(formatIcsDate(new Date(2026, 11, 31))).toBe('20261231');
  });

  it('formats UTC timestamps as YYYYMMDDTHHMMSSZ', () => {
    const date = new Date(Date.UTC(2026, 6, 29, 20, 47, 23));
    expect(formatIcsDateTimeUtc(date)).toBe('20260729T204723Z');
  });
});

describe('foldIcsLine', () => {
  it('leaves short lines untouched', () => {
    expect(foldIcsLine('VERSION:2.0')).toEqual(['VERSION:2.0']);
  });

  it('folds long lines with a leading space on continuations', () => {
    const line = `SUMMARY:${'Estancia muy larga '.repeat(10)}`;
    const folded = foldIcsLine(line);

    expect(folded.length).toBeGreaterThan(1);
    expect(folded[0].length).toBeLessThanOrEqual(74);
    folded.slice(1).forEach((part) => {
      expect(part.startsWith(' ')).toBe(true);
      expect(part.length).toBeLessThanOrEqual(74);
    });
    // Unfolding must restore the original line
    expect(folded[0] + folded.slice(1).map((part) => part.slice(1)).join('')).toBe(line);
  });
});

describe('findLimitDayDate', () => {
  it('returns the calendar date of the 183rd unique day', () => {
    // 2026 is not a leap year: day 183 is July 2nd
    expect(findLimitDayDate([{ start: '2026-01-01', end: '2026-07-02' }])).toEqual(new Date(2026, 6, 2));
  });

  it('returns null when the stays do not reach the limit', () => {
    expect(findLimitDayDate([{ start: '2026-01-01', end: '2026-06-30' }])).toBeNull();
  });

  it('accounts for gaps and overlaps across multiple ranges', () => {
    const ranges = [
      { start: '2026-01-01', end: '2026-03-31' }, // 90 days
      { start: '2026-02-15', end: '2026-04-15' }, // overlaps; merged Jan 1 - Apr 15 = 105 days
      { start: '2026-06-01', end: '2026-09-15' }, // 107 more days
    ];

    // 105 + 78 = 183 -> August 17th, 2026
    expect(findLimitDayDate(ranges)).toEqual(new Date(2026, 7, 17));
  });

  it('supports custom limits', () => {
    expect(findLimitDayDate([{ start: '2026-01-01', end: '2026-01-31' }], 10)).toEqual(new Date(2026, 0, 10));
  });
});

describe('buildIcsCalendar', () => {
  const options = {
    eventSummary: 'Estancia en España (regla 183)',
    reminderSummary: 'Quedan 30 días para alcanzar 183 días de presencia',
    fiscalYear: 2026,
    now: new Date(Date.UTC(2026, 0, 10, 12, 0, 0)),
  };

  it('returns null when there are no ranges', () => {
    expect(buildIcsCalendar({ ...options, ranges: [] })).toBeNull();
  });

  it('emits a valid VCALENDAR skeleton with CRLF line endings', () => {
    const ics = buildIcsCalendar({ ...options, ranges: [{ start: '2026-01-01', end: '2026-01-10' }] });

    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true);
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true);
    expect(ics).not.toMatch(/[^\r]\n/); // no bare LF
    expect(ics).toContain('VERSION:2.0\r\n');
    expect(ics).toContain('PRODID:-//regla183.com//Tax Nomad Calculator//ES\r\n');
    expect(ics).toContain('DTSTAMP:20260110T120000Z\r\n');
  });

  it('creates one all-day VEVENT per range with an exclusive DTEND', () => {
    const ics = buildIcsCalendar({
      ...options,
      ranges: [
        { start: '2026-01-01', end: '2026-01-10' },
        { start: '2026-03-01', end: '2026-03-05' },
      ],
    });

    const eventCount = (ics.match(/BEGIN:VEVENT/g) ?? []).length;
    expect(eventCount).toBe(2); // no reminder: 15 days stay, limit not reachable
    expect(ics).toContain('DTSTART;VALUE=DATE:20260101\r\n');
    expect(ics).toContain('DTEND;VALUE=DATE:20260111\r\n');
    expect(ics).toContain('DTSTART;VALUE=DATE:20260301\r\n');
    expect(ics).toContain('DTEND;VALUE=DATE:20260306\r\n');
    expect(ics).toContain(`SUMMARY:${options.eventSummary}\r\n`);
  });

  it('escapes reserved characters inside summaries', () => {
    const ics = buildIcsCalendar({
      ...options,
      eventSummary: 'Estancia, con coma; y punto y coma',
      ranges: [{ start: '2026-01-01', end: '2026-01-05' }],
    });

    expect(ics).toContain('SUMMARY:Estancia\\, con coma\\; y punto y coma\r\n');
  });

  it('adds a reminder event 30 days before the projected day 183', () => {
    const ics = buildIcsCalendar({
      ...options,
      ranges: [{ start: '2026-01-01', end: '2026-07-02' }], // day 183 = 2026-07-02
    });

    expect(ics).toContain('DTSTART;VALUE=DATE:20260602\r\n'); // July 2nd - 30 days
    expect(ics).toContain('DTEND;VALUE=DATE:20260603\r\n');
    expect(ics).toContain(`SUMMARY:${options.reminderSummary}\r\n`);
    expect(ics).toContain('UID:taxnomad-reminder-2026-20260602@regla183.com\r\n');
  });

  it('omits the reminder when day 183 is not projectable', () => {
    const ics = buildIcsCalendar({
      ...options,
      ranges: [{ start: '2026-01-01', end: '2026-01-31' }],
    });

    expect(ics).not.toContain('taxnomad-reminder');
    expect(ics).not.toContain(options.reminderSummary);
  });

  it('generates deterministic UIDs from fiscal year and dates', () => {
    const ics = buildIcsCalendar({
      ...options,
      ranges: [{ start: '2026-01-01', end: '2026-01-10' }],
    });

    expect(ics).toContain('UID:taxnomad-stay-2026-20260101-20260110@regla183.com\r\n');
  });
});
