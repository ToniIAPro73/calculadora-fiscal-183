# Checklist de validación — habilitar promoción gobernada (2026-10-23)

> Cambios de configuración y contrato. El SHA final se registra en el commit que incluye este checklist.

**Repositorio:** calculadora-fiscal-183
**Rama:** development
**Entorno de validación:** Preview asociado al SHA publicado
**Datos:** no se usaron ni modificaron datos de aplicación.

## 1. Qué cambia
- Se habilita `.github/workflows/promote.yml` con promoción individual y cadena completa asíncrona.
- El runtime declara la cadena `development → staging → production → main`, el token `PROMOTE=FULL` y el SHA exacto revisado en Preview.

## 2. Ya comprobado por el agente
| Comprobación | Método | Resultado |
| --- | --- | --- |
| Sintaxis YAML | Parser YAML sobre `promote.yml` | PASS |
| Integridad del diff | `git diff --check` | PASS |

## 3. Pruebas no ejecutadas (NOT_RUN)
| Prueba | Motivo concreto |
| --- | --- |
| Suite, lint y build de la aplicación | El cambio solo afecta al workflow y al contrato runtime. |
| Ejecución de `promote.yml` | No se ha solicitado iniciar una promoción con este cambio. |
| Revisión de Preview | Pendiente de Toni tras el push. |

## 4. Checklist para Toni
| # | Dónde | Pasos | Resultado esperado | Bloqueante |
| --- | --- | --- | --- | --- |
| 1 | Preview | Revisar la Preview del SHA publicado y el flujo configurado en el repositorio | El Preview corresponde al SHA exacto de `development` | Sí, antes de promocionar |

## 5. Riesgos y limitaciones
- La cadena completa se detiene si `development` avanza tras la revisión de Preview o si las ramas destino divergen.
- El agente no espera ni comprueba los resultados de staging, production o main; Toni revisa esos entornos.

## 6. Decisión de Toni
- [ ] Validado en Preview
- [ ] PROMOTE=FULL
- [ ] No se promociona. Motivo: ______________________

---

# Validación — correcciones de indexación SEO (2026-10-25)

**Commit de aplicación:** `8a3d58c` (`fix(seo): improve policy indexing and legacy redirects`)
**Rama:** development
**Entorno de validación:** Preview asociado al SHA publicado

## Qué cambia
- Se corrigen las páginas de privacidad y sus metadatos/prerenderizado para ES y EN.
- Se alinean las rutas de sitemap y redirecciones con las URL canónicas, evitando exponer rutas inexistentes.

## Ya comprobado por el agente
| Comprobación | Método | Resultado |
| --- | --- | --- |
| Build de producción | `npm run build --ignore-scripts` | PASS |
| Prerender SEO | `node scripts/prerender-seo.js` | PASS; 26 rutas generadas |
| Validación SEO | `node scripts/validate-seo.mjs` | PASS |
| Contenido prerenderizado | Inspección del HTML generado para privacidad ES/EN | PASS; canonical y contenido presentes |
| Typecheck | `npm run typecheck --if-present` | N/A; el proyecto no declara script `typecheck` ni usa TypeScript |
| Integridad del diff | `git diff --check` | Pendiente de repetir tras este checklist |

## No ejecutado
- Suite de tests y lint: no se ejecutaron para este cambio SEO; no se observaron fallos de build o validación SEO.
- Revisión de Preview: pendiente de Toni después del push.

## Checklist para Toni
| # | Dónde | Pasos | Resultado esperado | Bloqueante |
| --- | --- | --- | --- | --- |
| 1 | Preview | Revisar privacidad ES/EN y las URL canónicas/redirecciones modificadas en el SHA publicado | Páginas útiles accesibles, canónicas coherentes y sin enlaces a rutas 404 | Sí, antes de promocionar |

## Decisión de Toni
- [ ] Validado en Preview
- [ ] PROMOTE=FULL
- [ ] No se promociona. Motivo: ______________________
