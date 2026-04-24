import { describe, expect, it } from 'vitest';
import { createDeliveryToken, hashDeliveryToken, isDeliveryTokenValid } from './delivery-token.js';

describe('delivery-token', () => {
  it('validates only matching non-expired delivery tokens', () => {
    const token = createDeliveryToken();
    const report = {
      deliveryTokenHash: hashDeliveryToken(token),
      deliveryTokenExpiresAt: new Date(Date.now() + 60_000).toISOString(),
    };

    expect(isDeliveryTokenValid(report, token)).toBe(true);
    expect(isDeliveryTokenValid(report, 'wrong-token')).toBe(false);
  });

  it('rejects expired delivery tokens', () => {
    const token = createDeliveryToken();
    const report = {
      deliveryTokenHash: hashDeliveryToken(token),
      deliveryTokenExpiresAt: new Date(Date.now() - 60_000).toISOString(),
    };

    expect(isDeliveryTokenValid(report, token)).toBe(false);
  });
});
