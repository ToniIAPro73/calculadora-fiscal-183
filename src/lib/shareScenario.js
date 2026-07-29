import { normalizeDateRange, toDayKey } from './fiscalSummary.js';

export const SHARE_PARAM = 's';

const FORMAT_PLAIN = '1';
const FORMAT_DEFLATE = '2';

const MIN_SHARE_YEAR = 2000;
const MAX_SHARE_YEAR = 2100;

function toBase64Url(bytes) {
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(encoded) {
  const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function canUseCompressionStream() {
  return (
    typeof globalThis.CompressionStream === 'function' &&
    typeof globalThis.DecompressionStream === 'function' &&
    typeof Blob === 'function' &&
    typeof Response === 'function'
  );
}

async function compressText(text) {
  const stream = new Blob([text])
    .stream()
    .pipeThrough(new globalThis.CompressionStream('deflate-raw'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function decompressText(bytes) {
  const stream = new Blob([bytes])
    .stream()
    .pipeThrough(new globalThis.DecompressionStream('deflate-raw'));
  return new Response(stream).text();
}

function toSerializableRanges(ranges) {
  if (!Array.isArray(ranges)) return [];

  return ranges.reduce((acc, range) => {
    try {
      const { start, end } = normalizeDateRange(range);
      acc.push([toDayKey(start), toDayKey(end)]);
    } catch {
      // Skip corrupted entries instead of failing the whole payload.
    }
    return acc;
  }, []);
}

function fromSerializableRanges(list) {
  if (!Array.isArray(list)) return [];

  return list.reduce((acc, entry) => {
    try {
      const [start, end] = Array.isArray(entry) ? entry : [];
      acc.push(normalizeDateRange({ start, end }));
    } catch {
      // Skip corrupted entries instead of failing the whole load.
    }
    return acc;
  }, []);
}

/**
 * Builds the compact, privacy-safe payload that goes into the share URL.
 * Only dates, fiscal year and the scenario toggle: never personal data.
 */
export function buildSharePayload({ fiscalYear, stayRanges, scenarioEnabled, scenarioRanges }) {
  return {
    v: 1,
    y: Number(fiscalYear),
    r: toSerializableRanges(stayRanges),
    h: {
      e: scenarioEnabled === true,
      r: toSerializableRanges(scenarioRanges),
    },
  };
}

/**
 * Encodes the calculator state as a URL-safe string: a one-char format
 * marker plus base64url of the JSON, deflate-raw compressed when the
 * platform supports CompressionStream (plain JSON otherwise).
 */
export async function encodeShareState(state) {
  const json = JSON.stringify(buildSharePayload(state));

  if (canUseCompressionStream()) {
    try {
      return FORMAT_DEFLATE + toBase64Url(await compressText(json));
    } catch {
      // Fall back to the plain encoding below.
    }
  }

  return FORMAT_PLAIN + toBase64Url(new TextEncoder().encode(json));
}

/**
 * Decodes a share string back into calculator state.
 * Returns null for any malformed or unsupported input.
 */
export async function decodeShareState(encoded) {
  if (typeof encoded !== 'string' || encoded.length < 2) return null;

  const format = encoded[0];
  const body = encoded.slice(1);

  try {
    let json;
    if (format === FORMAT_DEFLATE) {
      if (typeof globalThis.DecompressionStream !== 'function') return null;
      json = await decompressText(fromBase64Url(body));
    } else if (format === FORMAT_PLAIN) {
      json = new TextDecoder().decode(fromBase64Url(body));
    } else {
      return null;
    }

    return normalizeSharePayload(JSON.parse(json));
  } catch {
    return null;
  }
}

function normalizeSharePayload(payload) {
  if (!payload || typeof payload !== 'object') return null;

  const year = Number(payload.y);
  if (!Number.isInteger(year) || year < MIN_SHARE_YEAR || year > MAX_SHARE_YEAR) {
    return null;
  }

  return {
    fiscalYear: year,
    stayRanges: fromSerializableRanges(payload.r),
    scenarioEnabled: payload.h?.e === true,
    scenarioRanges: fromSerializableRanges(payload.h?.r),
  };
}

/** Reads the share param from a query string (defaults to the current URL). */
export function readShareParam(search = globalThis.location?.search ?? '') {
  try {
    return new URLSearchParams(search).get(SHARE_PARAM);
  } catch {
    return null;
  }
}

/** Builds the full shareable URL for the current page plus the encoded state. */
export function buildShareUrl(encoded, baseUrl) {
  const base = baseUrl ?? `${globalThis.location?.origin ?? ''}${globalThis.location?.pathname ?? ''}`;
  return `${base}?${SHARE_PARAM}=${encoded}`;
}

/** Removes the share param from the address bar without reloading the page. */
export function clearShareParamFromUrl() {
  try {
    const url = new URL(globalThis.location.href);
    if (!url.searchParams.has(SHARE_PARAM)) return;

    url.searchParams.delete(SHARE_PARAM);
    const query = url.searchParams.toString();
    globalThis.history.replaceState(null, '', `${url.pathname}${query ? `?${query}` : ''}${url.hash}`);
  } catch {
    // Non-browser environment or blocked history API: nothing to clean.
  }
}

/**
 * Copies text to the clipboard using navigator.clipboard when available,
 * with a hidden-textarea fallback for older or insecure contexts.
 */
export async function copyTextToClipboard(text) {
  try {
    if (globalThis.navigator?.clipboard?.writeText) {
      await globalThis.navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the legacy path.
  }

  try {
    const doc = globalThis.document;
    if (!doc?.body) return false;

    const textarea = doc.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    doc.body.appendChild(textarea);
    textarea.select();
    const copied = doc.execCommand('copy');
    doc.body.removeChild(textarea);
    return copied;
  } catch {
    return false;
  }
}
