import React, { useMemo } from 'react';
import { addDays, format } from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage.js';
import {
  buildYearDayMap,
  groupYearDaysByMonth,
  YEAR_DAY_STATES,
} from '@/lib/yearCalendar.js';

const CELL_CLASSES = {
  [YEAR_DAY_STATES.IN_SPAIN]: 'bg-primary',
  [YEAR_DAY_STATES.HYPOTHETICAL]: 'bg-[hsl(var(--warning))]',
  [YEAR_DAY_STATES.ABROAD]: 'bg-muted/70',
};

// Monday-first column offset, matching the es/en calendar conventions used
// elsewhere in the app (date-fns locales start the week on Monday).
const mondayFirstOffset = (date) => (date.getDay() + 6) % 7;

const YearCalendarHeatmap = ({
  fiscalYear,
  realRanges = [],
  scenarioRanges = [],
  scenarioActive = false,
}) => {
  const { t, language } = useLanguage();
  const locale = language === 'es' ? es : enUS;

  const days = useMemo(
    () => buildYearDayMap(fiscalYear, realRanges, scenarioActive ? scenarioRanges : []),
    [fiscalYear, realRanges, scenarioRanges, scenarioActive],
  );
  const months = useMemo(() => groupYearDaysByMonth(days), [days]);

  const weekdayLabels = useMemo(() => {
    // 2024-01-01 is a Monday; derive localized 2-letter weekday labels from it.
    const monday = new Date(2024, 0, 1);
    return Array.from({ length: 7 }, (_, index) => format(addDays(monday, index), 'EEEEEE', { locale }));
  }, [locale]);

  const stateLabels = {
    [YEAR_DAY_STATES.IN_SPAIN]: t('yearCalendar.inSpain'),
    [YEAR_DAY_STATES.HYPOTHETICAL]: t('yearCalendar.hypothetical'),
    [YEAR_DAY_STATES.ABROAD]: t('yearCalendar.outside'),
  };

  return (
    <section
      aria-labelledby="year-calendar-heading"
      className="trust-panel space-y-4 p-5"
    >
      <div className="space-y-2">
        <span className="premium-eyebrow">{t('yearCalendar.eyebrow')}</span>
        <h2 id="year-calendar-heading" className="text-lg font-semibold text-foreground">
          {t('yearCalendar.title')}
        </h2>
        <p className="max-w-[62ch] text-sm leading-6 text-muted-foreground">
          {t('yearCalendar.description')}
        </p>
      </div>

      <TooltipProvider delayDuration={120}>
        <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 xl:grid-cols-4">
          {months.map((month) => (
            <div key={month.monthIndex} className="space-y-1.5">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {format(month.days[0].date, 'LLLL', { locale })}
              </p>
              <div className="grid grid-cols-7 gap-[3px]">
                {weekdayLabels.map((label, index) => (
                  <span
                    key={`${label}-${index}`}
                    aria-hidden="true"
                    className="text-center text-[8px] font-medium uppercase leading-none text-muted-foreground"
                  >
                    {label}
                  </span>
                ))}
                {month.days.map((day, dayIndex) => {
                  const formattedDate = format(day.date, 'PPP', { locale });
                  const statusLabel = stateLabels[day.state];

                  return (
                    <Tooltip key={day.dayKey}>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          aria-label={`${formattedDate}: ${statusLabel}`}
                          style={dayIndex === 0 ? { gridColumnStart: mondayFirstOffset(day.date) + 1 } : undefined}
                          className={cn(
                            'h-2.5 w-2.5 justify-self-center rounded-[3px] transition-transform duration-100 hover:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                            CELL_CLASSES[day.state],
                          )}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{formattedDate} · {statusLabel}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </TooltipProvider>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-[3px] bg-primary" aria-hidden="true" />
          {t('yearCalendar.inSpain')}
        </span>
        {scenarioActive && (
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-[3px] bg-[hsl(var(--warning))]" aria-hidden="true" />
            {t('yearCalendar.hypothetical')}
          </span>
        )}
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-[3px] border border-border bg-muted/70" aria-hidden="true" />
          {t('yearCalendar.outside')}
        </span>
      </div>
    </section>
  );
};

export default YearCalendarHeatmap;
