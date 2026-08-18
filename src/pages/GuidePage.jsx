import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import { ArrowRight } from '@phosphor-icons/react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import LegalRef from '@/components/LegalRef.jsx';
import FaqSection from '@/components/FaqSection.jsx';
import { buildFaqSchema, getLocalizedFaq } from '@/lib/faqData.js';
import { GUIDES, getGuidePath, getLocalizedGuide } from '@/lib/guideContent/index.js';
import { getCanonicalUrl } from '@/lib/seo';

const GuidePage = () => {
  const { t, language } = useLanguage();
  const isEs = language === 'es';
  const canonicalUrl = getCanonicalUrl(language, 'guide');

  // FAQ JSON-LD matches the visible accordion exactly (buildFaqSchema feeds
  // from the same localized strings as <FaqSection page="guide" />).
  const faqSchema = buildFaqSchema(getLocalizedFaq(language, 'guide'));

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isEs ? 'Guía Completa de la Regla de los 183 Días en España' : 'Complete Guide to the 183-Day Rule in Spain',
    description: isEs
      ? 'Todo lo que necesitas saber sobre la regla de los 183 días para determinar tu residencia fiscal en España.'
      : 'Everything you need to know about the 183-day rule to determine your tax residency in Spain.',
    author: {
      '@type': 'Organization',
      name: 'TaxNomad',
      url: 'https://www.regla183.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'TaxNomad',
      url: 'https://www.regla183.com',
    },
  };

  return (
    <>
      <Helmet>
        <title>{isEs ? 'Guía Completa de la Regla de los 183 Días en España · TaxNomad' : 'Complete Guide to the 183-Day Rule in Spain · TaxNomad'}</title>
        <meta name="description" content={isEs
          ? 'Todo lo que necesitas saber sobre la regla de los 183 días para determinar tu residencia fiscal en España. Explicación detallada con ejemplos y fuentes oficiales.'
          : 'Everything you need to know about the 183-day rule to determine your tax residency in Spain. Detailed explanation with examples and official sources.'}
        />
        <link rel="canonical" href={canonicalUrl} />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      </Helmet>
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="mx-auto max-w-[820px] px-4 py-12 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="mb-12">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              {isEs ? 'Guía completa' : 'Complete guide'}
            </p>
            <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              {isEs ? 'La Regla de los 183 Días en España' : 'The 183-Day Rule in Spain'}
            </h1>
            <p className="text-lg text-muted-foreground">
              {isEs
                ? 'Todo lo que necesitas saber para entender y calcular tu residencia fiscal en España según la legislación vigente.'
                : 'Everything you need to know to understand and calculate your tax residency in Spain under current legislation.'}
            </p>
          </div>

          {/* Guide hub: profile guides index */}
          <section className="mb-12">
            <h2 className="mb-2 text-2xl font-bold">
              {isEs ? 'Guías por perfil' : 'Guides by profile'}
            </h2>
            <p className="mb-6 leading-7 text-muted-foreground">
              {isEs
                ? 'Análisis en profundidad según tu situación: visado de nómada digital, régimen de impatriados, año del traslado y convenios de doble imposición.'
                : 'In-depth analysis for your situation: digital nomad visa, impatriate regime, moving year and double taxation treaties.'}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {GUIDES.map(({ slug }) => {
                const guide = getLocalizedGuide(slug, language);
                return (
                  <Link
                    key={slug}
                    to={getGuidePath(language, slug)}
                    className="group rounded-xl border border-border/70 bg-card p-5 transition-colors duration-200 hover:border-primary/50"
                  >
                    <h3 className="mb-2 font-semibold leading-snug transition-colors duration-200 group-hover:text-primary">
                      {guide.shortTitle}
                    </h3>
                    <p className="mb-3 text-sm leading-6 text-muted-foreground">
                      {guide.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                      {isEs ? 'Leer guía' : 'Read guide'}
                      <ArrowRight size={14} weight="bold" aria-hidden="true" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>

          {/* What is */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold">
              {isEs ? '¿Qué es la regla de los 183 días?' : 'What is the 183-day rule?'}
            </h2>
            <p className="mb-4 leading-7 text-muted-foreground">
              {isEs
                ? 'La regla de los 183 días es el criterio principal establecido en el artículo 9 de la Ley 35/2006 del Impuesto sobre la Renta de las Personas Físicas (LIRPF) para determinar la residencia fiscal en España. Según esta norma, una persona se considera residente fiscal en España cuando permanece más de 183 días durante el año natural en territorio español. Este criterio es aplicable tanto a ciudadanos españoles como extranjeros, y no depende de la nacionalidad sino de la presencia física efectiva en el país.'
                : 'The 183-day rule is the main criterion established in Article 9 of Law 35/2006 on Personal Income Tax (LIRPF) to determine tax residency in Spain. Under this rule, a person is considered a tax resident in Spain when they spend more than 183 days during the calendar year in Spanish territory. This criterion applies to both Spanish citizens and foreigners, and does not depend on nationality but on effective physical presence in the country.'}
            </p>
            <p className="mb-4 text-xs">
              <LegalRef refId="lirpf-art9" />
            </p>
            <p className="leading-7 text-muted-foreground">
              {isEs
                ? 'Es fundamental entender que la residencia fiscal no es lo mismo que la residencia administrativa o el empadronamiento. Una persona puede estar empadronada en un municipio pero no ser residente fiscal si no supera los 183 días de presencia. Igualmente, alguien puede ser residente fiscal sin estar empadronado si supera el umbral de días de presencia real.'
                : 'It is essential to understand that tax residency is not the same as administrative residency or municipal registration. A person can be registered in a municipality but not be a tax resident if they do not exceed 183 days of presence. Similarly, someone can be a tax resident without being registered if they exceed the threshold of actual days of presence.'}
            </p>
          </section>

          {/* How to count */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold">
              {isEs ? '¿Cómo se cuentan los días de presencia?' : 'How are days of presence counted?'}
            </h2>
            <p className="mb-4 leading-7 text-muted-foreground">
              {isEs
                ? 'El cómputo de días de presencia en España sigue reglas específicas que es importante conocer para realizar un cálculo preciso:'
                : 'The counting of days of presence in Spain follows specific rules that are important to know for an accurate calculation:'}
            </p>
            <ul className="mb-4 space-y-3">
              {(isEs ? [
                'Cualquier día en el que estés físicamente en territorio español, incluso durante parte del día, cuenta como día de presencia.',
                'El día de llegada y el día de salida se computan como días completos de presencia en España.',
                'Las ausencias temporales de corta duración (viajes de vacaciones, viajes de negocio) no interrumpen el cómputo de días.',
                'Se incluyen los días pasados en territorio español continental, las Islas Baleares, las Islas Canarias y las Ciudades Autónomas de Ceuta y Melilla.',
                'No se cuentan los días de tránsito en aeropuertos españoles si no entras en territorio nacional (aunque en la práctica, la AEAT suele computarlos).'
              ] : [
                'Any day you are physically in Spanish territory, even for part of the day, counts as a day of presence.',
                'The day of arrival and the day of departure are counted as full days of presence in Spain.',
                'Short temporary absences (vacation trips, business trips) do not interrupt the day count.',
                'Days spent in mainland Spain, the Balearic Islands, the Canary Islands, and the Autonomous Cities of Ceuta and Melilla are included.',
                'Transit days in Spanish airports where you do not enter national territory are generally not counted (although in practice, the AEAT often counts them).'
              ]).map((item, i) => (
                <li key={i} className="flex gap-3 leading-7 text-muted-foreground">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Consequences */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold">
              {isEs ? 'Consecuencias de superar los 183 días' : 'Consequences of exceeding 183 days'}
            </h2>
            <p className="mb-4 leading-7 text-muted-foreground">
              {isEs
                ? 'Superar el umbral de 183 días tiene implicaciones fiscales significativas. Como residente fiscal en España, estás obligado a declarar y tributar por tus rentas mundiales, lo que incluye ingresos del trabajo (sean o no de fuente española), rentas del capital (intereses, dividendos), ganancias y pérdidas patrimoniales, e imputación de rentas inmobiliarias. Además, estás sujeto al Impuesto sobre el Patrimonio y al Impuesto sobre Grandes Fortunas si corresponden según tu comunidad autónoma.'
                : 'Exceeding the 183-day threshold has significant tax implications. As a tax resident in Spain, you are required to declare and pay taxes on your worldwide income, which includes employment income (whether from Spanish sources or not), investment income (interest, dividends), capital gains and losses, and imputation of real estate income. Additionally, you are subject to Wealth Tax and the Tax on Large Fortunes if applicable in your autonomous community.'}
            </p>
            <p className="leading-7 text-muted-foreground">
              {isEs
                ? 'Es importante tener en cuenta que las comunidades autónomas en España tienen competencias normativas en materia de IRPF, lo que significa que los tipos impositivos, las deducciones y las bonificaciones pueden variar significativamente entre unas comunidades y otras. Por ejemplo, la Comunidad de Madrid y Andalucía tienen bonificaciones del 100% en el Impuesto sobre el Patrimonio, mientras que Cataluña y la Comunidad Valenciana aplican tipos más elevados.'
                : 'It is important to note that autonomous communities in Spain have regulatory powers regarding personal income tax, which means that tax rates, deductions, and bonuses can vary significantly between communities. For example, the Community of Madrid and Andalusia have 100% bonuses on Wealth Tax, while Catalonia and the Valencian Community apply higher rates.'}
            </p>
          </section>

          {/* Exceptions */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold">
              {isEs ? 'Excepciones y casos especiales' : 'Exceptions and special cases'}
            </h2>
            <p className="mb-4 leading-7 text-muted-foreground">
              {isEs
                ? 'Existen situaciones en las que la regla de los 183 días puede no ser determinante o puede aplicarse de forma diferente. Los convenios de doble imposición (CDI) suscritos por España con más de 90 países pueden prevalecer sobre la legislación interna. Cuando una persona es considerada residente fiscal en dos países según sus respectivas legislaciones internas, el CDI establece criterios de desempate en este orden: domicilio permanente, centro de intereses vitales, residencia habitual y nacionalidad.'
                : 'There are situations where the 183-day rule may not be determinative or may apply differently. Double taxation treaties (DTTs) signed by Spain with over 90 countries may prevail over domestic legislation. When a person is considered a tax resident in two countries under their respective domestic laws, the DTT establishes tie-breaker criteria in this order: permanent home, center of vital interests, habitual abode, and nationality.'}
            </p>
            <p className="leading-7 text-muted-foreground">
              {isEs
                ? 'Otros casos especiales incluyen el régimen de trabajadores desplazados (conocido como régimen Beckham), que permite a trabajadores extranjeros que se trasladan a España tributar como no residentes durante un periodo de 6 años bajo ciertas condiciones, y el régimen especial de impatriados regulado en el artículo 93 de la LIRPF.'
                : 'Other special cases include the displaced workers regime (known as the Beckham Law), which allows foreign workers who relocate to Spain to be taxed as non-residents for a period of 6 years under certain conditions, and the special impatriate regime regulated in Article 93 of the LIRPF.'}
            </p>
          </section>

          {/* Double taxation treaties */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold">
              {isEs ? 'Convenios de doble imposición' : 'Double taxation treaties'}
            </h2>
            <p className="mb-4 leading-7 text-muted-foreground">
              {isEs
                ? 'España tiene firmados convenios de doble imposición con más de 90 países, entre ellos Reino Unido, Alemania, Francia, Estados Unidos, Italia, Portugal, Países Bajos, Suiza, y prácticamente todos los países de la OCDE. Estos convenios son fundamentales para los nómadas digitales y expatriados porque determinan qué país tiene derecho a gravar las rentas y evitan la doble tributación. El convenio modelo de la OCDE establece un sistema de resolución de conflictos de residencia que se aplica cuando dos países consideran a la misma persona como residente fiscal.'
                : 'Spain has signed double taxation treaties with over 90 countries, including the United Kingdom, Germany, France, the United States, Italy, Portugal, the Netherlands, Switzerland, and virtually all OECD countries. These treaties are fundamental for digital nomads and expats because they determine which country has the right to tax income and prevent double taxation. The OECD model convention establishes a conflict resolution system for residency that applies when two countries consider the same person as a tax resident.'}
            </p>
            <p className="leading-7 text-muted-foreground">
              {isEs
                ? 'El orden de los criterios de desempate es el siguiente: primero, el domicilio permanente (donde tienes una vivienda a tu disposición de forma continuada); segundo, el centro de intereses vitales (donde tienes lazos personales y económicos más estrechos); tercero, la residencia habitual (donde vives más tiempo); y cuarto, la nacionalidad. Si persiste la duda, las autoridades competentes de ambos países resolverán de común acuerdo.'
                : 'The order of tie-breaker criteria is as follows: first, permanent home (where you have a dwelling continuously available to you); second, center of vital interests (where you have closer personal and economic ties); third, habitual abode (where you live more time); and fourth, nationality. If the doubt persists, the competent authorities of both countries will resolve by mutual agreement.'}
            </p>
          </section>

          {/* Practical tips */}
          <section className="mb-10">
            <h2 className="mb-4 text-2xl font-bold">
              {isEs ? 'Consejos prácticos para nómadas digitales' : 'Practical tips for digital nomads'}
            </h2>
            <ul className="space-y-3">
              {(isEs ? [
                'Lleva un registro detallado de todas tus entradas y salidas de España, incluyendo vuelos, billetes de tren y sellos de pasaporte.',
                'Usa una herramienta de seguimiento como TaxNomad para automatizar el cálculo y evitar errores en el cómputo de días.',
                'Guarda evidencia de tus estancias fuera de España: reservas de hotel, facturas de transporte, contratos de alquiler en el extranjero.',
                'Consulta siempre con un asesor fiscal especializado en fiscalidad internacional antes de tomar decisiones basadas en el número de días.',
                'Ten en cuenta que las reglas pueden variar según tu situación personal: nacionalidad, país de origen, tipo de ingresos, y acuerdos bilaterales.',
                'Si estás cerca del límite de 183 días, considera planificar tus viajes para mantener tu estancia por debajo del umbral.',
                'Recuerda que otros criterios además de los 183 días pueden determinarte como residente fiscal: centro de intereses económicos o núcleo familiar.'
              ] : [
                'Keep a detailed record of all your entries and exits from Spain, including flights, train tickets, and passport stamps.',
                'Use a tracking tool like TaxNomad to automate the calculation and avoid errors in counting days.',
                'Save evidence of your stays outside Spain: hotel bookings, transportation receipts, rental contracts abroad.',
                'Always consult with a tax advisor specialized in international taxation before making decisions based on the number of days.',
                'Keep in mind that rules may vary depending on your personal situation: nationality, country of origin, type of income, and bilateral agreements.',
                'If you are close to the 183-day limit, consider planning your trips to keep your stay below the threshold.',
                'Remember that criteria other than 183 days may determine you as a tax resident: center of economic interests or family nucleus.'
              ]).map((item, i) => (
                <li key={i} className="flex gap-3 leading-7 text-muted-foreground">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* FAQ */}
          <FaqSection page="guide" className="mb-12" />

          {/* CTA */}
          <div className="rounded-xl bg-primary/5 border border-primary/20 p-8 text-center">
            <h2 className="mb-3 text-2xl font-bold">
              {isEs ? 'Calcula tus días de presencia ahora' : 'Calculate your days of presence now'}
            </h2>
            <p className="mb-6 text-muted-foreground">
              {isEs
                ? 'Usa nuestra calculadora gratuita para llevar un control exacto de tus días en España y generar un informe PDF listo para auditoría.'
                : 'Use our free calculator to keep an exact track of your days in Spain and generate an audit-ready PDF report.'}
            </p>
            <Link
              to={isEs ? '/' : '/en'}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {isEs ? 'Ir a la calculadora' : 'Go to calculator'}
            </Link>
          </div>

          {/* Sources */}
          <div className="mt-10 border-t border-border/70 pt-6">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              {isEs ? 'Fuentes oficiales' : 'Official sources'}
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>{isEs ? 'Agencia Tributaria — Ley 35/2006, Artículo 9' : 'Agencia Tributaria — Law 35/2006, Article 9'}</li>
              <li>{isEs ? 'Comisión Europea — Fiscalidad y Unión Aduanera' : 'European Commission — Taxation and Customs Union'}</li>
              <li>{isEs ? 'OCDE — Modelo de Convenio Fiscal sobre la Renta y el Patrimonio' : 'OECD — Model Tax Convention on Income and on Capital'}</li>
            </ul>
            <p className="mt-4 text-xs text-muted-foreground italic">
              {isEs
                ? 'Nota: Esta guía es solo para fines informativos y no constituye asesoramiento legal o fiscal. Consulta siempre con un profesional fiscal cualificado.'
                : 'Note: This guide is for informational purposes only and does not constitute legal or tax advice. Always consult with a qualified tax professional.'}
            </p>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default GuidePage;
