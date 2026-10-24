import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ShieldCheck, FileText, Globe } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';
import { getCanonicalUrl } from '@/lib/seo.js';
import { contentByLanguage } from '@/lib/privacyPolicyContent.js';

const PrivacyPolicy = () => {
  const { language } = useLanguage();
  const content = contentByLanguage[language] || contentByLanguage.en;

  return (
    <>
      <Helmet>
        <title>{content.title}</title>
        <meta name="description" content={content.description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={getCanonicalUrl(language, '/privacy')} />
        <link rel="alternate" hrefLang="es" href={getCanonicalUrl('es', '/privacy')} />
        <link rel="alternate" hrefLang="en" href={getCanonicalUrl('en', '/privacy')} />
        <link rel="alternate" hrefLang="x-default" href={getCanonicalUrl('es', '/privacy')} />
      </Helmet>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 max-w-5xl mx-auto px-6 py-16 w-full">
          <div className="mb-12 border-b border-border pb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">
              {content.updatedAt}
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              {content.heading.split(' ')[0]} <span className="text-primary">{content.heading.split(' ').slice(1).join(' ')}</span>
            </h1>
            <p className="text-muted-foreground text-lg italic">
              {content.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 sticky top-24">
                <h3 className="font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" /> {content.quickSummaryTitle}
                </h3>
                <ul className="space-y-4 text-sm">
                  {content.quickSummary.map((item) => {
                    const Icon = item.icon;

                    return (
                      <li key={item.title} className="flex gap-3">
                        <Icon className="w-4 h-4 text-primary shrink-0" />
                        <span>
                          <strong>{item.title}:</strong>{' '}
                          {item.mailto ? (
                            <a href={`mailto:${item.description}`} className="underline">{item.description}</a>
                          ) : item.description}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-10 text-foreground/80 leading-relaxed">
              {content.sections.map((section) => (
                <section key={section.title}>
                  <h2 className="text-2xl font-bold text-foreground mb-4">{section.title}</h2>

                  {section.body?.map((paragraph) => (
                    <p key={paragraph} className="mb-3">{paragraph}</p>
                  ))}

                  {section.list && (
                    <ul className="mt-3 space-y-1 text-sm list-none pl-4 border-l-2 border-primary/20">
                      {section.list.map(([label, value]) => (
                        <li key={label}><strong>{label}:</strong> {value}</li>
                      ))}
                    </ul>
                  )}

                  {section.blocks?.map((block) => (
                    <div key={block.title} className="mt-4 text-sm">
                      <strong className="block mb-1">{block.title}</strong>
                      <p>{block.body}</p>
                      {block.link && (
                        <p className="mt-2">
                          <a href={block.link.href} className="underline text-primary" target="_blank" rel="noopener noreferrer">
                            {block.link.label}
                          </a>
                        </p>
                      )}
                      {block.note && <p className="mt-2"><strong>{block.note}</strong></p>}
                    </div>
                  ))}

                  {section.bulletList && (
                    <ul className="space-y-2 text-sm mt-3">
                      {section.bulletList.map(([title, description]) => (
                        <li key={title} className="flex gap-3">
                          <FileText className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span><strong>{title}:</strong> {description}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.plainList && (
                    <ul className="mt-2 space-y-1 text-sm list-disc pl-5">
                      {section.plainList.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}

                  {section.footer?.map((paragraph) => (
                    <p key={paragraph} className="mt-4 text-sm">
                      {paragraph.includes('hola@regla183.com') ? (
                        <>
                          {paragraph.split('hola@regla183.com')[0]}
                          <a href="mailto:hola@regla183.com" className="underline text-primary">hola@regla183.com</a>
                          {paragraph.split('hola@regla183.com')[1]}
                        </>
                      ) : paragraph.includes('www.aepd.es') ? (
                        <>
                          {paragraph.split('www.aepd.es')[0]}
                          <a href="https://www.aepd.es" className="underline text-primary" target="_blank" rel="noopener noreferrer">www.aepd.es</a>
                          {paragraph.split('www.aepd.es')[1]}
                        </>
                      ) : paragraph}
                    </p>
                  ))}
                </section>
              ))}

              <section className="p-8 rounded-3xl bg-muted/20 border border-border">
                <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" /> {content.commitmentTitle}
                </h2>
                <p className="text-sm italic">
                  {content.commitment}
                </p>
              </section>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default PrivacyPolicy;
