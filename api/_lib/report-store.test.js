import { describe, expect, it } from 'vitest';
import { updateReportPaymentStatus } from './report-store.js';

describe('report-store', () => {
  it('refuses payment status updates without a report key or Stripe session id', async () => {
    await expect(
      updateReportPaymentStatus({
        reportKey: null,
        stripeSessionId: null,
        paymentStatus: 'paid',
      }),
    ).rejects.toThrow('reportKey or stripeSessionId is required to update payment status');
  });
});
