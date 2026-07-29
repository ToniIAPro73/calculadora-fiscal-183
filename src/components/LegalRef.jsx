import React from 'react';
import { ArrowSquareOut } from '@phosphor-icons/react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useLanguage } from '@/hooks/useLanguage.js';
import { getLocalizedLegalRef } from '@/lib/legalRefs.js';
import { cn } from '@/lib/utils';

/**
 * Inline normative citation: renders the reference text as a link to the
 * official source (new tab), with an external-link icon and a tooltip
 * showing a short excerpt. Keyboard users get the tooltip on focus.
 */
const LegalRef = ({ refId, className }) => {
  const { t, language } = useLanguage();
  const ref = getLocalizedLegalRef(refId, language);

  if (!ref) return null;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href={ref.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'inline-flex items-center gap-1 rounded-sm font-medium text-primary underline decoration-dotted decoration-primary/50 underline-offset-4 transition-colors duration-200 hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              className,
            )}
          >
            {ref.title}
            <ArrowSquareOut size={13} weight="bold" aria-hidden="true" className="shrink-0" />
            <span className="sr-only">{t('legalRefs.externalLinkSr')}</span>
          </a>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[280px] px-3 py-2 text-left leading-5">
          <p>{ref.excerpt}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default LegalRef;
