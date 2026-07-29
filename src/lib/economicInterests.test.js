import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  ECONOMIC_INTERESTS_STORAGE_KEY,
  ECONOMIC_INTEREST_QUESTIONS,
  clearEconomicInterests,
  evaluateEconomicInterests,
  loadEconomicInterests,
  sanitizeEconomicInterestsAnswers,
  saveEconomicInterests,
} from './economicInterests.js';

describe('evaluateEconomicInterests', () => {
  it('is incomplete with no answers and returns no level', () => {
    const result = evaluateEconomicInterests({});

    expect(result.complete).toBe(false);
    expect(result.answeredCount).toBe(0);
    expect(result.totalScore).toBe(0);
    expect(result.level).toBeNull();
  });

  it('is incomplete until every question is answered', () => {
    const result = evaluateEconomicInterests({
      family: 'spain',
      income: 'spain',
      home: 'spain',
    });

    expect(result.complete).toBe(false);
    expect(result.answeredCount).toBe(3);
    expect(result.level).toBeNull();
  });

  it('evaluates all answers pointing abroad as low ties', () => {
    const result = evaluateEconomicInterests({
      family: 'abroad',
      income: 'abroad',
      home: 'abroad',
      activity: 'abroad',
    });

    expect(result.complete).toBe(true);
    expect(result.totalScore).toBe(0);
    expect(result.level).toBe('low');
  });

  it('evaluates all answers pointing to Spain as high ties', () => {
    const result = evaluateEconomicInterests({
      family: 'spain',
      income: 'spain',
      home: 'spain',
      activity: 'spain',
    });

    expect(result.complete).toBe(true);
    expect(result.totalScore).toBe(8);
    expect(result.maxScore).toBe(8);
    expect(result.level).toBe('high');
  });

  it('evaluates mixed situations as medium ties', () => {
    const result = evaluateEconomicInterests({
      family: 'mixed',
      income: 'mixed',
      home: 'mixed',
      activity: 'mixed',
    });

    expect(result.totalScore).toBe(4);
    expect(result.level).toBe('medium');
  });

  it('reaches high ties from the score threshold', () => {
    const result = evaluateEconomicInterests({
      family: 'spain',
      income: 'spain',
      home: 'spain',
      activity: 'abroad',
    });

    expect(result.totalScore).toBe(6);
    expect(result.level).toBe('high');
  });

  it('stays low just below the medium threshold', () => {
    const result = evaluateEconomicInterests({
      family: 'spain',
      income: 'abroad',
      home: 'abroad',
      activity: 'abroad',
    });

    expect(result.totalScore).toBe(2);
    expect(result.level).toBe('low');
  });

  it('ignores unknown questions and invalid option ids', () => {
    const result = evaluateEconomicInterests({
      family: 'spain',
      income: 'everywhere',
      bogus: 'spain',
    });

    expect(result.complete).toBe(false);
    expect(result.answeredCount).toBe(1);
    expect(result.perQuestion.every((item) => item.questionId !== 'bogus')).toBe(true);
  });

  it('covers every declared question in the breakdown', () => {
    const result = evaluateEconomicInterests(null);

    expect(result.perQuestion.map((item) => item.questionId)).toEqual(
      ECONOMIC_INTEREST_QUESTIONS.map((question) => question.id),
    );
  });
});

describe('sanitizeEconomicInterestsAnswers', () => {
  it('drops invalid entries and keeps valid ones', () => {
    expect(
      sanitizeEconomicInterestsAnswers({
        family: 'spain',
        income: 'invalid',
        unknown: 'spain',
      }),
    ).toEqual({ family: 'spain' });
  });

  it('returns an empty object for non-object input', () => {
    expect(sanitizeEconomicInterestsAnswers(null)).toEqual({});
    expect(sanitizeEconomicInterestsAnswers('spain')).toEqual({});
  });
});

function createMemoryStorage() {
  const map = new Map();

  return {
    getItem: (key) => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => map.set(key, String(value)),
    removeItem: (key) => map.delete(key),
    clear: () => map.clear(),
  };
}

describe('economic interests storage', () => {
  beforeEach(() => {
    globalThis.localStorage = createMemoryStorage();
  });

  afterEach(() => {
    delete globalThis.localStorage;
  });

  it('round-trips answers through localStorage', () => {
    saveEconomicInterests({ family: 'mixed', home: 'abroad' });

    expect(loadEconomicInterests()).toEqual({ family: 'mixed', home: 'abroad' });
  });

  it('sanitizes on save', () => {
    saveEconomicInterests({ family: 'spain', income: 'nope', extra: 'abroad' });

    expect(loadEconomicInterests()).toEqual({ family: 'spain' });
  });

  it('returns an empty object when the stored value is corrupted', () => {
    localStorage.setItem(ECONOMIC_INTERESTS_STORAGE_KEY, '{not json');

    expect(loadEconomicInterests()).toEqual({});
  });

  it('returns an empty object when nothing is stored', () => {
    expect(loadEconomicInterests()).toEqual({});
  });

  it('clears the stored answers', () => {
    saveEconomicInterests({ family: 'spain' });
    clearEconomicInterests();

    expect(localStorage.getItem(ECONOMIC_INTERESTS_STORAGE_KEY)).toBeNull();
    expect(loadEconomicInterests()).toEqual({});
  });
});
