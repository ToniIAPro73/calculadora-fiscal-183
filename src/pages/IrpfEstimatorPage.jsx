import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ArrowRight, Warning } from '@phosphor-icons/react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import LegalRef from '@/components/LegalRef.jsx';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getCanonicalUrl } from '@/lib/seo';
import { IRPF_REGION_KEYS, calculateIrpfEstimate } from '@/lib/irpfBrackets.js';

const NO_REGION = 'none';

const IrpfEstimatorPage = () => {
  const { t, language } = useLanguage();
  const canonicalUrl = getCanonicalUrl(language, 'irpf-estimator');

  const [baseInput, setBaseInput] = useState('');
  const [region, setRegion] = useState(NO_REGION);
  const [estimate, setEstimate] = useState(null);

  const currencyFormatter = useMemo(
    () => new Intl.NumberFormat(language === 'es' ? 'es-ES' : 'en-GB', {
      style: 'currency',
      currency: 'EUR',
    }),
    [language],
  );

  const formatCurrency = (value) => currencyFormatter.format(value);
  const formatRate = (rate) => `${(rate * 100).toLocaleString(language === 'es' ? 'es-ES' : 'en-GB', { maximumFractionDigits: 2 })} %`;

  const formatBracket = (row) => {
    const from = row.from === 0 ? '' : `${formatCurrency(row.from)} – `;
    if (row.to === null) {
      return `${formatCurrency(row.from)} ${t('irpfEstimator.bracketOpen')}`;
    }
    return `${from}${formatCurrency(row.to)}`;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setEstimate(calculateIrpfEstimate(baseInput, region === NO_REGION ? undefined : region));
  };

  const renderBreakdownTable = (part, caption) => (
    <table className="w-full border-collapse text-sm">
      <caption className="mb-2 text-left font-semibold text-foreground">
        {caption}
      </caption>
      <thead>
        <tr className="border-b border-border/70 text-left text-xs uppercase tracking-wide text-muted-foreground">
          <th scope="col" className="py-2 pr-2 font-medium">{t('irpfEstimator.colBracket')}</th>
          <th scope="col" className="py-2 pr-2 font-medium text-right">{t('irpfEstimator.colRate')}</th>
          <th scope="col" className="py-2 pr-2 font-medium text-right">{t('irpfEstimator.colTaxable')}</th>
          <th scope="col" className="py-2 font-medium text-right">{t('irpfEstimator.colTax')}</th>
        </tr>
      </thead>
      <tbody>
        {part.breakdown.map((row) => (
          <tr key={`${row.from}-${row.to ?? 'open'}`} className="border-b border-border/40">
            <td className="py-2 pr-2 text-muted-foreground">{formatBracket(row)}</td>
            <td className="py-2 pr-2 text-right text-muted-foreground">{formatRate(row.rate)}</td>
            <td className="py-2 pr-2 text-right text-muted-foreground">{formatCurrency(row.taxable)}</td>
            <td className="py-2 text-right font-medium">{formatCurrency(row.tax)}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={3} className="py-2 pr-2 text-right font-semibold">
            {t('irpfEstimator.rowTotal')}
          </td>
          <td className="py-2 text-right font-semibold">{formatCurrency(part.total)}</td>
        </tr>
      </tfoot>
    </table>
  );

  return (
    <>
      <Helmet>
        <title>{t('irpfEstimator.metaTitle')}</title>
        <meta name="description" content={t('irpfEstimator.metaDescription')} />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="mx-auto max-w-[820px] px-4 py-12 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="mb-10">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              {t('irpfEstimator.eyebrow')}
            </p>
            <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              {t('irpfEstimator.title')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('irpfEstimator.intro')}
            </p>
          </div>

          {/* Prominent disclaimer */}
          <div
            role="note"
            className="mb-10 flex gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4"
          >
            <Warning size={20} weight="bold" className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="mb-1 text-sm font-semibold">{t('irpfEstimator.disclaimerTitle')}</p>
              <p className="text-sm leading-6 text-muted-foreground">
                {t('irpfEstimator.disclaimerBody')}
              </p>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="mb-10 rounded-xl border border-border/70 bg-card p-6"
            aria-labelledby="irpf-form-title"
          >
            <h2 id="irpf-form-title" className="mb-4 text-lg font-semibold">
              {t('irpfEstimator.formTitle')}
            </h2>

            <div className="mb-4">
              <label htmlFor="irpf-base" className="field-label">
                {t('irpfEstimator.baseLabel')}
              </label>
              <Input
                id="irpf-base"
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                value={baseInput}
                onChange={(event) => setBaseInput(event.target.value)}
                placeholder={t('irpfEstimator.basePlaceholder')}
                className="mt-2 h-11"
                aria-describedby="irpf-base-helper"
              />
              <p id="irpf-base-helper" className="mt-1 text-xs text-muted-foreground">
                {t('irpfEstimator.baseHelper')}
              </p>
            </div>

            <div className="mb-6">
              <label htmlFor="irpf-region" className="field-label">
                {t('irpfEstimator.regionLabel')}
              </label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger
                  id="irpf-region"
                  className="mt-2 h-11 w-full rounded-md border-input bg-background text-sm font-semibold text-foreground focus:ring-ring/35"
                  aria-describedby="irpf-region-helper"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_REGION}>{t('irpfEstimator.regionNone')}</SelectItem>
                  {IRPF_REGION_KEYS.map((key) => (
                    <SelectItem key={key} value={key}>
                      {t(`irpfEstimator.regions.${key}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p id="irpf-region-helper" className="mt-1 text-xs text-muted-foreground">
                {t('irpfEstimator.regionHelper')}
              </p>
            </div>

            <Button type="submit" className="h-11 w-full sm:w-auto">
              {t('irpfEstimator.calculate')}
            </Button>
          </form>

          {/* Result */}
          <div aria-live="polite" className="mb-12">
            {estimate && (
              <section aria-labelledby="irpf-results-title">
                <h2 id="irpf-results-title" className="mb-4 text-2xl font-bold">
                  {t('irpfEstimator.resultsTitle')}
                </h2>

                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      {t('irpfEstimator.quotaLabel')}
                    </p>
                    <p className="text-3xl font-bold tracking-tight text-primary">
                      {formatCurrency(estimate.total)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border/70 bg-card p-5">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      {t('irpfEstimator.effectiveRateLabel')}
                    </p>
                    <p className="text-3xl font-bold tracking-tight">
                      {estimate.effectiveRate.toLocaleString(language === 'es' ? 'es-ES' : 'en-GB')} %
                    </p>
                  </div>
                </div>

                <h3 className="mb-3 text-lg font-semibold">
                  {t('irpfEstimator.breakdownTitle')}
                </h3>
                <div className="mb-4 overflow-x-auto rounded-xl border border-border/70 bg-card p-4">
                  {renderBreakdownTable(estimate.state, t('irpfEstimator.statePartTitle'))}
                </div>
                {estimate.regional && (
                  <div className="mb-4 overflow-x-auto rounded-xl border border-border/70 bg-card p-4">
                    {renderBreakdownTable(estimate.regional, t('irpfEstimator.regionalPartTitle'))}
                  </div>
                )}
                <p className="text-xs leading-5 text-muted-foreground">
                  {estimate.regional
                    ? t('irpfEstimator.regionalNote')
                    : t('irpfEstimator.stateScaleNote')}
                </p>
              </section>
            )}
          </div>

          {/* Methodology */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold">
              {t('irpfEstimator.howTitle')}
            </h2>
            <p className="mb-4 leading-7 text-muted-foreground">
              {t('irpfEstimator.howBody')}
            </p>
            <p className="mb-4 text-xs">
              <LegalRef refId="lirpf-art63" />
            </p>
          </section>

          {/* Cross CTA to the main calculator */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-8 text-center">
            <h2 className="mb-3 text-2xl font-bold">
              {t('irpfEstimator.ctaTitle')}
            </h2>
            <p className="mb-6 text-muted-foreground">
              {t('irpfEstimator.ctaBody')}
            </p>
            <Link
              to={language === 'en' ? '/en' : '/'}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {t('irpfEstimator.ctaButton')}
              <ArrowRight size={16} weight="bold" />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default IrpfEstimatorPage;
