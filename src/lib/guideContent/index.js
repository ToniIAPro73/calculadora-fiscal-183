// Registry of the profile guides that make up the guide hub (/es|en/guide).
// Same slug in both languages: keeps hreflang pairs, sitemap entries and
// vercel.json rewrites/redirects symmetrical and easy to maintain.
//
// Routing decision: /es/guide/<slug> and /en/guide/<slug>. Slugs stay in
// English because they are shared by both locales and the domain/brand is
// language-neutral (regla183.com).

import { digitalNomadVisaGuide } from './digital-nomad-visa-183-days.js';
import { beckhamLawGuide } from './beckham-law-vs-183-days.js';
import { countingDaysGuide } from './counting-days-arrival-departure.js';
import { sporadicAbsencesGuide } from './sporadic-absences-tax-treaties.js';

export const GUIDES = [
  digitalNomadVisaGuide,
  beckhamLawGuide,
  countingDaysGuide,
  sporadicAbsencesGuide,
];

export const GUIDE_SLUGS = GUIDES.map((guide) => guide.slug);

export const getGuideBySlug = (slug) =>
  GUIDES.find((guide) => guide.slug === slug) ?? null;

const SUPPORTED_LANGUAGES = ['es', 'en'];

const normalizeLanguage = (language) =>
  SUPPORTED_LANGUAGES.includes(language) ? language : 'es';

const localizeText = (field, lang) =>
  typeof field === 'string' ? field : field?.[lang] ?? field?.es ?? '';

// Route helpers: ES lives under /es/guide/<slug>, EN under /en/guide/<slug>.
export const getGuidePath = (language, slug) =>
  `/${normalizeLanguage(language)}/guide/${slug}`;

export const getGuideHubPath = (language) =>
  `/${normalizeLanguage(language)}/guide`;

export const getCalculatorPath = (language) =>
  normalizeLanguage(language) === 'en' ? '/en' : '/';

// Localizes the full guide structure for one language (falls back to ES).
export const getLocalizedGuide = (slug, language) => {
  const guide = getGuideBySlug(slug);
  if (!guide) return null;
  const lang = normalizeLanguage(language);

  const localizeBlocks = (blocks) =>
    blocks.map((block) => {
      if (block.type === 'list') {
        return {
          type: 'list',
          items: block.items.map((item) => localizeText(item, lang)),
        };
      }
      if (block.type === 'legalRef') {
        return { type: 'legalRef', refId: block.refId };
      }
      if (block.type === 'subsection') {
        return {
          type: 'subsection',
          heading: localizeText(block.heading, lang),
          blocks: localizeBlocks(block.blocks),
        };
      }
      return { type: 'paragraph', text: localizeText(block.text, lang) };
    });

  return {
    slug: guide.slug,
    publishedDate: guide.publishedDate,
    title: localizeText(guide.title, lang),
    shortTitle: localizeText(guide.shortTitle, lang),
    description: localizeText(guide.description, lang),
    excerpt: localizeText(guide.excerpt, lang),
    intro: guide.intro.map((paragraph) => localizeText(paragraph, lang)),
    sections: guide.sections.map((section) => ({
      heading: localizeText(section.heading, lang),
      blocks: localizeBlocks(section.blocks),
    })),
    related: guide.related,
  };
};

// Word count of the editorial body (intro + sections, incl. subsection
// paragraphs and list items) for one language. Used by the vitest suite to
// enforce the ~800-word minimum per language.
export const getGuideWordCount = (guide, language) => {
  const lang = normalizeLanguage(language);
  const countWords = (text) =>
    localizeText(text, lang).split(/\s+/).filter(Boolean).length;

  let total = guide.intro.reduce((sum, paragraph) => sum + countWords(paragraph), 0);

  const addBlocks = (blocks) => {
    for (const block of blocks) {
      if (block.type === 'paragraph') total += countWords(block.text);
      if (block.type === 'list') {
        total += block.items.reduce((sum, item) => sum + countWords(item), 0);
      }
      if (block.type === 'subsection') addBlocks(block.blocks);
    }
  };

  for (const section of guide.sections) addBlocks(section.blocks);
  return total;
};

const BASE_URL = 'https://www.regla183.com';

// Article JSON-LD shared by the React page (Helmet) and the prerender script.
// `dateModified` defaults to the published date; the prerender passes the
// build date so Google sees the real freshness of the static HTML.
export const buildArticleSchema = (slug, language, { dateModified } = {}) => {
  const guide = getLocalizedGuide(slug, language);
  if (!guide) return null;
  const lang = normalizeLanguage(language);

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.description,
    inLanguage: lang,
    datePublished: guide.publishedDate,
    dateModified: dateModified ?? guide.publishedDate,
    mainEntityOfPage: `${BASE_URL}${getGuidePath(lang, slug)}`,
    author: {
      '@type': 'Organization',
      name: 'TaxNomad',
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'TaxNomad',
      url: BASE_URL,
    },
  };
};

// BreadcrumbList JSON-LD: Inicio/Home > Guía/Guide > <guide title>.
export const buildBreadcrumbSchema = (slug, language) => {
  const guide = getLocalizedGuide(slug, language);
  if (!guide) return null;
  const lang = normalizeLanguage(language);

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: lang === 'es' ? 'Inicio' : 'Home',
        item: lang === 'es' ? `${BASE_URL}/` : `${BASE_URL}/en`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: lang === 'es' ? 'Guía' : 'Guide',
        item: `${BASE_URL}${getGuideHubPath(lang)}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: guide.shortTitle,
        item: `${BASE_URL}${getGuidePath(lang, slug)}`,
      },
    ],
  };
};
