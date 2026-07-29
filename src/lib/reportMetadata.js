export const reportOwner = {
  name: 'Antonio Ballesteros Alonso',
  address: 'Carrer Miquel Rosselló i Alemany, 48 07015 Palma de Mallorca (España)',
  email: 'hola@regla183.com',
};

export const buildExampleReportPayload = () => ({
  name: 'Alex Rivera',
  documentType: 'passport',
  taxId: 'X1234567Z',
  fiscalYear: 2026,
  totalDays: 54,
  ranges: [
    { start: new Date('2026-01-05'), end: new Date('2026-01-20'), days: 16 },
    { start: new Date('2026-01-18'), end: new Date('2026-01-28'), days: 11 },
    { start: new Date('2026-03-02'), end: new Date('2026-03-18'), days: 17 },
    { start: new Date('2026-08-11'), end: new Date('2026-08-23'), days: 13 },
  ],
  economicInterests: {
    family: 'abroad',
    income: 'abroad',
    home: 'mixed',
    activity: 'abroad',
  },
  savedScenarios: [
    {
      name: 'Verano en Mallorca',
      ranges: [
        { start: new Date('2026-07-01'), end: new Date('2026-07-21'), days: 21 },
      ],
    },
    {
      name: 'Puente de diciembre',
      ranges: [
        { start: new Date('2026-12-05'), end: new Date('2026-12-14'), days: 10 },
      ],
    },
  ],
  exampleMode: true,
});
