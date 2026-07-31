import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router';
import { toast } from 'sonner';
import {
  ArrowSquareOut,
  CalendarPlus,
  CheckCircle,
  ClockCountdown,
  Eraser,
  FilePdf,
  Flask,
  ShareNetwork,
  ShieldCheck,
  WarningCircle,
} from '@phosphor-icons/react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import DateRangeSelector from '@/components/DateRangeSelector.jsx';
import RangeList from '@/components/RangeList.jsx';
import YearCalendarHeatmap from '@/components/YearCalendarHeatmap.jsx';
import ProgressBar from '@/components/ProgressBar.jsx';
import RemainingDaysCountdown from '@/components/RemainingDaysCountdown.jsx';
import RiskGauge from '@/components/RiskGauge.jsx';
import DataAuthoritySection from '@/components/DataAuthoritySection.jsx';
import EconomicInterestsPanel from '@/components/EconomicInterestsPanel.jsx';
import TaxTreatiesPanel from '@/components/TaxTreatiesPanel.jsx';
import SavedScenariosPanel from '@/components/SavedScenariosPanel.jsx';
import OnboardingWizard from '@/components/OnboardingWizard.jsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/hooks/useLanguage.js';
import { mergeDateRanges, calculateUniqueDays } from '@/lib/dateRangeMerger.js';
import { calculateScenarioComparison, getRiskLevel } from '@/lib/fiscalSummary.js';
import {
  clearEconomicInterests,
  evaluateEconomicInterests,
  loadEconomicInterests,
  saveEconomicInterests,
} from '@/lib/economicInterests.js';
import {
  clearSecondCountry,
  loadSecondCountry,
  saveSecondCountry,
} from '@/lib/taxTreaties.js';
import {
  loadScenarioState,
  loadSelectedFiscalYear,
  loadStayRanges,
  saveScenarioState,
  saveSelectedFiscalYear,
  saveStayRanges,
} from '@/lib/stayRangesStorage.js';
import {
  addSavedScenario,
  loadSavedScenarios,
  removeSavedScenario,
} from '@/lib/savedScenarios.js';
import {
  buildShareUrl,
  clearShareParamFromUrl,
  copyTextToClipboard,
  decodeShareState,
  encodeShareState,
  readShareParam,
} from '@/lib/shareScenario.js';
import { buildExampleReportPayload } from '@/lib/reportMetadata.js';
import { isAdvisorCheckoutAvailable, sanitizeAdvisorBranding } from '@/lib/advisorReport.js';
import { getCanonicalUrl, getDefaultUrl } from '@/lib/seo.js';
import { SeoAppSchema } from '@/components/SeoAppSchema';
import FaqSection from '@/components/FaqSection.jsx';
import { buildFaqSchema, getLocalizedFaq } from '@/lib/faqData.js';

const UserDetailsModal = lazy(() => import('@/components/UserDetailsModal.jsx'));

