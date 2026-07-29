import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, FilePdf } from '@phosphor-icons/react';
import { useLanguage } from '@/hooks/useLanguage.js';
import {
  DEFAULT_FISCAL_LIMIT,
  DEFAULT_WARNING_THRESHOLD,
  getRiskLevel,
} from '@/lib/fiscalSummary.js';

// Semicircular gauge geometry: GAUGE_MAX days cover the full 180° arc so the
// 183-day limit stays visibly inside the red zone.
const GAUGE_MAX = 210;
const CX = 110;
const CY = 106;
const R = 84;
const ZONE_GAP = 0.006; // small visual separation between zones

const ZONE_COLORS = {
  safe: 'hsl(var(--success))',
  warning: 'hsl(var(--warning))',
  destructive: 'hsl(var(--destructive))',
};

const fractionToPoint = (fraction, radius = R) => {
  const angle = (180 - 180 * fraction) * (Math.PI / 180);
  return { x: CX + radius * Math.cos(angle), y: CY - radius * Math.sin(angle) };
};

const zoneArc = (from, to) => {
  const start = fractionToPoint(from);
  const end = fractionToPoint(to);
  const largeArc = to - from > 0.5 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${R} ${R} 0 ${largeArc} 1 ${end.x} ${end.y}`;
};

const RiskGauge = ({
  totalDays,
  projectedDays,
  onOpenPayment,
  paymentDisabled = false,
  limit = DEFAULT_FISCAL_LIMIT,
  warningThreshold = DEFAULT_WARNING_THRESHOLD,
}) => {
  const { t, language } = useLanguage();

  const status = getRiskLevel(totalDays, warningThreshold, limit);
  const statusLabel = status === 'safe'
    ? t('progress.safe')
    : status === 'warning'
    ? t('progress.approaching')
    : t('progress.over');

  const explanation = status === 'safe'
    ? t('riskGauge.explainSafe')
    : status === 'warning'
    ? t('riskGauge.explainWarning')
    : t('riskGauge.explainOver');

  const clampToGauge = (days) => Math.min(Math.max(days, 0), GAUGE_MAX) / GAUGE_MAX;
  const valueFraction = clampToGauge(totalDays);
  const safeEnd = warningThreshold / GAUGE_MAX;
  const limitEnd = limit / GAUGE_MAX;
  const needleTip = fractionToPoint(valueFraction, R - 26);

  const hasProjection = typeof projectedDays === 'number' && projectedDays !== totalDays;
  const projectedFraction = hasProjection ? clampToGauge(projectedDays) : null;
  const projectedTickInner = hasProjection ? fractionToPoint(projectedFraction, R - 12) : null;
  const projectedTickOuter = hasProjection ? fractionToPoint(projectedFraction, R + 8) : null;

  const zeroLabel = fractionToPoint(0, R + 16);
  const limitLabel = fractionToPoint(limitEnd, R + 20);

  const valueText = hasProjection
    ? `${totalDays} ${t('dateSelector.days')} · ${statusLabel} · ${t('scenario.withScenario')}: ${projectedDays} ${t('dateSelector.days')}`
    : `${totalDays} ${t('dateSelector.days')} · ${statusLabel}`;

  return (
    <div>
      <svg
        viewBox="0 0 220 134"
        className="mx-auto w-full max-w-[280px]"
        role="meter"
        aria-label={t('riskGauge.meterLabel')}
        aria-valuemin={0}
        aria-valuemax={limit}
        aria-valuenow={Math.min(Math.max(totalDays, 0), limit)}
        aria-valuetext={valueText}
      >
        {/* Three risk zones: safe / warning / destructive */}
        <path
          d={zoneArc(0, safeEnd - ZONE_GAP)}
          fill="none"
          stroke={ZONE_COLORS.safe}
          strokeWidth={14}
        />
        <path
          d={zoneArc(safeEnd + ZONE_GAP, limitEnd - ZONE_GAP)}
          fill="none"
          stroke={ZONE_COLORS.warning}
          strokeWidth={14}
        />
        <path
          d={zoneArc(limitEnd + ZONE_GAP, 1)}
          fill="none"
          stroke={ZONE_COLORS.destructive}
          strokeWidth={14}
        />

        {hasProjection && (
          <line
            x1={projectedTickInner.x}
            y1={projectedTickInner.y}
            x2={projectedTickOuter.x}
            y2={projectedTickOuter.y}
            stroke={ZONE_COLORS.warning}
            strokeWidth={3}
            strokeDasharray="3 2"
            strokeLinecap="round"
          />
        )}

        <g aria-hidden="true">
          {/* Needle for the current value */}
          <line
            x1={CX}
            y1={CY}
            x2={needleTip.x}
            y2={needleTip.y}
            className="stroke-foreground"
            strokeWidth={3}
            strokeLinecap="round"
          />
          <circle cx={CX} cy={CY} r={5} className="fill-foreground" />

          <text
            x={CX}
            y={CY - 34}
            textAnchor="middle"
            className="fill-foreground text-[32px] font-[750] tracking-tight"
          >
            {totalDays}
          </text>
          <text
            x={CX}
            y={CY - 14}
            textAnchor="middle"
            className="text-[11px] font-semibold"
            fill={ZONE_COLORS[status]}
          >
            {statusLabel}
          </text>
          <text
            x={zeroLabel.x}
            y={zeroLabel.y + 12}
            textAnchor="middle"
            className="fill-muted-foreground text-[10px] font-medium"
          >
            0
          </text>
          <text
            x={limitLabel.x}
            y={limitLabel.y + 12}
            textAnchor="middle"
            className="fill-muted-foreground text-[10px] font-medium"
          >
            {limit}
          </text>
        </g>
      </svg>

      {/* Legend: text labels keep the zones readable without relying on colour */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] font-medium text-muted-foreground">
        {[
          ['safe', t('riskGauge.legendSafe')],
          ['warning', t('riskGauge.legendWarning')],
          ['destructive', t('riskGauge.legendOver')],
        ].map(([zone, label]) => (
          <span key={zone} className="inline-flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: ZONE_COLORS[zone] }}
            />
            {label}
          </span>
        ))}
      </div>

      {hasProjection && (
        <p className="mt-2 text-center text-xs font-semibold text-[hsl(var(--warning-foreground))]">
          {t('scenario.withScenario')}: {projectedDays} {t('dateSelector.days')}
        </p>
      )}

      <p className="mt-3 text-sm leading-6 text-muted-foreground">{explanation}</p>

      <div className="mt-4 border-t border-border/70 pt-4">
        <p className="field-label">{t('riskGauge.nextSteps')}</p>
        <div className="mt-3 space-y-2">
          <button
            type="button"
            onClick={onOpenPayment}
            disabled={paymentDisabled}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
          >
            <FilePdf size={18} weight="bold" />
            {t('actions.generatePdf')} · 9,99 €
          </button>
          <Link
            to={`/${language}/guide`}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            <BookOpen size={18} weight="bold" className="text-primary" />
            {t('riskGauge.guideCta')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RiskGauge;
