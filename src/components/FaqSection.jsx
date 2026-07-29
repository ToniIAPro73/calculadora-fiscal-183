import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import LegalRef from '@/components/LegalRef.jsx';
import { useLanguage } from '@/hooks/useLanguage.js';
import { getLocalizedFaq } from '@/lib/faqData.js';

/**
 * Visible FAQ block for a given page ('home' | 'guide').
 * Renders an accessible accordion (Radix: button + aria-expanded + region,
 * full keyboard support). The same localized strings feed the FAQPage
 * JSON-LD via buildFaqSchema, keeping content/structured-data parity.
 */
const FaqSection = ({ page, className }) => {
  const { t, language } = useLanguage();
  const items = getLocalizedFaq(language, page);

  return (
    <section className={className} aria-labelledby={`faq-heading-${page}`}>
      <h2 id={`faq-heading-${page}`} className="mb-4 text-2xl font-bold">
        {t('faq.title')}
      </h2>
      <Accordion type="single" collapsible className="w-full">
        {items.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger className="text-base font-semibold">
              {item.question}
            </AccordionTrigger>
            <AccordionContent>
              <p className="leading-7 text-muted-foreground">{item.answer}</p>
              {item.legalRefId && (
                <p className="mt-3 text-xs">
                  <LegalRef refId={item.legalRefId} />
                </p>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <p className="mt-4 text-xs italic text-muted-foreground">
        {t('faq.disclaimer')}
      </p>
    </section>
  );
};

export default FaqSection;
