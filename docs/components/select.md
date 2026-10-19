# Aster Select Component Contract

**Status:** APPROVED PROPOSAL (Phase 10 — Batch A)  
**Governance:** Aligns with [`governance/SOUL.md`](../../governance/SOUL.md), [`governance/WORKFLOW.md`](../../governance/WORKFLOW.md), and DEC-013.

---

## 1. Component Overview & Anatomy

The Aster Select component provides an accessible dropdown selection field built on top of native `<select>` semantics.

```
+-------------------------------------------------------------+
| Label Text *                                                | <-- Label Area
+-------------------------------------------------------------+
| Selected Option Display                                 [v] | <-- Select Box + Chevron
+-------------------------------------------------------------+
| Helper description or error feedback                        | <-- Feedback
+-------------------------------------------------------------+
```

### Anatomical Sub-Elements

1. **Field Container (`.as-form-field`):** Layout wrapper for label, select box, and feedback.
2. **Select Box (`.as-select-box`):** Full pill-shaped control container (40px comfortable, 32px compact).
3. **Native Select (`.as-select`):** Native HTML `<select>` with `<option>` children.
4. **Chevron Icon (`.as-select-chevron`):** Decorative SVG arrow cue.
5. **Helper / Error Feedback:** Programmatically associated via `aria-describedby`.

---

## 2. Properties & Supported States

| State / Variant | Description | Token / Value Binding |
|---|---|---|
| Default | Card background with strong border | `var(--as-semantic-color-surface-card)` / `var(--as-semantic-color-border-strong)` |
| Hover | High contrast border highlight | `var(--as-semantic-color-text-default)` |
| Focus-Visible | High contrast 2px focus outline | `var(--as-semantic-color-border-focus)` |
| Disabled | Muted surface with not-allowed cursor | `var(--as-semantic-color-surface-muted)` |
| Invalid / Error | Critical status border and outline | `var(--as-semantic-color-status-critical-text)` |

---

## 3. Interaction & Keyboard Accessibility

- Native `<select>` guarantees 100% platform accessibility on mobile, screen readers, and desktop.
- Keyboard navigation: `Space` or `Alt + Down` opens menu, arrow keys navigate options.
- Focus visibility: 2px ring with 2px offset (`var(--as-elevation-border-focus) solid var(--as-semantic-color-border-focus)`).
- Control height meets Aster standards (40px comfortable, 32px compact).

---

## 4. Canonical Token Bindings

| Property / Area | CSS Custom Property Binding |
|---|---|
| Background (Rest) | `var(--as-semantic-color-surface-card)` |
| Background (Disabled) | `var(--as-semantic-color-surface-muted)` |
| Border (Rest) | `var(--as-semantic-color-border-strong)` |
| Border (Hover) | `var(--as-semantic-color-text-default)` |
| Focus Outline | `var(--as-elevation-border-focus) solid var(--as-semantic-color-border-focus)` |
| Error Border | `var(--as-semantic-color-status-critical-text)` |
| Text Color | `var(--as-semantic-color-text-default)` |
| Chevron / Placeholder | `var(--as-semantic-color-text-muted)` |
| Border Radius | `var(--as-radius-full)` (9999px) |
| Transition Duration | `var(--as-motion-duration-base)` |
| Transition Easing | `var(--as-motion-ease-out)` |

---

## 5. Requirements & Classification Framework

### 5.1 Normative Requirements (WCAG 2.2 Level AA Mandates)
1. **Non-text Contrast (SC 1.4.11 - Level AA):** Control border and chevron icon meet ≥3.0:1 contrast.
2. **Keyboard Operability (SC 2.1.1 - Level A):** Standard native `<select>` keyboard operation.
3. **Focus Visible (SC 2.4.7 - Level A):** Visible focus ring renders when select is focused.
4. **Target Size (SC 2.5.8 - Level AA):** 40px comfortable, 32px compact exceed 24×24px requirement.

### 5.2 Aster Conventions
- Full pill border radius (`var(--as-radius-full)`) coordinates with `.as-button` and `.as-input` aesthetic.

---

## 6. Scope Disclosure & Implementation Boundaries

> [!WARNING]
> Native `<select>` popup rendering is managed by the OS and browser. Custom styled option menus are deferred to overlay components (`DropdownMenu`).
