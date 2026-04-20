import React from 'react';
import { format } from 'date-fns';
import { CalendarBlank, PencilSimpleLine, Trash } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage.js';

const RangeList = ({ ranges, onRemoveRange, onEditRange }) => {
  const { t } = useLanguage();

  return (
    <div className="double-shell">
      <div className="double-shell-core overflow-hidden">
      <div className="border-b border-border/60 px-6 py-5">
        <div className="flex items-center gap-3 text-lg">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
            <CalendarBlank size={18} weight="light" className="text-primary" />
          </div>
          {t('rangeList.title')}
        </div>
      </div>

      <div className="p-0">
        {ranges.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-muted-foreground">
            {t('rangeList.empty')}
          </div>
        ) : (
          <ul className="divide-y divide-border/60">
            {ranges.map((range, index) => (
              <li
                key={`${range.start.toISOString()}-${range.end.toISOString()}-${index}`}
                className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-primary/15 bg-primary/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                      {range.days} {range.days === 1 ? t('dateSelector.day') : t('dateSelector.days')}
                    </span>
                  </div>

                  <div className="grid gap-2 text-sm text-foreground sm:grid-cols-3 sm:gap-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {t('rangeList.from')}
                      </p>
                      <p className="mt-1 font-medium">{format(range.start, 'yyyy/MM/dd')}</p>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {t('rangeList.to')}
                      </p>
                      <p className="mt-1 font-medium">{format(range.end, 'yyyy/MM/dd')}</p>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {t('rangeList.duration')}
                      </p>
                      <p className="mt-1 font-medium">
                        {range.days} {range.days === 1 ? t('dateSelector.day') : t('dateSelector.days')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => onEditRange(index)}
                    className="rounded-full"
                  >
                    <PencilSimpleLine size={15} weight="bold" />
                    {t('rangeList.edit')}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveRange(index)}
                    className="rounded-full text-muted-foreground hover:text-destructive"
                  >
                    <Trash size={15} weight="bold" />
                    {t('rangeList.delete')}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      </div>
    </div>
  );
};

export default RangeList;
