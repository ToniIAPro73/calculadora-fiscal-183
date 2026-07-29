import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  buildSharePayload,
  buildShareUrl,
  clearShareParamFromUrl,
  copyTextToClipboard,
  decodeShareState,
  encodeShareState,
  readShareParam,
} from './shareScenario.js';

const sampleState = {
  fiscalYear: 2026,
  stayRanges: [
    { start: new Date(2026, 0, 1), end: new Date(2026, 0, 10) },
    { start: '2026-03-01', end: '2026-03-15' },
  ],
  scenarioEnabled: true,
  scenarioRanges: [{ start: '2026-09-01', end: '2026-09-20' }],
};

describe('shareScenario payload', () => {
  it('builds a compact payload with dates only (no personal data)', () => {
    const payload = buildSharePayload(sampleState);

    expect(payload).toEqual({
      v: 1,
      y: 2026,
      r: [
        ['2026-01-01', '2026-01-10'],
        ['2026-03-01', '2026-03-15'],
      ],
      h: { e: true, r: [['2026-09-01', '2026-09-20']] },
    });
    expect(JSON.stringify(payload)).not.toMatch(/@|name|email/i);
  });

  it('skips corrupted ranges instead of failing the payload', () => {
    const payload = buildSharePayload({
      fiscalYear: 2026,
      stayRanges: [{ start: 'not-a-date', end: '2026-01-05' }, null, sampleState.stayRanges[0]],
      scenarioEnabled: false,
      scenarioRanges: [],
    });

    expect(payload.r).toEqual([['2026-01-01', '2026-01-10']]);
  });
});

describe('shareScenario encode/decode', () => {
  it('round-trips the full state (compressed when available)', async () => {
    const encoded = await encodeShareState(sampleState);

    expect(encoded).toMatch(/^[12][A-Za-z0-9_-]+$/);
    expect(encoded).not.toMatch(/[+/=]/);

    const decoded = await decodeShareState(encoded);
    expect(decoded.fiscalYear).toBe(2026);
    expect(decoded.scenarioEnabled).toBe(true);
    expect(decoded.stayRanges).toHaveLength(2);
    expect(decoded.stayRanges[0].start).toBeInstanceOf(Date);
    expect(decoded.stayRanges[0].days).toBe(10);
    expect(decoded.stayRanges[1].days).toBe(15);
    expect(decoded.scenarioRanges).toHaveLength(1);
    expect(decoded.scenarioRanges[0].days).toBe(20);
  });

  it('round-trips through the plain JSON fallback when CompressionStream is unavailable', async () => {
    const originalCompression = globalThis.CompressionStream;
    try {
      globalThis.CompressionStream = undefined;

      const encoded = await encodeShareState(sampleState);
      expect(encoded.startsWith('1')).toBe(true);

      const decoded = await decodeShareState(encoded);
      expect(decoded.fiscalYear).toBe(2026);
      expect(decoded.stayRanges).toHaveLength(2);
      expect(decoded.scenarioRanges).toHaveLength(1);
    } finally {
      globalThis.CompressionStream = originalCompression;
    }
  });

  it('encodes accented and special characters losslessly', async () => {
    const encoded = await encodeShareState({ ...sampleState, fiscalYear: 2025 });
    const decoded = await decodeShareState(encoded);
    expect(decoded.fiscalYear).toBe(2025);
  });

  it('returns null for malformed, tampered or unsupported input', async () => {
    expect(await decodeShareState(null)).toBeNull();
    expect(await decodeShareState('')).toBeNull();
    expect(await decodeShareState('x')).toBeNull();
    expect(await decodeShareState('9AAAA')).toBeNull(); // unknown format marker
    expect(await decodeShareState('1!!!not-base64!!!')).toBeNull();
    expect(await decodeShareState('2corruptedpayload')).toBeNull();

    // Valid base64url but JSON without a usable year
    const noYear = `1${btoa('{"v":1,"r":[]}').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')}`;
    expect(await decodeShareState(noYear)).toBeNull();

    // Year outside the accepted range
    const badYear = `1${btoa('{"v":1,"y":1990,"r":[]}').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')}`;
    expect(await decodeShareState(badYear)).toBeNull();
  });
});

describe('shareScenario URL helpers', () => {
  it('reads the share param from a query string', () => {
    expect(readShareParam('?s=abc123')).toBe('abc123');
    expect(readShareParam('?foo=1&s=xyz&bar=2')).toBe('xyz');
    expect(readShareParam('?foo=1')).toBeNull();
    expect(readShareParam('')).toBeNull();
  });

  it('builds the share URL from a base URL', () => {
    expect(buildShareUrl('1abc', 'https://www.regla183.com/')).toBe('https://www.regla183.com/?s=1abc');
    expect(buildShareUrl('2xyz', 'https://www.regla183.com/en')).toBe('https://www.regla183.com/en?s=2xyz');
  });

  it('removes only the share param from the current URL', () => {
    const replaceState = vi.fn();
    const originalLocation = globalThis.location;
    const originalHistory = globalThis.history;

    try {
      globalThis.location = { href: 'https://www.regla183.com/?s=abc&utm_source=test#top' };
      globalThis.history = { replaceState };

      clearShareParamFromUrl();
      expect(replaceState).toHaveBeenCalledWith(null, '', '/?utm_source=test#top');
    } finally {
      globalThis.location = originalLocation;
      globalThis.history = originalHistory;
    }
  });

  it('does nothing when the share param is absent or history is unavailable', () => {
    const replaceState = vi.fn();
    const originalLocation = globalThis.location;
    const originalHistory = globalThis.history;

    try {
      globalThis.location = { href: 'https://www.regla183.com/' };
      globalThis.history = { replaceState };

      clearShareParamFromUrl();
      expect(replaceState).not.toHaveBeenCalled();

      delete globalThis.location;
      delete globalThis.history;
      expect(() => clearShareParamFromUrl()).not.toThrow();
    } finally {
      globalThis.location = originalLocation;
      globalThis.history = originalHistory;
    }
  });
});

describe('shareScenario clipboard', () => {
  beforeEach(() => {
    vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn().mockResolvedValue(undefined) } });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('copies with navigator.clipboard when available', async () => {
    await expect(copyTextToClipboard('https://www.regla183.com/?s=abc')).resolves.toBe(true);
    expect(globalThis.navigator.clipboard.writeText).toHaveBeenCalledWith('https://www.regla183.com/?s=abc');
  });

  it('returns false when neither clipboard API nor document is available', async () => {
    vi.stubGlobal('navigator', {});
    await expect(copyTextToClipboard('text')).resolves.toBe(false);
  });

  it('falls back when navigator.clipboard rejects and reports failure without document', async () => {
    globalThis.navigator.clipboard.writeText.mockRejectedValue(new Error('denied'));
    await expect(copyTextToClipboard('text')).resolves.toBe(false);
  });
});
