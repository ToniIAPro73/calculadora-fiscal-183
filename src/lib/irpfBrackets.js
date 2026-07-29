// Progressive IRPF bracket data and pure calculation helpers for the
// /es|en/irpf-estimator mini-tool. All computation runs client-side.
//
// Scope: the estimator applies the STATE scale (escala estatal, art. 63
// LIRPF) always, and optionally adds an ORIENTATIVE regional scale on top.
// Regional scales below are approximate 2025 general autonomous scales
// mapped onto the national bracket boundaries — they are indicative only
// (foral regimes of País Vasco and Navarra are excluded on purpose).

const round2 = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

// State scale (escala general estatal, art. 63 de la Ley 35/2006).
// `upTo` is the upper bound of the bracket in euros (null = no upper bound).
export const IRPF_STATE_BRACKETS = [
  { upTo: 12450, rate: 0.095 },
  { upTo: 20200, rate: 0.12 },
  { upTo: 35200, rate: 0.15 },
  { upTo: 60000, rate: 0.185 },
  { upTo: 300000, rate: 0.225 },
  { upTo: null, rate: 0.245 },
];

// Reference regional scale (escala general autonómica de referencia):
// what applies when a region has not legislated its own scale.
export const IRPF_REFERENCE_REGIONAL_BRACKETS = [
  { upTo: 12450, rate: 0.095 },
  { upTo: 20200, rate: 0.12 },
  { upTo: 35200, rate: 0.15 },
  { upTo: 60000, rate: 0.185 },
  { upTo: 300000, rate: 0.225 },
  { upTo: null, rate: 0.245 },
];

// Orientative regional scales (approximate 2025 general autonomous rates,
// applied on the national bracket boundaries as an approximation).
// Labels live in translations.js under `irpfEstimator.regions.*`.
export const IRPF_REGIONAL_SCALES = {
  madrid: [
    { upTo: 12450, rate: 0.085 },
    { upTo: 20200, rate: 0.112 },
    { upTo: 35200, rate: 0.133 },
    { upTo: 60000, rate: 0.179 },
    { upTo: 300000, rate: 0.21 },
    { upTo: null, rate: 0.21 },
  ],
  cataluna: [
    { upTo: 12450, rate: 0.105 },
    { upTo: 20200, rate: 0.12 },
    { upTo: 35200, rate: 0.14 },
    { upTo: 60000, rate: 0.185 },
    { upTo: 300000, rate: 0.22 },
    { upTo: null, rate: 0.255 },
  ],
  'comunidad-valenciana': [
    { upTo: 12450, rate: 0.1 },
    { upTo: 20200, rate: 0.12 },
    { upTo: 35200, rate: 0.135 },
    { upTo: 60000, rate: 0.185 },
    { upTo: 300000, rate: 0.23 },
    { upTo: null, rate: 0.255 },
  ],
  otra: IRPF_REFERENCE_REGIONAL_BRACKETS,
};

export const IRPF_REGION_KEYS = Object.keys(IRPF_REGIONAL_SCALES);

// Clamps the input to a usable taxable base: NaN, non-finite and negative
// values become 0 (an empty or invalid form field must not crash the math).
export const sanitizeTaxableBase = (base) => {
  const numeric = Number(base);
  if (!Number.isFinite(numeric) || numeric <= 0) return 0;
  return numeric;
};

// Splits a taxable base across a progressive bracket scale.
// Returns one row per bracket actually reached:
// { from, to (null = open), rate, taxable, tax }.
export function calculateBracketBreakdown(base, brackets = IRPF_STATE_BRACKETS) {
  const safeBase = sanitizeTaxableBase(base);
  const breakdown = [];

  let lowerBound = 0;
  for (const bracket of brackets) {
    if (safeBase <= lowerBound) break;
    const upperBound = bracket.upTo ?? Infinity;
    const taxableInBracket = Math.min(safeBase, upperBound) - lowerBound;
    breakdown.push({
      from: lowerBound,
      to: bracket.upTo,
      rate: bracket.rate,
      taxable: round2(taxableInBracket),
      tax: round2(taxableInBracket * bracket.rate),
    });
    lowerBound = upperBound;
  }

  return breakdown;
}

const sumTax = (breakdown) => round2(breakdown.reduce((sum, row) => sum + row.tax, 0));

// Full estimate: state scale always applies; when a known region key is
// passed, the orientative regional scale is added on the same base.
// Unknown/missing region keys mean "state scale only".
export function calculateIrpfEstimate(base, regionKey) {
  const safeBase = sanitizeTaxableBase(base);

  const stateBreakdown = calculateBracketBreakdown(safeBase, IRPF_STATE_BRACKETS);
  const stateTotal = sumTax(stateBreakdown);

  const regionalBrackets = regionKey ? IRPF_REGIONAL_SCALES[regionKey] : undefined;
  const regionalBreakdown = regionalBrackets
    ? calculateBracketBreakdown(safeBase, regionalBrackets)
    : null;
  const regionalTotal = regionalBreakdown ? sumTax(regionalBreakdown) : 0;

  const total = round2(stateTotal + regionalTotal);

  return {
    base: safeBase,
    state: { breakdown: stateBreakdown, total: stateTotal },
    regional: regionalBreakdown
      ? { breakdown: regionalBreakdown, total: regionalTotal }
      : null,
    total,
    // Effective rate over the base, as a percentage with 2 decimals.
    effectiveRate: safeBase > 0 ? round2((total / safeBase) * 100) : 0,
  };
}
