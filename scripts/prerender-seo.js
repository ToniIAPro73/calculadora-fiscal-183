// Post-build script: generates static HTML per route with SEO tags pre-injected.
// vercel.json rewrites each public route (e.g. /es/terms) to its generated file
// (dist/es/terms/index.html) — no JS execution needed for Google to read
// canonical/hreflang tags or the static body links (#seo-content).

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');
const BASE_URL = 'https://www.regla183.com';

const routes = [
  {
    distPath: 'index.html',
    lang: 'es',
    canonical: `${BASE_URL}/`,
    title: 'Calculadora Regla 183 España | Residencia Fiscal',
    description: 'Calcula si eres residente fiscal en España según la regla de los 183 días. Herramienta gratuita para nómadas digitales y expatriados.',
    hreflang: [
      { lang: 'es', href: `${BASE_URL}/` },
      { lang: 'en', href: `${BASE_URL}/en` },
      { lang: 'x-default', href: `${BASE_URL}/` },
    ],
  },
  {
    distPath: 'es/terms/index.html',
    lang: 'es',
    canonical: `${BASE_URL}/es/terms`,
    title: 'Términos de Servicio · TaxNomad',
    description: 'Condiciones de uso del servicio TaxNomad para el informe premium y la calculadora de la regla de 183 días en España.',
    hreflang: [
      { lang: 'es', href: `${BASE_URL}/es/terms` },
      { lang: 'en', href: `${BASE_URL}/en/terms` },
      { lang: 'x-default', href: `${BASE_URL}/es/terms` },
    ],
  },
  {
    distPath: 'es/privacy/index.html',
    lang: 'es',
    canonical: `${BASE_URL}/es/privacy`,
    title: 'Política de Privacidad · TaxNomad',
    description: 'Política de privacidad de TaxNomad para la calculadora de la regla de 183 días y el informe premium.',
    hreflang: [
      { lang: 'es', href: `${BASE_URL}/es/privacy` },
      { lang: 'en', href: `${BASE_URL}/en/privacy` },
      { lang: 'x-default', href: `${BASE_URL}/es/privacy` },
    ],
  },
  {
    distPath: 'es/legal/index.html',
    lang: 'es',
    canonical: `${BASE_URL}/es/legal`,
    title: 'Aviso Legal · TaxNomad',
    description: 'Aviso legal de TaxNomad con la información identificativa del titular conforme a la LSSICE.',
    hreflang: [
      { lang: 'es', href: `${BASE_URL}/es/legal` },
      { lang: 'en', href: `${BASE_URL}/en/legal` },
      { lang: 'x-default', href: `${BASE_URL}/es/legal` },
    ],
  },
  {
    distPath: 'es/cookies/index.html',
    lang: 'es',
    canonical: `${BASE_URL}/es/cookies`,
    title: 'Política de Cookies · TaxNomad',
    description: 'Política de cookies de TaxNomad con detalle sobre tecnologías técnicas, consentimiento y servicios de terceros.',
    hreflang: [
      { lang: 'es', href: `${BASE_URL}/es/cookies` },
      { lang: 'en', href: `${BASE_URL}/en/cookies` },
      { lang: 'x-default', href: `${BASE_URL}/es/cookies` },
    ],
  },
  {
    distPath: 'es/guide/index.html',
    lang: 'es',
    canonical: `${BASE_URL}/es/guide`,
    title: 'Guía Completa de la Regla de los 183 Días en España · TaxNomad',
    description: 'Todo lo que necesitas saber sobre la regla de los 183 días para determinar tu residencia fiscal en España. Explicación detallada con ejemplos y fuentes oficiales.',
    hreflang: [
      { lang: 'es', href: `${BASE_URL}/es/guide` },
      { lang: 'en', href: `${BASE_URL}/en/guide` },
      { lang: 'x-default', href: `${BASE_URL}/es/guide` },
    ],
  },
  {
    distPath: 'es/about/index.html',
    lang: 'es',
    canonical: `${BASE_URL}/es/about`,
    title: 'Sobre TaxNomad · Quiénes Somos',
    description: 'Conoce el equipo y la metodología detrás de TaxNomad, la calculadora de residencia fiscal de referencia en España.',
    hreflang: [
      { lang: 'es', href: `${BASE_URL}/es/about` },
      { lang: 'en', href: `${BASE_URL}/en/about` },
      { lang: 'x-default', href: `${BASE_URL}/es/about` },
    ],
  },
  {
    distPath: 'en/index.html',
    lang: 'en',
    canonical: `${BASE_URL}/en`,
    title: '183-Day Rule Calculator Spain | Tax Residency',
    description: 'Calculate if you are a tax resident in Spain under the 183-day rule. Free tool for digital nomads and expats.',
    hreflang: [
      { lang: 'es', href: `${BASE_URL}/` },
      { lang: 'en', href: `${BASE_URL}/en` },
      { lang: 'x-default', href: `${BASE_URL}/` },
    ],
  },
  {
    distPath: 'en/terms/index.html',
    lang: 'en',
    canonical: `${BASE_URL}/en/terms`,
    title: 'Terms of Service · TaxNomad',
    description: 'Terms of service for TaxNomad\'s 183-day rule calculator and premium report.',
    hreflang: [
      { lang: 'es', href: `${BASE_URL}/es/terms` },
      { lang: 'en', href: `${BASE_URL}/en/terms` },
      { lang: 'x-default', href: `${BASE_URL}/es/terms` },
    ],
  },
  {
    distPath: 'en/privacy/index.html',
    lang: 'en',
    canonical: `${BASE_URL}/en/privacy`,
    title: 'Privacy Policy · TaxNomad',
    description: 'Privacy policy for TaxNomad\'s 183-day rule calculator and premium report service.',
    hreflang: [
      { lang: 'es', href: `${BASE_URL}/es/privacy` },
      { lang: 'en', href: `${BASE_URL}/en/privacy` },
      { lang: 'x-default', href: `${BASE_URL}/es/privacy` },
    ],
  },
  {
    distPath: 'en/legal/index.html',
    lang: 'en',
    canonical: `${BASE_URL}/en/legal`,
    title: 'Legal Notice · TaxNomad',
    description: 'Legal notice for TaxNomad including owner identification details as required by Spanish law.',
    hreflang: [
      { lang: 'es', href: `${BASE_URL}/es/legal` },
      { lang: 'en', href: `${BASE_URL}/en/legal` },
      { lang: 'x-default', href: `${BASE_URL}/es/legal` },
    ],
  },
  {
    distPath: 'en/cookies/index.html',
    lang: 'en',
    canonical: `${BASE_URL}/en/cookies`,
    title: 'Cookie Policy · TaxNomad',
    description: 'TaxNomad cookie policy describing technical storage, consent handling, and third-party payment technologies.',
    hreflang: [
      { lang: 'es', href: `${BASE_URL}/es/cookies` },
      { lang: 'en', href: `${BASE_URL}/en/cookies` },
      { lang: 'x-default', href: `${BASE_URL}/es/cookies` },
    ],
  },
  {
    distPath: 'en/guide/index.html',
    lang: 'en',
    canonical: `${BASE_URL}/en/guide`,
    title: 'Complete Guide to the 183-Day Rule in Spain · TaxNomad',
    description: 'Everything you need to know about the 183-day rule to determine your tax residency in Spain. Detailed explanation with examples and official sources.',
    hreflang: [
      { lang: 'es', href: `${BASE_URL}/es/guide` },
      { lang: 'en', href: `${BASE_URL}/en/guide` },
      { lang: 'x-default', href: `${BASE_URL}/es/guide` },
    ],
  },
  {
    distPath: 'en/about/index.html',
    lang: 'en',
    canonical: `${BASE_URL}/en/about`,
    title: 'About TaxNomad · Who We Are',
    description: 'Meet the team and methodology behind TaxNomad, the reference tax residency calculator for Spain.',
    hreflang: [
      { lang: 'es', href: `${BASE_URL}/es/about` },
      { lang: 'en', href: `${BASE_URL}/en/about` },
      { lang: 'x-default', href: `${BASE_URL}/es/about` },
    ],
  },
];

