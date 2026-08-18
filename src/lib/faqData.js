// Single source of truth for the FAQ blocks shown on the home page and the
// guide. Each entry flags the pages where it appears and carries the ES/EN
// question and answer as plain text: the same strings feed the visible
// accordion and the FAQPage JSON-LD (Google requires parity between the
// structured data and the visible content).
// Entries with `legalRefId` additionally render a <LegalRef> citation under
// the visible answer; the structured data stays plain text.

export const FAQ_PAGE_IDS = ['home', 'guide'];

export const FAQ_ITEMS = [
  {
    id: 'what-is-183-rule',
    pages: ['home', 'guide'],
    legalRefId: 'lirpf-art9',
    question: {
      es: '¿Qué es la regla de los 183 días?',
      en: 'What is the 183-day rule?',
    },
    answer: {
      es: 'Es el criterio principal del artículo 9 de la LIRPF para determinar la residencia fiscal en España: si permaneces más de 183 días en territorio español durante un año natural, se te considera residente fiscal. En ese caso tributas en España por tus rentas mundiales. El criterio se aplica por año natural completo, con independencia de la fecha de llegada.',
      en: 'It is the main criterion in Article 9 of the Spanish Personal Income Tax Act (LIRPF) for determining tax residency: if you spend more than 183 days in Spanish territory during a calendar year, you are considered a tax resident. In that case you are taxed in Spain on your worldwide income. The criterion applies to the full calendar year, regardless of your arrival date.',
    },
  },
  {
    id: 'sporadic-absences',
    pages: ['home', 'guide'],
    legalRefId: 'dgt-ausencias-esporadicas',
    question: {
      es: '¿Las ausencias esporádicas cuentan como días en España?',
      en: 'Do sporadic absences count as days in Spain?',
    },
    answer: {
      es: 'Sí. Según el criterio de la Dirección General de Tributos, las ausencias esporádicas (vacaciones cortas, viajes de negocio) se computan como días de permanencia en España, salvo que acredites tu residencia fiscal en otro país. Por eso es importante conservar evidencia documental de los desplazamientos.',
      en: 'Yes. Under the Directorate-General for Taxes (DGT) criterion, sporadic absences (short holidays, business trips) count as days of presence in Spain, unless you prove tax residency in another country. That is why keeping documentary evidence of your trips matters.',
    },
  },
  {
    id: 'arrival-year',
    pages: ['home', 'guide'],
    question: {
      es: '¿Qué pasa el año que llego a España?',
      en: 'What happens the year I move to Spain?',
    },
    answer: {
      es: 'La residencia fiscal se determina por año natural completo: si el año de tu llegada superas los 183 días de permanencia, se te considera residente durante todo ese ejercicio. Si llegas en la segunda mitad del año y no alcanzas el umbral, normalmente no serás residente ese año, salvo que concurra otro criterio como el centro de intereses económicos. Existen regímenes especiales, como el de impatriados (art. 93 LIRPF), que pueden cambiar este resultado.',
      en: 'Tax residency is determined for the full calendar year: if you exceed 183 days of presence in your arrival year, you are considered a resident for that entire tax year. If you arrive in the second half of the year and stay below the threshold, you will generally not be resident that year, unless another criterion such as the centre of economic interests applies. Special regimes, such as the impatriate regime (Art. 93 LIRPF), can change this outcome.',
    },
  },
  {
    id: 'double-taxation',
    pages: ['home', 'guide'],
    question: {
      es: '¿Cómo afecta el convenio de doble imposición?',
      en: 'How does the double taxation treaty affect me?',
    },
    answer: {
      es: 'Si según la legislación interna de dos países eres residente fiscal en ambos, el convenio de doble imposición (CDI) prevalece y aplica criterios de desempate en este orden: domicilio permanente, centro de intereses vitales, residencia habitual y nacionalidad. España tiene CDI firmados con más de 90 países. El resultado del desempate determina en qué país tributas como residente.',
      en: 'If under the domestic laws of two countries you are a tax resident in both, the double taxation treaty (DTT) prevails and applies tie-breaker criteria in this order: permanent home, centre of vital interests, habitual abode and nationality. Spain has signed DTTs with more than 90 countries. The tie-breaker outcome determines in which country you are taxed as a resident.',
    },
  },
  {
    id: 'count-days',
    pages: ['home', 'guide'],
    question: {
      es: '¿Cómo se cuentan los días de presencia?',
      en: 'How are days of presence counted?',
    },
    answer: {
      es: 'Cuenta cualquier día en el que estés físicamente en territorio español, aunque sea solo unas horas: el día de llegada y el de salida computan como días completos. Se incluyen la península, Baleares, Canarias, Ceuta y Melilla. Las ausencias temporales no interrumpen el cómputo salvo que acredites residencia fiscal en otro país.',
      en: 'Any day you are physically in Spanish territory counts, even for just a few hours: arrival and departure days count as full days. Mainland Spain, the Balearic and Canary Islands, and Ceuta and Melilla are included. Temporary absences do not interrupt the count unless you prove tax residency in another country.',
    },
  },
  {
    id: 'exceed-183',
    pages: ['home'],
    question: {
      es: '¿Qué pasa si supero los 183 días?',
      en: 'What happens if I exceed 183 days?',
    },
    answer: {
      es: 'Pasas a ser residente fiscal en España y debes declarar tus rentas mundiales: ingresos del trabajo, rentas del capital, ganancias patrimoniales e imputación de rentas inmobiliarias. Además puedes quedar sujeto al Impuesto sobre el Patrimonio según tu comunidad autónoma. Ante esta situación, es recomendable buscar asesoramiento fiscal profesional.',
      en: 'You become a tax resident in Spain and must declare your worldwide income: employment income, investment income, capital gains and imputed real estate income. You may also become liable for Wealth Tax depending on your autonomous community. If you find yourself in this situation, professional tax advice is recommended.',
    },
  },
  {
    id: 'economic-interests',
    pages: ['guide'],
    legalRefId: 'dgt-intereses-economicos',
    question: {
      es: '¿Hay otros criterios de residencia además de los 183 días?',
      en: 'Are there other residency criteria besides the 183 days?',
    },
    answer: {
      es: 'Sí. También se considera residente fiscal a quien tenga en España el núcleo principal o la base de sus actividades o intereses económicos, directa o indirectamente. La DGT entiende que esto ocurre cuando en España se genera la mayor parte de la base imponible del IRPF. Además, si tu cónyuge no separado y tus hijos menores residen en España, se te presume residente salvo prueba en contrario.',
      en: 'Yes. A person is also considered a tax resident if the main nucleus or base of their activities or economic interests is in Spain, directly or indirectly. The DGT considers this to be the case when most of the personal income tax base is generated in Spain. Additionally, if your non-separated spouse and minor children live in Spain, you are presumed to be resident unless proven otherwise.',
    },
  },
  {
    id: 'remote-worker',
    pages: ['guide'],
    question: {
      es: 'Si teletrabajo desde España para una empresa extranjera, ¿cuenta igual?',
      en: 'If I work remotely from Spain for a foreign company, does it count the same?',
    },
    answer: {
      es: 'Sí. La regla de los 183 días mide la presencia física, no el origen de los ingresos. Si teletrabajas desde España más de 183 días en un año natural, serás residente fiscal aunque tu empresa y tu nómina sean extranjeras. Es un caso frecuente entre nómadas digitales y suele requerir asesoramiento especializado.',
      en: 'Yes. The 183-day rule measures physical presence, not the source of your income. If you work remotely from Spain for more than 183 days in a calendar year, you will be a tax resident even if your employer and payroll are foreign. This is a common case among digital nomads and usually calls for specialist advice.',
    },
  },
  {
    id: 'proof-evidence',
    pages: ['home', 'guide'],
    question: {
      es: '¿Qué pruebas puedo usar para documentar mis días fuera de España?',
      en: 'What evidence can I use to document my days outside Spain?',
    },
    answer: {
      es: 'La carga de la prueba recae sobre el contribuyente. Resultan útiles billetes y tarjetas de embarque, sellos de pasaporte, extractos de tarjeta con compras en el extranjero, facturas de alojamiento, contratos de alquiler y certificados de empadronamiento. Conserva la documentación al menos 4 años, el plazo general de prescripción tributaria en España.',
      en: 'The burden of proof lies with the taxpayer. Useful evidence includes tickets and boarding passes, passport stamps, card statements showing purchases abroad, accommodation invoices, rental contracts and municipal registration certificates. Keep the documentation for at least 4 years, the general statute of limitations for tax matters in Spain.',
    },
  },
  {
    id: 'pdf-validity',
    pages: ['home', 'guide'],
    question: {
      es: '¿El informe PDF de TaxNomad tiene validez legal?',
      en: 'Does the TaxNomad PDF report have legal validity?',
    },
    answer: {
      es: 'No por sí mismo: es un documento informativo que resume tus periodos de estancia y el cómputo de días. Puede servir como documentación de apoyo ante una comprobación de la Agencia Tributaria, pero no sustituye las pruebas originales ni el asesoramiento fiscal profesional.',
      en: 'Not by itself: it is an informational document summarising your stay periods and day count. It can serve as supporting documentation in a Spanish Tax Authority review, but it does not replace the original evidence or professional tax advice.',
    },
  },
];

const SUPPORTED_LANGUAGES = ['es', 'en'];

// Returns the localized FAQ entries for a page, in catalogue order.
// Falls back to Spanish when the language is missing or unsupported.
export const getLocalizedFaq = (language, page) => {
  const lang = SUPPORTED_LANGUAGES.includes(language) ? language : 'es';
  return FAQ_ITEMS.filter((item) => item.pages.includes(page)).map((item) => ({
    id: item.id,
    question: item.question[lang],
    answer: item.answer[lang],
    legalRefId: item.legalRefId ?? null,
  }));
};

// Builds the FAQPage JSON-LD object from already-localized FAQ entries.
// Answers are plain text by construction (see header note).
export const buildFaqSchema = (localizedItems) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: localizedItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
});
