
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage.js';
import { getRiskLevel } from '@/lib/fiscalSummary.js';

const ProgressBar = ({ totalDays, projectedDays }) => {
  const { t } = useLanguage();
  const limit = 183;
  const percentage = Math.min((totalDays / limit) * 100, 100);
  const hasProjection = typeof projectedDays === 'number' && projectedDays > totalDays;
  const projectedPercentage = hasProjection ? Math.min((projectedDays / limit) * 100, 100) : null;
  const [isPulsing, setIsPulsing] = useState(false);
  
  useEffect(() => {
    if (totalDays > 0) {
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [totalDays]);

  const getStatus = () => {
    const level = getRiskLevel(totalDays);
    if (level === 'safe') return { color: 'success', label: t('progress.safe') };
    if (level === 'warning') return { color: 'warning', label: t('progress.approaching') };
    return { color: 'destructive', label: t('progress.over') };
  };

  const status = getStatus();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="field-label">{t('progress.title')}</span>
        <span className="font-semibold text-foreground">
          {totalDays} / {limit} {t('dateSelector.days')}
        </span>
      </div>
      
      <div className="relative h-8 overflow-hidden rounded-md border border-border bg-muted">
        <div
          className={cn(
            "h-full rounded-md",
            status.color === 'success' && "bg-[hsl(var(--success))]",
            status.color === 'warning' && "bg-[hsl(var(--warning))]",
            status.color === 'destructive' && "bg-[hsl(var(--destructive))]",
            isPulsing && "animate-pulse-subtle"
          )}
          style={{
            width: `${percentage}%`,
            transition: 'width 800ms cubic-bezier(0.32,0.72,0,1), background-color 300ms ease',
          }}
          role="progressbar"
          aria-valuenow={Number(percentage.toFixed(1))}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label={t('progress.title')}
        />

        {hasProjection && (
          <div
            aria-hidden="true"
            className="absolute inset-y-0 border-y border-dashed border-[hsl(var(--warning)/0.7)]"
            style={{
              left: `${percentage}%`,
              width: `${projectedPercentage - percentage}%`,
              background:
                'repeating-linear-gradient(45deg, hsl(var(--warning) / 0.35) 0 6px, hsl(var(--warning) / 0.12) 6px 12px)',
              transition: 'left 800ms cubic-bezier(0.32,0.72,0,1), width 800ms cubic-bezier(0.32,0.72,0,1)',
            }}
          />
        )}

        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn(
            "text-xs font-semibold transition-colors duration-300",
            percentage > 50
              ? status.color === 'warning'
                ? "text-[hsl(var(--warning-foreground))]"
                : "text-white"
              : "text-foreground"
          )}>
            {percentage.toFixed(1)}%
          </span>
        </div>
      </div>

      {hasProjection && (
        <p className="text-xs font-medium text-[hsl(var(--warning-foreground))]">
          {t('scenario.withScenario')}: {projectedDays} / {limit} {t('dateSelector.days')} ({projectedPercentage.toFixed(1)}%)
        </p>
      )}

      <div className="flex items-center justify-between text-xs">
        <span className={cn(
          "rounded-full px-3 py-1.5 font-medium uppercase tracking-wide transition-all duration-300",
          status.color === 'success' && "bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))]",
          status.color === 'warning' && "bg-[hsl(var(--warning)/0.1)] text-[hsl(var(--warning-foreground))]",
          status.color === 'destructive' && "bg-[hsl(var(--destructive)/0.1)] text-[hsl(var(--destructive))]"
        )}>
          {status.label}
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
