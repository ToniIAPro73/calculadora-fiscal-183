import React from 'react';
import { format } from 'date-fns';
import { CalendarBlank, PencilSimpleLine, Trash, Clock } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage.js';

const RangeList = ({ ranges, onRemoveRange, onEditRange, variant = 'default', title }) => {
  const { t } = useLanguage();

  if (ranges.length === 0) return null;

  const isScenario = variant === 'scenario';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="field-label">
          {title ?? t('rangeList.title')}
        </h3>
        <div className={cn(
          "flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium",
          isScenario
            ? "border-dashed border-[hsl(var(--warning)/0.45)] bg-[hsl(var(--warning)/0.1)] text-[hsl(var(--warning-foreground))]"
            : "border-border bg-muted/45 text-muted-foreground"
        )}>
          <CalendarBlank size={14} />
          {ranges.length} {ranges.length === 1 ? t('rangeList.rangeSingular') : t('rangeList.rangePlural')}
        </div>
      </div>

      <div className="grid gap-4">
        {ranges.map((range, index) => (
          <div
            key={`${range.start.toISOString()}-${range.end.toISOString()}-${index}`}
            className={cn(
              "group relative overflow-hidden rounded-xl border transition-all duration-200",
              isScenario
                ? "border-dashed border-[hsl(var(--warning)/0.45)] bg-[hsl(var(--warning)/0.05)] hover:border-[hsl(var(--warning)/0.7)]"
                : "border-border bg-card hover:border-primary/25"
            )}
          >
            <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-1 flex-col gap-6 sm:flex-row sm:items-center sm:gap-12">
                <div className={cn(
                  "flex h-16 w-16 shrink-0 flex-col items-center justify-center rounded-lg border",
                  isScenario
                    ? "border-[hsl(var(--warning)/0.35)] bg-[hsl(var(--warning)/0.12)]"
                    : "border-primary/20 bg-primary/10"
                )}>
                  <span className={cn(
                    "text-2xl font-[800] tracking-tight",
                    isScenario ? "text-[hsl(var(--warning-foreground))]" : "text-primary"
                  )}>{range.days}</span>
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-wide",
                    isScenario ? "text-[hsl(var(--warning-foreground)/0.75)]" : "text-primary/75"
                  )}>{t('dateSelector.days')}</span>
                </div>

                <div className="grid grid-cols-2 gap-8 sm:gap-16">
                  <div className="space-y-1.5">
                    <p className="field-label">
                      {t('rangeList.from')}
                    </p>
                    <p className="text-lg font-bold text-foreground">
                      {format(range.start, 'dd MMM')}
                      <span className="ml-1 text-xs font-medium text-muted-foreground">{format(range.start, 'yyyy')}</span>
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <p className="field-label">
                      {t('rangeList.to')}
                    </p>
                    <p className="text-lg font-bold text-foreground">
                      {format(range.end, 'dd MMM')}
                      <span className="ml-1 text-xs font-medium text-muted-foreground">{format(range.end, 'yyyy')}</span>
                    </p>
                  </div>
                </div>

                {isScenario && (
                  <span className="inline-flex w-fit items-center rounded-full border border-dashed border-[hsl(var(--warning)/0.45)] bg-[hsl(var(--warning)/0.1)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[hsl(var(--warning-foreground))]">
                    {t('scenario.badge')}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 border-t border-border pt-4 sm:border-t-0 sm:pt-0">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditRange(index)}
                  className="h-10 rounded-md bg-muted/50 px-4 text-xs font-bold uppercase tracking-wide"
                >
                  <PencilSimpleLine className="mr-2" size={16} weight="bold" />
                  {t('rangeList.edit')}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveRange(index)}
                  className="h-10 w-10 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  aria-label={t('rangeList.delete')}
                >
                  <Trash size={18} weight="bold" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RangeList;
