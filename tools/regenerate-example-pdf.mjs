import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { buildExampleReportPayload } from '../src/lib/reportMetadata.js';
import { generateTaxReport } from '../src/lib/generatePdf.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
// The example PDF is a static public asset: the "¿Qué incluye el informe?"
// page (/es|en/premium-report) links to it and Vite copies public/ into dist/.
const outputPath = path.join(repoRoot, 'public', 'ejemplo.pdf');
// Downscaled 256px copy of src/assets/logo.png: jsPDF stores PNGs as raw
// pixels under Node, so embedding the full 1024px logo would make the
// example PDF weigh several MB.
const logoPath = path.join(repoRoot, 'src', 'assets', 'logo-report.png');

const example = buildExampleReportPayload();
const logoBase64 = await readFile(logoPath, 'base64');
const brandLogoDataUrl = `data:image/png;base64,${logoBase64}`;

const doc = await generateTaxReport({
  ...example,
  language: 'es',
  exampleMode: true,
  brandLogoDataUrl,
});

const pdfBytes = doc.output('arraybuffer');
await writeFile(outputPath, Buffer.from(pdfBytes));
console.log(`✓ PDF de ejemplo regenerado → public/ejemplo.pdf (${pdfBytes.byteLength} bytes)`);
