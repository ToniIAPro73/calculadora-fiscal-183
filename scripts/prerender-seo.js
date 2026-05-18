// Post-build script: generates static HTML per route with SEO tags pre-injected.
// With cleanUrls:true in Vercel, dist/es/cookies/index.html is served directly
// for /es/cookies — no JS execution needed for Google to read canonical tags.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, '..', 'dist');
const BASE_URL = 'https://www.regla183.com';

const routes = [
  {
    distPath: 'index.html',
    canonical: `${BASE_URL}/`,
    title: 'Calculadora Regla 183 España | Residencia Fiscal',
    description: 'Calcula si eres residente fiscal en España según la regla de los 183 días.',
    hreflang: [
      { lang: 'es', href: `${BASE_URL}/` },
      { lang: 'en', href: `${BASE_URL}/en` },
      { lang: 'x-default', href: `${BASE_URL}/` },
    ],
  },
  {
    distPath: 'es/terms/index.html',
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
    distPath: 'en/index.html',
    canonical: `${BASE_URL}/en`,
    title: '183-Day Rule Calculator Spain | Tax Residency',
    description: 'Calculate if you are a tax resident in Spain under the 183-day rule.',
    hreflang: [
      { lang: 'es', href: `${BASE_URL}/` },
      { lang: 'en', href: `${BASE_URL}/en` },
      { lang: 'x-default', href: `${BASE_URL}/` },
    ],
  },
  {
    distPath: 'en/terms/index.html',
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
    canonical: `${BASE_URL}/en/cookies`,
    title: 'Cookie Policy · TaxNomad',
    description: 'TaxNomad cookie policy describing technical storage, consent handling, and third-party payment technologies.',
    hreflang: [
      { lang: 'es', href: `${BASE_URL}/es/cookies` },
      { lang: 'en', href: `${BASE_URL}/en/cookies` },
      { lang: 'x-default', href: `${BASE_URL}/es/cookies` },
    ],
  },
];

const baseHtml = readFileSync(join(distDir, 'index.html'), 'utf-8');

for (const route of routes) {
  let html = baseHtml;

  // Strip any existing title, description, canonical and hreflang alternate tags
  html = html.replace(/<title>[^<]*<\/title>/, '');
  html = html.replace(/<meta\s+name="description"[^>]*>/i, '');
  html = html.replace(/<link\s+rel="canonical"[^>]*>/gi, '');
  html = html.replace(/<link\s+rel="alternate"\s+hreflang[^>]*>/gi, '');

  const hreflangTags = route.hreflang
    .map(h => `  <link rel="alternate" hreflang="${h.lang}" href="${h.href}">`)
    .join('\n');

  const seoBlock = [
    `  <title>${route.title}</title>`,
    `  <meta name="description" content="${route.description}">`,
    `  <meta name="robots" content="index, follow">`,
    `  <link rel="canonical" href="${route.canonical}">`,
    hreflangTags,
  ].join('\n');

  html = html.replace('</head>', `${seoBlock}\n</head>`);

  const outputPath = join(distDir, route.distPath);
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, html, 'utf-8');
  console.log(`✓ Pre-rendered → dist/${route.distPath}`);
}

console.log(`\n✅ Pre-rendering complete: ${routes.length} routes generated.`);
