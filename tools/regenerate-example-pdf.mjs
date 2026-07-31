import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { buildExampleReportPayload } from '../src/lib/reportMetadata.js';
import { generateTaxReport } from '../src/lib/generatePdf.js';
import { EXAMPLE_PDF_URLS } from '../src/lib/reportContents.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
// The example PDFs are static public assets: the "¿Qué incluye el informe?"
// page (/es|en/premium-report) links to them and Vite copies public/ into
// dist/. One file per UI language (EXAMPLE_PDF_URLS in reportContents.js).
const logoPath = path.join(repoRoot, 'src', 'assets', 'logo-report.png');

const example = buildExampleReportPayload();
const logoBase64 = await readFile(logoPath, 'base64');
const brandLogoDataUrl = `data:image/png;base64,${logoBase64}`;

for (const language of Object.keys(EXAMPLE_PDF_URLS)) {
  const outputPath = path.join(repoRoot, 'public', EXAMPLE_PDF_URLS[language]);
  const doc = await generateTaxReport({
    ...example,
    language,
    exampleMode: true,
    brandLogoDataUrl,
  });

  const pdfBytes = doc.output('arraybuffer');
  await writeFile(outputPath, Buffer.from(pdfBytes));
  console.log(`✓ PDF de ejemplo [${language}] regenerado → public${EXAMPLE_PDF_URLS[language]} (${pdfBytes.byteLength} bytes)`);
}
