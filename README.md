<!-- markdownlint-disable MD001 MD013 MD033 MD041 MD060 -->

<div align="center">

<img src="./public/apple-touch-icon.png" alt="Anclora Calculadora Fiscal 183" width="120" />

# Anclora Calculadora Fiscal 183

### Calculadora de residencia fiscal en España por la regla de los 183 días

**Español** · [English](./README.en.md)

<br />

![Anclora](https://img.shields.io/badge/Anclora-ecosystem-111827)
![Documentation](https://img.shields.io/badge/documentation-premium-BFA46A)
![Languages](https://img.shields.io/badge/languages-ES%20%7C%20EN-047857)

</div>

---

> [!IMPORTANT]
> Repositorio público reducido. Describe el producto y su arquitectura conceptual; no expone lógica operativa, secretos ni datos reales.

## Qué es

Una calculadora web para personas que pasan tiempo dentro y fuera de España y necesitan saber si superan (o están cerca de superar) los **183 días de permanencia** que la Agencia Tributaria usa como criterio principal de residencia fiscal. El usuario introduce sus rangos de estancia y la aplicación calcula los días acumulados, el riesgo de considerarse residente fiscal y una cuenta atrás de días restantes.

## Funcionalidades principales

- **Selector de rangos de fechas** y calendario anual en mapa de calor para visualizar la estancia.
- **Cuenta atrás de días restantes** antes de alcanzar el umbral de 183 días.
- **Indicador de riesgo** de residencia fiscal según los días acumulados.
- **Panel de intereses económicos** y **convenios de doble imposición** aplicables.
- **Estimador de IRPF** orientativo.
- **Informe premium** de pago (vía Stripe) con el detalle completo del cálculo.
- **Guías** explicativas sobre la normativa de residencia fiscal.

## Tecnología

| Área | Detalle |
| --- | --- |
| Frontend | React + Tailwind CSS |
| Validación | Zod |
| Pagos | Stripe |
| Tests | Vitest |

## Documentación

- [Documentación](./docs)

## Marca

- Producto canónico: `anclora-calculadora-fiscal-183`
- Familia: `independent_product`
- Visibilidad objetivo: `public`
- Asset de marca: `presente`

---

<div align="center">

### Antonio Ballesteros · Anclora Group

Software, IA generativa y automatización para productos digitales trazables.

</div>
