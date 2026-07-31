import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, FilePdf } from '@phosphor-icons/react';
import { useLanguage } from '@/hooks/useLanguage.js';
import LegalRef from '@/components/LegalRef.jsx';
import {
  DEFAULT_FISCAL_LIMIT,
  DEFAULT_WARNING_THRESHOLD,
  getRiskLevel,
} from '@/lib/fiscalSummary.js';
import {
  gaugeArcPath,
  gaugePoint,
} from '@/lib/gaugeGeometry.js';

// Semicircular gauge: GAUGE_MAX days cover the full 180° arc. 240 keeps the
// three zones contiguous and proportioned (safe 0-150 ≈ 62% of the arc,
// warning 150-183 ≈ 14%, over-limit 183-240 ≈ 24%) so the red zone stays
// clearly visible while the 183-day mark sits well inside it.
const GAUGE_MAX = 240;
const CX = 110;
const CY = 106;
const R = 84;
const ZONE_GAP_DAYS = 1.5; // small visual separation between zones, in days

const ZONE_COLORS = {
  safe: 'hsl(var(--success))',
  warning: 'hsl(var(--warning))',
  destructive: 'hsl(var(--destructive))',
};

// Solid zone tones fail AA as text on card backgrounds; use the strong
// variants for textual status (arcs and legend dots keep the solid tones).
const ZONE_TEXT_COLORS = {
  safe: 'hsl(var(--success-strong))',
  warning: 'hsl(var(--warning-strong))',
  destructive: 'hsl(var(--destructive-strong))',
};

const zoneArc = (fromDays, toDays) => gaugeArcPath(CX, CY, R, fromDays, toDays, GAUGE_MAX);

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

  const needleTip = gaugePoint(CX, CY, R - 26, totalDays, GAUGE_MAX);

  const hasProjection = typeof projectedDays === 'number' && projectedDays !== totalDays;
  const projectedTickInner = hasProjection ? gaugePoint(CX, CY, R - 12, projectedDays, GAUGE_MAX) : null;
  const projectedTickOuter = hasProjection ? gaugePoint(CX, CY, R + 8, projectedDays, GAUGE_MAX) : null;

  const zeroLabel = gaugePoint(CX, CY, R + 16, 0, GAUGE_MAX);
  const limitLabel = gaugePoint(CX, CY, R + 20, limit, GAUGE_MAX);

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
        {/* Three contiguous risk zones: safe / warning / destructive */}
        <path
          d={zoneArc(0, warningThreshold - ZONE_GAP_DAYS)}
          fill="none"
          stroke={ZONE_COLORS.safe}
          strokeWidth={14}
        />
        <path
          d={zoneArc(warningThreshold + ZONE_GAP_DAYS, limit - ZONE_GAP_DAYS)}
          fill="none"
          stroke={ZONE_COLORS.warning}
          strokeWidth={14}
        />
        <path
          d={zoneArc(limit + ZONE_GAP_DAYS, GAUGE_MAX)}
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
            fill={ZONE_TEXT_COLORS[status]}
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
        <p className="mt-2 text-center text-xs font-semibold text-[hsl(var(--warning-strong))]">
          {t('scenario.withScenario')}: {projectedDays} {t('dateSelector.days')}
        </p>
      )}

      <p className="mt-3 text-sm leading-6 text-muted-foreground">{explanation}</p>
      <p className="mt-2 text-xs">
        <LegalRef refId="lirpf-art9" />
      </p>

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
