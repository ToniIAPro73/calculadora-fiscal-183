import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import DateRangeSelector from '@/components/DateRangeSelector.jsx';
import RangeList from '@/components/RangeList.jsx';
import ProgressBar from '@/components/ProgressBar.jsx';
import SummaryCard from '@/components/SummaryCard.jsx';
import DataAuthoritySection from '@/components/DataAuthoritySection.jsx';
import AdPlaceholder from '@/components/AdPlaceholder.jsx';
import StripePaymentButton from '@/components/StripePaymentButton.jsx';
import { useLanguage } from '@/hooks/useLanguage.js';
import { mergeDateRanges, calculateUniqueDays } from '@/lib/dateRangeMerger.js';

const TaxNomadCalculator = () => {
  const { t } = useLanguage();
  const [selectedRanges, setSelectedRanges] = useState([]);

  // --- Lógica de Gestión de Fechas ---
  const handleAddRange = (range) => {
    const updatedRanges = [...selectedRanges, range];
    
    // Verificamos solapamientos para avisar al usuario
    const rawTotal = updatedRanges.reduce((sum, r) => sum + r.days, 0);
    const { merged } = mergeDateRanges(updatedRanges);
    const mergedTotal = calculateUniqueDays(merged);

    if (mergedTotal < rawTotal) {
      toast.info(t('toast.overlap'), {
        duration: 5000,
      });
    } else {
      toast.success(t('toast.rangeAdded'));
    }

    setSelectedRanges(updatedRanges);
  };

  const handleRemoveRange = (index) => {
    setSelectedRanges(selectedRanges.filter((_, i) => i !== index));
    toast.success(t('toast.rangeRemoved'));
  };

  // --- Cálculos de Métricas ---
  const { merged } = mergeDateRanges(selectedRanges);
  const totalDays = calculateUniqueDays(merged);
  
  const LIMIT = 183;
  const remaining = Math.max(LIMIT - totalDays, 0);
  const percentage = Math.min((totalDays / LIMIT) * 100, 100);

  const getStatusObj = () => {
    if (totalDays <= 150) return { color: 'safe', label: t('progress.safe') };
    if (totalDays <= 183) return { color: 'warning', label: t('progress.approaching') };
    return { color: 'destructive', label: t('progress.over') };
  };

  const statusObj = getStatusObj();

  // --- Función de Navegación al Pago (Header Action) ---
  const scrollToPayment = () => {
    const element = document.getElementById('payment-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Feedback visual para el usuario
      toast.success(t('stats.totalDays') + ": " + totalDays, {
        description: "Ready to generate your Audit-Ready report."
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        {/* Header con lógica de descarga integrada */}
        <Header totalDays={totalDays} onDownload={scrollToPayment} />

        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
          <div className="layout-60-40">
            {/* Columna Izquierda: Entrada de datos y Lista */}
            <div className="layout-60">
              <DateRangeSelector onAddRange={handleAddRange} />
              
              <RangeList 
                ranges={selectedRanges} 
                onRemoveRange={handleRemoveRange} 
              />
              
              <ProgressBar totalDays={totalDays} />

              <AdPlaceholder orientation="horizontal" />
              
              <DataAuthoritySection />
            </div>

            {/* Columna Derecha: Resumen y Pago */}
            <div className="layout-40">
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-6">
                <SummaryCard 
                  title={t('stats.totalDays')} 
                  value={totalDays} 
                  status={statusObj} 
                />
                <SummaryCard 
                  title={t('stats.remainingDays')} 
                  value={remaining} 
                  status={statusObj} 
                />
                <SummaryCard 
                  title={t('stats.limitUsage')} 
                  value={`${percentage.toFixed(1)}%`} 
                  status={statusObj} 
                />
              </div>

              <AdPlaceholder orientation="vertical" />
              
              {/* Sección de Pago con ID para el scroll del Header */}
              <div id="payment-section" className="mt-8 transition-all">
                <StripePaymentButton />
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default TaxNomadCalculator;