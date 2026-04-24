import Stripe from 'stripe';
import { z } from 'zod';
import { createDraftReport, attachStripeSession } from './_lib/report-store.js';
import { buildDeliveryTokenExpiry, createDeliveryToken, hashDeliveryToken } from './_lib/delivery-token.js';
import { recordOperationalError, recordOperationalEvent } from './_lib/telemetry.js';
import { calculateFiscalSummary } from '../src/lib/fiscalSummary.js';

// Vercel Serverless Function — create-checkout-session
// Real mode: Stripe Checkout con configuración server-side.
// Mock mode: solo permitido fuera de producción si faltan credenciales.

function normalizeBaseUrl(value) {
  return value.replace(/\/+$/, '');
}

function buildClientReferenceId(taxId) {
  const normalizedTaxId = String(taxId || '')
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .slice(-24);

  return `regla183_${Date.now()}_${normalizedTaxId || 'guest'}`;
}

const checkoutPayloadSchema = z.object({
  name: z.string().trim().min(1).max(160),
  taxId: z.string().trim().min(1).max(64),
  documentType: z.enum(['passport', 'nie']).default('passport'),
  fiscalYear: z.number().int().min(1900).max(2100).default(new Date().getFullYear()),
  statusLabel: z.string().max(80).optional().default(''),
  ranges: z.array(z.object({
    start: z.union([z.string(), z.date()]),
    end: z.union([z.string(), z.date()]),
  })).min(1).max(366),
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const parsedPayload = checkoutPayloadSchema.safeParse(req.body || {});
  if (!parsedPayload.success) {
    return res.status(400).json({ error: 'Invalid checkout payload' });
  }

  let fiscalSummary;
  try {
    fiscalSummary = calculateFiscalSummary(parsedPayload.data.ranges);
  } catch {
    return res.status(400).json({ error: 'Invalid date ranges' });
  }

  const { name, taxId, fiscalYear, statusLabel, documentType, ranges } = parsedPayload.data;
  const totalDays = fiscalSummary.totalDays;

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID;
  const appUrl = process.env.APP_URL;
  const databaseUrl = process.env.DATABASE_URL;
  const isProduction = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';

  // ── REAL STRIPE MODE ──────────────────────────────────────────
  if (stripeKey) {
    try {
      const stripe = new Stripe(stripeKey, { apiVersion: '2024-12-18.acacia' });
      const baseUrl = normalizeBaseUrl(appUrl || '');

      if (!stripeKey.startsWith('sk_test_') && !stripeKey.startsWith('sk_live_')) {
        return res.status(500).json({ error: 'STRIPE_SECRET_KEY has invalid format' });
      }

      if (!priceId) {
        return res.status(500).json({ error: 'STRIPE_PRICE_ID not configured' });
      }

      if (!baseUrl) {
        return res.status(500).json({ error: 'APP_URL not configured' });
      }

      if (!databaseUrl) {
        return res.status(500).json({ error: 'DATABASE_URL not configured' });
      }

      const reportKey = crypto.randomUUID();
      const clientReferenceId = buildClientReferenceId(taxId);
      const deliveryToken = createDeliveryToken();

      await createDraftReport({
        reportKey,
        source: 'regla183',
        productType: 'premium_report',
        name,
        taxId,
        documentType: String(documentType || 'passport'),
        fiscalYear,
        totalDays,
        statusLabel: String(statusLabel ?? ''),
        ranges,
        deliveryTokenHash: hashDeliveryToken(deliveryToken),
        deliveryTokenExpiresAt: buildDeliveryTokenExpiry(),
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: 'payment',
        success_url: `${baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}&delivery_token=${deliveryToken}`,
        cancel_url: `${baseUrl}/?cancelled=true`,
        client_reference_id: clientReferenceId,
        metadata: {
          source: 'regla183',
          product_type: 'premium_report',
          report_key: reportKey,
        },
        payment_intent_data: {
          metadata: {
            source: 'regla183',
            product_type: 'premium_report',
            report_key: reportKey,
          },
        },
      });

      await attachStripeSession({
        reportKey,
        stripeSessionId: session.id,
        clientReferenceId,
      });

      recordOperationalEvent('checkout_created', {
        reportKey,
        stripeSessionId: session.id,
        fiscalYear,
        periodCount: ranges.length,
        totalDays,
      });

      return res.status(200).json({ url: session.url, mode: 'stripe' });
    } catch (err) {
      recordOperationalError('checkout_creation_failed', err, {
        fiscalYear,
        periodCount: ranges.length,
        totalDays,
      });
      return res.status(500).json({ error: 'Unable to create checkout session' });
    }
  }

  // ── MOCK / DEV MODE ──────────────────────────────────────────
  if (isProduction) {
    return res.status(500).json({ error: 'Stripe is not configured for production' });
  }

  return res.status(200).json({
    url: '/payment-mock',
    mode: 'mock_dev',
  });
}
