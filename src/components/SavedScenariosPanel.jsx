import React, { useState } from 'react';
import { FloppyDisk, FolderOpen, Table, Trash } from '@phosphor-icons/react';
import { useLanguage } from '@/hooks/useLanguage.js';
import {
  MAX_SAVED_SCENARIOS,
  MAX_SCENARIO_NAME_LENGTH,
  buildScenarioComparison,
} from '@/lib/savedScenarios.js';

const RISK_STYLES = {
  safe: 'border-[hsl(var(--success)/0.22)] bg-[hsl(var(--success)/0.1)] text-[hsl(var(--success))]',
  warning: 'border-[hsl(var(--warning)/0.28)] bg-[hsl(var(--warning)/0.13)] text-[hsl(var(--warning-foreground))]',
  destructive: 'border-[hsl(var(--destructive)/0.25)] bg-[hsl(var(--destructive)/0.12)] text-[hsl(var(--destructive))]',
};

const RISK_LABEL_KEYS = {
  safe: 'progress.safe',
  warning: 'progress.approaching',
  destructive: 'progress.over',
};

const RiskBadge = ({ level }) => {
  const { t } = useLanguage();
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${RISK_STYLES[level] ?? RISK_STYLES.safe}`}>
      {t(RISK_LABEL_KEYS[level] ?? RISK_LABEL_KEYS.safe)}
    </span>
  );
};

/**
 * Named hypothetical scenarios saved in localStorage only, with a comparison
 * table against the current situation (days in Spain, days left, risk level).
 */
const SavedScenariosPanel = ({
  scenarios,
  currentRanges,
  canSave,
  onSave,
  onLoad,
  onDelete,
}) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const limitReached = scenarios.length >= MAX_SAVED_SCENARIOS;
  const comparison = buildScenarioComparison(currentRanges, scenarios);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!canSave || limitReached) return;
    const saved = onSave(name);
    if (saved) setName('');
  };

  return (
    <section aria-labelledby="saved-scenarios-heading" className="trust-panel p-5">
      <div className="space-y-2">
        <span className="premium-eyebrow">
          <Table size={12} weight="fill" className="mr-2" />
          {t('savedScenarios.eyebrow')}
        </span>
        <h3 id="saved-scenarios-heading" className="text-lg font-semibold text-foreground">
          {t('savedScenarios.title')}
        </h3>
        <p className="text-sm leading-6 text-muted-foreground">
          {t('savedScenarios.description')}
        </p>
      </div>

      <form className="mt-4 flex flex-col gap-2 sm:flex-row" onSubmit={handleSubmit}>
        <div className="flex-1">
          <label htmlFor="saved-scenario-name" className="field-label">
            {t('savedScenarios.nameLabel')}
          </label>
          <input
            id="saved-scenario-name"
            type="text"
            value={name}
            maxLength={MAX_SCENARIO_NAME_LENGTH}
            placeholder={t('savedScenarios.namePlaceholder')}
            onChange={(event) => setName(event.target.value)}
            disabled={!canSave || limitReached}
            className="mt-1.5 h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <button
          type="submit"
          disabled={!canSave || limitReached || name.trim().length === 0}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 self-end rounded-md border border-input bg-background px-4 text-xs font-bold uppercase tracking-wide text-foreground transition-colors duration-200 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FloppyDisk size={16} weight="bold" />
          {t('savedScenarios.save')}
        </button>
      </form>

      {!canSave && (
        <p role="status" className="mt-2 text-xs leading-5 text-muted-foreground">
          {t('savedScenarios.nothingToSave')}
        </p>
      )}
      {limitReached && (
        <p role="status" className="mt-2 rounded-lg border border-[hsl(var(--warning)/0.28)] bg-[hsl(var(--warning)/0.08)] px-3 py-2 text-xs leading-5 text-[hsl(var(--warning-foreground))]">
          {t('savedScenarios.limitReached')}
        </p>
      )}

      {scenarios.length === 0 ? (
        <p role="status" className="mt-4 rounded-lg border border-border bg-muted/40 px-3.5 py-2.5 text-xs leading-5 text-muted-foreground">
          {t('savedScenarios.empty')}
        </p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[520px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th scope="col" className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t('savedScenarios.tableScenario')}
                </th>
                <th scope="col" className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t('savedScenarios.tableDays')}
                </th>
                <th scope="col" className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t('savedScenarios.tableRemaining')}
                </th>
                <th scope="col" className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t('savedScenarios.tableRisk')}
                </th>
                <th scope="col" className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t('savedScenarios.tableActions')}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border bg-primary/[0.04]">
                <th scope="row" className="px-3 py-2 text-sm font-semibold text-foreground">
                  {t('savedScenarios.currentRow')}
                </th>
                <td className="px-3 py-2 text-right font-semibold text-foreground">
                  {comparison.current.totalDays}
                </td>
                <td className="px-3 py-2 text-right text-muted-foreground">
                  {comparison.current.remainingDays}
                </td>
                <td className="px-3 py-2">
                  <RiskBadge level={comparison.current.riskLevel} />
                </td>
                <td className="px-3 py-2" />
              </tr>
              {comparison.rows.map((row) => (
                <tr key={row.id} className="border-b border-border last:border-b-0">
                  <th scope="row" className="max-w-[180px] truncate px-3 py-2 text-sm font-semibold text-foreground">
                    {row.name}
                  </th>
                  <td className="px-3 py-2 text-right font-semibold text-foreground">
                    {row.totalDays}
                  </td>
                  <td className="px-3 py-2 text-right text-muted-foreground">
                    {row.remainingDays}
                  </td>
                  <td className="px-3 py-2">
                    <RiskBadge level={row.riskLevel} />
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onLoad(row.id)}
                        aria-label={`${t('savedScenarios.load')}: ${row.name}`}
                        className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-input bg-background px-2.5 text-[11px] font-bold uppercase tracking-wide text-foreground transition-colors duration-200 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                      >
                        <FolderOpen size={13} weight="bold" />
                        {t('savedScenarios.load')}
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(row.id)}
                        aria-label={`${t('savedScenarios.delete')}: ${row.name}`}
                        className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-[hsl(var(--destructive)/0.25)] bg-background px-2.5 text-[11px] font-bold uppercase tracking-wide text-[hsl(var(--destructive))] transition-colors duration-200 hover:bg-[hsl(var(--destructive)/0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                      >
                        <Trash size={13} weight="bold" />
                        {t('savedScenarios.delete')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default SavedScenariosPanel;
