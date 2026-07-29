import React from 'react';
import { ArrowSquareOut, Handshake, WarningCircle } from '@phosphor-icons/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/hooks/useLanguage.js';
import LegalRef from '@/components/LegalRef.jsx';
import {
  AEAT_TREATY_LIST_URL,
  OTHER_COUNTRY_OPTION,
  TAX_TREATY_COUNTRIES,
  TIE_BREAKER_RULES,
  getTaxTreatyCountry,
} from '@/lib/taxTreaties.js';

const SUPPORTED_LANGUAGES = ['es', 'en'];

/**
 * Optional "second country of residence" selector. When a treaty country is
 * chosen, shows the Article 4 (OECD Model) tie-breaker rules in order and a
 * link to the official source; any other country gets a generic pointer to
 * the official AEAT treaty listing. The selection stays in localStorage
 * only and is never sent to any server.
 */
const TaxTreatiesPanel = ({ selection, onChange }) => {
  const { t, language } = useLanguage();
  const lang = SUPPORTED_LANGUAGES.includes(language) ? language : 'es';
  const country = selection ? getTaxTreatyCountry(selection) : null;

  return (
    <section aria-labelledby="tax-treaties-heading" className="trust-panel p-5">
      <div className="space-y-2">
        <span className="premium-eyebrow">
          <Handshake size={12} weight="fill" className="mr-2" />
          {t('taxTreaties.eyebrow')}
        </span>
        <h3 id="tax-treaties-heading" className="text-lg font-semibold text-foreground">
          {t('taxTreaties.title')}
        </h3>
        <p className="text-sm leading-6 text-muted-foreground">
          {t('taxTreaties.description')}
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
          <LegalRef refId="dgt-convenios-cdi" />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="second-country" className="field-label">
          {t('taxTreaties.selectLabel')}
        </label>
        <Select
          value={selection ?? 'none'}
          onValueChange={onChange}
        >
          <SelectTrigger
            id="second-country"
            className="mt-2 h-11 w-full rounded-md border-input bg-background text-sm font-semibold text-foreground focus:ring-ring/35"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">{t('taxTreaties.noneOption')}</SelectItem>
            {TAX_TREATY_COUNTRIES.map((entry) => (
              <SelectItem key={entry.id} value={entry.id}>
                {entry.name[lang]}
              </SelectItem>
            ))}
            <SelectItem value={OTHER_COUNTRY_OPTION}>
              {t('taxTreaties.otherOption')}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {country && (
        <div
          role="status"
          className="mt-4 space-y-3 rounded-lg border border-primary/20 bg-primary/[0.05] px-3.5 py-3"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t('taxTreaties.rulesTitle')}
          </p>
          <ol className="list-decimal space-y-1.5 pl-4 text-xs leading-5 text-foreground">
            {TIE_BREAKER_RULES.map((rule) => (
              <li key={rule.id}>{rule[lang]}</li>
            ))}
          </ol>
          <a
            href={country.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-sm text-xs font-medium text-primary underline decoration-dotted decoration-primary/50 underline-offset-4 transition-colors duration-200 hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {t('taxTreaties.sourceLink')}
            <ArrowSquareOut size={13} weight="bold" aria-hidden="true" className="shrink-0" />
            <span className="sr-only">{t('legalRefs.externalLinkSr')}</span>
          </a>
          <div className="flex gap-2.5 rounded-md border border-dashed border-[hsl(var(--warning)/0.45)] bg-[hsl(var(--warning)/0.06)] px-3 py-2">
            <WarningCircle size={16} weight="fill" className="mt-0.5 shrink-0 text-[hsl(var(--warning-foreground))]" />
            <p className="text-[11px] leading-4 text-muted-foreground">
              {t('taxTreaties.disclaimer')}
            </p>
          </div>
        </div>
      )}

      {selection === OTHER_COUNTRY_OPTION && (
        <div
          role="status"
          className="mt-4 space-y-2.5 rounded-lg border border-border bg-muted/40 px-3.5 py-3"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t('taxTreaties.genericTitle')}
          </p>
          <p className="text-xs leading-5 text-foreground">
            {t('taxTreaties.genericMessage')}
          </p>
          <a
            href={AEAT_TREATY_LIST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-sm text-xs font-medium text-primary underline decoration-dotted decoration-primary/50 underline-offset-4 transition-colors duration-200 hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {t('taxTreaties.genericLink')}
            <ArrowSquareOut size={13} weight="bold" aria-hidden="true" className="shrink-0" />
            <span className="sr-only">{t('legalRefs.externalLinkSr')}</span>
          </a>
        </div>
      )}

      <p className="mt-4 text-[11px] leading-4 text-muted-foreground">
        {t('taxTreaties.privacy')}
      </p>
    </section>
  );
};

export default TaxTreatiesPanel;
