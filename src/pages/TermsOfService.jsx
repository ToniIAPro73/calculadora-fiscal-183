import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Scale, CreditCard, AlertCircle, CheckCircle2 } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto px-6 py-16 w-full">
        <div className="mb-12 border-b border-border pb-8 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Términos de <span className="text-primary">Servicio</span>
          </h1>
          <div className="flex items-center justify-center md:justify-start gap-2 text-primary font-medium">
            <CheckCircle2 className="w-5 h-5" />
            <span>Audit-Ready Standard 2026</span>
          </div>
        </div>

        <div className="space-y-12 max-w-4xl">
          <section className="relative p-8 rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <Scale className="w-24 h-24" />
            </div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Scale className="w-6 h-6 text-primary" /> 1. Propósito y Limitación Legal
            </h2>
            <p className="text-lg leading-relaxed text-foreground/80">
              Esta es una herramienta de utilidad técnica. El informe generado es un resumen de procesamiento de datos para apoyo al cumplimiento fiscal. <strong>No constituye, bajo ninguna circunstancia, asesoramiento legal o fiscal oficial</strong>.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="p-8 rounded-2xl border border-border bg-muted/10">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-primary" /> 2. Política de Venta
              </h2>
              <p className="text-sm">
                El Informe Premium tiene un coste de <strong>9,99 €</strong>. Al ser un producto digital de entrega inmediata y descarga instantánea, todas las ventas son finales y no se admiten reembolsos.
              </p>
            </section>

            <section className="p-8 rounded-2xl border border-destructive/20 bg-destructive/5">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-3 text-destructive">
                <AlertCircle className="w-6 h-6" /> 3. Responsabilidad
              </h2>
              <p className="text-sm italic">
                El usuario asume la responsabilidad total de los datos introducidos. Se recomienda validar este informe con un asesor fiscal oficial antes de cualquier trámite administrativo.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;