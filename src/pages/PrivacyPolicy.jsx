import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ShieldCheck, Eye, Lock, Mail } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 max-w-5xl mx-auto px-6 py-16 w-full">
        {/* Hero Section Legal */}
        <div className="mb-12 border-b border-border pb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Política de <span className="text-primary">Privacidad</span>
          </h1>
          <p className="text-muted-foreground text-lg italic">
            Tu confianza es nuestro mayor activo. Transparencia total sobre tus datos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Columna Izquierda: Resumen Rápido */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 sticky top-24">
              <h3 className="font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" /> Resumen Premium
              </h3>
              <ul className="space-y-4 text-sm">
                <li className="flex gap-3">
                  <Lock className="w-4 h-4 text-primary shrink-0" />
                  <span><strong>Pagos Seguros:</strong> Procesados 100% por Stripe. No vemos tu tarjeta.</span>
                </li>
                <li className="flex gap-3">
                  <Eye className="w-4 h-4 text-primary shrink-0" />
                  <span><strong>Uso Mínimo:</strong> Solo procesamos fechas para tus cálculos.</span>
                </li>
                <li className="flex gap-3">
                  <Mail className="w-4 h-4 text-primary shrink-0" />
                  <span><strong>Soporte Directo:</strong> antonio@anclora.com</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Columna Derecha: Texto Detallado */}
          <div className="lg:col-span-8 space-y-10 text-foreground/80 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">1. Recopilación de Datos Técnicos</h2>
              <p>
                Recopilamos exclusivamente los rangos de fechas introducidos para el cálculo de presencia física. Esta información se procesa mediante algoritmos avanzados para garantizar la precisión del informe PDF.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">2. Integración con Google AdSense</h2>
              <p>
                Como parte de nuestra monetización, utilizamos Google AdSense. Google utiliza cookies para mostrar anuncios personalizados. Puedes gestionar estas preferencias en la configuración de privacidad de tu navegador o en la cuenta de Google.
              </p>
            </section>

            <section className="p-8 rounded-3xl bg-muted/20 border border-border">
              <h2 className="text-xl font-bold text-foreground mb-3">Compromiso 2026</h2>
              <p className="text-sm italic">
                Nos comprometemos a no vender, alquilar ni compartir tu información personal con terceros para fines publicitarios. Tu informe es privado y de tu propiedad.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;