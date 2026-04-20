import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const TermsOfService = () => (
  <div className="min-h-screen bg-background flex flex-col">
    <Header />
    <main className="flex-1 max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Términos de Servicio</h1>
      <p className="mb-4">Al utilizar esta herramienta, aceptas los siguientes términos:</p>

      <h2 className="text-xl font-semibold mt-6 mb-3">1. Naturaleza del Servicio</h2>
      <p className="mb-4">Esta es una herramienta de cálculo basada en algoritmos de procesamiento de datos. No constituye asesoramiento legal o fiscal oficial. Los resultados son informativos y deben ser validados por un profesional colegiado.</p>

      <h2 className="text-xl font-semibold mt-6 mb-3">2. Pagos y Reembolsos</h2>
      <p className="mb-4">El precio del informe PDF es de 9,99 €. Debido a que el producto es de entrega digital inmediata, no se aceptan devoluciones una vez confirmada la compra en Stripe.</p>

      <h2 className="text-xl font-semibold mt-6 mb-3">3. Limitación de Responsabilidad</h2>
      <p className="mb-4">No somos responsables de sanciones o inspecciones derivadas del uso de estos cálculos.</p>
    </main>
    <Footer />
  </div>
);

export default TermsOfService;