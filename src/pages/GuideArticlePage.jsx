import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight } from '@phosphor-icons/react';
import { useLanguage } from '@/hooks/useLanguage';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import LegalRef from '@/components/LegalRef.jsx';
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  getCalculatorPath,
  getGuideBySlug,
  getGuideHubPath,
  getGuidePath,
  getLocalizedGuide,
} from '@/lib/guideContent/index.js';
import { APP_ORIGIN } from '@/lib/seo';

// Renders the content blocks of a guide section (paragraph | list |
// legalRef | subsection). Subsections recurse one level (H3).
const GuideBlocks = ({ blocks }) =>
  blocks.map((block, index) => {
    if (block.type === 'list') {
      return (
        <ul key={index} className="mb-4 space-y-3">
          {block.items.map((item, itemIndex) => (
            <li key={itemIndex} className="flex gap-3 leading-7 text-muted-foreground">
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
              {item}
            </li>
          ))}
        </ul>
      );
    }
    if (block.type === 'legalRef') {
      return (
        <p key={index} className="mb-4 text-xs">
          <LegalRef refId={block.refId} />
        </p>
      );
    }
    if (block.type === 'subsection') {
      return (
        <div key={index} className="mb-4">
          <h3 className="mb-3 text-xl font-semibold">{block.heading}</h3>
          <GuideBlocks blocks={block.blocks} />
        </div>
      );
    }
    return (
      <p key={index} className="mb-4 leading-7 text-muted-foreground">
        {block.text}
      </p>
    );
  });

const GuideArticlePage = () => {
  const { slug } = useParams();
  const { language } = useLanguage();
  const isEs = language === 'es';

  const guide = getLocalizedGuide(slug, language);
  const hasGuide = getGuideBySlug(slug) !== null;

  if (!hasGuide) {
    return <Navigate to={isEs ? '/es/guide' : '/en/guide'} replace />;
  }

  const canonicalUrl = `${APP_ORIGIN}${getGuidePath(language, slug)}`;
  const articleSchema = buildArticleSchema(slug, language);
  const breadcrumbSchema = buildBreadcrumbSchema(slug, language);

  const relatedGuides = guide.related
    .map((relatedSlug) => getLocalizedGuide(relatedSlug, language))
    .filter(Boolean);

  return (
    <>
      <Helmet>
        <title>{`${guide.title} · TaxNomad`}</title>
        <meta name="description" content={guide.description} />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="alternate" hrefLang="es" href={`${APP_ORIGIN}${getGuidePath('es', slug)}`} />
        <link rel="alternate" hrefLang="en" href={`${APP_ORIGIN}${getGuidePath('en', slug)}`} />
        <link rel="alternate" hrefLang="x-default" href={`${APP_ORIGIN}${getGuidePath('es', slug)}`} />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="mx-auto max-w-[820px] px-4 py-12 sm:px-6 lg:px-8">
          {/* Visible breadcrumbs (mirrors the BreadcrumbList JSON-LD) */}
          <nav aria-label={isEs ? 'Miga de pan' : 'Breadcrumb'} className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <li>
                <Link
                  to={getCalculatorPath(language)}
                  className="transition-colors duration-200 hover:text-foreground"
                >
                  {isEs ? 'Inicio' : 'Home'}
                </Link>
              </li>
              <li aria-hidden="true" className="text-muted-foreground/50">/</li>
              <li>
                <Link
                  to={getGuideHubPath(language)}
                  className="transition-colors duration-200 hover:text-foreground"
                >
                  {isEs ? 'Guía' : 'Guide'}
                </Link>
              </li>
              <li aria-hidden="true" className="text-muted-foreground/50">/</li>
              <li aria-current="page" className="font-medium text-foreground">
                {guide.shortTitle}
              </li>
            </ol>
          </nav>

          {/* Hero */}
          <div className="mb-10">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              {isEs ? 'Guía por perfil' : 'Profile guide'}
            </p>
            <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              {guide.title}
            </h1>
            <p className="text-xs text-muted-foreground italic">
              {isEs
                ? 'Contenido de orientación general: no constituye asesoramiento legal ni fiscal. Consulta siempre a un profesional cualificado para tu caso concreto.'
                : 'General guidance content: it does not constitute legal or tax advice. Always consult a qualified professional for your specific case.'}
            </p>
          </div>

          {/* Intro */}
          {guide.intro.map((paragraph, index) => (
            <p key={index} className="mb-4 text-lg leading-8 text-muted-foreground">
              {paragraph}
            </p>
          ))}

          {/* Sections */}
          {guide.sections.map((section, index) => (
            <section key={index} className="mb-10 mt-10">
              <h2 className="mb-4 text-2xl font-bold">{section.heading}</h2>
              <GuideBlocks blocks={section.blocks} />
            </section>
          ))}

          {/* Related guides */}
          <section className="mb-10 mt-12">
            <h2 className="mb-4 text-2xl font-bold">
              {isEs ? 'Sigue leyendo' : 'Keep reading'}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedGuides.map((related) => (
                <Link
                  key={related.slug}
                  to={getGuidePath(language, related.slug)}
                  className="group rounded-xl border border-border/70 bg-card p-5 transition-colors duration-200 hover:border-primary/50"
                >
                  <h3 className="mb-2 font-semibold leading-snug transition-colors duration-200 group-hover:text-primary">
                    {related.shortTitle}
                  </h3>
                  <p className="mb-3 text-sm leading-6 text-muted-foreground">
                    {related.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                    {isEs ? 'Leer guía' : 'Read guide'}
                    <ArrowRight size={14} weight="bold" aria-hidden="true" />
                  </span>
                </Link>
              ))}
            </div>
          </section>

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
              to={getCalculatorPath(language)}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {isEs ? 'Ir a la calculadora' : 'Go to calculator'}
            </Link>
          </div>

          {/* Disclaimer */}
          <p className="mt-10 border-t border-border/70 pt-6 text-xs text-muted-foreground italic">
            {isEs
              ? 'Nota: Esta guía es solo para fines informativos y no constituye asesoramiento legal o fiscal. La normativa puede cambiar y cada situación es distinta: consulta siempre con un profesional fiscal cualificado.'
              : 'Note: This guide is for informational purposes only and does not constitute legal or tax advice. Legislation may change and every situation is different: always consult a qualified tax professional.'}
          </p>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default GuideArticlePage;
