# Aster Alert Component Contract

**Status:** APPROVED PROPOSAL (Phase 10 — Batch B)  
**Design System Alignment:** Aligns with [Design Principles](../principles.md) and [DEC-013](../../records/DECISION-LOG.md).

---

## 1. Component Overview & Anatomy

The Aster Alert component provides prominent, high-contrast banners for critical system notifications, warnings, and informational notices.

```
+-------------------------------------------------------------+
| [!]  Alert Title Text                                   [X] | <-- Header + Dismiss
|      Detailed description or instructions for user.         | <-- Description
+-------------------------------------------------------------+
```

### Anatomical Sub-Elements

1. **Alert Container (`.as-alert`):** Box container with tinted background and border.
2. **Icon (`.as-alert__icon`):** Status icon (`aria-hidden="true"`).
3. **Content (`.as-alert__content`):** Title and description container.
4. **Dismiss Button (`.as-alert__close`):** Optional button with `aria-label="Dismiss alert"`.

---

## 2. Properties & Supported States

| State / Variant | Description | Token / Value Binding |
|---|---|---|
| Info | Interactive primary brand tint | `var(--as-semantic-color-interactive-primary)` |
| Success | Success status tint | `var(--as-semantic-color-status-success-text)` |
| Warning | Warning status tint | `var(--as-semantic-color-status-warning-text)` |
| Critical | Critical error tint | `var(--as-semantic-color-status-critical-text)` |

---

## 3. Interaction & Keyboard Accessibility

- Dynamic error/critical alerts declare `role="alert"` (`aria-live="assertive"`).
- Static or informational alerts declare `role="region"` with `aria-labelledby`.
- Dismiss button is keyboard accessible via `Tab` and activated via `Enter` / `Space`.
- Focus ring visible on dismiss button (`var(--as-elevation-border-focus) solid var(--as-semantic-color-border-focus)`).

---

## 4. Canonical Token Bindings

| Property / Area | CSS Custom Property Binding |
|---|---|
| Surface Background | `var(--as-semantic-color-surface-card)` |
| Title Color | `var(--as-semantic-color-text-default)` |
| Description Color | `var(--as-semantic-color-text-muted)` |
| Focus Ring | `var(--as-elevation-border-focus) solid var(--as-semantic-color-border-focus)` |
| Transition Duration | `var(--as-motion-duration-base)` |
| Transition Easing | `var(--as-motion-ease-out)` |

---

## 5. Requirements & Classification Framework

### 5.1 Normative Requirements (WCAG 2.2 Level AA Mandates)
1. **Text Contrast (SC 1.4.3 - Level AA):** Title and description meet ≥4.5:1 against tinted card surface.
2. **Non-text Contrast (SC 1.4.11 - Level AA):** Icon meets ≥3.0:1 contrast.
3. **Keyboard Operability (SC 2.1.1 - Level A):** Dismiss button operable via keyboard.
4. **Name, Role, Value (SC 4.1.2 - Level A):** `role="alert"` or explicit accessible name.

### 5.2 Aster Conventions
- Border radius `var(--as-radius-md)` (8px) comfortable, `var(--as-radius-sm)` (6px) compact.

---

## 6. Scope Disclosure & Implementation Boundaries

> [!WARNING]
> While `role="alert"` triggers an immediate announcement in screen readers, critical alerts appearing off-screen may require polite announcement strategies or managed focus to prevent disorientation.