const TaxNomadCalculator = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [fiscalYear, setFiscalYear] = useState(() => loadSelectedFiscalYear(new Date().getFullYear()));
  const [selectedRanges, setSelectedRanges] = useState(() => loadStayRanges(loadSelectedFiscalYear(new Date().getFullYear())));
  const [editingRangeIndex, setEditingRangeIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRangeModalOpen, setIsRangeModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [userData, setUserData] = useState({ name: '', email: '', documentType: 'passport', taxId: '', isAdvisor: false, advisorName: '', advisorLogo: '' });
  const [scenarioRanges, setScenarioRanges] = useState(() => loadScenarioState(loadSelectedFiscalYear(new Date().getFullYear())).ranges);
  const [scenarioEnabled, setScenarioEnabled] = useState(() => loadScenarioState(loadSelectedFiscalYear(new Date().getFullYear())).enabled);
  const [editingScenarioIndex, setEditingScenarioIndex] = useState(null);
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false);
  const [economicInterests, setEconomicInterests] = useState(() => loadEconomicInterests());
  const [secondCountry, setSecondCountry] = useState(() => loadSecondCountry());
  const [savedScenarios, setSavedScenarios] = useState(() => loadSavedScenarios(loadSelectedFiscalYear(new Date().getFullYear())));

  // Persist both range sets locally (browser only, never sent to any server)
  useEffect(() => {
    saveStayRanges(fiscalYear, selectedRanges);
  }, [fiscalYear, selectedRanges]);

  // Questionnaire answers also stay local-only (browser, never a server)
  useEffect(() => {
    saveEconomicInterests(economicInterests);
  }, [economicInterests]);

  useEffect(() => {
    saveScenarioState(fiscalYear, { enabled: scenarioEnabled, ranges: scenarioRanges });
  }, [fiscalYear, scenarioEnabled, scenarioRanges]);

  useEffect(() => {
    saveSelectedFiscalYear(fiscalYear);
  }, [fiscalYear]);

  // Restore a shared calculation from the URL (?s=...) once on mount, then
  // clean the param so the address bar and analytics stay tidy.
  useEffect(() => {
    const encoded = readShareParam();
    if (!encoded) return undefined;

    let cancelled = false;
    decodeShareState(encoded).then((shared) => {
      clearShareParamFromUrl();
      if (cancelled) return;

      if (!shared) {
        toast.error(t('share.invalid'));
        return;
      }

      setFiscalYear(shared.fiscalYear);
      setSelectedRanges(shared.stayRanges);
      setScenarioRanges(shared.scenarioRanges);
      setScenarioEnabled(shared.scenarioEnabled);
      setEditingRangeIndex(null);
      setEditingScenarioIndex(null);
      toast.success(t('share.loaded'));
    });

    return () => {
      cancelled = true;
    };
    // Run only on mount: the share param is consumed exactly once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { merged, annotatedRanges } = mergeDateRanges(selectedRanges);
  const totalDays = calculateUniqueDays(merged);
  const LIMIT = 183;
  const remaining = Math.max(LIMIT - totalDays, 0);
  const percentage = Math.min((totalDays / LIMIT) * 100, 100);
  const canonicalUrl = getCanonicalUrl(null); // Home page uses root canonical https://www.regla183.com/

  const scenarioComparison = calculateScenarioComparison(selectedRanges, scenarioRanges);
  const scenarioActive = scenarioEnabled && scenarioRanges.length > 0;
  const projected = scenarioComparison.projected;

  const economicInterestsEvaluation = evaluateEconomicInterests(economicInterests);

  const handleEconomicInterestChange = (questionId, optionId) => {
    setEconomicInterests(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleEconomicInterestsReset = () => {
    clearEconomicInterests();
    setEconomicInterests({});
  };

  // Second-country selection also stays local-only (browser, never a server)
  const handleSecondCountryChange = (value) => {
    if (value === 'none') {
      clearSecondCountry();
      setSecondCountry(null);
      return;
    }
    saveSecondCountry(value);
    setSecondCountry(value);
  };

  // FAQ JSON-LD matches the visible accordion exactly (buildFaqSchema feeds
  // from the same localized strings as <FaqSection page="home" />).
  const faqSchema = buildFaqSchema(getLocalizedFaq(language, 'home'));

  const toStatusObj = (days) => {
    const color = getRiskLevel(days);
    return {
      color,
      label: color === 'safe'
        ? t('progress.safe')
        : color === 'warning'
        ? t('progress.approaching')
        : t('progress.over'),
    };
  };

  const statusObj = toStatusObj(totalDays);
  const projectedStatusObj = toStatusObj(projected.totalDays);

  const handleAddScenarioRange = (range) => {
    setScenarioRanges(prev => [...prev, range]);
  };

  const handleRemoveScenarioRange = (index) => {
    setScenarioRanges(prev => prev.filter((_, i) => i !== index));
    setEditingScenarioIndex((currentIndex) => {
      if (currentIndex === null) return null;
      if (currentIndex === index) return null;
      return currentIndex > index ? currentIndex - 1 : currentIndex;
    });
  };

  const handleEditScenarioRange = (index) => {
    setEditingScenarioIndex(index);
    setIsScenarioModalOpen(true);
  };

  const handleUpdateScenarioRange = (index, nextRange) => {
    setScenarioRanges(prev => prev.map((range, currentIndex) => (
      currentIndex === index ? nextRange : range
    )));
    setEditingScenarioIndex(null);
  };

  const handleClearScenario = () => {
    setScenarioRanges([]);
    setEditingScenarioIndex(null);
  };

  const handleSaveScenario = (name) => {
    const result = addSavedScenario(fiscalYear, { name, ranges: scenarioRanges });

    if (result.status === 'saved') {
      setSavedScenarios(loadSavedScenarios(fiscalYear));
      toast.success(t('savedScenarios.saved'));
      return true;
    }

    if (result.status === 'limit') {
      toast.error(t('savedScenarios.limitReached'));
    } else if (result.status === 'invalid-name') {
      toast.error(t('savedScenarios.invalidName'));
    } else {
      toast.error(t('savedScenarios.nothingToSave'));
    }

    return false;
  };

  const handleLoadSavedScenario = (scenarioId) => {
    const scenario = savedScenarios.find((entry) => entry.id === scenarioId);
    if (!scenario) return;

    setScenarioRanges(scenario.ranges);
    setScenarioEnabled(true);
    setEditingScenarioIndex(null);
    toast.success(t('savedScenarios.loaded'));
  };

  const handleDeleteSavedScenario = (scenarioId) => {
    removeSavedScenario(fiscalYear, scenarioId);
    setSavedScenarios(loadSavedScenarios(fiscalYear));
    toast.success(t('savedScenarios.deleted'));
  };

  const handleShareCalculation = async () => {
    const encoded = await encodeShareState({
      fiscalYear,
      stayRanges: selectedRanges,
      scenarioEnabled,
      scenarioRanges,
    });
    const shareUrl = buildShareUrl(encoded, `${window.location.origin}${window.location.pathname}`);
    const copied = await copyTextToClipboard(shareUrl);

    if (copied) {
      toast.success(t('share.copied'));
    } else {
      toast.error(t('share.copyError'));
    }

    if (typeof window.taxNomadTrack === 'function') {
      window.taxNomadTrack('calculation_shared', { fiscal_year: fiscalYear });
    }
  };

  const handleAddRange = (range) => {
    setSelectedRanges(prev => [...prev, range]);
    // Track conversion event
    if (typeof window.taxNomadTrack === 'function') {
      window.taxNomadTrack('range_added', { total_ranges: selectedRanges.length + 1 });
    }
  };

  const handleRemoveRange = (index) => {
    setSelectedRanges(prev => prev.filter((_, i) => i !== index));
    // Track conversion event
    if (typeof window.taxNomadTrack === 'function') {
      window.taxNomadTrack('range_removed', { total_ranges: Math.max(selectedRanges.length - 1, 0) });
    }
    setEditingRangeIndex((currentIndex) => {
      if (currentIndex === null) return null;
      if (currentIndex === index) return null;
      return currentIndex > index ? currentIndex - 1 : currentIndex;
    });
  };

  const handleEditRange = (index) => {
    setEditingRangeIndex(index);
    setIsRangeModalOpen(true);
  };

  const handleFiscalYearChange = (value) => {
    const nextYear = Number(value);
    if (nextYear === fiscalYear) return;
    setFiscalYear(nextYear);
    setSelectedRanges(loadStayRanges(nextYear));
    const nextScenarioState = loadScenarioState(nextYear);
    setScenarioRanges(nextScenarioState.ranges);
    setScenarioEnabled(nextScenarioState.enabled);
    setSavedScenarios(loadSavedScenarios(nextYear));
    setEditingRangeIndex(null);
    setEditingScenarioIndex(null);
  };

  const fiscalYearOptions = Array.from(
    { length: new Date().getFullYear() - 2015 + 1 },
    (_, i) => new Date().getFullYear() - i,
  );

  const handleUpdateRange = (index, nextRange) => {
    setSelectedRanges(prev => prev.map((range, currentIndex) => (
      currentIndex === index ? nextRange : range
    )));
    setEditingRangeIndex(null);
  };

  const handleOpenExample = async () => {
    const previewWindow = window.open('about:blank', '_blank');
    const example = buildExampleReportPayload();

    try {
      const { generateTaxReport } = await import('@/lib/generatePdf.js');
      const doc = await generateTaxReport({
        name: example.name,
        documentType: example.documentType,
        taxId: example.taxId,
        totalDays: example.totalDays,
        ranges: example.ranges,
        fiscalYear: example.fiscalYear,
        language,
        exampleMode: true,
        economicInterests: example.economicInterests,
        savedScenarios: example.savedScenarios,
      });

      const blobUrl = doc.output('bloburl');

      if (previewWindow && !previewWindow.closed) {
        previewWindow.opener = null;
        previewWindow.location.href = blobUrl;
      } else {
        window.open(blobUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      previewWindow?.close();
      toast.error('No se pudo generar el ejemplo del PDF.');
      console.error('Example PDF generation error:', error);
    }
  };

  const handleConfirmPurchase = async () => {
    setIsProcessing(true);

    // Track checkout initiated event
    if (typeof window.taxNomadTrack === 'function') {
      window.taxNomadTrack('checkout_initiated', { total_days: totalDays, price: '9.99', currency: 'EUR' });
    }

    // Advisor option (Mejora 15): only honored when the feature flag and the
    // Stripe Price are configured; the firm branding stays local-only.
    const advisorRequested = isAdvisorCheckoutAvailable(import.meta.env) && Boolean(userData.isAdvisor);
    const advisorBranding = advisorRequested
      ? sanitizeAdvisorBranding({ name: userData.advisorName, logo: userData.advisorLogo })
      : null;

    // Persist session data so payment & success pages can access it
    const sessionData = {
      name: userData.name,
      email: userData.email,
      documentType: userData.documentType,
      taxId: userData.taxId,
      language,
      totalDays,
      statusLabel: statusObj.label,
      fiscalYear,
      ranges: selectedRanges.map(r => ({
        start: r.start instanceof Date ? r.start.toISOString() : r.start,
        end:   r.end   instanceof Date ? r.end.toISOString()   : r.end,
        days:  r.days,
      })),
      uniqueRanges: merged.map(r => ({
        start: r.start instanceof Date ? r.start.toISOString() : r.start,
        end:   r.end   instanceof Date ? r.end.toISOString()   : r.end,
        days:  r.days,
      })),
      // Questionnaire answers travel only inside this browser session so the
      // paid PDF can include them; they are NOT sent to the checkout API.
      ...(economicInterestsEvaluation.complete
        ? { economicInterests: { ...economicInterests } }
        : {}),
      // Saved scenarios also stay local-only (sessionStorage) so the paid PDF
      // can render the comparison table; never sent to the checkout API.
      ...(savedScenarios.length >= 2
        ? {
            savedScenarios: savedScenarios.map((scenario) => ({
              name: scenario.name,
              ranges: scenario.ranges.map((r) => ({
                start: r.start instanceof Date ? r.start.toISOString() : r.start,
                end:   r.end   instanceof Date ? r.end.toISOString()   : r.end,
              })),
            })),
          }
        : {}),
      // Advisor branding (firm name + logo data URL) travels only inside this
      // browser session so the paid PDF can brand its header; only the
      // `advisor` boolean is sent to the checkout API to pick the Price.
      ...(advisorBranding ? { advisor: advisorBranding } : {}),
    };
    sessionStorage.setItem('taxnomad_session', JSON.stringify(sessionData));

    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:        userData.name,
          email:       userData.email,
          documentType: userData.documentType,
          taxId:       userData.taxId,
          language,
          totalDays,
          statusLabel: statusObj.label,
          fiscalYear,
          advisor:     advisorRequested,
          ranges: selectedRanges.map(r => ({
            start: r.start instanceof Date ? r.start.toISOString() : r.start,
            end:   r.end   instanceof Date ? r.end.toISOString()   : r.end,
            days:  r.days,
          })),
        }),
      });

      if (!res.ok) throw new Error('API error');

      const { url } = await res.json();

      setIsModalOpen(false);
      setIsProcessing(false);

      if (url.startsWith('http')) {
        window.location.href = url; // Real Stripe hosted page
      } else {
        navigate(url);              // Internal mock route (the API returns the language-prefixed path)
      }
    } catch (error) {
      setIsModalOpen(false);
      setIsProcessing(false);

      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        navigate(`${language === 'en' ? '/en' : '/es'}/payment-mock`);
        return;
      }

      console.error('Checkout creation error:', error);
      toast.error(t('toast.checkoutUnavailable'));
    }
  };

  return (
    <>
      <SeoAppSchema />
      <Helmet>
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="alternate" hrefLang="es" href={getCanonicalUrl('es')} />
        <link rel="alternate" hrefLang="en" href={getCanonicalUrl('en')} />
        <link rel="alternate" hrefLang="x-default" href={getCanonicalUrl('es')} />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <DateRangeSelector
        fiscalYear={fiscalYear}
        ranges={selectedRanges}
        onAddRange={handleAddRange}
        onUpdateRange={handleUpdateRange}
        editingRangeIndex={editingRangeIndex}
        onEditingHandled={() => setEditingRangeIndex(null)}
        isOpen={isRangeModalOpen}
        setIsOpen={setIsRangeModalOpen}
      />

      <DateRangeSelector
        fiscalYear={fiscalYear}
        ranges={scenarioRanges}
        onAddRange={handleAddScenarioRange}
        onUpdateRange={handleUpdateScenarioRange}
        editingRangeIndex={editingScenarioIndex}
        onEditingHandled={() => setEditingScenarioIndex(null)}
        isOpen={isScenarioModalOpen}
        setIsOpen={setIsScenarioModalOpen}
        allowFutureDates
        modalTitle={t('scenario.modalTitle')}
        modalDescription={t('scenario.modalDescription')}
        editRangeTitle={t('scenario.editRange')}
      />

      <div className="relative flex min-h-[100dvh] flex-col bg-background pb-[calc(5.75rem+env(safe-area-inset-bottom))] lg:pb-0">
        <Header
          totalDays={totalDays}
          onOpenModal={() => setIsModalOpen(true)}
          onOpenExample={handleOpenExample}
        />

        <main className="flex-1">
          <section className="premium-section pb-6 pt-6 md:pt-10">
            <div className="grid items-start gap-6">
              <div className="space-y-6 animate-fade-in-up">
                <div className="trust-panel p-5 sm:p-7">
                  <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px] xl:items-end">
                    <div className="space-y-4">
                      <span className="premium-eyebrow">
                        <ShieldCheck size={12} weight="fill" className="mr-2" />
                        {t('dashboard.eyebrow')}
                      </span>
                      <div className="max-w-3xl space-y-4">
                        <h1 className="text-4xl font-[700] tracking-tight text-foreground sm:text-5xl xl:text-6xl">
                          {t('header.title')}
                        </h1>
                        <p className="max-w-[68ch] text-base leading-7 text-muted-foreground sm:text-lg">
                          {t('dashboard.intro')}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-xl border border-border bg-muted/40 p-4">
                      <label htmlFor="fiscal-year" className="field-label">
                        {t('fiscalYear.label')}
                      </label>
                      <div className="mt-3 flex items-center gap-3">
                        <Select
                          value={String(fiscalYear)}
                          onValueChange={handleFiscalYearChange}
                        >
                          <SelectTrigger
                            id="fiscal-year"
                            className="h-11 w-36 rounded-md border-input bg-background text-base font-semibold text-foreground focus:ring-ring/35"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {fiscalYearOptions.map((year) => (
                              <SelectItem key={year} value={String(year)}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs leading-5 text-muted-foreground">
                          {t('fiscalYear.helper')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { label: t('stats.totalDays'), value: `${totalDays}`, projectedValue: `${projected.totalDays}`, icon: ClockCountdown, helper: t('dashboard.totalHelper') },
                    { label: t('stats.remainingDays'), value: `${remaining}`, projectedValue: `${projected.remainingDays}`, icon: ShieldCheck, helper: t('dashboard.remainingHelper') },
                    { label: t('stats.limitUsage'), value: `${percentage.toFixed(1)}%`, projectedValue: `${projected.percentageUsed.toFixed(1)}%`, icon: ArrowSquareOut, helper: statusObj.label },
                  ].map(({ label, value, projectedValue, icon: Icon, helper }) => (
                    <div key={label} className="trust-panel reveal-surface p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1.5">
                          <p className="field-label">{label}</p>
                          <p className="text-3xl font-[700] tracking-tight text-foreground">{value}</p>
                          {scenarioActive && (
                            <p className="text-xs font-semibold text-[hsl(var(--warning-strong))]">
                              {t('scenario.withScenario')}: {projectedValue}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">{helper}</p>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-md border border-primary/15 bg-primary/10">
                          <Icon size={19} weight="bold" className="text-primary" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                  <div className="space-y-4">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingRangeIndex(null);
                        setIsRangeModalOpen(true);
                      }}
                      className="group flex w-full items-center justify-between gap-5 rounded-xl border border-dashed border-primary/35 bg-primary/[0.08] p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/60 hover:bg-primary/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                          <CalendarPlus size={22} weight="bold" />
                        </div>
                        <div>
                          <h2 className="text-lg font-semibold text-foreground">
                            {selectedRanges.length > 0 ? t('dateSelector.addAnotherRange') : t('dateSelector.title')}
                          </h2>
                          <p className="mt-1 text-sm leading-6 text-muted-foreground">
                            {t('dateSelector.description')}
                          </p>
                        </div>
                      </div>
                      <ArrowSquareOut size={18} weight="bold" className="hidden text-primary transition-transform duration-200 group-hover:translate-x-0.5 sm:block" />
                    </button>

                    <RangeList
                      ranges={annotatedRanges}
                      onRemoveRange={handleRemoveRange}
                      onEditRange={handleEditRange}
                    />

                    {selectedRanges.length === 0 && (
                      <div className="trust-panel p-5">
                        <div className="flex gap-3">
                          <WarningCircle size={20} weight="fill" className="mt-0.5 shrink-0 text-[hsl(var(--warning-strong))]" />
                          <div>
                            <p className="text-sm font-semibold text-foreground">{t('dashboard.emptyTitle')}</p>
                            <p className="mt-1 text-sm leading-6 text-muted-foreground">{t('dashboard.emptyDescription')}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <YearCalendarHeatmap
                      fiscalYear={fiscalYear}
                      realRanges={selectedRanges}
                      scenarioRanges={scenarioRanges}
                      scenarioActive={scenarioActive}
                    />

                    <section
                      aria-labelledby="scenario-simulator-heading"
                      className="trust-panel space-y-4 border-dashed border-[hsl(var(--warning)/0.45)] bg-[hsl(var(--warning)/0.04)] p-5"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-2">
                          <span className="inline-flex items-center gap-2 rounded-full border border-dashed border-[hsl(var(--warning)/0.45)] bg-[hsl(var(--warning)/0.1)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[hsl(var(--warning-strong))]">
                            <Flask size={13} weight="fill" />
                            {t('scenario.eyebrow')}
                          </span>
                          <h2 id="scenario-simulator-heading" className="text-lg font-semibold text-foreground">
                            {t('scenario.title')}
                          </h2>
                          <p className="max-w-[62ch] text-sm leading-6 text-muted-foreground">
                            {t('scenario.description')}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <label
                            htmlFor="scenario-toggle"
                            className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                          >
                            {t('scenario.toggleLabel')}
                          </label>
                          <Switch
                            id="scenario-toggle"
                            checked={scenarioEnabled}
                            onCheckedChange={setScenarioEnabled}
                            aria-label={t('scenario.toggleLabel')}
                          />
                        </div>
                      </div>

                      {!scenarioEnabled && scenarioRanges.length > 0 && (
                        <p role="status" className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs leading-5 text-muted-foreground">
                          {t('scenario.inactiveHint')}
                        </p>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setEditingScenarioIndex(null);
                          setIsScenarioModalOpen(true);
                        }}
                        className="group flex w-full items-center justify-between gap-5 rounded-xl border border-dashed border-[hsl(var(--warning)/0.45)] bg-[hsl(var(--warning)/0.08)] p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[hsl(var(--warning)/0.7)] hover:bg-[hsl(var(--warning)/0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[hsl(var(--warning)/0.18)] text-[hsl(var(--warning-strong))]">
                            <CalendarPlus size={20} weight="bold" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{t('scenario.addRange')}</p>
                            <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{t('scenario.modalDescription')}</p>
                          </div>
                        </div>
                        <ArrowSquareOut size={16} weight="bold" className="hidden shrink-0 text-[hsl(var(--warning-strong))] transition-transform duration-200 group-hover:translate-x-0.5 sm:block" />
                      </button>

                      {scenarioRanges.length === 0 && (
                        <p className="text-xs leading-5 text-muted-foreground">{t('scenario.emptyHint')}</p>
                      )}

                      <RangeList
                        ranges={scenarioRanges}
                        onRemoveRange={handleRemoveScenarioRange}
                        onEditRange={handleEditScenarioRange}
                        variant="scenario"
                        title={t('scenario.title')}
                      />

                      {scenarioActive && (
                        <div
                          role="status"
                          className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-lg border border-dashed border-[hsl(var(--warning)/0.45)] bg-[hsl(var(--warning)/0.08)] px-4 py-3 text-sm"
                        >
                          <span className="text-muted-foreground">
                            {t('scenario.currentLabel')}: <strong className="text-foreground">{totalDays} {t('dateSelector.days')}</strong>
                          </span>
                          <span className="font-semibold text-[hsl(var(--warning-strong))]">
                            {t('scenario.withScenario')}: {projected.totalDays} {t('dateSelector.days')}
                            {scenarioComparison.addedDays > 0 && ` (+${scenarioComparison.addedDays})`}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={handleClearScenario}
                          disabled={scenarioRanges.length === 0}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-input bg-background px-4 text-xs font-bold uppercase tracking-wide text-foreground transition-colors duration-200 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Eraser size={16} weight="bold" />
                          {t('scenario.clear')}
                        </button>
                      </div>
                    </section>

                    <SavedScenariosPanel
                      scenarios={savedScenarios}
                      currentRanges={selectedRanges}
                      canSave={scenarioRanges.length > 0}
                      onSave={handleSaveScenario}
                      onLoad={handleLoadSavedScenario}
                      onDelete={handleDeleteSavedScenario}
                    />

                    <DataAuthoritySection />
                  </div>

                  <div className="space-y-4 xl:sticky xl:top-28">
                    <RemainingDaysCountdown
                      totalDays={totalDays}
                      ranges={selectedRanges}
                      fiscalYear={fiscalYear}
                    />

                    <div className="trust-panel p-5">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between gap-3">
                          <span className="premium-eyebrow">{t('dashboard.statusEyebrow')}</span>
                          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                            statusObj.color === 'safe'
                              ? 'border-[hsl(var(--success)/0.22)] bg-[hsl(var(--success)/0.1)] text-[hsl(var(--success-strong))]'
                              : statusObj.color === 'warning'
                              ? 'border-[hsl(var(--warning)/0.28)] bg-[hsl(var(--warning)/0.13)] text-[hsl(var(--warning-strong))]'
                              : 'border-[hsl(var(--destructive)/0.25)] bg-[hsl(var(--destructive)/0.12)] text-[hsl(var(--destructive-strong))]'
                          }`}>
                            {statusObj.color === 'safe' ? <CheckCircle size={14} weight="fill" /> : <WarningCircle size={14} weight="fill" />}
                            {statusObj.label}
                          </span>
                        </div>

                        <RiskGauge
                          totalDays={totalDays}
                          projectedDays={scenarioActive ? projected.totalDays : undefined}
                          onOpenPayment={() => setIsModalOpen(true)}
                          paymentDisabled={totalDays <= 0}
                        />

                        <ProgressBar totalDays={totalDays} projectedDays={scenarioActive ? projected.totalDays : undefined} />

                        {scenarioActive && (
                          <div
                            role="status"
                            className="flex items-center justify-between gap-3 rounded-lg border border-dashed border-[hsl(var(--warning)/0.45)] bg-[hsl(var(--warning)/0.08)] px-3.5 py-2.5"
                          >
                            <span className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--warning-strong))]">
                              {t('scenario.withScenario')}
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[hsl(var(--warning-strong))]">
                              {projectedStatusObj.color === 'safe' ? <CheckCircle size={14} weight="fill" /> : <WarningCircle size={14} weight="fill" />}
                              {projected.totalDays}/183 · {projectedStatusObj.label}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <EconomicInterestsPanel
                      answers={economicInterests}
                      onChange={handleEconomicInterestChange}
                      onReset={handleEconomicInterestsReset}
                    />

                    <TaxTreatiesPanel
                      selection={secondCountry}
                      onChange={handleSecondCountryChange}
                    />

                    <button
                      type="button"
                      onClick={handleShareCalculation}
                      aria-label={t('share.button')}
                      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                    >
                      <ShareNetwork size={18} weight="bold" className="text-primary" />
                      {t('share.button')}
                    </button>

                    <div className="trust-panel p-5">
                      <div className="flex items-start gap-3">
                        <FilePdf size={22} weight="bold" className="mt-0.5 shrink-0 text-primary" />
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold text-foreground">{t('pdfCard.title')}</h3>
                          <p className="text-sm leading-6 text-muted-foreground">{t('pdfCard.description')}</p>
                        </div>
                      </div>

                      <div className="mt-5 space-y-2 rounded-lg border border-border bg-muted/35 p-3 text-sm">
                        <div className="flex justify-between gap-3">
                          <span className="text-muted-foreground">{t('stats.totalDays')}</span>
                          <span className="font-semibold text-foreground">{totalDays}</span>
                        </div>
                        <div className="flex justify-between gap-3">
                          <span className="text-muted-foreground">{t('stats.status')}</span>
                          <span className="font-semibold text-foreground">{statusObj.label}</span>
                        </div>
                        <div className="flex justify-between gap-3">
                          <span className="text-muted-foreground">{t('pdfCard.price')}</span>
                          <span className="font-semibold text-foreground">9,99 €</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={totalDays <= 0}
                        onClick={() => setIsModalOpen(true)}
                        className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
                      >
                        <FilePdf size={18} weight="bold" />
                        {t('actions.generatePdf')} · 9,99 €
                      </button>
                      <button
                        type="button"
                        onClick={handleOpenExample}
                        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md border border-input bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-accent"
                      >
                        <ArrowSquareOut size={16} weight="bold" />
                        {t('actions.viewExample')}
                      </button>
                      <Link
                        to={`/${language}/premium-report`}
                        className="mt-3 inline-flex w-full items-center justify-center gap-1.5 text-xs font-semibold text-muted-foreground underline-offset-4 transition-colors duration-200 hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                      >
                        {t('premiumReport.linkLabel')}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <FaqSection page="home" className="premium-section pb-10 pt-2" />
        </main>

        <Footer />

        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border/70 bg-background/88 px-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-18px_45px_-30px_rgba(15,23,42,0.75)] backdrop-blur-xl lg:hidden">
          <div className="mx-auto grid max-w-md grid-cols-[0.82fr_1.18fr] gap-2 rounded-xl border border-border/80 bg-card/90 p-2">
            <button
              type="button"
              onClick={handleOpenExample}
              className="inline-flex h-12 min-w-0 items-center justify-center gap-2 rounded-lg border border-input bg-background px-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              <ArrowSquareOut size={17} weight="bold" className="shrink-0 text-primary" />
              <span className="truncate">{t('actions.viewExample')}</span>
            </button>
            <button
              type="button"
              disabled={totalDays <= 0}
              onClick={() => setIsModalOpen(true)}
              className="inline-flex h-12 min-w-0 items-center justify-center gap-2 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none"
            >
              <FilePdf size={18} weight="bold" className="shrink-0" />
              <span className="truncate">{t('actions.generatePdf')} · 9,99 €</span>
            </button>
          </div>
        </div>

        <Suspense fallback={null}>
          <UserDetailsModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleConfirmPurchase}
            userData={userData}
            setUserData={setUserData}
            isLoading={isProcessing}
          />
        </Suspense>

        <OnboardingWizard />
      </div>
    </>
  );
};

export default TaxNomadCalculator;