const NAV_LINKS = {
  es: [
    { href: '/', label: 'Inicio' },
    { href: '/es/guide', label: 'Guía de la regla de los 183 días' },
    { href: '/es/about', label: 'Sobre TaxNomad' },
    { href: '/es/legal', label: 'Aviso legal' },
    { href: '/es/privacy', label: 'Política de privacidad' },
    { href: '/es/terms', label: 'Términos de servicio' },
    { href: '/es/cookies', label: 'Política de cookies' },
  ],
  en: [
    { href: '/en', label: 'Home' },
    { href: '/en/guide', label: '183-day rule guide' },
    { href: '/en/about', label: 'About TaxNomad' },
    { href: '/en/legal', label: 'Legal notice' },
    { href: '/en/privacy', label: 'Privacy policy' },
    { href: '/en/terms', label: 'Terms of service' },
    { href: '/en/cookies', label: 'Cookie policy' },
  ],
};

const baseHtml = readFileSync(join(distDir, 'index.html'), 'utf-8');

for (const route of routes) {
  let html = baseHtml;

  // Strip any existing title, description, canonical, hreflang alternate tags and robots meta
  html = html.replace(/<title>[^<]*<\/title>/, '');
  html = html.replace(/<meta\s+name="description"[^>]*>/i, '');
  html = html.replace(/<meta\s+name="robots"[^>]*>/i, '');
  html = html.replace(/<link\s+rel="canonical"[^>]*>/gi, '');
  html = html.replace(/<link\s+rel="alternate"\s+hreflang[^>]*>/gi, '');

  // Update <html lang> attribute to match the page language
  html = html.replace(/<html\s+lang="[^"]*"/, `<html lang="${route.lang}"`);

  const hreflangTags = route.hreflang
    .map(h => `  <link rel="alternate" hreflang="${h.lang}" href="${h.href}">`)
    .join('\n');

  const ogUrl = route.canonical;
  const ogType = route.distPath === 'index.html' ? 'website' : 'article';

  const seoBlock = [
    `  <title>${route.title}</title>`,
    `  <meta name="description" content="${route.description}">`,
    `  <meta name="robots" content="index, follow">`,
    `  <link rel="canonical" href="${route.canonical}">`,
    `  <meta property="og:title" content="${route.title}">`,
    `  <meta property="og:description" content="${route.description}">`,
    `  <meta property="og:url" content="${ogUrl}">`,
    `  <meta property="og:type" content="${ogType}">`,
    `  <meta property="og:site_name" content="TaxNomad">`,
    `  <meta name="twitter:card" content="summary">`,
    `  <meta name="twitter:title" content="${route.title}">`,
    `  <meta name="twitter:description" content="${route.description}">`,
    hreflangTags,
  ].join('\n');

  html = html.replace('</head>', `${seoBlock}\n</head>`);

  // Static body content: real h1/paragraph plus crawlable <a href> links.
  // The React app removes this block on mount (see src/main.jsx), so it only
  // exists in the pre-rendered HTML served to crawlers / no-JS clients.
  const heading = route.title.split(/[·|]/)[0].trim();
  const navLinks = NAV_LINKS[route.lang]
    .map(link => `      <a href="${link.href}">${link.label}</a>`)
    .join('\n');

  const bodyBlock = [
    `<div id="seo-content">`,
    `  <main>`,
    `    <h1>${heading}</h1>`,
    `    <p>${route.description}</p>`,
    `    <nav>`,
    navLinks,
    `    </nav>`,
    `  </main>`,
    `</div>`,
  ].join('\n');

  html = html.replace('<div id="root">', `${bodyBlock}\n<div id="root">`);

  const outputPath = join(distDir, route.distPath);
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, html, 'utf-8');
  console.log(`✓ Pre-rendered → dist/${route.distPath}`);
}

// Keep sitemap <lastmod> in sync with the real deploy date on every build.
const today = new Date().toISOString().slice(0, 10);
const sitemapPath = join(distDir, 'sitemap.xml');
try {
  const sitemap = readFileSync(sitemapPath, 'utf-8');
  const updated = sitemap.replace(/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g, `<lastmod>${today}</lastmod>`);
  writeFileSync(sitemapPath, updated, 'utf-8');
  console.log(`✓ Sitemap lastmod updated → ${today}`);
} catch {
  console.warn('⚠ dist/sitemap.xml not found; skipping lastmod update.');
}

console.log(`\n✅ Pre-rendering complete: ${routes.length} routes generated.`);
