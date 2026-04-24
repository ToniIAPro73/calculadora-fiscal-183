import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

export function createDeliveryToken() {
  return randomBytes(32).toString('base64url');
}

export function hashDeliveryToken(token) {
  return createHash('sha256').update(String(token)).digest('hex');
}

export function buildDeliveryTokenExpiry(days = 7) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + days);
  return expiresAt.toISOString();
}

export function isDeliveryTokenValid(report, token) {
  if (!report?.deliveryTokenHash || !token) {
    return false;
  }

  if (report.deliveryTokenExpiresAt && new Date(report.deliveryTokenExpiresAt).getTime() < Date.now()) {
    return false;
  }

  const expected = Buffer.from(report.deliveryTokenHash, 'hex');
  const actual = Buffer.from(hashDeliveryToken(token), 'hex');

  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
