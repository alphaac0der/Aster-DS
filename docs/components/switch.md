# Aster Switch Component Contract

**Status:** APPROVED PROPOSAL (Phase 10 — Batch A)  
**Design System Alignment:** Aligns with [Design Principles](../principles.md) and [DEC-013](../../records/DECISION-LOG.md).

---

## 1. Component Overview & Anatomy

The Aster Switch component provides an instantaneous binary on/off control for settings and preferences.

```
+-------------------------------------------------------------+
| [ ( )==== ]  Switch Label Text                              | <-- Switch Field
|              Supporting description or status hint          | <-- Description
+-------------------------------------------------------------+
```

### Anatomical Sub-Elements

1. **Field Container (`.as-switch-field`):** Flex alignment container.
2. **Native Input (`.as-switch-input`):** Native checkbox declaring `role="switch"`.
3. **Track (`.as-switch-track`):** Pill-shaped track indicating state boundary.
4. **Thumb (`.as-switch-thumb`):** Sliding circular knob moving between off (left) and on (right).
5. **Label Text (`.as-switch-field__label`):** Visual label for the toggle setting.

---

## 2. Properties & Supported States

| State / Variant | Description | Token / Value Binding |
|---|---|---|
| Off (Unchecked) | Muted surface track with subtle border | `var(--as-semantic-color-surface-muted)` / `var(--as-semantic-color-border-strong)` |
| On (Checked) | Primary brand background fill | `var(--as-semantic-color-interactive-primary)` |
| Hover | High contrast border highlight on track | `var(--as-semantic-color-text-default)` |
| Focus-Visible | High contrast 2px focus outline around track | `var(--as-semantic-color-border-focus)` |
| Disabled | Muted opacity with not-allowed cursor | `opacity: 0.5; cursor: not-allowed` |

---

## 3. Interaction & Keyboard Accessibility

- Uses native `<input type="checkbox" role="switch">` so screen readers announce "switch, on/off".
- Activated with `Space` key.
- Animation smoothly slides thumb, collapsing duration under `prefers-reduced-motion: reduce`.
- Target size satisfies WCAG 2.5.8 (44×24px track comfortable, 36×20px compact).

---

## 4. Canonical Token Bindings

| Property / Area | CSS Custom Property Binding |
|---|---|
| Track Background (On) | `var(--as-semantic-color-interactive-primary)` |
| Track Background (Off) | `var(--as-semantic-color-surface-muted)` |
| Track Border | `var(--as-semantic-color-border-strong)` |
| Focus Outline | `var(--as-elevation-border-focus) solid var(--as-semantic-color-border-focus)` |
| Label Color | `var(--as-semantic-color-text-default)` |
| Description Color | `var(--as-semantic-color-text-muted)` |
| Transition Duration | `var(--as-motion-duration-base)` |
| Transition Easing | `var(--as-motion-ease-out)` |

---

## 5. Requirements & Classification Framework

### 5.1 Normative Requirements (WCAG 2.2 Level AA Mandates)
1. **Non-text Contrast (SC 1.4.11 - Level AA):** Off track border achieves ≥3.0:1 contrast; on track achieves ≥3.0:1 contrast against surface.
2. **Keyboard Operability (SC 2.1.1 - Level A):** Reachable via `Tab` and operable via `Space`.
3. **Focus Visible (SC 2.4.7 - Level A):** Focus outline clearly visible around switch track.
4. **Name, Role, Value (SC 4.1.2 - Level A):** `role="switch"` and `aria-checked` accurately reported to assistive technology.

### 5.2 Aster Conventions
- Instantaneous effect: Switches are used for settings that apply immediately without an explicit submit button.

---

## 6. Scope Disclosure & Implementation Boundaries

> [!WARNING]
> Visual sliding animation is verified headlessly in Chrome CDP. Auditory feedback and screen reader announcement timing across platforms requires manual verification.
