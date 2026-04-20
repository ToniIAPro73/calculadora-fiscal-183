import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { generateTaxReport } from '../src/lib/generatePdf.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const outputPath = path.join(repoRoot, 'TaxNomad_Informe_Antonio_Ballesteros_Alonso_2026.pdf');
const logoPath = path.join(repoRoot, 'public', 'logo-calculadora-183-clean-512.png');
const logoBase64 = await readFile(logoPath, 'base64');
const brandLogoDataUrl = `data:image/png;base64,${logoBase64}`;

const doc = await generateTaxReport({
  name: 'Antonio Ballesteros Alonso',
  documentType: 'passport',
  taxId: '35345656344',
  totalDays: 90,
  ranges: [
    { start: new Date('2026-03-01'), end: new Date('2026-05-29'), days: 90 },
    { start: new Date('2026-04-06'), end: new Date('2026-04-09'), days: 4 },
  ],
  language: 'es',
  exampleMode: false,
  brandLogoDataUrl,
});

const pdfBytes = doc.output('arraybuffer');
await writeFile(outputPath, Buffer.from(pdfBytes));
