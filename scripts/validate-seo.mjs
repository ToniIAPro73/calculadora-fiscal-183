// Validates the SEO contract of the production build (dist/).
// Runs automatically in the postbuild hook and in CI, after `npm run build`.
// Exits non-zero if any check fails.

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { GUIDE_SLUGS } from '../src/lib/guideContent/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');
const BASE_URL = 'https://www.regla183.com';

const SECTIONS = ['terms', 'privacy', 'legal', 'cookies', 'guide', 'about', 'irpf-estimator', 'premium-report'];

const publicRoutes = [
  { distPath: 'index.html', canonical: `${BASE_URL}/` },
  { distPath: 'en/index.html', canonical: `${BASE_URL}/en` },
  ...SECTIONS.flatMap((section) => [
    { distPath: `es/${section}/index.html`, canonical: `${BASE_URL}/es/${section}` },
    { distPath: `en/${section}/index.html`, canonical: `${BASE_URL}/en/${section}` },
  ]),
  // Content hub: profile guides, same slug in both languages.
  ...GUIDE_SLUGS.flatMap((slug) => [
    { distPath: `es/guide/${slug}/index.html`, canonical: `${BASE_URL}/es/guide/${slug}` },
    { distPath: `en/guide/${slug}/index.html`, canonical: `${BASE_URL}/en/guide/${slug}` },
  ]),
];

const errors = [];

// (a) Every public route has its pre-rendered index.html,
// (b) canonical matches its own URL,
// (c) hreflang es/en/x-default present.
for (const route of publicRoutes) {
  const filePath = join(distDir, route.distPath);
  if (!existsSync(filePath)) {
    errors.push(`[a] Missing pre-rendered file: dist/${route.distPath}`);
    continue;
  }

  const html = readFileSync(filePath, 'utf-8');

  const canonicalMatch = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
  if (!canonicalMatch) {
    errors.push(`[b] Missing canonical in dist/${route.distPath}`);
  } else if (canonicalMatch[1] !== route.canonical) {
    errors.push(
      `[b] Wrong canonical in dist/${route.distPath}: expected ${route.canonical}, got ${canonicalMatch[1]}`,
    );
  }

  for (const lang of ['es', 'en', 'x-default']) {
    if (!new RegExp(`<link\\s+rel="alternate"\\s+hreflang="${lang}"`, 'i').test(html)) {
      errors.push(`[c] Missing hreflang "${lang}" in dist/${route.distPath}`);
    }
  }
}

// (d) #seo-root must not exist in any generated HTML file.
const listHtmlFiles = (dir) =>
  readdirSync(dir).flatMap((entry) => {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) return listHtmlFiles(fullPath);
    return fullPath.endsWith('.html') ? [fullPath] : [];
  });

for (const filePath of listHtmlFiles(distDir)) {
  const html = readFileSync(filePath, 'utf-8');
  if (html.includes('id="seo-root"')) {
    errors.push(`[d] Forbidden #seo-root block found in ${filePath.replace(`${distDir}/`, 'dist/')}`);
  }
}

// (e) No sitemap URL may end in a redirect per vercel.json.
const vercelConfig = JSON.parse(readFileSync(join(rootDir, 'vercel.json'), 'utf-8'));
const redirectSources = new Set(
  (vercelConfig.redirects ?? []).map((redirect) => redirect.source),
);

const sitemapPath = join(distDir, 'sitemap.xml');
if (!existsSync(sitemapPath)) {
  errors.push('[e] Missing dist/sitemap.xml');
} else {
  const sitemap = readFileSync(sitemapPath, 'utf-8');
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  for (const loc of locs) {
    if (!loc.startsWith(BASE_URL)) {
      errors.push(`[e] Sitemap URL outside expected host: ${loc}`);
      continue;
    }
    const path = loc.slice(BASE_URL.length) || '/';
    if (redirectSources.has(path) || (path !== '/' && path.endsWith('/'))) {
      errors.push(`[e] Sitemap URL ends in a redirect per vercel.json: ${loc}`);
    }
  }
}

if (errors.length > 0) {
  console.error(`\n❌ SEO validation failed (${errors.length} error${errors.length === 1 ? '' : 's'}):`);
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

console.log(`✅ SEO validation passed: ${publicRoutes.length} routes, sitemap and vercel.json consistent.`);
