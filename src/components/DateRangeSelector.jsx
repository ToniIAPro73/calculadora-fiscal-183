import React, { useEffect, useMemo, useState } from 'react';
import {
  addMonths,
  differenceInCalendarDays,
  eachDayOfInterval,
  endOfYear,
  format,
  isAfter,
  isBefore,
  isValid,
  parseISO,
  startOfMonth,
  startOfYear,
  subMonths,
} from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDots,
  CalendarBlank,
  CalendarPlus,
  CheckCircle,
  Circle,
  CornersOut,
  PencilSimpleLine,
  X,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter as AlertDialogFooterActions,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/hooks/useLanguage.js';

const DateRangeSelector = ({
  ranges,
  onAddRange,
  onUpdateRange,
  editingRangeIndex,
  onEditingHandled,
}) => {
  const { t, language } = useLanguage();
  const [open, setOpen] = useState(false);
  const [draftStart, setDraftStart] = useState(null);
  const [draftEnd, setDraftEnd] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);
  const [startInput, setStartInput] = useState('');
  const [endInput, setEndInput] = useState('');
  const [monthCount, setMonthCount] = useState(1);
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(new Date()));
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const locale = language === 'es' ? es : enUS;
  const today = useMemo(() => new Date(), []);
  const initialMonth = useMemo(() => startOfMonth(today), [today]);
  const exerciseStart = useMemo(() => startOfYear(new Date()), []);
  const exerciseEnd = useMemo(() => endOfYear(new Date()), []);
  const premiumCopy = useMemo(() => (
    language === 'es'
      ? {
          rangeDrafting: 'Borrador del rango',
          calendarNavigation: 'Navegacion mensual',
          calendarLead: 'Mueve el calendario sin perder el rango que estas preparando.',
          jumpToToday: 'Ir a hoy',
          previousMonth: 'Mes anterior',
          nextMonth: 'Mes siguiente',
        }
      : {
          rangeDrafting: 'Range drafting',
          calendarNavigation: 'Monthly navigation',
          calendarLead: 'Move across months without losing the range you are drafting.',
          jumpToToday: 'Jump to today',
          previousMonth: 'Previous month',
          nextMonth: 'Next month',
        }
  ), [language]);
  const isEditing = editingRangeIndex !== null && editingRangeIndex !== undefined;
  const currentEditingRange = isEditing ? ranges[editingRangeIndex] : null;
  const savedRangeCountLabel = language === 'es'
    ? `${ranges.length} ${ranges.length === 1 ? 'rango guardado' : 'rangos guardados'}`
    : `${ranges.length} ${ranges.length === 1 ? 'range saved' : 'ranges saved'}`;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const syncMonths = () => setMonthCount(mediaQuery.matches ? 2 : 1);

    syncMonths();
    mediaQuery.addEventListener('change', syncMonths);

    return () => mediaQuery.removeEventListener('change', syncMonths);
  }, []);

  useEffect(() => {
    if (!isEditing) {
      return;
    }

    if (!currentEditingRange) {
      onEditingHandled?.();
      return;
    }

    setDraftStart(currentEditingRange.start);
    setDraftEnd(currentEditingRange.end);
    setStartInput(toInputValue(currentEditingRange.start));
    setEndInput(toInputValue(currentEditingRange.end));
    setHoverDate(null);
    setVisibleMonth(startOfMonth(currentEditingRange.start));
    setOpen(true);
  }, [currentEditingRange, isEditing, onEditingHandled]);

  const occupiedRanges = useMemo(
    () => ranges.filter((_, index) => index !== editingRangeIndex),
    [editingRangeIndex, ranges],
  );

  const occupiedDayKeys = useMemo(() => {
    const keys = new Set();

    occupiedRanges.forEach((range) => {
      eachDayOfInterval({ start: range.start, end: range.end }).forEach((day) => {
        keys.add(toDayKey(day));
      });
    });

    return keys;
  }, [occupiedRanges]);

  const validationMessage = useMemo(() => {
    const hasPartialInput = startInput || endInput;

    if (!hasPartialInput && !draftStart && !draftEnd) {
      return null;
    }

    if (!draftStart) return t('dateSelector.validationMissingStart');
    if (!draftEnd) return t('dateSelector.validationMissingEnd');

    if (isOutsideExercise(draftStart, exerciseStart, exerciseEnd) || isOutsideExercise(draftEnd, exerciseStart, exerciseEnd)) {
      return t('dateSelector.validationOutsideExercise');
    }

    if (isBefore(draftEnd, draftStart)) {
      return t('dateSelector.validationOrder');
    }

    if (rangeContainsOccupiedDays(draftStart, draftEnd, occupiedDayKeys)) {
      return t('dateSelector.validationOverlap');
    }

    return null;
  }, [draftEnd, draftStart, endInput, exerciseEnd, exerciseStart, occupiedDayKeys, startInput, t]);

  const rangePreview = useMemo(() => {
    if (!draftStart) return undefined;

    if (draftEnd && !isBefore(draftEnd, draftStart) && !rangeContainsOccupiedDays(draftStart, draftEnd, occupiedDayKeys)) {
      return { from: draftStart, to: draftEnd };
    }

    if (hoverDate && !draftEnd && canBuildRange(draftStart, hoverDate, exerciseStart, exerciseEnd, occupiedDayKeys)) {
      const [from, to] = normalizeBounds(draftStart, hoverDate);
      return { from, to };
    }

    return { from: draftStart, to: draftStart };
  }, [draftEnd, draftStart, exerciseEnd, exerciseStart, hoverDate, occupiedDayKeys]);

  const canSubmit = !validationMessage && draftStart && draftEnd;
  const selectingEnd = Boolean(draftStart && !draftEnd);
  const initialStartInput = currentEditingRange ? toInputValue(currentEditingRange.start) : '';
  const initialEndInput = currentEditingRange ? toInputValue(currentEditingRange.end) : '';
  const initialVisibleMonth = currentEditingRange ? startOfMonth(currentEditingRange.start) : initialMonth;
  const previousMonthDisabled = visibleMonth <= startOfMonth(exerciseStart);
  const nextMonthDisabled = addMonths(visibleMonth, monthCount - 1) >= startOfMonth(exerciseEnd);
  const visibleMonths = Array.from({ length: monthCount }, (_, index) => addMonths(visibleMonth, index));

  const applyInitialDraftState = () => {
    if (currentEditingRange) {
      setDraftStart(currentEditingRange.start);
      setDraftEnd(currentEditingRange.end);
      setStartInput(toInputValue(currentEditingRange.start));
      setEndInput(toInputValue(currentEditingRange.end));
      setVisibleMonth(startOfMonth(currentEditingRange.start));
    } else {
      setDraftStart(null);
      setDraftEnd(null);
      setStartInput('');
      setEndInput('');
      setVisibleMonth(initialMonth);
    }

    setHoverDate(null);
  };

  const resetDraft = () => {
    applyInitialDraftState();
  };

  const hasUnsavedChanges = Boolean(
    hoverDate
    || startInput !== initialStartInput
    || endInput !== initialEndInput
    || toInputValue(draftStart) !== initialStartInput
    || toInputValue(draftEnd) !== initialEndInput
    || toDayKey(visibleMonth) !== toDayKey(initialVisibleMonth),
  );

  const closeModal = () => {
    setOpen(false);
    setResetConfirmOpen(false);
    resetDraft();
    onEditingHandled?.();
  };

  const openCreateModal = () => {
    onEditingHandled?.();
    resetDraft();
    setOpen(true);
  };

  const syncDraftDates = (nextStart, nextEnd) => {
    setDraftStart(nextStart);
    setDraftEnd(nextEnd);
    setStartInput(toInputValue(nextStart));
    setEndInput(toInputValue(nextEnd));
  };

  const handleDayClick = (day) => {
    if (isDayDisabled(day)) return;

    if (!draftStart || draftEnd) {
      syncDraftDates(day, null);
      setHoverDate(null);
      return;
    }

    if (!canBuildRange(draftStart, day, exerciseStart, exerciseEnd, occupiedDayKeys)) {
      return;
    }

    const [nextStart, nextEnd] = normalizeBounds(draftStart, day);
    syncDraftDates(nextStart, nextEnd);
    setHoverDate(null);
  };

  const handleStartInputChange = (value) => {
    setStartInput(value);

    const parsedDate = parseInputDate(value);
    setDraftStart(parsedDate);

    if (parsedDate) {
      setVisibleMonth(startOfMonth(parsedDate));

      if (draftEnd && isBefore(draftEnd, parsedDate)) {
        setDraftEnd(null);
        setEndInput('');
      }
    }
  };

  const handleEndInputChange = (value) => {
    setEndInput(value);

    const parsedDate = parseInputDate(value);
    setDraftEnd(parsedDate);

    if (parsedDate) {
      setVisibleMonth(startOfMonth(parsedDate));
    }
  };

  const handleResetModal = () => {
    if (hasUnsavedChanges) {
      setResetConfirmOpen(true);
      return;
    }

    resetDraft();
  };

  const confirmResetModal = () => {
    resetDraft();
    setResetConfirmOpen(false);
  };

  const handlePreviousMonth = () => {
    if (previousMonthDisabled) {
      return;
    }

    setVisibleMonth((currentMonth) => subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    if (nextMonthDisabled) {
      return;
    }

    setVisibleMonth((currentMonth) => addMonths(currentMonth, 1));
  };

  const handleJumpToCurrentMonth = () => {
    setVisibleMonth(initialMonth);
  };

  const handleConfirm = () => {
    if (!canSubmit) {
      return;
    }

    const payload = {
      start: draftStart,
      end: draftEnd,
      days: differenceInCalendarDays(draftEnd, draftStart) + 1,
    };

    if (isEditing) {
      onUpdateRange(editingRangeIndex, payload);
    } else {
      onAddRange(payload);
    }

    closeModal();
  };

  const isDayDisabled = (date) => {
    if (isOutsideExercise(date, exerciseStart, exerciseEnd)) return true;
    if (occupiedDayKeys.has(toDayKey(date))) return true;

    if (draftStart && !draftEnd && toDayKey(date) !== toDayKey(draftStart)) {
      return !canBuildRange(draftStart, date, exerciseStart, exerciseEnd, occupiedDayKeys);
    }

    return false;
  };

  return (
    <>
      <Card className="rounded-[32px] border-border/60 bg-transparent shadow-none">
        <CardContent className="double-shell p-1.5">
          <div className="double-shell-core p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                <CalendarBlank className="h-3.5 w-3.5" weight="light" />
                {savedRangeCountLabel}
              </div>
              <div>
                <h3 className="text-2xl font-[620] tracking-[-0.05em] text-foreground">
                  {t('dateSelector.title')}
                </h3>
                <p className="mt-2 max-w-[56ch] text-sm leading-7 text-muted-foreground">
                  {t('dateSelector.description')}
                </p>
              </div>
            </div>

            <Button
              onClick={openCreateModal}
              className="group h-12 gap-3 px-2 pl-5 text-sm font-semibold"
            >
              <span>{ranges.length > 0 ? t('dateSelector.addAnotherRange') : t('dateSelector.title')}</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/15 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-1 group-hover:-translate-y-[1px]">
                <CalendarPlus className="h-4 w-4" weight="bold" />
              </span>
            </Button>
          </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={(nextOpen) => (nextOpen ? setOpen(true) : closeModal())}>
        <DialogContent
          showClose={false}
          className="h-[calc(100vh-1rem)] max-h-[calc(100vh-1rem)] w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] gap-0 overflow-hidden rounded-[32px] border-border/90 bg-[#0d1320] p-0 shadow-[0_40px_120px_-56px_rgba(0,0,0,0.92)] sm:h-[min(760px,calc(100vh-2rem))] sm:max-h-[min(760px,calc(100vh-2rem))] sm:max-w-[1140px]"
        >
          <div className="flex h-full flex-col">
            <DialogHeader className="border-b border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(8,12,22,0.96))] px-5 py-3 sm:px-5 sm:py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1 space-y-1.5 pr-2 text-left">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                    <CalendarDots className="h-3.5 w-3.5" weight="fill" />
                    {premiumCopy.rangeDrafting}
                  </div>
                  <DialogTitle className="text-[1.85rem] font-[650] leading-none tracking-[-0.06em] sm:text-[2rem]">
                    {t('dateSelector.modalTitle')}
                  </DialogTitle>
                  <DialogDescription className="max-w-xl text-[0.92rem] leading-5 text-muted-foreground/90">
                    {t('dateSelector.modalDescription')}
                  </DialogDescription>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  {isEditing && (
                    <div className="hidden sm:inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
                      <PencilSimpleLine className="h-3.5 w-3.5" weight="bold" />
                      {t('dateSelector.editRange')}
                    </div>
                  )}

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={closeModal}
                    className="h-9 w-9 rounded-full border border-border/80 bg-[#151d30] hover:bg-accent"
                    aria-label={t('dateSelector.cancel')}
                  >
                    <X className="h-4 w-4" weight="bold" />
                  </Button>
                </div>
              </div>

              {isEditing && (
                <div className="mt-2 sm:hidden">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    <PencilSimpleLine className="h-3.5 w-3.5" weight="bold" />
                    {t('dateSelector.editRange')}
                  </div>
                </div>
              )}
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-4 py-3 sm:px-4 sm:py-3 lg:overflow-hidden">
              <div className="grid gap-3 lg:h-full lg:grid-cols-[290px_minmax(0,1fr)]">
                <div className="space-y-2.5">
                  <div className="double-shell">
                    <div className="double-shell-core rounded-[1.625rem] bg-[#171f31] p-3">
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                      <div className="space-y-1.5">
                        <label htmlFor="range-start-date" className="text-[13px] font-semibold tracking-[-0.02em] text-foreground">
                          {t('dateSelector.startDate')}
                        </label>
                        <Input
                          id="range-start-date"
                          type="text"
                          value={startInput}
                          inputMode="numeric"
                          placeholder="YYYY/MM/DD"
                          onChange={(event) => handleStartInputChange(event.target.value)}
                          className="h-11 rounded-[1rem] border-border/80 bg-[#0f1524] text-base"
                        />
                        <p className="text-xs leading-5 text-muted-foreground">{t('dateSelector.inputHint')}</p>
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="range-end-date" className="text-[13px] font-semibold tracking-[-0.02em] text-foreground">
                          {t('dateSelector.endDate')}
                        </label>
                        <Input
                          id="range-end-date"
                          type="text"
                          value={endInput}
                          inputMode="numeric"
                          placeholder="YYYY/MM/DD"
                          onChange={(event) => handleEndInputChange(event.target.value)}
                          className="h-11 rounded-[1rem] border-border/80 bg-[#0f1524] text-base"
                        />
                        <p className="text-xs leading-5 text-muted-foreground">{t('dateSelector.inputHint')}</p>
                      </div>
                    </div>
                  </div>
                  </div>

                  <div className="double-shell">
                    <div className="double-shell-core rounded-[1.625rem] bg-[#171f31] p-3">
                    <div className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-foreground">
                      <Circle className="h-3.5 w-3.5" weight="fill" />
                      {selectingEnd
                        ? t('dateSelector.helperEnd')
                        : canSubmit
                          ? t('dateSelector.rangeReady')
                          : t('dateSelector.helperStart')}
                    </div>

                    <p className={cn(
                      'pt-2.5 text-sm leading-6',
                      validationMessage ? 'text-destructive' : 'text-muted-foreground',
                    )}>
                      {validationMessage || t('dateSelector.helperUsedDates')}
                    </p>

                    {draftStart && draftEnd && !validationMessage && (
                      <div className="mt-3 rounded-[1.5rem] border border-primary/15 bg-primary/10 p-3.5">
                        <p className="text-sm font-semibold text-foreground">{t('dateSelector.selectedRange')}</p>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          {toInputValue(draftStart)} <span className="mx-1 text-muted-foreground/60">→</span>
                          {toInputValue(draftEnd)}
                        </p>
                        <p className="mt-2 text-sm font-semibold text-primary">
                          {differenceInCalendarDays(draftEnd, draftStart) + 1} {differenceInCalendarDays(draftEnd, draftStart) + 1 === 1 ? t('dateSelector.day') : t('dateSelector.days')}
                        </p>
                      </div>
                    )}
                  </div>
                  </div>
                </div>

                <div className="double-shell">
                  <div className="double-shell-core flex h-full flex-col rounded-[1.75rem] bg-[#161d2d] p-3">
                  <div className="mb-2.5 rounded-[1.5rem] border border-border/70 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.07),transparent_52%),rgba(17,23,37,0.98)] px-3.5 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_24px_60px_-42px_rgba(15,23,42,0.9)]">
                    <div className="flex flex-col gap-2.5 xl:flex-row xl:items-start xl:justify-between">
                      <div className="space-y-1.5">
                        <div className="space-y-0.5">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            {premiumCopy.calendarNavigation}
                          </p>
                          <p className="max-w-[30rem] text-[0.82rem] leading-5 text-muted-foreground/85">
                            {premiumCopy.calendarLead}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {visibleMonths.map((monthDate, index) => (
                            <span
                              key={monthDate.toISOString()}
                              className={cn(
                                'rounded-full border px-3 py-1 text-sm font-semibold backdrop-blur-sm',
                                index === 0
                                  ? 'border-primary/30 bg-primary/12 text-foreground shadow-[0_16px_36px_-28px_rgba(59,130,246,0.9)]'
                                  : 'border-white/8 bg-white/[0.03] text-muted-foreground',
                              )}
                            >
                              {format(monthDate, 'LLLL yyyy', { locale })}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-end gap-2 xl:max-w-[15rem]">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={handleJumpToCurrentMonth}
                          className="h-9 rounded-full border border-border/70 bg-[#111827] px-3.5 text-sm font-semibold text-foreground"
                        >
                          {premiumCopy.jumpToToday}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={handlePreviousMonth}
                          disabled={previousMonthDisabled}
                          className="h-9 w-9 rounded-full border-border/80 bg-[#111827] shadow-[0_12px_24px_-18px_rgba(15,23,42,0.65)]"
                          aria-label={premiumCopy.previousMonth}
                        >
                          <ArrowLeft className="h-4 w-4" weight="bold" />
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={handleNextMonth}
                          disabled={nextMonthDisabled}
                          className="h-9 w-9 rounded-full border-border/80 bg-[#111827] shadow-[0_12px_24px_-18px_rgba(15,23,42,0.65)]"
                          aria-label={premiumCopy.nextMonth}
                        >
                          <ArrowRight className="h-4 w-4" weight="bold" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Calendar
                    mode="range"
                    locale={locale}
                    selected={rangePreview}
                    numberOfMonths={monthCount}
                    month={visibleMonth}
                    weekStartsOn={language === 'es' ? 1 : 0}
                    onDayClick={handleDayClick}
                    onMonthChange={setVisibleMonth}
                    onDayMouseEnter={(day) => {
                      if (selectingEnd) {
                        setHoverDate(day);
                      }
                    }}
                    disabled={isDayDisabled}
                    startMonth={exerciseStart}
                    endMonth={exerciseEnd}
                    showOutsideDays={false}
                    className="mx-auto w-full flex-1 [--cell-size:2.05rem]"
                    modifiers={{
                      occupied: (date) => occupiedDayKeys.has(toDayKey(date)),
                      outOfExercise: (date) => isOutsideExercise(date, exerciseStart, exerciseEnd),
                    }}
                    modifiersClassNames={{
                      occupied: 'bg-slate-100 text-slate-400 line-through border border-slate-200 aria-disabled:opacity-100 dark:bg-slate-800/70 dark:text-slate-500 dark:border-slate-700',
                      outOfExercise: 'opacity-30',
                    }}
                    classNames={{
                      root: 'relative w-full flex-1 overflow-hidden rounded-[20px] border border-border/70 bg-[#111827] p-2.5',
                      months: 'grid grid-cols-1 gap-2.5 xl:grid-cols-2',
                      month: 'min-w-0 rounded-2xl border border-border/70 bg-[#0f1524] p-2.5 shadow-sm',
                      nav: 'hidden',
                      button_previous: 'hidden',
                      button_next: 'hidden',
                      month_caption: 'mb-2.5 flex h-9 items-center justify-start rounded-2xl border border-border/50 bg-[#121a2a] px-4 text-left',
                      caption_label: 'text-[1rem] font-semibold tracking-tight capitalize',
                      table: 'w-full border-collapse table-fixed',
                      weekdays: 'table-row',
                      weekday: 'pb-1.5 text-center text-[0.69rem] font-medium uppercase tracking-[0.12em] text-muted-foreground',
                      week: 'table-row',
                      day: 'p-0 text-center align-middle',
                      day_button: 'h-9 w-9 rounded-[0.85rem] text-[0.92rem] font-medium transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-[1px]',
                      range_start: 'bg-primary/15 rounded-[1rem]',
                      range_middle: 'bg-primary/10',
                      range_end: 'bg-primary/15 rounded-[1rem]',
                      today: 'rounded-[0.95rem] border border-primary/30 bg-primary/5 text-primary',
                      disabled: 'text-muted-foreground',
                      hidden: 'invisible',
                    }}
                  />

                  <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-border/70 px-2 pt-2.5 text-[11px] text-muted-foreground">
                    <div className="inline-flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-primary" />
                      {t('dateSelector.activeRange')}
                    </div>
                    <div className="inline-flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full border border-slate-300 bg-slate-100 dark:border-slate-700 dark:bg-slate-800/70" />
                      {t('dateSelector.usedDates')}
                    </div>
                  </div>
                </div>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-auto shrink-0 border-t border-border/80 bg-[#0f1524] px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:space-x-0">
              <Button
                type="button"
                variant="ghost"
                onClick={handleResetModal}
                className="h-9 rounded-full px-3.5 text-muted-foreground"
              >
                <CornersOut className="mr-2 h-4 w-4" weight="bold" />
                {t('dateSelector.reset')}
              </Button>

              <div className="flex flex-col-reverse gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  className="h-9 rounded-full px-3.5"
                >
                  {t('dateSelector.cancel')}
                </Button>
                <Button
                  type="button"
                  onClick={handleConfirm}
                  disabled={!canSubmit}
                  className="h-9 rounded-full px-3.5 font-semibold shadow-md shadow-primary/15"
                >
                  <CheckCircle className="h-4 w-4" weight="bold" />
                  {isEditing ? t('dateSelector.confirmEdit') : t('dateSelector.addRange')}
                </Button>
              </div>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={resetConfirmOpen} onOpenChange={setResetConfirmOpen}>
        <AlertDialogContent className="max-w-md rounded-[24px] border-border/80">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('dateSelector.resetDialogTitle')}</AlertDialogTitle>
            <AlertDialogDescription className="leading-6">
              {t('dateSelector.resetWarning')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooterActions>
            <AlertDialogCancel className="rounded-full">
              {t('dateSelector.resetDialogCancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmResetModal}
              className="rounded-full"
            >
              {t('dateSelector.resetDialogConfirm')}
            </AlertDialogAction>
          </AlertDialogFooterActions>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

function toDayKey(date) {
  return format(date, 'yyyy-MM-dd');
}

function toInputValue(date) {
  return date ? format(date, 'yyyy/MM/dd') : '';
}

function parseInputDate(value) {
  if (!value) return null;

  const normalizedValue = value.replace(/\./g, '/').replace(/-/g, '/');
  const isoLikeValue = normalizedValue.replace(/\//g, '-');
  const parsedDate = parseISO(isoLikeValue);
  return isValid(parsedDate) ? parsedDate : null;
}

function normalizeBounds(firstDate, secondDate) {
  return isAfter(firstDate, secondDate)
    ? [secondDate, firstDate]
    : [firstDate, secondDate];
}

function isOutsideExercise(date, exerciseStart, exerciseEnd) {
  return isBefore(date, exerciseStart) || isAfter(date, exerciseEnd);
}

function rangeContainsOccupiedDays(start, end, occupiedDayKeys) {
  const [safeStart, safeEnd] = normalizeBounds(start, end);

  return eachDayOfInterval({ start: safeStart, end: safeEnd }).some((day) =>
    occupiedDayKeys.has(toDayKey(day)),
  );
}

function canBuildRange(start, end, exerciseStart, exerciseEnd, occupiedDayKeys) {
  return !isOutsideExercise(start, exerciseStart, exerciseEnd)
    && !isOutsideExercise(end, exerciseStart, exerciseEnd)
    && !rangeContainsOccupiedDays(start, end, occupiedDayKeys);
}

export default DateRangeSelector;
