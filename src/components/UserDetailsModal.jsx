import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileText, CreditCard } from 'lucide-react';

const UserDetailsModal = ({ isOpen, onClose, onConfirm, userData, setUserData, isLoading }) => {
  const { language } = useLanguage();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl">
        <DialogHeader>
          <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <FileText className="text-primary w-6 h-6" />
          </div>
          <DialogTitle className="text-2xl font-black text-center">
            {language === 'es' ? 'Datos del Informe' : 'Report Details'}
          </DialogTitle>
          <DialogDescription className="text-center italic">
            Introduce tus datos para personalizar el PDF oficial.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase opacity-60">Nombre</Label>
            <Input
              placeholder="Ej. Juan Pérez"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              className="rounded-xl border-muted bg-muted/30"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase opacity-60">DNI / Pasaporte</Label>
            <Input
              placeholder="Ej. 12345678X"
              value={userData.taxId}
              onChange={(e) => setUserData({ ...userData, taxId: e.target.value })}
              className="rounded-xl border-muted bg-muted/30"
            />
          </div>
        </div>

        <DialogFooter>
          <Button 
            onClick={onConfirm} 
            disabled={isLoading || !userData.name || !userData.taxId}
            className="w-full rounded-full h-12 font-bold text-lg shadow-lg"
          >
            {isLoading ? "Generando..." : (language === 'es' ? "Confirmar y Descargar" : "Confirm & Download")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;