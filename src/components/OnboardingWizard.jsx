import React, { useEffect, useState } from 'react';
import { CalendarPlus, FilePdf, Gauge } from '@phosphor-icons/react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/hooks/useLanguage';
import {
  COOKIE_CONSENT_UPDATED_EVENT,
  getCookieConsent,
} from '@/lib/cookieConsent';
import {
  ONBOARDING_REPLAY_EVENT,
  ONBOARDING_TOTAL_STEPS,
  markOnboardingCompleted,
  shouldShowOnboarding,
} from '@/lib/onboarding';

const STEP_ICONS = [CalendarPlus, Gauge, FilePdf];

/**
 * First-visit guided tour: 3 steps (add stays → review result → download
 * report). Rendered as a bottom sheet so it never covers the whole screen,
 * and it waits until the cookie consent banner is resolved before opening.
 */
const OnboardingWizard = () => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Cookie consent always wins on a first visit: the tour only opens once
    // the banner has been accepted or rejected.
    const maybeOpen = () => {
      if (shouldShowOnboarding() && getCookieConsent()) {
        setStep(0);
        setOpen(true);
      }
    };

    // requestOnboardingReplay already reset the flag; if the consent banner
    // is still pending, the listener above opens the tour once it resolves.
    const handleReplay = () => {
      if (getCookieConsent()) {
        setStep(0);
        setOpen(true);
      }
    };

    maybeOpen();
    window.addEventListener(COOKIE_CONSENT_UPDATED_EVENT, maybeOpen);
    window.addEventListener(ONBOARDING_REPLAY_EVENT, handleReplay);

    return () => {
      window.removeEventListener(COOKIE_CONSENT_UPDATED_EVENT, maybeOpen);
      window.removeEventListener(ONBOARDING_REPLAY_EVENT, handleReplay);
    };
  }, []);

  const handleOpenChange = (nextOpen) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      markOnboardingCompleted();
    }
  };

  const isLastStep = step === ONBOARDING_TOTAL_STEPS - 1;
  const StepIcon = STEP_ICONS[step];
  const stepTitle = t(`onboarding.step${step + 1}Title`);
  const stepDescription = t(`onboarding.step${step + 1}Description`);
  const progressLabel = t('onboarding.progress')
    .replace('{{current}}', String(step + 1))
    .replace('{{total}}', String(ONBOARDING_TOTAL_STEPS));

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-2xl px-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-6 sm:px-8"
      >
        <div className="mx-auto w-full max-w-xl">
          <SheetHeader>
            <span className="premium-eyebrow">{t('onboarding.eyebrow')}</span>
            <SheetTitle className="flex items-center gap-3 text-xl">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <StepIcon size={20} weight="bold" />
              </span>
              {stepTitle}
            </SheetTitle>
            <SheetDescription className="text-sm leading-6">
              {stepDescription}
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground" aria-live="polite">
              {progressLabel}
            </p>
            <Progress
              value={((step + 1) / ONBOARDING_TOTAL_STEPS) * 100}
              aria-label={progressLabel}
            />
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => handleOpenChange(false)}
              className="inline-flex h-11 items-center justify-center rounded-md px-4 text-sm font-semibold text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              {t('onboarding.skip')}
            </button>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center">
              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-semibold text-foreground transition-colors duration-200 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                >
                  {t('onboarding.back')}
                </button>
              )}
              <button
                type="button"
                onClick={() => (isLastStep ? handleOpenChange(false) : setStep(step + 1))}
                className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
              >
                {isLastStep ? t('onboarding.done') : t('onboarding.next')}
              </button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default OnboardingWizard;
