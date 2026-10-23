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
