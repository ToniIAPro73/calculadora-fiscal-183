// Guide: 183-day rule for digital nomads holding the Spanish digital nomad
// visa (visado de teletrabajador de carácter internacional, Ley de Startups).
// Content model consumed by GuideArticlePage.jsx, the prerender script and
// the hub cards. Blocks: paragraph | list | legalRef | subsection.

export const digitalNomadVisaGuide = {
  slug: 'digital-nomad-visa-183-days',
  publishedDate: '2026-07-29',
  title: {
    es: 'Regla de los 183 días para nómadas digitales con visado DNV (Ley de Startups)',
    en: 'The 183-day rule for digital nomads on the DNV (Startups Act)',
  },
  shortTitle: {
    es: 'Nómadas digitales y visado DNV',
    en: 'Digital nomads and the DNV',
  },
  description: {
    es: 'Cómo afecta la regla de los 183 días al visado de nómada digital: residencia fiscal, cómputo de días, ausencias y opciones de tributación en España.',
    en: 'How the 183-day rule affects holders of Spain’s digital nomad visa under the Startups Act: tax residency, day counting, absences and taxation options in Spain.',
  },
  excerpt: {
    es: 'El visado de nómada digital te da residencia administrativa, pero no decide tu residencia fiscal. Descubre cuándo los 183 días te convierten en residente tributario en España.',
    en: 'The digital nomad visa grants administrative residency, but it does not decide your tax residency. Find out when the 183 days make you a tax resident in Spain.',
  },
  intro: [
    {
      es: 'El visado de teletrabajador de carácter internacional, conocido como visado de nómada digital o DNV, fue creado por la Ley 28/2022, de fomento del ecosistema de las empresas emergentes (Ley de Startups). Permite residir en España a profesionales que trabajan en remoto para empresas extranjeras o que prestan servicios a clientes de fuera de España, con un límite del 20 % de su actividad para clientes españoles. Sin embargo, una confusión muy extendida es creer que este visado determina por sí mismo dónde tributas. No es así: el visado regula tu situación administrativa y migratoria, mientras que la residencia fiscal se decide por otros criterios, siendo la regla de los 183 días el principal.',
      en: 'The international remote worker visa, known as the digital nomad visa or DNV, was created by Law 28/2022 on promoting the startup ecosystem (the Startups Act). It allows professionals who work remotely for foreign companies, or who serve clients outside Spain, to live in Spain, with a cap of 20% of their activity for Spanish clients. However, a widespread misconception is that this visa determines by itself where you pay taxes. It does not: the visa regulates your administrative and immigration status, while tax residency is decided by other criteria, the 183-day rule being the main one.',
    },
  ],
  sections: [
    {
      heading: {
        es: 'Qué es el visado de nómada digital y qué derechos concede',
        en: 'What the digital nomad visa is and what rights it grants',
      },
      blocks: [
        {
          type: 'paragraph',
          text: {
            es: 'El DNV es una autorización de residencia dirigida a dos perfiles: empleados que teletrabajan para una empresa ubicada fuera de España y autónomos o profesionales independientes con clientes mayoritariamente extranjeros. En ambos casos se exige acreditar la relación profesional, unos ingresos mínimos (vinculados al salario mínimo interprofesional), titulación o experiencia de al menos tres años, y una cobertura de seguridad social válida. La primera autorización puede durar hasta tres años si se solicita ya desde España, renovable por periodos adicionales.',
            en: 'The DNV is a residence permit aimed at two profiles: employees working remotely for a company located outside Spain, and freelancers or independent professionals with mostly foreign clients. In both cases you must prove the professional relationship, a minimum income (linked to the Spanish minimum wage), a degree or at least three years of experience, and valid social security coverage. The first authorization can last up to three years if applied for from within Spain, renewable for additional periods.',
          },
        },
        {
          type: 'paragraph',
          text: {
            es: 'Lo que el visado no regula es tu condición de residente fiscal. Ser titular de un DNV significa que puedes vivir legalmente en España, pero la Agencia Tributaria decidirá si eres residente fiscal aplicando el artículo 9 de la Ley 35/2006 (LIRPF) y, en su caso, los convenios de doble imposición. En la práctica, la gran mayoría de los titulares del DNV viven en España de forma continuada, por lo que superan el umbral de presencia física y se convierten en residentes fiscales españoles.',
            en: 'What the visa does not regulate is your tax resident status. Holding a DNV means you can legally live in Spain, but the Spanish Tax Authority will decide whether you are a tax resident by applying Article 9 of Law 35/2006 (PIT Act) and, where applicable, double taxation treaties. In practice, the vast majority of DNV holders live in Spain continuously, so they exceed the physical presence threshold and become Spanish tax residents.',
          },
        },
        { type: 'legalRef', refId: 'ley-startups' },
      ],
    },
    {
      heading: {
        es: 'Residencia administrativa frente a residencia fiscal',
        en: 'Administrative residency versus tax residency',
      },
      blocks: [
        {
          type: 'paragraph',
          text: {
            es: 'Conviene separar tres conceptos que a menudo se mezclan. La residencia administrativa es tu permiso para vivir en España: el DNV. El empadronamiento es la inscripción en el padrón municipal del lugar donde vives habitualmente, un trámite local con fines estadísticos y de acceso a servicios. La residencia fiscal es la condición que determina ante qué hacienda declaras tu renta mundial. Las tres son independientes: puedes tener visado y no ser residente fiscal si pasas pocos días al año en España, y puedes ser residente fiscal sin visado si eres ciudadano europeo, por ejemplo.',
            en: 'It is worth separating three concepts that are often mixed up. Administrative residency is your permit to live in Spain: the DNV. Municipal registration (empadronamiento) is your enrolment in the local register of the place where you habitually live, a local procedure for statistical and service-access purposes. Tax residency is the status that determines before which tax authority you declare your worldwide income. All three are independent: you can hold a visa and not be a tax resident if you spend few days a year in Spain, and you can be a tax resident without a visa if you are an EU citizen, for example.',
          },
        },
        {
          type: 'paragraph',
          text: {
            es: 'La consecuencia práctica es importante: si te mudas a España con un DNV y vives aquí todo el año, serás residente fiscal aunque tus clientes o tu empleador sean extranjeros y aunque cobres en otra moneda o en una cuenta bancaria de otro país. La regla de los 183 días mide presencia física, no el origen de los ingresos ni la ubicación de tu empleador.',
            en: 'The practical consequence is significant: if you move to Spain on a DNV and live here all year, you will be a tax resident even if your clients or employer are foreign and even if you are paid in another currency or into a bank account in another country. The 183-day rule measures physical presence, not the source of your income or the location of your employer.',
          },
        },
      ],
    },
    {
      heading: {
        es: 'Cómo se aplican los 183 días cuando tienes un visado DNV',
        en: 'How the 183 days apply when you hold a DNV',
      },
      blocks: [
        {
          type: 'paragraph',
          text: {
            es: 'El cómputo es el mismo que para cualquier otra persona: si permaneces más de 183 días en territorio español durante un año natural, eres residente fiscal en España ese ejercicio. Cuentan todos los días de presencia física, incluidos los de llegada y salida, y las ausencias temporales no descuentan salvo que acredites residencia fiscal en otro país. Esto significa que un nómada con DNV que se toma tres semanas de vacaciones fuera sigue sumando esos días como presencia en España, salvo prueba en contrario.',
            en: 'The count is the same as for anyone else: if you spend more than 183 days in Spanish territory during a calendar year, you are a Spanish tax resident for that tax year. All days of physical presence count, including arrival and departure days, and temporary absences are not deducted unless you prove tax residency in another country. This means a nomad on a DNV who takes three weeks of holiday abroad still accrues those days as presence in Spain, unless proven otherwise.',
          },
        },
        { type: 'legalRef', refId: 'lirpf-art9' },
        {
          type: 'subsection',
          heading: {
            es: 'El primer año con el visado',
            en: 'The first year on the visa',
          },
          blocks: [
            {
              type: 'paragraph',
              text: {
                es: 'La residencia fiscal se determina por año natural completo. Si aterrizas en España en octubre con tu DNV, es muy probable que no alcances los 183 días ese primer ejercicio y que no seas residente fiscal hasta el año siguiente (salvo que tu centro de intereses económicos ya esté en España). En cambio, si llegas en febrero, superarás el umbral ese mismo año. Planificar la fecha de traslado tiene, por tanto, un efecto fiscal directo. Analizamos este escenario en detalle en la guía sobre el año de llegada y de salida.',
                en: 'Tax residency is determined for the full calendar year. If you land in Spain in October on your DNV, you will most likely not reach 183 days in that first tax year and will not become a tax resident until the following year (unless your centre of economic interests is already in Spain). If you arrive in February instead, you will cross the threshold that same year. Planning the date of your move therefore has a direct tax effect. We analyse this scenario in detail in the guide on the arrival and departure year.',
              },
            },
          ],
        },
        {
          type: 'subsection',
          heading: {
            es: 'Viajes y ausencias durante el año',
            en: 'Trips and absences during the year',
          },
          blocks: [
            {
              type: 'paragraph',
              text: {
                es: 'Los nómadas digitales viajan con frecuencia, pero la doctrina de la Dirección General de Tributos considera que las ausencias esporádicas computan como días de permanencia en España. Para descontar esos días necesitarías acreditar que eres residente fiscal en otro país durante esos periodos, algo poco habitual en la práctica. Lo sensato es contar todos los días salvo los de estancia claramente prolongada en el extranjero y conservar evidencia documental de cada desplazamiento.',
                en: 'Digital nomads travel frequently, but the doctrine of the Directorate-General for Taxes considers that sporadic absences count as days of presence in Spain. To deduct those days you would need to prove that you are a tax resident of another country during those periods, which is uncommon in practice. The sensible approach is to count every day except clearly extended stays abroad and to keep documentary evidence of each trip.',
              },
            },
          ],
        },
      ],
    },
    {
      heading: {
        es: 'Opciones de tributación: IRPF general o régimen de impatriados',
        en: 'Taxation options: general income tax or the impatriate regime',
      },
      blocks: [
        {
          type: 'paragraph',
          text: {
            es: 'Una de las grandes ventajas de la Ley de Startups es que abrió el régimen especial de trabajadores desplazados (art. 93 LIRPF, conocido como Ley Beckham) a los teletrabajadores internacionales. Si cumples los requisitos —entre ellos no haber sido residente fiscal en España en los cinco ejercicios anteriores— puedes optar por tributar a un tipo fijo del 24 % sobre los rendimientos del trabajo hasta 600.000 euros, en lugar del tipo progresivo del IRPF. La opción debe ejercitarse en el plazo de seis meses desde el inicio de la actividad y se mantiene durante el año del cambio de residencia y los cinco siguientes.',
            en: 'One of the major advantages of the Startups Act is that it opened the special regime for posted workers (Art. 93 PIT Act, known as the Beckham Law) to international remote workers. If you meet the requirements — among them, not having been a Spanish tax resident in the previous five tax periods — you can opt to be taxed at a flat 24% rate on employment income up to €600,000, instead of the progressive income tax scale. The option must be exercised within six months of starting the activity and lasts for the year of the change of residence plus the following five years.',
          },
        },
        { type: 'legalRef', refId: 'lirpf-art93' },
        {
          type: 'paragraph',
          text: {
            es: 'La elección no es automática ni siempre favorable: con el régimen de impatriados renuncias a las reducciones y deducciones del IRPF, y los autónomos solo pueden acogerse si encajan en las categorías previstas (actividad emprendedora, profesional altamente cualificado o teletrabajador internacional). Comparamos ambas vías en la guía dedicada a la Ley Beckham frente a la regla de los 183 días.',
            en: 'The choice is neither automatic nor always favourable: under the impatriate regime you give up the reductions and deductions of the general income tax, and freelancers can only join if they fit the foreseen categories (entrepreneurial activity, highly qualified professional or international remote worker). We compare both paths in the guide dedicated to the Beckham Law versus the 183-day rule.',
          },
        },
      ],
    },
    {
      heading: {
        es: 'Errores frecuentes de los nómadas con visado DNV',
        en: 'Common mistakes of nomads on the DNV',
      },
      blocks: [
        {
          type: 'list',
          items: [
            {
              es: 'Creer que el visado incluye un régimen fiscal propio: el DNV es un permiso de residencia; tu tributación depende de la regla de los 183 días y de si optas al régimen de impatriados.',
              en: 'Believing the visa includes its own tax regime: the DNV is a residence permit; your taxation depends on the 183-day rule and on whether you opt into the impatriate regime.',
            },
            {
              es: 'No contar los días de presencia desde el primer día: el cómputo empieza cuando aterrizas, no cuando recoges la tarjeta de residencia.',
              en: 'Not counting days of presence from day one: the count starts when you land, not when you collect your residence card.',
            },
            {
              es: 'Asumir que trabajar para clientes extranjeros exime de tributar en España: el origen de los ingresos no cambia la residencia fiscal.',
              en: 'Assuming that working for foreign clients exempts you from Spanish tax: the source of income does not change tax residency.',
            },
            {
              es: 'Dejar pasar el plazo de seis meses para optar al régimen de impatriados: es un plazo estricto y la opción no se puede ejercitar después.',
              en: 'Missing the six-month deadline to opt into the impatriate regime: it is a strict deadline and the option cannot be exercised afterwards.',
            },
            {
              es: 'No conservar pruebas de los desplazamientos: billetes, reservas y extractos bancarios son tu defensa ante una comprobación.',
              en: 'Not keeping proof of your trips: tickets, bookings and bank statements are your defence in a tax review.',
            },
          ],
        },
        {
          type: 'paragraph',
          text: {
            es: 'La recomendación general es sencilla: lleva un registro riguroso de tus días en España desde el primer momento, valora la opción del régimen de impatriados antes de que venza el plazo y confirma tu escenario con un asesor fiscal especializado en fiscalidad internacional. La calculadora de TaxNomad te ayuda con el primer paso: medir con precisión tu presencia y saber cuántos días te separan del umbral.',
            en: 'The general recommendation is simple: keep a rigorous record of your days in Spain from the very beginning, assess the impatriate regime option before the deadline expires, and confirm your scenario with a tax advisor specialised in international taxation. The TaxNomad calculator helps with the first step: accurately measuring your presence and knowing how many days separate you from the threshold.',
          },
        },
      ],
    },
  ],
  related: [
    'beckham-law-vs-183-days',
    'counting-days-arrival-departure',
    'sporadic-absences-tax-treaties',
  ],
};
