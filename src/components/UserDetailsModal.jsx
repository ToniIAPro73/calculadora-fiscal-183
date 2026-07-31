import React, { useRef, useState } from 'react';
import { Link } from 'react-router';
import { useLanguage } from '@/hooks/useLanguage';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Article, Briefcase, CheckCircle, LockKey, User, X } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';
import {
  ADVISOR_LOGO_ACCEPT_ATTR,
  isAdvisorCheckoutAvailable,
  validateAdvisorLogo,
} from '@/lib/advisorReport.js';

const UserDetailsModal = ({ isOpen, onClose, onConfirm, userData, setUserData, isLoading }) => {
  const { language, t } = useLanguage();
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email || '');
  const advisorAvailable = isAdvisorCheckoutAvailable(import.meta.env);
  const isAdvisor = Boolean(userData.isAdvisor) && advisorAvailable;
  const [logoError, setLogoError] = useState(null);
  const logoInputRef = useRef(null);

  const documentTypes = [
    { value: 'passport', label: t('userDetails.documentTypePassport') },
    { value: 'nie', label: t('userDetails.documentTypeNie') },
  ];

  const selectedDocumentLabel = userData.documentType === 'nie'
    ? t('userDetails.documentTypeNie')
    : t('userDetails.documentTypePassport');

  const handleAdvisorToggle = (checked) => {
    if (!advisorAvailable) return;
    setLogoError(null);
    setUserData({ ...userData, isAdvisor: checked === true });
  };

  const handleLogoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = validateAdvisorLogo(file);
    if (validationError) {
      setLogoError(validationError);
      event.target.value = '';
      return;
    }

    setLogoError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      // The logo stays local-only (data URL in this browser session); it is
      // never uploaded and only embedded in the generated PDF header.
      setUserData({ ...userData, advisorLogo: String(reader.result || '') });
    };
    reader.readAsDataURL(file);
  };

  const handleLogoRemove = () => {
    setLogoError(null);
    setUserData({ ...userData, advisorLogo: '' });
    if (logoInputRef.current) logoInputRef.current.value = '';
  };

  const advisorNameMissing = isAdvisor && !String(userData.advisorName || '').trim();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="rounded-xl border-border bg-card p-0 sm:max-w-[760px]">
        <div className="max-h-[92dvh] overflow-y-auto px-6 py-6 sm:px-8">
        <DialogHeader className="flex-row items-center gap-4 space-y-0 text-left">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
            <Article className="text-primary" size={24} weight="light" />
          </div>
          <div className="grid gap-1">
            <DialogTitle className="text-xl font-[650] tracking-[-0.03em] sm:text-2xl">
              {t('userDetails.title')}
            </DialogTitle>
            <DialogDescription className="text-sm leading-6">
              {t('userDetails.description')}
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <section aria-label={t('userDetails.sectionPersonal')} className="space-y-4">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <User size={14} weight="bold" className="text-primary" />
              {t('userDetails.sectionPersonal')}
            </h3>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase opacity-60">{t('userDetails.nameLabel')}</Label>
              <Input
                placeholder="Ej. Juan Pérez García"
                value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                autoComplete="name"
                className="h-11 rounded-md border-input bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase opacity-60">{t('userDetails.emailLabel')}</Label>
              <Input
                type="email"
                inputMode="email"
                placeholder={t('userDetails.emailPlaceholder')}
                value={userData.email}
                onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                autoComplete="email"
                aria-invalid={Boolean(userData.email) && !isEmailValid}
                className="h-11 rounded-md border-input bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase opacity-60">{t('userDetails.documentLabel')}</Label>
              <div className="grid grid-cols-2 gap-2">
                {documentTypes.map((option) => {
                  const isSelected = userData.documentType === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setUserData({ ...userData, documentType: option.value })}
                      className={cn(
                        "flex items-center justify-center gap-2 rounded-[1.25rem] border px-3 py-3 text-sm font-semibold transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
                        isSelected
                          ? "border-primary/25 bg-primary/10 text-primary"
                          : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      )}
                    >
                      {isSelected && <CheckCircle size={16} weight="fill" />}
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase opacity-60">
                {language === 'es' ? `Número de ${selectedDocumentLabel}` : `${selectedDocumentLabel} number`}
              </Label>
              <Input
                placeholder={t('userDetails.taxIdPlaceholder')}
                value={userData.taxId}
                onChange={(e) => setUserData({ ...userData, taxId: e.target.value })}
                autoComplete="off"
                className="h-11 rounded-md border-input bg-background"
              />
            </div>
            <p className="text-[11px] leading-4 text-muted-foreground">
              {t('userDetails.note')}
            </p>
          </section>

          <section aria-label={t('userDetails.sectionAdvisor')} className="space-y-4">
            <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <Briefcase size={14} weight="bold" className="text-primary" />
              {t('userDetails.sectionAdvisor')}
            </h3>
            <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4">
              <div
                className="flex items-start gap-3"
                title={advisorAvailable ? undefined : t('userDetails.advisorComingSoon')}
              >
                <Checkbox
                  id="advisor-checkbox"
                  checked={isAdvisor}
                  onCheckedChange={handleAdvisorToggle}
                  disabled={!advisorAvailable}
                  aria-describedby="advisor-checkbox-hint"
                  className="mt-0.5"
                />
                <div className="grid gap-1">
                  <Label
                    htmlFor="advisor-checkbox"
                    className={cn(
                      "text-sm font-semibold leading-5",
                      !advisorAvailable && "cursor-not-allowed opacity-60"
                    )}
                  >
                    {t('userDetails.advisorCheckboxLabel')}
                    {!advisorAvailable && (
                      <span
                        role="note"
                        className="ml-2 inline-flex items-center rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground"
                      >
                        {t('userDetails.advisorComingSoon')}
                      </span>
                    )}
                  </Label>
                  <p id="advisor-checkbox-hint" className="text-xs leading-5 text-muted-foreground">
                    {t('userDetails.advisorCheckboxHint')}
                  </p>
                </div>
              </div>

              {isAdvisor && (
                <div className="space-y-3 border-t border-border pt-3">
                  <div className="space-y-2">
                    <Label htmlFor="advisor-name" className="text-xs font-bold uppercase opacity-60">
                      {t('userDetails.advisorNameLabel')}
                    </Label>
                    <Input
                      id="advisor-name"
                      placeholder={t('userDetails.advisorNamePlaceholder')}
                      value={userData.advisorName || ''}
                      onChange={(e) => setUserData({ ...userData, advisorName: e.target.value })}
                      autoComplete="organization"
                      aria-invalid={advisorNameMissing}
                      className="h-11 rounded-md border-input bg-background"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="advisor-logo" className="text-xs font-bold uppercase opacity-60">
                      {t('userDetails.advisorLogoLabel')}
                    </Label>
                    {userData.advisorLogo ? (
                      <div className="flex items-center gap-3 rounded-md border border-border bg-background p-2">
                        <img
                          src={userData.advisorLogo}
                          alt={userData.advisorName || t('userDetails.advisorLogoLabel')}
                          className="h-10 w-10 rounded-sm object-contain"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleLogoRemove}
                          className="ml-auto gap-1 text-xs"
                        >
                          <X size={14} weight="bold" />
                          {t('userDetails.advisorLogoRemove')}
                        </Button>
                      </div>
                    ) : (
                      <Input
                        id="advisor-logo"
                        ref={logoInputRef}
                        type="file"
                        accept={ADVISOR_LOGO_ACCEPT_ATTR}
                        onChange={handleLogoChange}
                        aria-describedby="advisor-logo-help"
                        className="h-11 rounded-md border-input bg-background text-sm file:mr-3 file:rounded-sm file:border-0 file:bg-primary/10 file:px-2 file:py-1 file:text-xs file:font-semibold file:text-primary"
                      />
                    )}
                    <p id="advisor-logo-help" className="text-[11px] leading-4 text-muted-foreground">
                      {t('userDetails.advisorLogoHelp')}
                    </p>
                    {logoError && (
                      <p role="alert" className="text-[11px] font-semibold leading-4 text-destructive">
                        {logoError === 'tooLarge'
                          ? t('userDetails.advisorLogoTooLarge')
                          : t('userDetails.advisorLogoInvalidType')}
                      </p>
                    )}
                  </div>
                  <p className="text-[11px] leading-4 text-muted-foreground">
                    {t('userDetails.advisorPrivacyNote')}
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        <DialogFooter className="mt-6 flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between sm:space-x-0">
          <Link
            to={`/${language}/premium-report`}
            className="inline-flex items-center justify-center text-xs font-semibold text-muted-foreground underline-offset-4 transition-colors hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          >
            {t('userDetails.whatsIncluded')}
          </Link>
          <Button
            onClick={onConfirm}
            disabled={isLoading || !userData.name || !isEmailValid || !userData.taxId || advisorNameMissing}
            className="h-12 w-full gap-2 text-base font-semibold sm:w-auto sm:min-w-[280px]"
          >
            <LockKey size={16} weight="bold" />
            {isLoading
              ? t('userDetails.redirecting')
              : isAdvisor
                ? t('userDetails.confirm')
                : `${t('userDetails.confirm')} · 9,99 €`}
          </Button>
        </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;
