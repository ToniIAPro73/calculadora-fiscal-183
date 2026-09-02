<!-- markdownlint-disable MD001 MD013 MD033 MD041 MD060 -->

<div align="center">

<img src="./public/apple-touch-icon.png" alt="Anclora Calculadora Fiscal 183" width="120" />

# Anclora Calculadora Fiscal 183

### Spanish tax-residency calculator based on the 183-day rule

[Español](./README.md) · **English**

<br />

![Anclora](https://img.shields.io/badge/Anclora-ecosystem-111827)
![Documentation](https://img.shields.io/badge/documentation-premium-BFA46A)
![Languages](https://img.shields.io/badge/languages-ES%20%7C%20EN-047857)

</div>

---

> [!IMPORTANT]
> Reduced public repository. Describes the product and its conceptual architecture; it does not expose operational logic, secrets or real data.

## What this is

A web calculator for people who split their time inside and outside Spain and need to know whether they exceed (or are close to exceeding) the **183 days of presence** that the Spanish tax authority (Agencia Tributaria) uses as its main tax-residency criterion. The user enters their stay date ranges and the app computes accumulated days, tax-residency risk, and a countdown of remaining days.

## Main features

- **Date range selector** and an annual heatmap calendar to visualize time spent in the country.
- **Remaining-days countdown** before hitting the 183-day threshold.
- **Risk gauge** for tax residency based on accumulated days.
- **Economic interests panel** and applicable **double-taxation treaties**.
- **Indicative IRPF (income tax) estimator**.
- **Paid premium report** (via Stripe) with the full calculation breakdown.
- **Guides** explaining the tax-residency regulations.

## Technology

| Area | Detail |
| --- | --- |
| Frontend | React + Tailwind CSS |
| Validation | Zod |
| Payments | Stripe |
| Tests | Vitest |

## Documentation

- [Documentation](./docs)

## Brand

- Canonical product: `anclora-calculadora-fiscal-183`
- Family: `independent_product`
- Target visibility: `public`
- Brand asset: `present`

---

<div align="center">

### Antonio Ballesteros · Anclora Group

Software, generative AI and automation for traceable digital products.

</div>
