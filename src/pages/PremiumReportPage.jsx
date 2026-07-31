import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import { ArrowRight, Download, FilePdf } from '@phosphor-icons/react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Button } from '@/components/ui/button';
import { getCanonicalUrl } from '@/lib/seo';
import {
  EXAMPLE_PDF_URL,
  PREMIUM_REPORT_ROUTE,
  getReportContents,
} from '@/lib/reportContents.js';

// Abstract mini-mock per report section: pure CSS blocks that evoke the real
// PDF layout. Each mock is decorative-but-described (role="img" + aria-label)
// so screen readers get the visual description from the translations.
const SectionMock = ({ sectionId, label }) => {
  const bar = 'h-1.5 rounded-full bg-border';
  const blocks = {
    taxpayer: (
      <div className="grid grid-cols-2 gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="space-y-1">
            <div className="h-1 w-8 rounded-full bg-muted-foreground/40" />
            <div className={`${bar} w-full bg-foreground/25`} />
          </div>
        ))}
      </div>
    ),
    summary: (
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-14 items-center justify-center rounded-md bg-primary/15 text-lg font-bold text-primary">54</div>
          <div className="flex-1 space-y-1.5">
            <div className={`${bar} w-3/4`} />
            <div className={`${bar} w-2/3`} />
            <div className={`${bar} w-1/2`} />
          </div>
          <div className="h-3.5 w-12 rounded-full bg-emerald-500/70" />
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
          <div className="h-full w-1/3 rounded-full bg-emerald-500/80" />
        </div>
      </div>
    ),
    periods: (
      <div className="space-y-1.5">
        <div className="h-3 w-full rounded-sm bg-primary/80" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`${bar} flex-1`} />
            {i < 2 && <div className="h-2.5 w-8 rounded-full bg-amber-500/70" />}
          </div>
        ))}
        <div className="h-3 w-full rounded-sm bg-primary/20" />
      </div>
    ),
    overlap: (
      <div className="rounded-md border border-amber-500/50 bg-amber-500/10 p-2.5">
        <div className="mb-1.5 h-1.5 w-1/3 rounded-full bg-amber-600/70" />
        <div className={`${bar} mb-1 w-full bg-amber-600/40`} />
        <div className={`${bar} w-2/3 bg-amber-600/40`} />
      </div>
    ),
    economicInterests: (
      <div className="space-y-2">
        {[0, 1].map((i) => (
          <div key={i} className="space-y-1">
            <div className={`${bar} w-full bg-foreground/25`} />
            <div className={`${bar} ml-2 w-1/2`} />
          </div>
        ))}
        <div className="h-3.5 w-16 rounded-full bg-emerald-500/70" />
      </div>
    ),
    scenarioComparison: (
      <div className="space-y-1.5">
        <div className="h-3 w-full rounded-sm bg-primary/80" />
        {['bg-primary/15', '', 'bg-muted/60'].map((fill, i) => (
          <div key={i} className={`flex items-center gap-2 rounded-sm px-1 py-0.5 ${fill}`}>
            <div className={`${bar} flex-1`} />
            <div className="h-1.5 w-6 rounded-full bg-foreground/30" />
            <div className="h-2.5 w-10 rounded-full bg-emerald-500/70" />
          </div>
        ))}
      </div>
    ),
    conclusion: (
      <div className="space-y-1.5">
        <div className={`${bar} w-full bg-foreground/25`} />
        <div className={`${bar} w-full bg-foreground/25`} />
        <div className={`${bar} w-3/4 bg-foreground/25`} />
      </div>
    ),
    legalNotice: (
      <div className="rounded-md bg-muted/70 p-2.5">
        <div className="mb-1.5 h-1.5 w-1/4 rounded-full bg-muted-foreground/60" />
        <div className={`${bar} mb-1 w-full`} />
        <div className={`${bar} w-5/6`} />
      </div>
    ),
    methodology: (
      <div className="space-y-2">
        {[0, 1].map((i) => (
          <div key={i} className="space-y-1">
            <div className={`${bar} w-2/3 bg-foreground/25`} />
            <div className={`${bar} ml-2 w-full`} />
            <div className={`${bar} ml-2 w-4/5`} />
          </div>
        ))}
        <div className="rounded-md bg-muted/70 p-2">
          <div className={`${bar} w-5/6`} />
        </div>
      </div>
    ),
  };

  return (
    <div
      role="img"
      aria-label={label}
      className="rounded-lg border border-border/70 bg-background p-3"
    >
      <div className="mb-2 h-2 w-1/3 rounded-full bg-primary/70" />
      {blocks[sectionId]}
    </div>
  );
};

