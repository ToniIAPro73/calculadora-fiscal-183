import { describe, expect, it } from 'vitest';
import {
  clamp,
  daysToFraction,
  fractionToAngle,
  gaugeArcPath,
  gaugePoint,
  polarToCartesian,
} from './gaugeGeometry.js';

const CX = 110;
const CY = 106;
const R = 84;
const GAUGE_MAX = 240;

function parseArcPath(d) {
  const match = d.match(/^M ([-\d.e]+) ([-\d.e]+) A ([-\d.e]+) ([-\d.e]+) 0 (\d) (\d) ([-\d.e]+) ([-\d.e]+)$/);
  expect(match, `path "${d}" should be an M + A arc`).not.toBeNull();
  expect(match[3]).toBe(match[4]);
  return {
    start: { x: Number(match[1]), y: Number(match[2]) },
    radius: Number(match[3]),
    largeArc: Number(match[5]),
    sweep: Number(match[6]),
    end: { x: Number(match[7]), y: Number(match[8]) },
  };
}

describe('clamp', () => {
  it('keeps values inside the range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-3, 0, 10)).toBe(0);
    expect(clamp(42, 0, 10)).toBe(10);
  });
});

describe('daysToFraction', () => {
  it('maps days onto the 0..1 gauge range', () => {
    expect(daysToFraction(0, GAUGE_MAX)).toBe(0);
    expect(daysToFraction(GAUGE_MAX, GAUGE_MAX)).toBe(1);
    expect(daysToFraction(120, GAUGE_MAX)).toBe(0.5);
  });

  it('clamps out-of-scale values', () => {
    expect(daysToFraction(-10, GAUGE_MAX)).toBe(0);
    expect(daysToFraction(999, GAUGE_MAX)).toBe(1);
  });
});

describe('fractionToAngle', () => {
  it('places 0 at 180° (left) and the max at 0° (right)', () => {
    expect(fractionToAngle(0)).toBe(180);
    expect(fractionToAngle(1)).toBe(0);
    expect(fractionToAngle(0.5)).toBe(90);
  });
});

describe('polarToCartesian', () => {
  it('converts angles to SVG coordinates with y growing downward', () => {
    const left = polarToCartesian(CX, CY, R, 180);
    expect(left.x).toBeCloseTo(CX - R, 6);
    expect(left.y).toBeCloseTo(CY, 6);

    const right = polarToCartesian(CX, CY, R, 0);
    expect(right.x).toBeCloseTo(CX + R, 6);
    expect(right.y).toBeCloseTo(CY, 6);

    const top = polarToCartesian(CX, CY, R, 90);
    expect(top.x).toBeCloseTo(CX, 6);
    expect(top.y).toBeCloseTo(CY - R, 6);
  });
});

describe('gaugePoint', () => {
  it('never renders points below the diameter line', () => {
    for (let days = 0; days <= GAUGE_MAX; days += 1) {
      const point = gaugePoint(CX, CY, R, days, GAUGE_MAX);
      expect(point.y).toBeLessThanOrEqual(CY + 1e-9);
    }
  });

  it('places mid-scale values on the upper half', () => {
    const point = gaugePoint(CX, CY, R, 28, GAUGE_MAX);
    expect(point.x).toBeLessThan(CX);
    expect(point.y).toBeLessThan(CY);
  });
});

describe('gaugeArcPath', () => {
  it('always uses the minor arc (large-arc flag 0) inside a 180° gauge', () => {
    // Regression: a fraction-based threshold (span > 0.5) set large-arc=1 for
    // the safe zone, rendering the major arc through the clipped bottom half.
    const safe = parseArcPath(gaugeArcPath(CX, CY, R, 0, 148.5, GAUGE_MAX));
    expect(safe.largeArc).toBe(0);
    expect(safe.sweep).toBe(1);

    const warning = parseArcPath(gaugeArcPath(CX, CY, R, 151.5, 181.5, GAUGE_MAX));
    expect(warning.largeArc).toBe(0);

    const over = parseArcPath(gaugeArcPath(CX, CY, R, 184.5, GAUGE_MAX, GAUGE_MAX));
    expect(over.largeArc).toBe(0);
  });

  it('keeps the three zones contiguous from the left end to the right end', () => {
    const safe = parseArcPath(gaugeArcPath(CX, CY, R, 0, 148.5, GAUGE_MAX));
    expect(safe.start.x).toBeCloseTo(CX - R, 6);
    expect(safe.start.y).toBeCloseTo(CY, 6);

    const over = parseArcPath(gaugeArcPath(CX, CY, R, 184.5, GAUGE_MAX, GAUGE_MAX));
    expect(over.end.x).toBeCloseTo(CX + R, 6);
    expect(over.end.y).toBeCloseTo(CY, 6);

    // Adjacent zone boundaries sit at the same angle (minus the visual gap).
    const warning = parseArcPath(gaugeArcPath(CX, CY, R, 151.5, 181.5, GAUGE_MAX));
    const safeEndAngle = Math.atan2(CY - safe.end.y, safe.end.x - CX);
    const warningStartAngle = Math.atan2(CY - warning.start.y, warning.start.x - CX);
    expect(warningStartAngle).toBeLessThan(safeEndAngle);
    expect(safeEndAngle - warningStartAngle).toBeLessThan(0.05);
  });

  it('draws every zone on the upper semicircle', () => {
    for (const [from, to] of [[0, 148.5], [151.5, 181.5], [184.5, GAUGE_MAX]]) {
      const arc = parseArcPath(gaugeArcPath(CX, CY, R, from, to, GAUGE_MAX));
      expect(arc.start.y).toBeLessThanOrEqual(CY + 1e-9);
      expect(arc.end.y).toBeLessThanOrEqual(CY + 1e-9);
      expect(arc.radius).toBe(R);
    }
  });
});
