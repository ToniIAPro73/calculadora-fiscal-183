// Centralised catalogue of the official legal references cited across the app.
// Each entry carries a stable official URL (BOE for legislation, the AEAT
// doctrine page for DGT binding rulings, whose per-ruling URLs are not stable)
// and a short ES/EN excerpt used by the <LegalRef> tooltip.
export const LEGAL_REFS = [
  {
    id: 'lirpf-art9',
    title: {
      es: 'Art. 9 de la Ley 35/2006 (LIRPF)',
      en: 'Article 9 of Law 35/2006 (PIT Act)',
    },
    url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764#a9',
    excerpt: {
      es: 'Se considera residente fiscal en España quien permanezca más de 183 días, durante el año natural, en territorio español. Las ausencias temporales se computan como permanencia salvo que se acredite la residencia fiscal en otro país.',
      en: 'A person is considered tax resident in Spain if they spend more than 183 days in Spanish territory during the calendar year. Temporary absences count as presence unless tax residency in another country is proven.',
    },
  },
  {
    id: 'dgt-ausencias-esporadicas',
    title: {
      es: 'DGT · Ausencias esporádicas (consultas vinculantes)',
      en: 'DGT · Sporadic absences (binding rulings)',
    },
    url: 'https://sede.agenciatributaria.gob.es/Sede/normativa-criterios-interpretativos/doctrina-criterios-interpretativos.html',
    excerpt: {
      es: 'La Dirección General de Tributos interpreta que las ausencias esporádicas se computan como días de permanencia en España, salvo que el contribuyente acredite su residencia fiscal en otro país. Criterio recogido en sus consultas vinculantes.',
      en: 'The Directorate-General for Taxes (DGT) interprets that sporadic absences count as days of presence in Spain, unless the taxpayer proves tax residency in another country. Criterion set out in its binding rulings.',
    },
  },
  {
    id: 'dgt-intereses-economicos',
    title: {
      es: 'DGT · Centro de intereses económicos (consultas vinculantes)',
      en: 'DGT · Centre of economic interests (binding rulings)',
    },
    url: 'https://sede.agenciatributaria.gob.es/Sede/normativa-criterios-interpretativos/doctrina-criterios-interpretativos.html',
    excerpt: {
      es: 'La DGT entiende que el núcleo principal o la base de los intereses económicos se sitúa en España cuando en España se genera la mayor parte de la base imponible del IRPF del contribuyente. Criterio recogido en sus consultas vinculantes.',
      en: 'The DGT considers that the main nucleus or base of economic interests lies in Spain when most of the taxpayer’s personal income tax base is generated there. Criterion set out in its binding rulings.',
    },
  },
];

export const LEGAL_REF_IDS = LEGAL_REFS.map((ref) => ref.id);

export const getLegalRef = (id) => LEGAL_REFS.find((ref) => ref.id === id) ?? null;

const SUPPORTED_LANGUAGES = ['es', 'en'];

// Falls back to Spanish when the language is missing or unsupported.
export const getLocalizedLegalRef = (id, language) => {
  const ref = getLegalRef(id);
  if (!ref) return null;
  const lang = SUPPORTED_LANGUAGES.includes(language) ? language : 'es';
  return {
    id: ref.id,
    url: ref.url,
    title: ref.title[lang],
    excerpt: ref.excerpt[lang],
  };
};