const PremiumReportPage = () => {
  const { t, language } = useLanguage();
  const canonicalUrl = getCanonicalUrl(language, PREMIUM_REPORT_ROUTE);
  const contents = getReportContents(language);

  return (
    <>
      <Helmet>
        <title>{t('premiumReport.metaTitle')}</title>
        <meta name="description" content={t('premiumReport.metaDescription')} />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="alternate" hrefLang="es" href={getCanonicalUrl('es', PREMIUM_REPORT_ROUTE)} />
        <link rel="alternate" hrefLang="en" href={getCanonicalUrl('en', PREMIUM_REPORT_ROUTE)} />
        <link rel="alternate" hrefLang="x-default" href={getCanonicalUrl('es', PREMIUM_REPORT_ROUTE)} />
      </Helmet>
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="mx-auto max-w-[820px] px-4 py-12 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="mb-10">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              {t('premiumReport.eyebrow')}
            </p>
            <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              {t('premiumReport.title')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('premiumReport.intro')}
            </p>
          </div>

          {/* Download card + visual preview */}
          <div className="mb-12 grid gap-6 sm:grid-cols-[minmax(0,1fr)_280px] sm:items-center">
            <div
              role="img"
              aria-label={t('premiumReport.previewAlt')}
              className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm"
            >
              <div className="flex items-center justify-between bg-primary px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-sm bg-primary-foreground/80" />
                  <div className="h-2 w-20 rounded-full bg-primary-foreground/80" />
                </div>
                <div className="rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-950">
                  {language === 'en' ? 'Example' : 'Ejemplo'}
                </div>
              </div>
              <div className="space-y-3 p-4">
                <div className="h-2.5 w-2/3 rounded-full bg-foreground/30" />
                <div className="rounded-lg bg-muted/60 p-3">
                  <div className="grid grid-cols-2 gap-2">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className="space-y-1">
                        <div className="h-1.5 w-10 rounded-full bg-muted-foreground/40" />
                        <div className="h-1.5 w-full rounded-full bg-foreground/25" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-16 items-center justify-center rounded-md bg-emerald-500/15 text-xl font-bold text-emerald-600 dark:text-emerald-400">
                    54
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div className="h-1.5 w-3/4 rounded-full bg-border" />
                    <div className="h-1.5 w-2/3 rounded-full bg-border" />
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                      <div className="h-full w-1/3 rounded-full bg-emerald-500/80" />
                    </div>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="h-3 w-full rounded-sm bg-primary/80" />
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 rounded-full bg-border" />
                    <div className="h-2.5 w-8 rounded-full bg-amber-500/70" />
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-border" />
                  <div className="h-3 w-full rounded-sm bg-primary/20" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-semibold">{t('premiumReport.previewTitle')}</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                {t('premiumReport.previewNote')}
              </p>
              <Button asChild className="h-11 w-full gap-2">
                <a href={EXAMPLE_PDF_URL} download>
                  <Download size={17} weight="bold" />
                  {t('premiumReport.downloadCta')}
                </a>
              </Button>
              <p className="text-xs leading-5 text-muted-foreground">
                {t('premiumReport.downloadNote')}
              </p>
              <p className="text-xs font-semibold text-foreground">
                {t('premiumReport.priceNote')}
              </p>
            </div>
          </div>

          {/* Table of contents (index) */}
          <nav aria-labelledby="premium-report-index" className="mb-8">
            <h2 id="premium-report-index" className="mb-4 text-2xl font-bold">
              {t('premiumReport.indexTitle')}
            </h2>
            <ol className="grid gap-2 sm:grid-cols-2">
              {contents.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#section-${section.id}`}
                    className="flex items-baseline gap-3 rounded-lg border border-border/70 bg-card px-4 py-3 text-sm transition-colors hover:border-primary/40 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                  >
                    <span className="font-bold text-primary">{section.number}.</span>
                    <span className="font-semibold text-foreground">{section.title}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {/* Section-by-section detail with mini previews */}
          <div className="mb-12 space-y-4">
            {contents.map((section) => (
              <section
                key={section.id}
                id={`section-${section.id}`}
                aria-labelledby={`section-${section.id}-title`}
                className="grid gap-4 rounded-xl border border-border/70 bg-card p-5 sm:grid-cols-[minmax(0,1fr)_220px] sm:items-center"
              >
                <div>
                  <h3 id={`section-${section.id}-title`} className="mb-2 text-lg font-semibold">
                    <span className="mr-2 text-primary">{section.number}.</span>
                    {section.title}
                  </h3>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {section.description}
                  </p>
                </div>
                <SectionMock sectionId={section.id} label={section.previewAlt} />
              </section>
            ))}
          </div>

          {/* CTA to the calculator */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-8 text-center">
            <FilePdf size={28} weight="bold" className="mx-auto mb-3 text-primary" />
            <h2 className="mb-3 text-2xl font-bold">
              {t('premiumReport.ctaTitle')}
            </h2>
            <p className="mb-6 text-muted-foreground">
              {t('premiumReport.ctaBody')}
            </p>
            <Link
              to={language === 'en' ? '/en' : '/'}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {t('premiumReport.ctaButton')}
              <ArrowRight size={16} weight="bold" />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default PremiumReportPage;
