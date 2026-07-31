/**
 * Geometry helpers for the semicircular RiskGauge.
 *
 * Angle convention: 0 days sits at 180° (left end of the semicircle) and
 * `maxDays` sits at 0° (right end), so the arc sweeps over the top as days
 * increase. SVG y grows downward, hence the minus sign on the sine term.
 */

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const daysToFraction = (days, maxDays) => clamp(days, 0, maxDays) / maxDays;

export const fractionToAngle = (fraction) => 180 - 180 * clamp(fraction, 0, 1);

export const polarToCartesian = (cx, cy, radius, angleDeg) => {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(rad),
    y: cy - radius * Math.sin(rad),
  };
};

export const gaugePoint = (cx, cy, radius, days, maxDays) =>
  polarToCartesian(cx, cy, radius, fractionToAngle(daysToFraction(days, maxDays)));

/**
 * SVG arc path (`A` command) between two day marks on the semicircle.
 *
 * The large-arc flag must be derived from the span in DEGREES: the full
 * semicircle is 180°, so it can only be 1 when the span exceeds 180° (never
 * inside this gauge). Comparing the day fraction against 0.5 (90°) instead
 * made long zones render the major arc through the clipped bottom half.
 * Sweep flag 1 walks from the left end (0 days) to the right end over the top.
 */
export const gaugeArcPath = (cx, cy, radius, fromDays, toDays, maxDays) => {
  const fromFraction = daysToFraction(fromDays, maxDays);
  const toFraction = daysToFraction(toDays, maxDays);
  const start = polarToCartesian(cx, cy, radius, fractionToAngle(fromFraction));
  const end = polarToCartesian(cx, cy, radius, fractionToAngle(toFraction));
  const spanDeg = Math.abs(toFraction - fromFraction) * 180;
  const largeArc = spanDeg > 180 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
};
