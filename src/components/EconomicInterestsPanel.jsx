import React from 'react';
import { CheckCircle, Eraser, Scales, WarningCircle } from '@phosphor-icons/react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useLanguage } from '@/hooks/useLanguage.js';
import LegalRef from '@/components/LegalRef.jsx';
import {
  ECONOMIC_INTEREST_QUESTIONS,
  evaluateEconomicInterests,
} from '@/lib/economicInterests.js';

const LEVEL_STYLES = {
  low: {
    badge: 'border-[hsl(var(--success)/0.22)] bg-[hsl(var(--success)/0.1)] text-[hsl(var(--success-strong))]',
    panel: 'border-[hsl(var(--success)/0.28)] bg-[hsl(var(--success)/0.06)]',
  },
  medium: {
    badge: 'border-[hsl(var(--warning)/0.28)] bg-[hsl(var(--warning)/0.13)] text-[hsl(var(--warning-strong))]',
    panel: 'border-[hsl(var(--warning)/0.4)] bg-[hsl(var(--warning)/0.06)]',
  },
  high: {
    badge: 'border-[hsl(var(--destructive)/0.25)] bg-[hsl(var(--destructive)/0.12)] text-[hsl(var(--destructive-strong))]',
    panel: 'border-[hsl(var(--destructive)/0.3)] bg-[hsl(var(--destructive)/0.06)]',
  },
};

const LEVEL_LABEL_KEYS = {
  low: 'economicInterests.levelLow',
  medium: 'economicInterests.levelMedium',
  high: 'economicInterests.levelHigh',
};

const LEVEL_DESC_KEYS = {
  low: 'economicInterests.levelLowDesc',
  medium: 'economicInterests.levelMediumDesc',
  high: 'economicInterests.levelHighDesc',
};

/**
 * Guided questionnaire that complements the day count with a qualitative
 * "centre of economic interests" assessment (art. 9 Law 35/2006, IRPF).
 * Answers stay in the browser's localStorage only.
 */
const EconomicInterestsPanel = ({ answers, onChange, onReset }) => {
  const { t } = useLanguage();
  const evaluation = evaluateEconomicInterests(answers);
  const levelStyles = evaluation.level ? LEVEL_STYLES[evaluation.level] : null;

  return (
    <section aria-labelledby="economic-interests-heading" className="trust-panel p-5">
      <div className="space-y-2">
        <span className="premium-eyebrow">
          <Scales size={12} weight="fill" className="mr-2" />
          {t('economicInterests.eyebrow')}
        </span>
        <h3 id="economic-interests-heading" className="text-lg font-semibold text-foreground">
          {t('economicInterests.title')}
        </h3>
        <p className="text-sm leading-6 text-muted-foreground">
          {t('economicInterests.description')}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
          <LegalRef refId="lirpf-art9" />
          <LegalRef refId="dgt-intereses-economicos" />
        </div>
      </div>

      <div className="mt-4 flex gap-3 rounded-lg border border-dashed border-[hsl(var(--warning)/0.45)] bg-[hsl(var(--warning)/0.06)] px-3.5 py-2.5">
        <WarningCircle size={18} weight="fill" className="mt-0.5 shrink-0 text-[hsl(var(--warning-strong))]" />
        <p className="text-xs leading-5 text-muted-foreground">
          {t('economicInterests.disclaimer')}
        </p>
      </div>

      <form className="mt-5 space-y-5" onSubmit={(event) => event.preventDefault()}>
        {ECONOMIC_INTEREST_QUESTIONS.map((question, index) => (
          <fieldset key={question.id} className="space-y-2.5">
            <legend className="text-sm font-semibold leading-5 text-foreground">
              {index + 1}. {t(`economicInterests.${question.id}.title`)}
            </legend>
            <RadioGroup
              value={answers[question.id] ?? ''}
              onValueChange={(optionId) => onChange(question.id, optionId)}
              className="gap-1.5"
            >
              {question.options.map((option) => {
                const optionElementId = `economic-interests-${question.id}-${option.id}`;
                return (
                  <label
                    key={option.id}
                    htmlFor={optionElementId}
                    className="flex cursor-pointer items-center gap-3 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors duration-200 hover:bg-accent has-[:checked]:border-primary/50 has-[:checked]:bg-primary/[0.06]"
                  >
                    <RadioGroupItem value={option.id} id={optionElementId} />
                    <span className="leading-5">{t(`economicInterests.${question.id}.${option.id}`)}</span>
                  </label>
                );
              })}
            </RadioGroup>
          </fieldset>
        ))}
      </form>

      {evaluation.complete && evaluation.level ? (
        <div
          role="status"
          className={`mt-5 space-y-2 rounded-lg border px-3.5 py-3 ${levelStyles.panel}`}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t('economicInterests.resultTitle')}
            </span>
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${levelStyles.badge}`}>
              <CheckCircle size={14} weight="fill" />
              {t(LEVEL_LABEL_KEYS[evaluation.level])}
            </span>
          </div>
          <p className="text-xs leading-5 text-muted-foreground">
            {t(LEVEL_DESC_KEYS[evaluation.level])}
          </p>
        </div>
      ) : (
        <p role="status" className="mt-5 rounded-lg border border-border bg-muted/40 px-3.5 py-2.5 text-xs leading-5 text-muted-foreground">
          {t('economicInterests.pendingHint')}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-[11px] leading-4 text-muted-foreground">
          {t('economicInterests.privacy')}
        </p>
        <button
          type="button"
          onClick={onReset}
          disabled={evaluation.answeredCount === 0}
          className="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-md border border-input bg-background px-3 text-[11px] font-bold uppercase tracking-wide text-foreground transition-colors duration-200 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Eraser size={13} weight="bold" />
          {t('economicInterests.reset')}
        </button>
      </div>
    </section>
  );
};

export default EconomicInterestsPanel;
