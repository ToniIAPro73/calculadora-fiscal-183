/**
 * Double taxation treaties (CDI/DTT) support module.
 *
 * When two countries treat the same person as tax resident, the treaty
 * prevails over domestic law and its Article 4 (OECD Model) tie-breaker
 * rules decide the single treaty residence. This module holds the reference
 * table for the countries most common among the target audience, each with
 * a stable official source URL (Spanish Tax Agency treaty pages, verified
 * to respond with HTTP 200).
 *
 * The selected "second country" is stored only in the browser's
 * localStorage and is never sent to any server.
 */

// Official Spanish Tax Agency (AEAT) listing of every treaty signed by Spain.
export const AEAT_TREATY_LIST_URL =
  'https://sede.agenciatributaria.gob.es/Sede/normativa-criterios-interpretativos/fiscalidad-internacional/convenios-doble-imposicion-firmados-espana.html';

const AEAT_TREATY_BASE_URL =
  'https://sede.agenciatributaria.gob.es/Sede/normativa-criterios-interpretativos/fiscalidad-internacional/convenios-doble-imposicion-firmados-espana';

// Special value for any country outside the reference table: the panel then
// shows a generic message pointing to the official AEAT treaty listing.
export const OTHER_COUNTRY_OPTION = 'other';

export const TAX_TREATY_COUNTRIES = [
  {
    id: 'reino-unido',
    name: { es: 'Reino Unido', en: 'United Kingdom' },
    sourceUrl: `${AEAT_TREATY_BASE_URL}/reino-unido.html`,
  },
  {
    id: 'alemania',
    name: { es: 'Alemania', en: 'Germany' },
    sourceUrl: `${AEAT_TREATY_BASE_URL}/alemania.html`,
  },
  {
    id: 'francia',
    name: { es: 'Francia', en: 'France' },
    sourceUrl: `${AEAT_TREATY_BASE_URL}/francia.html`,
  },
  {
    id: 'portugal',
    name: { es: 'Portugal', en: 'Portugal' },
    sourceUrl: `${AEAT_TREATY_BASE_URL}/portugal.html`,
  },
  {
    id: 'paises-bajos',
    name: { es: 'Países Bajos', en: 'Netherlands' },
    sourceUrl: `${AEAT_TREATY_BASE_URL}/holanda.html`,
  },
  {
    id: 'estados-unidos',
    name: { es: 'Estados Unidos', en: 'United States' },
    sourceUrl: `${AEAT_TREATY_BASE_URL}/estados-unidos.html`,
  },
  {
    id: 'andorra',
    name: { es: 'Andorra', en: 'Andorra' },
    sourceUrl: `${AEAT_TREATY_BASE_URL}/andorra.html`,
  },
];

// Tie-breaker rules of Article 4 of the OECD Model Tax Convention, in the
// order they are applied. Every treaty in the table above follows this
// order; each rule resolves the dual residence only if the previous one
// could not.
export const TIE_BREAKER_RULES = [
  {
    id: 'permanentHome',
    es: 'Vivienda permanente: se considera residente solo del país donde disponga de una vivienda permanente a su disposición.',
    en: 'Permanent home: the person is deemed resident only in the country where they have a permanent home available to them.',
  },
  {
    id: 'vitalInterests',
    es: 'Centro de intereses vitales: si tiene vivienda permanente en ambos países, prevalece el de los vínculos personales y económicos más estrechos.',
    en: 'Centre of vital interests: if they have a permanent home in both countries, the country with the closer personal and economic ties prevails.',
  },
  {
    id: 'habitualAbode',
    es: 'Morada habitual: si el centro de intereses vitales no puede determinarse, prevalece el país donde reside habitualmente.',
    en: 'Habitual abode: if the centre of vital interests cannot be determined, the country where they habitually live prevails.',
  },
  {
    id: 'nationality',
    es: 'Nacionalidad: si reside habitualmente en ambos países o en ninguno, se decide por la nacionalidad.',
    en: 'Nationality: if they habitually live in both countries or in neither, nationality decides.',
  },
  {
    id: 'mutualAgreement',
    es: 'Procedimiento amistoso: en último término, las administraciones tributarias de ambos países resuelven el caso de común acuerdo.',
    en: 'Mutual agreement procedure: as a last resort, the tax authorities of both countries settle the case by mutual agreement.',
  },
];

export function getTaxTreatyCountry(id) {
  return TAX_TREATY_COUNTRIES.find((country) => country.id === id) ?? null;
}

/**
 * A stored selection is valid only when it matches a known treaty country
 * or the explicit "other country" option; anything else is discarded so
 * corrupted or stale values cannot break the panel.
 */
export function isValidSecondCountrySelection(value) {
  return (
    typeof value === 'string' &&
    (value === OTHER_COUNTRY_OPTION || getTaxTreatyCountry(value) !== null)
  );
}

export const TAX_TREATY_STORAGE_KEY = 'taxnomad_second_country';

function getStorage() {
  try {
    const storage = globalThis.localStorage;
    return storage ?? null;
  } catch {
    return null;
  }
}

// Returns the selected country id, OTHER_COUNTRY_OPTION, or null when
// nothing valid is stored.
export function loadSecondCountry() {
  const storage = getStorage();
  if (!storage) return null;

  try {
    const raw = storage.getItem(TAX_TREATY_STORAGE_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw);
    return isValidSecondCountrySelection(value) ? value : null;
  } catch {
    return null;
  }
}

export function saveSecondCountry(value) {
  const storage = getStorage();
  if (!storage) return;

  try {
    if (!isValidSecondCountrySelection(value)) {
      storage.removeItem(TAX_TREATY_STORAGE_KEY);
      return;
    }
    storage.setItem(TAX_TREATY_STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Storage full or unavailable: persistence is best-effort only.
  }
}

export function clearSecondCountry() {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.removeItem(TAX_TREATY_STORAGE_KEY);
  } catch {
    // Storage unavailable: nothing to clear.
  }
}
