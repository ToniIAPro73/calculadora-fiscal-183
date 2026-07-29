import { translations } from './translations.js';

// Static asset served from public/ (copied to dist/ by the Vite build).
// Regenerate it with: node tools/regenerate-example-pdf.mjs
export const EXAMPLE_PDF_URL = '/ejemplo.pdf';
export const PREMIUM_REPORT_ROUTE = 'premium-report';

// Sections of the premium PDF, in the exact order generateTaxReport()
// (src/lib/generatePdf.js) renders them. The copy for each section lives in
// translations[lang].premiumReport.sections[id].
export const REPORT_SECTION_IDS = [
  'taxpayer',
  'summary',
  'periods',
  'overlap',
  'economicInterests',
  'scenarioComparison',
  'conclusion',
  'legalNotice',
  'methodology',
];

/**
 * Returns the localized table of contents of the premium report:
 * [{ id, number, title, description, previewAlt }] in PDF order.
 */
export function getReportContents(language = 'es') {
  const sections = (translations[language] || translations.es).premiumReport.sections;

  return REPORT_SECTION_IDS.map((id, index) => ({
    id,
    number: index + 1,
    ...sections[id],
  }));
}
