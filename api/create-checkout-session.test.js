import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  stripeSessionCreate: vi.fn(),
  createDraftReport: vi.fn(),
  attachStripeSession: vi.fn(),
}));

vi.mock('stripe', () => ({
  default: vi.fn(function StripeMock() {
    return {
      checkout: {
        sessions: {
          create: mocks.stripeSessionCreate,
        },
      },
    };
  }),
}));

vi.mock('./_lib/report-store.js', () => ({
  createDraftReport: mocks.createDraftReport,
  attachStripeSession: mocks.attachStripeSession,
}));

function createResponse() {
  return {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
}

describe('create-checkout-session', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.STRIPE_SECRET_KEY = 'sk_test_valid';
    process.env.STRIPE_PRICE_ID = 'price_123';
    delete process.env.STRIPE_ADVISOR_PRICE_ID;
    process.env.APP_URL = 'https://example.com/';
    process.env.DATABASE_URL = 'postgres://example';
    process.env.NODE_ENV = 'test';
    process.env.VERCEL_ENV = 'preview';
    mocks.stripeSessionCreate.mockResolvedValue({ id: 'cs_test_123', url: 'https://stripe.example/session' });
  });

  it('rejects invalid checkout payloads before creating Stripe sessions', async () => {
    const { default: handler } = await import('./create-checkout-session.js');
    const res = createResponse();

    await handler({ method: 'POST', body: { name: '', taxId: '', ranges: [] } }, res);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid checkout payload' });
    expect(mocks.stripeSessionCreate).not.toHaveBeenCalled();
  });

  it('recalculates totalDays from ranges instead of trusting client input', async () => {
    const { default: handler } = await import('./create-checkout-session.js');
    const res = createResponse();

    await handler(
      {
        method: 'POST',
        body: {
          name: 'Alex Rivera',
          email: 'alex@example.com',
          taxId: 'X1234567Z',
          language: 'en',
          fiscalYear: 2026,
          totalDays: 999,
          ranges: [{ start: '2026-01-01', end: '2026-01-10', days: 999 }],
        },
      },
      res,
    );

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ url: 'https://stripe.example/session', mode: 'stripe' });
    expect(mocks.createDraftReport).toHaveBeenCalledWith(
      expect.objectContaining({
        fiscalYear: 2026,
        customerEmail: 'alex@example.com',
        language: 'en',
        totalDays: 10,
        deliveryTokenHash: expect.any(String),
        deliveryTokenExpiresAt: expect.any(String),
      }),
    );
    expect(mocks.stripeSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        customer_email: 'alex@example.com',
        success_url: expect.stringContaining('delivery_token='),
        metadata: expect.objectContaining({
          report_language: 'en',
        }),
      }),
    );
  });

  it('rejects inverted date ranges', async () => {
    const { default: handler } = await import('./create-checkout-session.js');
    const res = createResponse();

    await handler(
      {
        method: 'POST',
        body: {
          name: 'Alex Rivera',
          email: 'alex@example.com',
          taxId: 'X1234567Z',
          ranges: [{ start: '2026-01-10', end: '2026-01-01' }],
        },
      },
      res,
    );

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid date ranges' });
    expect(mocks.stripeSessionCreate).not.toHaveBeenCalled();
  });

  it('uses the standard price by default and adds no advisor metadata', async () => {
    const { default: handler } = await import('./create-checkout-session.js');
    const res = createResponse();

    await handler(
      {
        method: 'POST',
        body: {
          name: 'Alex Rivera',
          email: 'alex@example.com',
          taxId: 'X1234567Z',
          ranges: [{ start: '2026-01-01', end: '2026-01-10' }],
        },
      },
      res,
    );

    expect(res.statusCode).toBe(200);
    expect(mocks.stripeSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: [{ price: 'price_123', quantity: 1 }],
        metadata: expect.not.objectContaining({ advisor_report: 'true' }),
      }),
    );
  });

  it('uses the advisor price only when the advisor flag is set', async () => {
    process.env.STRIPE_ADVISOR_PRICE_ID = 'price_advisor_123';
    const { default: handler } = await import('./create-checkout-session.js');
    const res = createResponse();

    await handler(
      {
        method: 'POST',
        body: {
          name: 'Alex Rivera',
          email: 'alex@example.com',
          taxId: 'X1234567Z',
          advisor: true,
          ranges: [{ start: '2026-01-01', end: '2026-01-10' }],
        },
      },
      res,
    );

    expect(res.statusCode).toBe(200);
    expect(mocks.stripeSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: [{ price: 'price_advisor_123', quantity: 1 }],
        metadata: expect.objectContaining({ advisor_report: 'true' }),
      }),
    );
  });

  it('keeps the standard price when advisor is explicitly false', async () => {
    process.env.STRIPE_ADVISOR_PRICE_ID = 'price_advisor_123';
    const { default: handler } = await import('./create-checkout-session.js');
    const res = createResponse();

    await handler(
      {
        method: 'POST',
        body: {
          name: 'Alex Rivera',
          email: 'alex@example.com',
          taxId: 'X1234567Z',
          advisor: false,
          ranges: [{ start: '2026-01-01', end: '2026-01-10' }],
        },
      },
      res,
    );

    expect(res.statusCode).toBe(200);
    expect(mocks.stripeSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: [{ price: 'price_123', quantity: 1 }],
      }),
    );
  });

  it('fails cleanly when the advisor price is not configured', async () => {
    const { default: handler } = await import('./create-checkout-session.js');
    const res = createResponse();

    await handler(
      {
        method: 'POST',
        body: {
          name: 'Alex Rivera',
          email: 'alex@example.com',
          taxId: 'X1234567Z',
          advisor: true,
          ranges: [{ start: '2026-01-01', end: '2026-01-10' }],
        },
      },
      res,
    );

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'STRIPE_ADVISOR_PRICE_ID not configured' });
    expect(mocks.stripeSessionCreate).not.toHaveBeenCalled();
  });
});
