import { describe, expect, it } from 'vitest';
import {
  LEGAL_REFS,
  LEGAL_REF_IDS,
  getLegalRef,
  getLocalizedLegalRef,
} from './legalRefs.js';

describe('LEGAL_REFS catalogue', () => {
  it('has unique ids', () => {
    const ids = LEGAL_REFS.map((ref) => ref.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('includes the Article 9 LIRPF reference and at least one DGT ruling', () => {
    expect(LEGAL_REF_IDS).toContain('lirpf-art9');
    expect(LEGAL_REFS.some((ref) => ref.id.startsWith('dgt-'))).toBe(true);
  });

  it.each(LEGAL_REFS.map((ref) => [ref.id, ref]))(
    'entry %s has title and excerpt in ES and EN',
    (_id, ref) => {
      for (const lang of ['es', 'en']) {
        expect(typeof ref.title[lang]).toBe('string');
        expect(ref.title[lang].length).toBeGreaterThan(0);
        expect(typeof ref.excerpt[lang]).toBe('string');
        expect(ref.excerpt[lang].length).toBeGreaterThan(0);
      }
    },
  );

  it.each(LEGAL_REFS.map((ref) => [ref.id, ref]))(
    'entry %s points to a stable official HTTPS URL',
    (_id, ref) => {
      expect(ref.url).toMatch(/^https:\/\//);
      expect(ref.url).toMatch(/\.gob\.es|\.boe\.es/);
    },
  );
});

describe('getLegalRef', () => {
  it('returns the entry for a known id', () => {
    const ref = getLegalRef('lirpf-art9');
    expect(ref).not.toBeNull();
    expect(ref.id).toBe('lirpf-art9');
    expect(ref.url).toContain('BOE-A-2006-20764');
  });

  it('returns null for an unknown id', () => {
    expect(getLegalRef('no-existe')).toBeNull();
  });
});

describe('getLocalizedLegalRef', () => {
  it('returns the Spanish copy for es', () => {
    const ref = getLocalizedLegalRef('lirpf-art9', 'es');
    expect(ref.title).toBe('Art. 9 de la Ley 35/2006 (LIRPF)');
    expect(ref.excerpt).toContain('183 días');
  });

  it('returns the English copy for en', () => {
    const ref = getLocalizedLegalRef('lirpf-art9', 'en');
    expect(ref.title).toBe('Article 9 of Law 35/2006 (PIT Act)');
    expect(ref.excerpt).toContain('183 days');
  });

  it('falls back to Spanish for unsupported languages', () => {
    const ref = getLocalizedLegalRef('lirpf-art9', 'fr');
    expect(ref.title).toBe('Art. 9 de la Ley 35/2006 (LIRPF)');
  });

  it('returns null for an unknown id', () => {
    expect(getLocalizedLegalRef('desconocido', 'es')).toBeNull();
  });
});
