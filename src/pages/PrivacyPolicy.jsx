import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => (
  <div className="min-h-screen bg-background flex flex-col">
    <Header />
    <main className="flex-1 max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Política de Privacidad</h1>
      <p className="mb-4">Última actualización: 20 de abril de 2026</p>
      
      <h2 className="text-xl font-semibold mt-6 mb-3">1. Información que recopilamos</h2>
      <p className="mb-4">Recopilamos los datos de fechas que introduces para realizar los cálculos. Si decides comprar un informe premium, Stripe procesará tus datos de pago. Nosotros no almacenamos los números de tu tarjeta de crédito.</p>

      <h2 className="text-xl font-semibold mt-6 mb-3">2. Google AdSense</h2>
      <p className="mb-4">Utilizamos Google AdSense para mostrar anuncios. Google utiliza cookies para publicar anuncios basados en tus visitas a este y otros sitios web. Puedes inhabilitar la publicidad personalizada en la configuración de anuncios de Google.</p>

      <h2 className="text-xl font-semibold mt-6 mb-3">3. Contacto</h2>
      <p className="mb-4">Para cualquier duda, puedes contactarnos en: antonio@anclora.com</p>
    </main>
    <Footer />
  </div>
);

export default PrivacyPolicy;