import React from 'react';
import { toast } from 'sonner';
import { CalendarPlus } from '@phosphor-icons/react';
import { useLanguage } from '@/hooks/useLanguage.js';
import { buildIcsCalendar } from '@/lib/icsExport.js';
import { DEFAULT_FISCAL_LIMIT, DEFAULT_WARNING_THRESHOLD, getRiskLevel } from '@/lib/fiscalSummary.js';

const interpolate = (template, values) =>
  Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{{${key}}}`, String(value)),
    template,
  );

const SEMAPHORE_STYLES = {
  safe: 'border-[hsl(var(--success)/0.22)] bg-[hsl(var(--success)/0.1)]',
  warning: 'border-[hsl(var(--warning)/0.28)] bg-[hsl(var(--warning)/0.13)]',
  destructive: 'border-[hsl(var(--destructive)/0.25)] bg-[hsl(var(--destructive)/0.12)]',
};

const SEMAPHORE_DOT = {
  safe: 'bg-[hsl(var(--success))]',
  warning: 'bg-[hsl(var(--warning))]',
  destructive: 'bg-[hsl(var(--destructive))]',
};

const RemainingDaysCountdown = ({
  totalDays,
  ranges,
  fiscalYear,
  limit = DEFAULT_FISCAL_LIMIT,
  warningThreshold = DEFAULT_WARNING_THRESHOLD,
}) => {
  const { t } = useLanguage();

  const remaining = Math.max(limit - totalDays, 0);
  const exceeded = Math.max(totalDays - limit, 0);

  const status = getRiskLevel(totalDays, warningThreshold, limit);

  const statusLabel = status === 'safe'
    ? t('progress.safe')
    : status === 'warning'
    ? t('progress.approaching')
    : t('progress.over');

  const message = exceeded > 0
    ? interpolate(t('countdown.exceeded'), { days: exceeded, year: fiscalYear })
    : interpolate(t('countdown.remaining'), { days: remaining, year: fiscalYear });

  const handleAddToCalendar = () => {
    const ics = buildIcsCalendar({
      ranges,
      eventSummary: t('countdown.stayEventSummary'),
      reminderSummary: t('countdown.reminderEventSummary'),
      fiscalYear,
      limit,
    });

    if (!ics) return;

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `estancias-${fiscalYear}.ics`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    toast.success(t('countdown.icsDownloaded'));

    if (typeof window.taxNomadTrack === 'function') {
      window.taxNomadTrack('ics_exported', { fiscal_year: fiscalYear, total_ranges: ranges.length });
    }
  };

  return (
    <section aria-labelledby="countdown-heading" className="trust-panel p-5">
      <div className="flex items-center justify-between gap-3">
        <h2 id="countdown-heading" className="premium-eyebrow">
          {t('countdown.title')}
        </h2>
        <div
          role="img"
          aria-label={`${t('countdown.semaphoreLabel')}: ${statusLabel}`}
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 ${SEMAPHORE_STYLES[status]}`}
        >
          {['safe', 'warning', 'destructive'].map((level) => (
            <span
              key={level}
              aria-hidden="true"
              className={`h-2.5 w-2.5 rounded-full transition-colors ${
                level === status ? SEMAPHORE_DOT[level] : 'bg-muted-foreground/25'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-end gap-2">
        <span className="text-5xl font-[750] tracking-tight text-foreground">
          {exceeded > 0 ? exceeded : remaining}
        </span>
        <span className="pb-1 text-sm font-semibold text-muted-foreground">
          {t('dateSelector.days')}
        </span>
      </div>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{message}</p>

      <button
        type="button"
        onClick={handleAddToCalendar}
        disabled={ranges.length === 0}
        className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
      >
        <CalendarPlus size={18} weight="bold" />
        {t('countdown.addToCalendar')}
      </button>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        {t('countdown.calendarHint')}
      </p>
    </section>
  );
};

export default RemainingDaysCountdown;
