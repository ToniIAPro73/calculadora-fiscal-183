// Guide: how to count days of presence in the arrival and departure years.
// Content model consumed by GuideArticlePage.jsx, the prerender script and
// the hub cards. Blocks: paragraph | list | legalRef | subsection.

export const countingDaysGuide = {
  slug: 'counting-days-arrival-departure',
  publishedDate: '2026-07-29',
  title: {
    es: 'El año de llegada y de salida: cómo contar los días de presencia',
    en: 'The arrival and departure year: how to count days of presence',
  },
  shortTitle: {
    es: 'El año de llegada y de salida',
    en: 'Arrival and departure year',
  },
  description: {
    es: 'Cómo contar los días de presencia el año que llegas a España o te marchas: año natural, día de llegada y salida, ausencias y prueba documental.',
    en: 'How to count days of presence in the year you move to or leave Spain: full calendar year, arrival and departure days, absences, documentary evidence and move planning.',
  },
  excerpt: {
    es: 'La residencia fiscal se decide por año natural completo: llegar en junio no es lo mismo que llegar en octubre. Aprende a contar los días del año del traslado sin errores.',
    en: 'Tax residency is decided for the full calendar year: arriving in June is not the same as arriving in October. Learn to count the days of the moving year without mistakes.',
  },
  intro: [
    {
      es: 'Una de las preguntas más frecuentes de quienes se trasladan a España — o se marchan — es qué ocurre el año del cambio. ¿Se tributa solo por la parte del año vivida en España? ¿Desde qué fecha empieza a contar la residencia fiscal? La respuesta corta es que la residencia fiscal en España se determina por año natural completo: no hay fraccionamiento del ejercicio. Si superas los 183 días de presencia, eres residente durante todo ese año; si no los superas, en principio no lo eres. Esa regla, aparentemente simple, convierte la fecha exacta del traslado en una decisión fiscal de primer orden.',
      en: 'One of the most frequent questions of those moving to Spain — or leaving — is what happens in the year of the change. Do you pay tax only for the part of the year lived in Spain? From which exact date does tax residency start? The short answer is that tax residency in Spain is determined for the full calendar year: there is no splitting of the tax year. If you exceed 183 days of presence, you are a resident for that entire year; if you do not, you are generally not. That seemingly simple rule turns the exact date of the move into a first-order tax decision.',
    },
  ],
  sections: [
    {
      heading: {
        es: 'La residencia fiscal se decide por año natural completo',
        en: 'Tax residency is decided for the full calendar year',
      },
      blocks: [
        {
          type: 'paragraph',
          text: {
            es: 'El artículo 9 de la LIRPF fija el criterio de permanencia en “el año natural”: del 1 de enero al 31 de diciembre. No existe en España un mecanismo general de año partido como en otros países (split-year treatment), salvo el caso particular de quienes optan por el régimen de impatriados, cuyas especialidades tratamos en la guía sobre la Ley Beckham. En el régimen general, la consecuencia es directa: si el 31 de diciembre has acumulado más de 183 días de presencia, tributas como residente por todo el ejercicio, incluidos los meses anteriores a tu llegada.',
            en: 'Article 9 of the PIT Act sets the presence criterion in “the calendar year”: from 1 January to 31 December. Spain has no general split-year mechanism like other countries, except for the particular case of those opting into the impatriate regime, whose particularities we cover in the guide on the Beckham Law. Under the general regime, the consequence is direct: if by 31 December you have accumulated more than 183 days of presence, you are taxed as a resident for the entire tax year, including the months before your arrival.',
          },
        },
        { type: 'legalRef', refId: 'lirpf-art9' },
        {
          type: 'paragraph',
          text: {
            es: 'Ojo con la interpretación: esto no significa que debas declarar en España las rentas de tu país de origen obtenidas antes del traslado sin más. El convenio de doble imposición aplicable y las normas de tributación de no residentes determinarán qué rentas anteriores tributan en España, pero la condición de residente alcanza al ejercicio completo. Es un matiz técnico que conviene revisar con un asesor, especialmente si el año del traslado tuviste ganancias patrimoniales importantes.',
            en: 'Careful with the interpretation: this does not mean you must automatically declare in Spain the income from your home country earned before the move. The applicable double taxation treaty and the non-resident taxation rules will determine which earlier income is taxed in Spain, but resident status covers the full tax year. It is a technical nuance worth reviewing with an advisor, especially if in the year of the move you had significant capital gains.',
          },
        },
      ],
    },
    {
      heading: {
        es: 'El año de llegada a España',
        en: 'The year of arrival in Spain',
      },
      blocks: [
        {
          type: 'paragraph',
          text: {
            es: 'El cómputo de días empieza el día en que aterrizas, no el día en que obtienes el NIE, firmas el alquiler o te empadronas. La fecha del documento administrativo es irrelevante para la regla de los 183 días: lo que cuenta es la presencia física. Si llegas el 1 de julio, dispones de 184 días hasta fin de año; cualquier viaje posterior te puede situar por debajo o por encima del umbral.',
            en: 'The day count starts the day you land, not the day you obtain your NIE, sign the lease or register at the town hall. The date of the administrative document is irrelevant for the 183-day rule: what counts is physical presence. If you arrive on 1 July, you have 184 days until year-end; any later trip can place you below or above the threshold.',
          },
        },
        {
          type: 'subsection',
          heading: {
            es: 'Llegada en el primer semestre',
            en: 'Arrival in the first half of the year',
          },
          blocks: [
            {
              type: 'paragraph',
              text: {
                es: 'Si te trasladas entre enero y junio, lo normal es superar los 183 días ese mismo ejercicio: aunque viajes después, las ausencias temporales no descuentan salvo que acredites residencia fiscal en otro país. Debes asumir desde el primer día que serás residente fiscal ese año y planificar en consecuencia: valorar el régimen de impatriados en los primeros seis meses, ordenar la documentación y prever el impacto de tributar por la renta mundial.',
                en: 'If you move between January and June, you will normally exceed 183 days in that same tax year: even if you travel afterwards, temporary absences do not count as deductions unless you prove tax residency in another country. You should assume from day one that you will be a tax resident that year and plan accordingly: assess the impatriate regime within the first six months, organise your documentation and anticipate the impact of worldwide-income taxation.',
              },
            },
          ],
        },
        {
          type: 'subsection',
          heading: {
            es: 'Llegada en el segundo semestre',
            en: 'Arrival in the second half of the year',
          },
          blocks: [
            {
              type: 'paragraph',
              text: {
                es: 'Si llegas a partir de julio, tienes margen para no superar el umbral ese primer año, siempre que gestiones bien los días. Recuerda que el día de llegada cuenta completo y que las vacaciones fuera no restan. Es frecuente el error de pensar “he vivido seis meses, no llego a 183” sin contar que llegar el 1 de julio ya suma 184 días potenciales. Un par de viajes bien documentados pueden marcar la diferencia entre ser residente ese ejercicio o al siguiente, con efectos muy distintos en la tributación de ganancias previas al traslado.',
                en: 'If you arrive from July onwards, you have room to stay below the threshold that first year, provided you manage your days well. Remember that the arrival day counts in full and that holidays abroad do not subtract. A common mistake is thinking “I have lived six months, I do not reach 183” without realising that arriving on 1 July already adds 184 potential days. A couple of well-documented trips can make the difference between being a resident that tax year or the next, with very different effects on the taxation of pre-move gains.',
              },
            },
          ],
        },
      ],
    },
    {
      heading: {
        es: 'El año de salida de España',
        en: 'The year of departure from Spain',
      },
      blocks: [
        {
          type: 'paragraph',
          text: {
            es: 'Al marcharte ocurre lo simétrico: si sales de España en la segunda mitad del año, es muy probable que ya hayas acumulado más de 183 días y sigas siendo residente fiscal todo ese ejercicio, aunque vivas el resto del año en otro país. Para dejar de ser residente en el año de la salida, la marcha debe producirse en la primera mitad del año y, además, normalmente necesitarás acreditar la residencia fiscal en el nuevo país. Cambiar de domicilio en diciembre no “cierra” tu residencia fiscal ese año: la cierras al año siguiente.',
            en: 'When you leave, the situation is symmetrical: if you leave Spain in the second half of the year, you have most likely already accumulated more than 183 days and remain a tax resident for that entire tax year, even if you live the rest of the year in another country. To stop being a resident in the year of departure, the move must take place in the first half of the year and, in addition, you will normally need to prove tax residency in the new country. Changing your address in December does not “close” your tax residency that year: it closes the following year.',
          },
        },
        {
          type: 'paragraph',
          text: {
            es: 'Un caso especial son los traslados a paraísos fiscales: la normativa española permite que la Agencia Tributaria te siga considerando residente durante el año del cambio y los cuatro siguientes si te trasladas a un territorio calificado como jurisdicción no cooperativa, salvo que acredites que permaneces allí por motivos justificados. Si tu destino es un país sin convenio de doble imposición con España, revisa este punto con especial cuidado.',
            en: 'A special case is moves to tax havens: Spanish rules allow the Tax Authority to keep considering you a resident during the year of the change and the following four if you move to a territory classified as a non-cooperative jurisdiction, unless you prove you stay there for justified reasons. If your destination is a country without a double taxation treaty with Spain, review this point with particular care.',
          },
        },
      ],
    },
    {
      heading: {
        es: 'Reglas de cómputo día a día',
        en: 'Day-by-day counting rules',
      },
      blocks: [
        {
          type: 'list',
          items: [
            {
              es: 'Cuenta cualquier día con presencia física en España, aunque sean pocas horas: llegada y salida computan como días completos.',
              en: 'Count any day with physical presence in Spain, even for a few hours: arrival and departure count as full days.',
            },
            {
              es: 'Las ausencias temporales (vacaciones, viajes de trabajo) no descuentan salvo que acredites residencia fiscal en otro país.',
              en: 'Temporary absences (holidays, work trips) do not subtract unless you prove tax residency in another country.',
            },
            {
              es: 'Se incluyen la península, Baleares, Canarias, Ceuta y Melilla; el tránsito aeroportuario sin entrar en territorio nacional es discutible, pero la prudencia aconseja contarlo.',
              en: 'Mainland Spain, the Balearic and Canary Islands, and Ceuta and Melilla are included; airport transit without entering national territory is debatable, but prudence advises counting it.',
            },
            {
              es: 'El año natural es el periodo de referencia: el cómputo se reinicia cada 1 de enero.',
              en: 'The calendar year is the reference period: the count resets every 1 January.',
            },
            {
              es: 'Cruzando el umbral por un solo día ya eres residente todo el ejercicio: 184 días tienen el mismo efecto que 300.',
              en: 'Crossing the threshold by a single day already makes you a resident for the whole year: 184 days have the same effect as 300.',
            },
          ],
        },
      ],
    },
    {
      heading: {
        es: 'Prueba documental y planificación',
        en: 'Documentary evidence and planning',
      },
      blocks: [
        {
          type: 'paragraph',
          text: {
            es: 'La carga de la prueba recae sobre el contribuyente. Si la Agencia Tributaria cuestiona tu cómputo, tendrás que demostrar los días fuera con billetes, tarjetas de embarque, sellos de pasaporte, extractos de tarjeta con operaciones en el extranjero, facturas de alojamiento o contratos de alquiler. Conserva esta documentación al menos cuatro años, el plazo general de prescripción. La doctrina de la DGT sobre ausencias esporádicas hace especialmente relevante esta prueba cuando estás cerca del umbral.',
            en: 'The burden of proof lies with the taxpayer. If the Tax Authority questions your count, you will have to demonstrate the days abroad with tickets, boarding passes, passport stamps, card statements showing transactions abroad, accommodation invoices or rental contracts. Keep this documentation for at least four years, the general limitation period. The DGT doctrine on sporadic absences makes this evidence especially relevant when you are close to the threshold.',
          },
        },
        { type: 'legalRef', refId: 'dgt-ausencias-esporadicas' },
        {
          type: 'paragraph',
          text: {
            es: 'La planificación práctica se resume en tres hábitos: registra cada entrada y salida desde el primer día (la calculadora de TaxNomad lo automatiza), decide con antelación en qué ejercicio te conviene ser residente si tu traslado está cerca de la frontera entre años, y documenta cualquier estancia prolongada fuera. Si tu caso implica dos países que te consideran residente a la vez, la solución pasa por el convenio de doble imposición: lo explicamos en la guía sobre ausencias esporádicas y convenios.',
            en: 'Practical planning comes down to three habits: record every entry and exit from day one (the TaxNomad calculator automates this), decide in advance in which tax year it suits you to be a resident if your move is near the year boundary, and document any extended stay abroad. If your case involves two countries considering you a resident at once, the solution lies in the double taxation treaty: we explain it in the guide on sporadic absences and treaties.',
          },
        },
      ],
    },
  ],
  related: [
    'sporadic-absences-tax-treaties',
    'beckham-law-vs-183-days',
    'digital-nomad-visa-183-days',
  ],
};
