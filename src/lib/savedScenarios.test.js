import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  MAX_SAVED_SCENARIOS,
  SAVED_SCENARIOS_STORAGE_KEY,
  addSavedScenario,
  buildScenarioComparison,
  loadSavedScenarios,
  removeSavedScenario,
} from './savedScenarios.js';

function createMemoryStorage() {
  const map = new Map();

  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
    clear: () => map.clear(),
  };
}

describe('savedScenarios', () => {
  beforeEach(() => {
    globalThis.localStorage = createMemoryStorage();
  });

  afterEach(() => {
    delete globalThis.localStorage;
  });

  it('round-trips named scenarios per fiscal year with normalized ranges', () => {
    const result = addSavedScenario(2026, {
      name: '  Verano en Mallorca  ',
      ranges: [{ start: '2026-07-01', end: '2026-07-15' }],
    });

    expect(result.status).toBe('saved');
    expect(result.scenario.name).toBe('Verano en Mallorca');
    expect(result.scenario.id).toMatch(/^scenario-/);

    const scenarios = loadSavedScenarios(2026);
    expect(scenarios).toHaveLength(1);
    expect(scenarios[0].name).toBe('Verano en Mallorca');
    expect(scenarios[0].ranges[0].start).toBeInstanceOf(Date);
    expect(scenarios[0].ranges[0].days).toBe(15);

    expect(loadSavedScenarios(2025)).toEqual([]);
  });

  it('rejects empty names and scenarios without valid ranges', () => {
    expect(addSavedScenario(2026, { name: '   ', ranges: [{ start: '2026-07-01', end: '2026-07-02' }] }).status)
      .toBe('invalid-name');
    expect(addSavedScenario(2026, { name: 42, ranges: [{ start: '2026-07-01', end: '2026-07-02' }] }).status)
      .toBe('invalid-name');
    expect(addSavedScenario(2026, { name: 'Vacío', ranges: [] }).status).toBe('empty');
    expect(addSavedScenario(2026, { name: 'Roto', ranges: [{ start: 'nope', end: '2026-07-02' }] }).status)
      .toBe('empty');
    expect(loadSavedScenarios(2026)).toEqual([]);
  });

  it('enforces the saved scenarios limit', () => {
    for (let index = 0; index < MAX_SAVED_SCENARIOS; index += 1) {
      const result = addSavedScenario(2026, {
        name: `Escenario ${index + 1}`,
        ranges: [{ start: '2026-07-01', end: '2026-07-02' }],
      });
      expect(result.status).toBe('saved');
    }

    const overflow = addSavedScenario(2026, {
      name: 'De más',
      ranges: [{ start: '2026-07-01', end: '2026-07-02' }],
    });

    expect(overflow.status).toBe('limit');
    expect(loadSavedScenarios(2026)).toHaveLength(MAX_SAVED_SCENARIOS);
  });

  it('removes scenarios by id without touching other years', () => {
    const first = addSavedScenario(2026, {
      name: 'A',
      ranges: [{ start: '2026-07-01', end: '2026-07-02' }],
    }).scenario;
    addSavedScenario(2026, {
      name: 'B',
      ranges: [{ start: '2026-08-01', end: '2026-08-02' }],
    });
    addSavedScenario(2025, {
      name: 'Otro año',
      ranges: [{ start: '2025-08-01', end: '2025-08-02' }],
    });

    removeSavedScenario(2026, first.id);

    const remaining = loadSavedScenarios(2026);
    expect(remaining).toHaveLength(1);
    expect(remaining[0].name).toBe('B');
    expect(loadSavedScenarios(2025)).toHaveLength(1);

    removeSavedScenario(2026, remaining[0].id);
    expect(loadSavedScenarios(2026)).toEqual([]);
  });

  it('skips corrupted entries instead of failing the whole load', () => {
    globalThis.localStorage.setItem(
      SAVED_SCENARIOS_STORAGE_KEY,
      JSON.stringify({
        2026: [
          { id: 'ok', name: 'Válido', ranges: [{ start: '2026-07-01', end: '2026-07-02' }] },
          { id: 'no-name', name: '', ranges: [{ start: '2026-07-01', end: '2026-07-02' }] },
          { id: 'no-ranges', name: 'Sin rangos', ranges: [] },
          { id: 'bad-range', name: 'Rango roto', ranges: [{ start: 'nope', end: 'nope' }] },
          null,
        ],
      }),
    );

    const scenarios = loadSavedScenarios(2026);
    expect(scenarios).toHaveLength(1);
    expect(scenarios[0].name).toBe('Válido');
  });

  it('degrades gracefully when localStorage is unavailable', () => {
    delete globalThis.localStorage;

    expect(loadSavedScenarios(2026)).toEqual([]);
    expect(() => removeSavedScenario(2026, 'x')).not.toThrow();
    expect(addSavedScenario(2026, {
      name: 'Sin storage',
      ranges: [{ start: '2026-07-01', end: '2026-07-02' }],
    }).status).toBe('saved');
  });

  it('builds comparison rows projecting each scenario over the real stays', () => {
    const currentRanges = [
      { start: new Date(2026, 0, 1), end: new Date(2026, 0, 100) }, // 100 days
    ];
    const scenarios = [
      {
        id: 's1',
        name: 'Corta',
        ranges: [{ start: new Date(2026, 6, 1), end: new Date(2026, 6, 20) }], // +20
      },
      {
        id: 's2',
        name: 'Larga solapada',
        ranges: [
          { start: new Date(2025, 11, 20), end: new Date(2026, 0, 20) }, // overlaps 20 real days
          { start: new Date(2026, 7, 1), end: new Date(2026, 7, 31) }, // +31
        ],
      },
    ];

    const comparison = buildScenarioComparison(currentRanges, scenarios);

    expect(comparison.current.totalDays).toBe(100);
    expect(comparison.current.remainingDays).toBe(83);
    expect(comparison.current.riskLevel).toBe('safe');

    expect(comparison.rows).toHaveLength(2);
    expect(comparison.rows[0]).toMatchObject({
      id: 's1',
      name: 'Corta',
      totalDays: 120,
      remainingDays: 63,
      riskLevel: 'safe',
    });
    // Overlapping days count once: 100 real + 12 pre-year + 31 august = 143
    expect(comparison.rows[1].totalDays).toBe(143);
    expect(comparison.rows[1].riskLevel).toBe('safe');
  });

  it('flags warning and destructive risk levels in the comparison', () => {
    const currentRanges = [
      { start: new Date(2026, 0, 1), end: new Date(2026, 4, 31) }, // 151 days
    ];
    const scenarios = [
      {
        id: 'over',
        name: 'Exceso',
        ranges: [{ start: new Date(2026, 8, 1), end: new Date(2026, 9, 10) }], // +40 -> 191
      },
    ];

    const comparison = buildScenarioComparison(currentRanges, scenarios);

    expect(comparison.current.riskLevel).toBe('warning');
    expect(comparison.rows[0].totalDays).toBe(191);
    expect(comparison.rows[0].remainingDays).toBe(0);
    expect(comparison.rows[0].riskLevel).toBe('destructive');
  });
});
