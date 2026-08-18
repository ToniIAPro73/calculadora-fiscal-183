// Guide: impatriate regime (Beckham Law, art. 93 LIRPF) versus the general
// 183-day rule. Content model consumed by GuideArticlePage.jsx, the prerender
// script and the hub cards. Blocks: paragraph | list | legalRef | subsection.

export const beckhamLawGuide = {
  slug: 'beckham-law-vs-183-days',
  publishedDate: '2026-07-29',
  title: {
    es: 'Régimen de impatriados (Ley Beckham) frente a la regla de los 183 días',
    en: 'The impatriate regime (Beckham Law) versus the 183-day rule',
  },
  shortTitle: {
    es: 'Ley Beckham vs 183 días',
    en: 'Beckham Law vs 183 days',
  },
  description: {
    es: 'Comparativa entre la Ley Beckham (art. 93 LIRPF) y la tributación general por la regla de los 183 días: requisitos, tipos, plazos y cuándo conviene cada opción.',
    en: 'Comparison between the Beckham Law (Art. 93 PIT Act) and general taxation under the 183-day rule: requirements, rates and when each option pays off.',
  },
  excerpt: {
    es: 'Tipo fijo del 24 % o escala progresiva del IRPF: el régimen Beckham puede ahorrarte miles de euros, pero solo si optas a tiempo. Compara ambas vías antes de decidir.',
    en: 'A flat 24% rate or the progressive income tax scale: the Beckham regime can save you thousands, but only if you opt in on time. Compare both paths before deciding.',
  },
  intro: [
    {
      es: 'Cuando te mudas a España por trabajo y superas los 183 días de presencia, te conviertes en residente fiscal. A partir de ahí tienes dos caminos posibles: tributar por el IRPF general, con su escala progresiva que en los tramos altos supera el 45 %, o acogerte al régimen especial de trabajadores desplazados del artículo 93 de la LIRPF, popularmente conocido como Ley Beckham. Elegir bien puede suponer una diferencia de miles de euros al año, pero la opción tiene requisitos estrictos y un plazo que no perdona. Esta guía compara ambas vías con detalle.',
      en: 'When you move to Spain for work and exceed 183 days of presence, you become a tax resident. From that point you have two possible paths: being taxed under the general personal income tax, with a progressive scale that exceeds 45% in the higher brackets, or joining the special regime for posted workers in Article 93 of the PIT Act, popularly known as the Beckham Law. Choosing well can mean a difference of thousands of euros a year, but the option has strict requirements and an unforgiving deadline. This guide compares both paths in detail.',
    },
  ],
  sections: [
    {
      heading: {
        es: 'Qué mide la regla de los 183 días y qué cambia con la Ley Beckham',
        en: 'What the 183-day rule measures and what the Beckham Law changes',
      },
      blocks: [
        {
          type: 'paragraph',
          text: {
            es: 'La regla de los 183 días determina si eres residente fiscal en España: supera ese umbral de presencia en un año natural y pasas a tributar por tu renta mundial. La Ley Beckham no cambia esa condición de residente; lo que cambia es cómo tributas. Quien se acoge al régimen de impatriados sigue siendo residente fiscal en España, pero calcula su impuesto con las reglas del Impuesto sobre la Renta de no Residentes, con algunas especialidades.',
            en: 'The 183-day rule determines whether you are a tax resident in Spain: cross that presence threshold in a calendar year and you become taxable on your worldwide income. The Beckham Law does not change that resident status; what changes is how you are taxed. Those who join the impatriate regime remain Spanish tax residents, but they compute their tax under the Non-Resident Income Tax rules, with some particularities.',
          },
        },
        { type: 'legalRef', refId: 'lirpf-art9' },
        {
          type: 'paragraph',
          text: {
            es: 'Esta distinción es clave y a menudo se malinterpreta: acogerte al régimen Beckham no te convierte en no residente ni te permite ignorar la regla de los 183 días. Al contrario, el requisito de partida es precisamente haberte convertido en residente fiscal por el traslado a España. Lo que obtienes a cambio es un esquema de tributación más favorable durante un periodo limitado.',
            en: 'This distinction is key and often misunderstood: joining the Beckham regime does not make you a non-resident nor does it allow you to ignore the 183-day rule. On the contrary, the starting requirement is precisely having become a Spanish tax resident as a result of relocating to Spain. What you get in return is a more favourable taxation scheme for a limited period.',
          },
        },
      ],
    },
    {
      heading: {
        es: 'Requisitos para acogerse al régimen de impatriados',
        en: 'Requirements to join the impatriate regime',
      },
      blocks: [
        {
          type: 'paragraph',
          text: {
            es: 'El artículo 93 de la LIRPF, tras la reforma de la Ley de Startups, exige unas condiciones precisas. Debes cumplirlas todas y acreditarlas ante la Agencia Tributaria:',
            en: 'Article 93 of the PIT Act, after the Startups Act reform, requires precise conditions. You must meet all of them and prove them to the Spanish Tax Authority:',
          },
        },
        {
          type: 'list',
          items: [
            {
              es: 'No haber sido residente fiscal en España durante los cinco ejercicios anteriores al traslado (antes de la Ley de Startups eran diez).',
              en: 'Not having been a Spanish tax resident during the five tax periods before the move (it was ten before the Startups Act).',
            },
            {
              es: 'Que el desplazamiento se produzca por una de las causas previstas: contrato de trabajo con empresa española, nombramiento como administrador, actividad emprendedora, condición de profesional altamente cualificado o teletrabajo de carácter internacional.',
              en: 'That the relocation occurs for one of the foreseen reasons: an employment contract with a Spanish company, appointment as a director, entrepreneurial activity, highly qualified professional status or international remote work.',
            },
            {
              es: 'No obtener rentas calificadas como obtenidas mediante establecimiento permanente en España (con las excepciones de las nuevas categorías).',
              en: 'Not earning income classified as obtained through a permanent establishment in Spain (with the exceptions of the new categories).',
            },
            {
              es: 'Ejercitar la opción en el plazo de seis meses desde el inicio de la relación laboral o del alta en la seguridad social, mediante el modelo 149.',
              en: 'Exercising the option within six months of the start of the employment relationship or social security registration, using form 149.',
            },
          ],
        },
        { type: 'legalRef', refId: 'lirpf-art93' },
      ],
    },
    {
      heading: {
        es: 'Diferencias prácticas de tributación',
        en: 'Practical taxation differences',
      },
      blocks: [
        {
          type: 'paragraph',
          text: {
            es: 'La diferencia más visible es el tipo impositivo. Con el régimen de impatriados, los rendimientos del trabajo tributan a un tipo fijo del 24 % hasta los 600.000 euros anuales (el exceso, al 47 %), sin escala progresiva. En el IRPF general, el tipo marginal estatal más autonómico puede situarse entre el 45 % y el 50 % según la comunidad autónoma, aunque con mínimos personales, reducciones y deducciones que el régimen Beckham no permite. En cifras: un salario de 90.000 euros tributa íntegro al 24 % bajo el régimen, mientras que en el IRPF general el tipo efectivo suele acercarse al 35 % tras aplicar el mínimo personal y familiar.',
            en: 'The most visible difference is the tax rate. Under the impatriate regime, employment income is taxed at a flat 24% up to €600,000 a year (the excess at 47%), with no progressive scale. Under the general income tax, the marginal state-plus-regional rate can sit between 45% and 50% depending on the autonomous community, although with personal allowances, reductions and deductions that the Beckham regime does not allow. In figures: a €90,000 salary is taxed entirely at 24% under the regime, while under the general income tax the effective rate usually approaches 35% after applying the personal and family allowance.',
          },
        },
        {
          type: 'subsection',
          heading: {
            es: 'Rentas mundiales frente a rentas de fuente española',
            en: 'Worldwide income versus Spanish-source income',
          },
          blocks: [
            {
              type: 'paragraph',
              text: {
                es: 'Otro cambio sustancial: bajo el régimen Beckham, la mayoría de las rentas solo tributan si son de fuente española. Los dividendos, intereses y ganancias patrimoniales de fuente extranjera quedan fuera del IRPF español. La gran excepción son los rendimientos del trabajo, que se consideran íntegramente obtenidos en España. En el IRPF general tributas por toda tu renta mundial, con la posibilidad de deducir los impuestos soportados en el extranjero según los convenios de doble imposición.',
                en: 'Another substantial change: under the Beckham regime, most income is only taxed if it is Spanish-source. Foreign-source dividends, interest and capital gains fall outside Spanish income tax. The big exception is employment income, which is deemed to be entirely obtained in Spain. Under the general regime you are taxed on your full worldwide income, with the possibility of crediting foreign taxes paid according to double taxation treaties.',
              },
            },
          ],
        },
        {
          type: 'subsection',
          heading: {
            es: 'Duración y obligaciones formales',
            en: 'Duration and formal obligations',
          },
          blocks: [
            {
              type: 'paragraph',
              text: {
                es: 'El régimen se aplica durante el ejercicio del cambio de residencia y los cinco siguientes: seis años en total. Durante ese tiempo presentas el modelo 151 en lugar de la declaración ordinaria del IRPF, y sigues estando sujeto a la obligación de informar sobre bienes en el extranjero (modelo 720). En el Impuesto sobre el Patrimonio tributas solo por los bienes situados en España, una ventaja relevante frente a la obligación por bienes mundiales del residente ordinario.',
                en: 'The regime applies during the tax year of the change of residence and the following five: six years in total. During that time you file form 151 instead of the ordinary income tax return, and you remain subject to the obligation to report assets abroad (form 720). For Wealth Tax you are taxed only on assets located in Spain, a relevant advantage over the worldwide-assets obligation of the ordinary resident.',
              },
            },
          ],
        },
      ],
    },
    {
      heading: {
        es: 'Las novedades de la Ley de Startups',
        en: 'The Startups Act novelties',
      },
      blocks: [
        {
          type: 'paragraph',
          text: {
            es: 'La Ley 28/2022 modernizó el régimen en tres frentes. Primero, redujo de diez a cinco los años previos de no residencia exigidos. Segundo, incorporó nuevos colectivos beneficiarios: emprendedores, profesionales altamente cualificados que prestan servicios a startups y teletrabajadores internacionales, el colectivo del visado de nómada digital. Tercero, permitió que el cónyuge y los hijos mayores de la persona desplazada puedan acogerse en determinadas condiciones. Si llegas a España con el visado DNV, esta reforma es la que te abre la puerta al régimen.',
            en: 'Law 28/2022 modernised the regime on three fronts. First, it reduced the required previous years of non-residency from ten to five. Second, it added new beneficiary groups: entrepreneurs, highly qualified professionals serving startups and international remote workers, the digital nomad visa collective. Third, it allowed the spouse and adult children of the relocated person to join under certain conditions. If you arrive in Spain on the DNV, this reform is what opens the regime’s door to you.',
          },
        },
        { type: 'legalRef', refId: 'ley-startups' },
      ],
    },
    {
      heading: {
        es: 'Cómo decidir: escenarios habituales',
        en: 'How to decide: common scenarios',
      },
      blocks: [
        {
          type: 'paragraph',
          text: {
            es: 'Como regla general, el régimen Beckham suele compensar a partir de rentas del trabajo en torno a 55.000–60.000 euros anuales, porque el ahorro por el tipo fijo supera la pérdida de reducciones y deducciones. Por debajo de esa cifra, el IRPF general suele ser más favorable. También suele convenir a quien tiene rentas del capital relevantes fuera de España, porque bajo el régimen no tributan en España. En cambio, penaliza a quien tiene derecho a deducciones importantes (vivienda habitual en alquiler en algunas comunidades, planes de pensiones con aportaciones elevadas, familia numerosa) o rentas irregulares.',
            en: 'As a general rule, the Beckham regime usually pays off from employment income of around €55,000–60,000 a year, because the saving from the flat rate outweighs the loss of reductions and deductions. Below that figure, the general income tax is usually more favourable. It also tends to suit those with significant investment income abroad, because under the regime it is not taxed in Spain. On the other hand, it penalises those entitled to significant deductions (main-home rent relief in some regions, high pension plan contributions, large families) or irregular income.',
          },
        },
        {
          type: 'paragraph',
          text: {
            es: 'Sea cual sea tu escenario, dos decisiones son urgentes nada más llegar: contar tus días de presencia con precisión para saber en qué ejercicio te conviertes en residente, y valorar la opción Beckham antes de que pasen los seis meses de plazo. Nuestra guía sobre el año de llegada y de salida te ayuda con la primera; para la segunda, la decisión merece un cálculo personalizado con un asesor fiscal.',
            en: 'Whatever your scenario, two decisions are urgent as soon as you arrive: counting your days of presence precisely to know in which tax year you become a resident, and assessing the Beckham option before the six-month deadline passes. Our guide on the arrival and departure year helps with the first; for the second, the decision deserves a personalised calculation with a tax advisor.',
          },
        },
      ],
    },
  ],
  related: [
    'digital-nomad-visa-183-days',
    'counting-days-arrival-departure',
    'sporadic-absences-tax-treaties',
  ],
};
