CREATE TABLE IF NOT EXISTS premium_reports (
  report_key TEXT PRIMARY KEY,
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  client_reference_id TEXT,
  source TEXT NOT NULL,
  product_type TEXT NOT NULL,
  name TEXT NOT NULL,
  tax_id TEXT NOT NULL,
  document_type TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'es',
  fiscal_year INTEGER NOT NULL DEFAULT 2026,
  total_days INTEGER NOT NULL,
  status_label TEXT,
  ranges_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  delivery_token_hash TEXT,
  delivery_token_expires_at TIMESTAMPTZ,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  customer_email TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE premium_reports
ADD COLUMN IF NOT EXISTS language TEXT NOT NULL DEFAULT 'es';

ALTER TABLE premium_reports
ADD COLUMN IF NOT EXISTS fiscal_year INTEGER NOT NULL DEFAULT 2026;

ALTER TABLE premium_reports
ADD COLUMN IF NOT EXISTS delivery_token_hash TEXT;

ALTER TABLE premium_reports
ADD COLUMN IF NOT EXISTS delivery_token_expires_at TIMESTAMPTZ;
