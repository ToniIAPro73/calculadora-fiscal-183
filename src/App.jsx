import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import ScrollToTop from './components/ScrollToTop';
import TagManagerManager from './components/TagManagerManager';
import HomePage from './pages/HomePage';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/i18nContext';
import { SeoAppSchema } from '@/components/SeoAppSchema';
import CookieBanner from '@/components/CookieBanner';

const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const LegalNotice = lazy(() => import('./pages/LegalNotice'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));
const PaymentMock = lazy(() => import('./pages/PaymentMock'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <BrowserRouter>
          <SeoAppSchema />
          <TagManagerManager />
          <ScrollToTop />
          <Suspense fallback={null}>
            <Routes>
              {/* El root "/" renderiza la HomePage directamente (Español por defecto) */}
              <Route path="/" element={<HomePage />} />
              
              {/* Redirección preventiva de "/es" a la raíz para evitar contenido duplicado */}
              <Route path="/es" element={<Navigate to="/" replace />} />
              
              {/* Rutas de idioma alternativas (ej. Inglés) */}
              <Route path="/en" element={<HomePage />} />
              
              {/* Rutas Legales en Español sin barra diagonal final */}
              <Route path="/es/terms" element={<TermsOfService />} />
              <Route path="/es/privacy" element={<PrivacyPolicy />} />
              <Route path="/es/legal" element={<LegalNotice />} />
              <Route path="/es/cookies" element={<CookiePolicy />} />
              <Route path="/es/payment-success" element={<PaymentSuccess />} />
              <Route path="/es/payment-mock" element={<PaymentMock />} />
              
              {/* Rutas Legales en Inglés sin barra diagonal final */}
              <Route path="/en/terms" element={<TermsOfService />} />
              <Route path="/en/privacy" element={<PrivacyPolicy />} />
              <Route path="/en/legal" element={<LegalNotice />} />
              <Route path="/en/cookies" element={<CookiePolicy />} />
              <Route path="/en/payment-success" element={<PaymentSuccess />} />
              <Route path="/en/payment-mock" element={<PaymentMock />} />
              
              {/* Ruta de respaldo segura hacia la raíz */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
          <CookieBanner />
          <Toaster position="top-center" richColors />
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
