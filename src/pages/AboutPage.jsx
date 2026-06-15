import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { getCanonicalUrl } from '@/lib/seo';

const AboutPage = () => {
  const { language } = useLanguage();
  const isEs = language === 'es';
  const canonicalUrl = getCanonicalUrl(language, 'about');

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'TaxNomad',
    url: 'https://www.regla183.com',
    logo: 'https://www.regla183.com/apple-touch-icon.png',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'hola@regla183.com',
      availableLanguage: ['Spanish', 'English'],
    },
    sameAs: [],
  };

  return (
    <>
      <Helmet>
        <title>{isEs ? 'Sobre TaxNomad · Quiénes Somos' : 'About TaxNomad · Who We Are'}</title>
        <meta name="description" content={isEs
          ? 'Conoce el equipo y la metodología detrás de TaxNomad, la calculadora de residencia fiscal de referencia en España.'
          : 'Meet the team and methodology behind TaxNomad, the reference tax residency calculator for Spain.'}
        />
        <link rel="canonical" href={canonicalUrl} />
        <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
      </Helmet>
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="mx-auto max-w-[820px] px-4 py-12 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="mb-12">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              {isEs ? 'Sobre nosotros' : 'About us'}
            </p>
            <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              {isEs ? 'Quiénes somos' : 'Who we are'}
            </h1>
            <p className="text-lg text-muted-foreground">
              {isEs
                ? 'TaxNomad es una utilidad digital independiente diseñada para ayudar a nómadas digitales, expatriados y trabajadores remotos a determinar su residencia fiscal en España de forma precisa y documentada.'
                : 'TaxNomad is an independent digital utility designed to help digital nomads, expats, and remote workers determine their tax residency in Spain accurately and with proper documentation.'}
            </p>
          </div>

          {/* Mission */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold">
              {isEs ? 'Nuestra misión' : 'Our mission'}
            </h2>
            <p className="mb-4 leading-7 text-muted-foreground">
              {isEs
                ? 'Nuestra misión es democratizar el acceso a herramientas de cumplimiento fiscal que tradicionalmente requerían los servicios de un asesor cara a cara. Creemos que cualquier persona debería poder llevar un control preciso de sus días de presencia en España sin necesidad de conocimientos fiscales avanzados. La regla de los 183 días es un criterio objetivo y cuantificable, y nuestra calculadora automatiza su cómputo eliminando los errores manuales y los solapamientos de fechas que tantas veces complican el recuento.'
                : 'Our mission is to democratize access to tax compliance tools that traditionally required in-person advisor services. We believe anyone should be able to keep precise track of their days of presence in Spain without needing advanced tax knowledge. The 183-day rule is an objective and quantifiable criterion, and our calculator automates its computation by eliminating manual errors and date overlaps that so often complicate the count.'}
            </p>
            <p className="leading-7 text-muted-foreground">
              {isEs
                ? 'Entendemos que la movilidad internacional es una realidad creciente. Miles de profesionales trabajan de forma remota desde diferentes países, y las implicaciones fiscales de esta movilidad pueden ser complejas y costosas si no se gestionan adecuadamente. TaxNomad existe para hacer que este proceso sea más transparente, accesible y documentado.'
                : 'We understand that international mobility is a growing reality. Thousands of professionals work remotely from different countries, and the tax implications of this mobility can be complex and costly if not managed properly. TaxNomad exists to make this process more transparent, accessible, and documented.'}
            </p>
          </section>

          {/* Methodology */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold">
              {isEs ? 'Metodología' : 'Methodology'}
            </h2>
            <p className="mb-4 leading-7 text-muted-foreground">
              {isEs
                ? 'La calculadora de TaxNomad se basa en el artículo 9 de la Ley 35/2007 del Impuesto sobre la Renta de las Personas Físicas (LIRPF), que establece el criterio de los 183 días como determinante principal de la residencia fiscal en España. Nuestro algoritmo de cálculo funciona de la siguiente manera:'
                : 'The TaxNomad calculator is based on Article 9 of Law 35/2007 on Personal Income Tax (LIRPF), which establishes the 183-day criterion as the main determinant of tax residency in Spain. Our calculation algorithm works as follows:'}
            </p>
            <ol className="mb-4 space-y-3">
              {(isEs ? [
                'El usuario introduce sus periodos de estancia en España mediante un selector de fechas intuitivo.',
                'El sistema fusiona automáticamente los rangos de fechas solapados, eliminando duplicidades.',
                'Se calculan los días únicos de presencia contando cada día natural una sola vez.',
                'Se compara el total con el umbral de 183 días y se determina el estado: seguro, próximo al límite o superado.',
                'Opcionalmente, el usuario puede generar un informe PDF con los resultados para su documentación fiscal.'
              ] : [
                'The user enters their stay periods in Spain through an intuitive date selector.',
                'The system automatically merges overlapping date ranges, eliminating duplicates.',
                'Unique days of presence are calculated by counting each calendar day only once.',
                'The total is compared against the 183-day threshold and the status is determined: safe, approaching limit, or exceeded.',
                'Optionally, the user can generate a PDF report with the results for their tax documentation.'
              ]).map((item, i) => (
                <li key={i} className="flex gap-3 leading-7 text-muted-foreground">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </section>

          {/* Transparency */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold">
              {isEs ? 'Transparencia y limitaciones' : 'Transparency and limitations'}
            </h2>
            <p className="mb-4 leading-7 text-muted-foreground">
              {isEs
                ? 'Es importante ser transparentes sobre lo que TaxNomad es y lo que no es. Nuestra herramienta calcula los días de presencia física en España y compara el resultado con el umbral legal de 183 días. Sin embargo, la residencia fiscal puede determinarse también por otros criterios como el centro de intereses económicos o el núcleo familiar. Nuestro cálculo no sustituye el asesoramiento fiscal profesional y no debe considerarse como una opinión legal vinculante.'
                : 'It is important to be transparent about what TaxNomad is and what it is not. Our tool calculates days of physical presence in Spain and compares the result with the legal threshold of 183 days. However, tax residency can also be determined by other criteria such as the center of economic interests or family nucleus. Our calculation does not replace professional tax advice and should not be considered a binding legal opinion.'}
            </p>
            <p className="leading-7 text-muted-foreground">
              {isEs
                ? 'Las fuentes oficiales en las que nos basamos incluyen la Agencia Tributaria española (AEAT), la legislación vigente (Ley 35/2007 y modificaciones posteriores), y los convenios de doble imposición publicados por el Ministerio de Asuntos Exteriores. Todos los cálculos se realizan del lado del cliente o mediante una API pública documentada, garantizando la trazabilidad y auditabilidad del proceso.'
                : 'The official sources we rely on include the Spanish Tax Authority (AEAT), current legislation (Law 35/2007 and subsequent amendments), and double taxation treaties published by the Ministry of Foreign Affairs. All calculations are performed on the client side or through a documented public API, ensuring the traceability and auditability of the process.'}
            </p>
          </section>

          {/* E-E-A-T: Contact & Trust */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold">
              {isEs ? 'Contacto y confianza' : 'Contact and trust'}
            </h2>
            <p className="mb-4 leading-7 text-muted-foreground">
              {isEs
                ? 'TaxNomad es un proyecto independiente desarrollado con los más altos estándares de calidad técnica y cumplimiento normativo. Nuestro código fuente es auditable, nuestra API está documentada públicamente, y nuestras prácticas de privacidad cumplen con el Reglamento General de Protección de Datos (RGPD) y la Ley Orgánica de Protección de Datos Personales (LOPDGDD).'
                : 'TaxNomad is an independent project developed with the highest standards of technical quality and regulatory compliance. Our source code is auditable, our API is publicly documented, and our privacy practices comply with the General Data Protection Regulation (GDPR) and the Organic Law on Data Protection (LOPDGDD).'}
            </p>
            <div className="rounded-lg border border-border/70 p-5">
              <h3 className="mb-2 font-semibold">{isEs ? 'Datos de contacto' : 'Contact details'}</h3>
              <p className="text-muted-foreground">
                {isEs ? 'Email' : 'Email'}: <a href="mailto:hola@regla183.com" className="text-primary hover:underline">hola@regla183.com</a>
              </p>
              <p className="mt-1 text-muted-foreground">
                {isEs ? 'Web' : 'Web'}: <Link to="/" className="text-primary hover:underline">www.regla183.com</Link>
              </p>
            </div>
          </section>

          {/* CTA */}
          <div className="rounded-xl bg-primary/5 border border-primary/20 p-8 text-center">
            <h2 className="mb-3 text-2xl font-bold">
              {isEs ? 'Comienza a calcular tus días' : 'Start calculating your days'}
            </h2>
            <p className="mb-6 text-muted-foreground">
              {isEs
                ? 'Prueba nuestra calculadora gratuita y genera un informe PDF listo para auditoría fiscal.'
                : 'Try our free calculator and generate an audit-ready PDF report.'}
            </p>
            <Link
              to={isEs ? '/' : '/en'}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {isEs ? 'Ir a la calculadora' : 'Go to calculator'}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default AboutPage;
