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
    id: 'lirpf-art93',
    title: {
      es: 'Art. 93 de la Ley 35/2006 (régimen de impatriados)',
      en: 'Article 93 of Law 35/2006 (impatriate regime)',
    },
    url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2006-20764#a93',
    excerpt: {
      es: 'Los trabajadores desplazados a España pueden optar por tributar en el IRPF como contribuyentes del Impuesto sobre la Renta de no Residentes, manteniendo la condición de residentes fiscales en España, durante el período impositivo del cambio de residencia y los cinco siguientes.',
      en: 'Workers relocated to Spain may opt to be taxed under the Non-Resident Income Tax rules while remaining Spanish tax residents, during the tax period of the change of residence and the following five periods.',
    },
  },
  {
    id: 'ley-startups',
    title: {
      es: 'Ley 28/2022 (Ley de Startups) · teletrabajadores internacionales',
      en: 'Law 28/2022 (Startups Act) · international remote workers',
    },
    url: 'https://www.boe.es/buscar/act.php?id=BOE-A-2022-21739',
    excerpt: {
      es: 'La Ley 28/2022 crea el visado para teletrabajadores de carácter internacional (visado de nómada digital) y amplía el acceso al régimen especial de trabajadores desplazados del art. 93 LIRPF, incluyendo a los teletrabajadores internacionales.',
      en: 'Law 28/2022 creates the international remote worker visa (digital nomad visa) and widens access to the special regime for posted workers in Art. 93 of the PIT Act, including international remote workers.',
    },
  },
  {
    id: 'dgt-convenios-cdi',
    title: {
      es: 'DGT · Convenios de doble imposición (doctrina)',
      en: 'DGT · Double taxation treaties (doctrine)',
    },
    url: 'https://sede.agenciatributaria.gob.es/Sede/normativa-criterios-interpretativos/doctrina-criterios-interpretativos.html',
    excerpt: {
      es: 'La Dirección General de Tributos aplica los convenios de doble imposición (CDI) con prevalencia sobre la normativa interna: los criterios de desempate (domicilio permanente, centro de intereses vitales, residencia habitual, nacionalidad) resuelven los conflictos de doble residencia.',
      en: 'The Directorate-General for Taxes (DGT) applies double taxation treaties (DTTs) with precedence over domestic law: tie-breaker criteria (permanent home, centre of vital interests, habitual abode, nationality) resolve dual-residency conflicts.',
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
