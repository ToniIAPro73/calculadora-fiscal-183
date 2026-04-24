import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  retrieveSession: vi.fn(),
  getReportByStripeSessionId: vi.fn(),
  getReportByReportKey: vi.fn(),
}));

vi.mock('stripe', () => ({
  default: vi.fn(function StripeMock() {
    return {
      checkout: {
        sessions: {
          retrieve: mocks.retrieveSession,
        },
      },
    };
  }),
}));

vi.mock('./_lib/report-store.js', () => ({
  getReportByStripeSessionId: mocks.getReportByStripeSessionId,
  getReportByReportKey: mocks.getReportByReportKey,
}));

vi.mock('./_lib/delivery-token.js', () => ({
  isDeliveryTokenValid: vi.fn((_report, token) => token === 'valid-token'),
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

describe('checkout-session-status', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.STRIPE_SECRET_KEY = 'sk_test_valid';
    mocks.retrieveSession.mockResolvedValue({
      id: 'cs_test_123',
      mode: 'payment',
      status: 'complete',
      payment_status: 'paid',
      metadata: { report_key: 'report_123' },
      customer_details: { email: 'alex@example.com', name: 'Alex Rivera' },
      client_reference_id: 'regla183_ref',
    });
    mocks.getReportByStripeSessionId.mockResolvedValue({
      reportKey: 'report_123',
      name: 'Alex Rivera',
      taxId: 'X1234567Z',
      documentType: 'passport',
      fiscalYear: 2027,
      totalDays: 10,
      statusLabel: 'Seguro',
      ranges: [{ start: '2027-01-01', end: '2027-01-10' }],
    });
  });

  it('requires a session_id query parameter', async () => {
    const { default: handler } = await import('./checkout-session-status.js');
    const res = createResponse();

    await handler({ method: 'GET', query: {} }, res);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: 'session_id is required' });
  });

  it('requires a delivery token before returning report data', async () => {
    const { default: handler } = await import('./checkout-session-status.js');
    const res = createResponse();

    await handler({ method: 'GET', query: { session_id: 'cs_test_123' } }, res);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: 'delivery_token is required' });
  });

  it('returns verified report payload for paid complete sessions', async () => {
    const { default: handler } = await import('./checkout-session-status.js');
    const res = createResponse();

    await handler({ method: 'GET', query: { session_id: 'cs_test_123', delivery_token: 'valid-token' } }, res);

    expect(res.statusCode).toBe(200);
    expect(res.body.verified).toBe(true);
    expect(res.body.report_payload).toEqual({
      name: 'Alex Rivera',
      taxId: 'X1234567Z',
      documentType: 'passport',
      fiscalYear: 2027,
      totalDays: 10,
      statusLabel: 'Seguro',
      ranges: [{ start: '2027-01-01', end: '2027-01-10' }],
    });
  });

  it('rejects paid sessions with an invalid delivery token', async () => {
    const { default: handler } = await import('./checkout-session-status.js');
    const res = createResponse();

    await handler({ method: 'GET', query: { session_id: 'cs_test_123', delivery_token: 'bad-token' } }, res);

    expect(res.statusCode).toBe(403);
    expect(res.body).toEqual({ error: 'Invalid report delivery token' });
  });
});
