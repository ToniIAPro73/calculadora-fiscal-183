// Guide: sporadic absences and double taxation treaties (CDI/DTT).
// Content model consumed by GuideArticlePage.jsx, the prerender script and
// the hub cards. Blocks: paragraph | list | legalRef | subsection.

export const sporadicAbsencesGuide = {
  slug: 'sporadic-absences-tax-treaties',
  publishedDate: '2026-07-29',
  title: {
    es: 'Ausencias esporádicas y convenios de doble imposición',
    en: 'Sporadic absences and double taxation treaties',
  },
  shortTitle: {
    es: 'Ausencias y convenios (CDI)',
    en: 'Absences and tax treaties',
  },
  description: {
    es: 'Cómo computan las ausencias esporádicas en la regla de los 183 días y cómo resuelven los convenios de doble imposición los conflictos de residencia entre dos países.',
    en: 'How sporadic absences count under the 183-day rule and how double taxation treaties resolve tax residency conflicts between two countries.',
  },
  excerpt: {
    es: '¿Descuentan los viajes del cómputo de 183 días? ¿Y si dos países te consideran residente? El convenio de doble imposición tiene la respuesta, con criterios de desempate claros.',
    en: 'Do trips deduct from the 183-day count? What if two countries consider you a resident? The double taxation treaty has the answer, with clear tie-breaker criteria.',
  },
  intro: [
    {
      es: 'Dos ideas dominan la vida fiscal de un nómada digital o un expatriado con calendario internacional. La primera: los viajes cortos fuera de España no restan días de presencia, salvo que puedas acreditar residencia fiscal en otro país. La segunda: cuando dos países te reclaman como residente a la vez, el convenio de doble imposición (CDI) es la norma que deshace el empate. Entender cómo interactúan ambas ideas es esencial para no tributar dos veces — o para no descubrir, años después, que llevabas siendo residente español sin saberlo.',
      en: 'Two ideas dominate the tax life of a digital nomad or an expat with an international calendar. The first: short trips outside Spain do not subtract days of presence, unless you can prove tax residency in another country. The second: when two countries claim you as a resident at the same time, the double taxation treaty (DTT) is the rule that breaks the tie. Understanding how both ideas interact is essential to avoid being taxed twice — or discovering, years later, that you had been a Spanish resident without knowing it.',
    },
  ],
  sections: [
    {
      heading: {
        es: 'Qué son las ausencias esporádicas',
        en: 'What sporadic absences are',
      },
      blocks: [
        {
          type: 'paragraph',
          text: {
            es: 'El artículo 9 de la LIRPF establece que, a efectos de determinar la permanencia en territorio español, no se deducen las ausencias temporales. Es decir, los días que pasas fuera de España por vacaciones, viajes de negocio o estancias cortas siguen computando como si estuvieras en España. La excepción: esos días sí se descuentan si el contribuyente acredita su residencia fiscal en otro país durante esos periodos. La carga de la prueba, por tanto, es tuya.',
            en: 'Article 9 of the PIT Act establishes that, for the purpose of determining presence in Spanish territory, temporary absences are not deducted. In other words, the days you spend outside Spain on holiday, business trips or short stays still count as if you were in Spain. The exception: those days are deducted if the taxpayer proves their tax residency in another country during those periods. The burden of proof, therefore, is yours.',
          },
        },
        { type: 'legalRef', refId: 'lirpf-art9' },
        {
          type: 'paragraph',
          text: {
            es: 'En la práctica, acreditar residencia fiscal en otro país significa obtener un certificado de residencia fiscal de la autoridad tributaria de ese país, un documento que solo se expide si efectivamente tributas allí como residente. Para un nómada que viaja de turismo entre países sin ser residente fiscal en ninguno de ellos, esa acreditación es inviable: sus ausencias, por muchas que sean, se consideran esporádicas y no descuentan.',
            en: 'In practice, proving tax residency in another country means obtaining a tax residency certificate from that country’s tax authority, a document only issued if you actually pay tax there as a resident. For a nomad travelling as a tourist between countries without being a tax resident of any of them, that proof is unfeasible: their absences, however many, are considered sporadic and do not subtract.',
          },
        },
      ],
    },
    {
      heading: {
        es: 'El criterio de la DGT y la carga de la prueba',
        en: 'The DGT criterion and the burden of proof',
      },
      blocks: [
        {
          type: 'paragraph',
          text: {
            es: 'La Dirección General de Tributos ha consolidado en sus consultas vinculantes una interpretación estricta: las ausencias esporádicas computan como permanencia, y corresponde al contribuyente demostrar tanto los días efectivamente pasados fuera como, en su caso, la residencia fiscal en otro país. La Agencia Tributaria no acepta cómputos aproximados: en una comprobación pedirá evidencia documental día a día.',
            en: 'The Directorate-General for Taxes has consolidated a strict interpretation in its binding rulings: sporadic absences count as presence, and it is up to the taxpayer to demonstrate both the days actually spent abroad and, where applicable, tax residency in another country. The Tax Authority does not accept approximate counts: in a review it will request day-by-day documentary evidence.',
          },
        },
        { type: 'legalRef', refId: 'dgt-ausencias-esporadicas' },
        {
          type: 'paragraph',
          text: {
            es: 'Las pruebas que mejor funcionan son las generadas por terceros: tarjetas de embarque y billetes, sellos y registros de pasaporte, extractos bancarios con compras en el extranjero, facturas de hotel, contratos de alquiler y, si existe, el certificado de residencia fiscal del otro país. La recomendación operativa es mantener un calendario de presencia actualizado — la calculadora de TaxNomad está diseñada para ello — y archivar la documentación al menos durante los cuatro años del plazo de prescripción.',
            en: 'The evidence that works best is generated by third parties: boarding passes and tickets, passport stamps and records, bank statements with purchases abroad, hotel invoices, rental contracts and, if it exists, the tax residency certificate of the other country. The operational recommendation is to keep an up-to-date presence calendar — the TaxNomad calculator is designed for this — and to archive the documentation for at least the four years of the limitation period.',
          },
        },
      ],
    },
    {
      heading: {
        es: 'Qué es un convenio de doble imposición',
        en: 'What a double taxation treaty is',
      },
      blocks: [
        {
          type: 'paragraph',
          text: {
            es: 'Un convenio de doble imposición es un tratado internacional entre dos países que reparte el derecho a gravar cada tipo de renta y evita que la misma renta tribute dos veces. España tiene convenios firmados con más de 90 países, incluidos Reino Unido, Alemania, Francia, Estados Unidos, Italia, Portugal, Países Bajos y prácticamente toda la OCDE y América Latina. Estos convenios prevalecen sobre la normativa interna española: si el CDI dice que eres residente del otro país, la regla interna de los 183 días queda desplazada.',
            en: 'A double taxation treaty is an international agreement between two countries that allocates the right to tax each type of income and prevents the same income from being taxed twice. Spain has signed treaties with more than 90 countries, including the United Kingdom, Germany, France, the United States, Italy, Portugal, the Netherlands and virtually all of the OECD and Latin America. These treaties prevail over Spanish domestic law: if the DTT says you are a resident of the other country, the domestic 183-day rule is displaced.',
          },
        },
        {
          type: 'paragraph',
          text: {
            es: 'El escenario típico de conflicto: pasas 200 días en España (residente según la LIRPF) pero también superas los criterios de residencia de tu país de origen, por ejemplo por mantener allí tu vivienda y tu actividad. Sin convenio, ambos países te reclamarían la renta mundial. Con convenio, se aplican los criterios de desempate del artículo 4 del modelo OCDE, que prácticamente todos los CDI españoles reproducen.',
            en: 'The typical conflict scenario: you spend 200 days in Spain (a resident under the PIT Act) but you also meet the residency criteria of your home country, for example by keeping your home and activity there. Without a treaty, both countries would claim your worldwide income. With a treaty, the tie-breaker criteria of Article 4 of the OECD model apply, which virtually all Spanish DTTs reproduce.',
          },
        },
      ],
    },
    {
      heading: {
        es: 'Los criterios de desempate, en orden',
        en: 'The tie-breaker criteria, in order',
      },
      blocks: [
        {
          type: 'list',
          items: [
            {
              es: 'Domicilio permanente: se te considera residente del país donde dispones de una vivienda permanente a tu disposición. Si la tienes en ambos, se pasa al siguiente criterio.',
              en: 'Permanent home: you are considered a resident of the country where you have a permanent home available to you. If you have one in both, move to the next criterion.',
            },
            {
              es: 'Centro de intereses vitales: el país con el que mantienes lazos personales y económicos más estrechos (familia, trabajo, patrimonio, actividad social).',
              en: 'Centre of vital interests: the country with which you maintain closer personal and economic ties (family, work, wealth, social activity).',
            },
            {
              es: 'Residencia habitual: el país donde permaneces habitualmente; aquí el cómputo de días vuelve a ser relevante.',
              en: 'Habitual abode: the country where you habitually stay; here the day count becomes relevant again.',
            },
            {
              es: 'Nacionalidad: si todo lo anterior empata, decide la nacionalidad; y si persiste el empate, las autoridades tributarias de ambos países lo resuelven de común acuerdo (procedimiento amistoso).',
              en: 'Nationality: if everything above ties, nationality decides; and if the tie persists, the tax authorities of both countries resolve it by mutual agreement (mutual agreement procedure).',
            },
          ],
        },
        { type: 'legalRef', refId: 'dgt-convenios-cdi' },
        {
          type: 'subsection',
          heading: {
            es: 'El certificado de residencia fiscal',
            en: 'The tax residency certificate',
          },
          blocks: [
            {
              type: 'paragraph',
              text: {
                es: 'Para invocar un convenio necesitas acreditar tu residencia fiscal con un certificado oficial. En España lo expide la Agencia Tributaria, con validez de un año, y es la prueba estándar para beneficiarte de tipos reducidos de retención en el extranjero o para desempatar una doble residencia. Solicitarlo requiere ser residente fiscal español y estar al corriente de obligaciones. Si tu conflicto es al revés — acreditar residencia en otro país frente a España — necesitarás el certificado equivalente de la autoridad de ese país.',
                en: 'To invoke a treaty you need to prove your tax residency with an official certificate. In Spain it is issued by the Tax Authority, valid for one year, and it is the standard proof to benefit from reduced withholding rates abroad or to break a dual-residency tie. Requesting it requires being a Spanish tax resident and being up to date with obligations. If your conflict is the other way around — proving residency in another country against Spain — you will need the equivalent certificate from that country’s authority.',
              },
            },
          ],
        },
      ],
    },
    {
      heading: {
        es: 'Estrategia: cómo combinar cómputo de días y convenio',
        en: 'Strategy: combining day counting and the treaty',
      },
      blocks: [
        {
          type: 'paragraph',
          text: {
            es: 'La secuencia lógica ante cualquier duda de residencia es: primero, cuenta tus días de presencia en España con rigor, asumiendo que las ausencias cortas no descuentan; segundo, comprueba si tu país de origen también te considera residente según su normativa interna; tercero, si hay doble residencia, aplica los criterios de desempate del convenio correspondiente; y cuarto, documenta todo el razonamiento con certificados y pruebas de viaje. Las guías sobre el año de llegada y de salida y sobre el visado de nómada digital desarrollan los escenarios más frecuentes de cada perfil.',
            en: 'The logical sequence when facing any residency doubt is: first, count your days of presence in Spain rigorously, assuming short absences do not subtract; second, check whether your home country also considers you a resident under its domestic law; third, if there is dual residency, apply the tie-breaker criteria of the relevant treaty; and fourth, document the whole reasoning with certificates and travel evidence. The guides on the arrival and departure year and on the digital nomad visa develop the most frequent scenarios for each profile.',
          },
        },
        {
          type: 'paragraph',
          text: {
            es: 'Un último aviso: los convenios difieren entre sí en detalles relevantes (definiciones, exenciones, métodos de eliminación de la doble imposición). El esquema de desempate es común, pero la letra pequeña no. Antes de tomar decisiones basadas en un CDI concreto, lee el texto del convenio publicado en el BOE o confirma tu interpretación con un asesor especializado en fiscalidad internacional.',
            en: 'A final warning: treaties differ from one another in relevant details (definitions, exemptions, double taxation relief methods). The tie-breaker scheme is common, but the fine print is not. Before making decisions based on a specific DTT, read the treaty text published in the BOE or confirm your interpretation with an advisor specialised in international taxation.',
          },
        },
      ],
    },
  ],
  related: [
    'counting-days-arrival-departure',
    'digital-nomad-visa-183-days',
    'beckham-law-vs-183-days',
  ],
};
