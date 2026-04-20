import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileText, Lock, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const UserDetailsModal = ({ isOpen, onClose, onConfirm, userData, setUserData, isLoading }) => {
  const { language, t } = useLanguage();

  const documentTypes = [
    { value: 'passport', label: t('userDetails.documentTypePassport') },
    { value: 'nie', label: t('userDetails.documentTypeNie') },
  ];

  const selectedDocumentLabel = userData.documentType === 'nie'
    ? t('userDetails.documentTypeNie')
    : t('userDetails.documentTypePassport');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl">
        <DialogHeader>
          <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <FileText className="text-primary w-6 h-6" />
          </div>
          <DialogTitle className="text-2xl font-black text-center">
            {t('userDetails.title')}
          </DialogTitle>
          <DialogDescription className="text-center italic">
            {t('userDetails.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase opacity-60">{t('userDetails.nameLabel')}</Label>
            <Input
              placeholder="Ej. Juan Pérez García"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              className="rounded-xl border-muted bg-muted/30"
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
                      "flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition-all",
                      isSelected
                        ? "border-primary bg-primary/10 text-primary shadow-sm"
                        : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    )}
                  >
                    {isSelected && <Check className="h-4 w-4" />}
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
              className="rounded-xl border-muted bg-muted/30"
            />
          </div>
          <p className="text-[11px] text-muted-foreground">
            {t('userDetails.note')}
          </p>
        </div>

        <DialogFooter>
          <Button
            onClick={onConfirm}
            disabled={isLoading || !userData.name || !userData.taxId}
            className="w-full rounded-full h-12 font-bold text-base shadow-lg gap-2"
          >
            <Lock className="w-4 h-4" />
            {isLoading
              ? t('userDetails.redirecting')
              : `${t('userDetails.confirm')} · 9,99 €`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;
