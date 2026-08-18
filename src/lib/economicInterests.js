/**
 * "Centro de intereses económicos" self-assessment module (art. 9 Law 35/2006, IRPF).
 *
 * The questionnaire produces a QUALITATIVE complement to the 183-day count.
 * Answers are stored only in the browser's localStorage and are never sent
 * to any server.
 */

export const ECONOMIC_INTERESTS_STORAGE_KEY = 'taxnomad_economic_interests';

// Option ids are shared across questions; the per-question meaning and copy
// live in the translations under `economicInterests.<questionId>.<optionId>`.
export const ECONOMIC_INTEREST_QUESTIONS = [
  {
    id: 'family',
    options: [
      { id: 'spain', score: 2 },
      { id: 'mixed', score: 1 },
      { id: 'abroad', score: 0 },
    ],
  },
  {
    id: 'income',
    options: [
      { id: 'spain', score: 2 },
      { id: 'mixed', score: 1 },
      { id: 'abroad', score: 0 },
    ],
  },
  {
    id: 'home',
    options: [
      { id: 'spain', score: 2 },
      { id: 'mixed', score: 1 },
      { id: 'abroad', score: 0 },
    ],
  },
  {
    id: 'activity',
    options: [
      { id: 'spain', score: 2 },
      { id: 'mixed', score: 1 },
      { id: 'abroad', score: 0 },
    ],
  },
];

const HIGH_TIES_MIN_SCORE = 6;
const MEDIUM_TIES_MIN_SCORE = 3;

function findOption(questionId, optionId) {
  const question = ECONOMIC_INTEREST_QUESTIONS.find((q) => q.id === questionId);
  if (!question) return null;
  return question.options.find((option) => option.id === optionId) ?? null;
}

/**
 * Evaluates the questionnaire answers into a qualitative level of economic
 * ties with Spain: 'low', 'medium' or 'high'. Returns `level: null` until
 * every question has a valid answer.
 */
export function evaluateEconomicInterests(answers) {
  const safeAnswers = answers && typeof answers === 'object' ? answers : {};

  const perQuestion = ECONOMIC_INTEREST_QUESTIONS.map((question) => {
    const option = findOption(question.id, safeAnswers[question.id]);
    return {
      questionId: question.id,
      optionId: option?.id ?? null,
      score: option?.score ?? null,
    };
  });

  const answeredCount = perQuestion.filter((item) => item.optionId !== null).length;
  const complete = answeredCount === ECONOMIC_INTEREST_QUESTIONS.length;
  const totalScore = perQuestion.reduce((sum, item) => sum + (item.score ?? 0), 0);
  const maxScore = ECONOMIC_INTEREST_QUESTIONS.reduce(
    (sum, question) => sum + Math.max(...question.options.map((option) => option.score)),
    0,
  );

  let level = null;
  if (complete) {
    if (totalScore >= HIGH_TIES_MIN_SCORE) {
      level = 'high';
    } else if (totalScore >= MEDIUM_TIES_MIN_SCORE) {
      level = 'medium';
    } else {
      level = 'low';
    }
  }

  return { complete, answeredCount, totalScore, maxScore, level, perQuestion };
}

/**
 * Keeps only known question/option pairs so corrupted or stale entries
 * cannot break the evaluation or the PDF report.
 */
export function sanitizeEconomicInterestsAnswers(answers) {
  if (!answers || typeof answers !== 'object') return {};

  return ECONOMIC_INTEREST_QUESTIONS.reduce((acc, question) => {
    const optionId = answers[question.id];
    if (findOption(question.id, optionId)) {
      acc[question.id] = optionId;
    }
    return acc;
  }, {});
}

function getStorage() {
  try {
    const storage = globalThis.localStorage;
    return storage ?? null;
  } catch {
    return null;
  }
}

export function loadEconomicInterests() {
  const storage = getStorage();
  if (!storage) return {};

  try {
    const raw = storage.getItem(ECONOMIC_INTERESTS_STORAGE_KEY);
    if (!raw) return {};
    return sanitizeEconomicInterestsAnswers(JSON.parse(raw));
  } catch {
    return {};
  }
}

export function saveEconomicInterests(answers) {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.setItem(
      ECONOMIC_INTERESTS_STORAGE_KEY,
      JSON.stringify(sanitizeEconomicInterestsAnswers(answers)),
    );
  } catch {
    // Storage full or unavailable: persistence is best-effort only.
  }
}

export function clearEconomicInterests() {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.removeItem(ECONOMIC_INTERESTS_STORAGE_KEY);
  } catch {
    // Storage unavailable: nothing to clear.
  }
}
