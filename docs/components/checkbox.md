# Aster Checkbox Component Contract

**Status:** APPROVED PROPOSAL (Phase 10 — Batch A)  
**Design System Alignment:** Aligns with [Design Principles](../principles.md) and [DEC-013](../../records/DECISION-LOG.md).

---

## 1. Component Overview & Anatomy

The Aster Checkbox component provides an accessible, high-contrast selection control allowing users to toggle between checked, unchecked, or indeterminate states.

```
+-------------------------------------------------------------+
| [✓]  Checkbox Label Text                                     | <-- Checkbox Field
|      Supporting description or context text                 | <-- Optional Description
+-------------------------------------------------------------+
```

### Anatomical Sub-Elements

1. **Field Container (`.as-checkbox-field`):** Inline flex container establishing alignment between the checkbox box and label text.
2. **Checkbox Hit Container (`.as-checkbox`):** The touch and click hit boundary (32px comfortable, 28px compact) surrounding the visual box.
3. **Native Checkbox Input (`.as-checkbox-input`):** Native HTML `<input type="checkbox">` receiving focus, change events, and screen reader announcements.
4. **Label Text (`.as-checkbox-field__label`):** Visual label associated with the checkbox.
5. **Description (`.as-checkbox-field__description`):** Optional supplementary description text.

---

## 2. Properties & Supported States

| State / Variant | Description | Token / Value Binding |
|---|---|---|
| Unchecked | Card background with strong border | `var(--as-semantic-color-surface-card)` / `var(--as-semantic-color-border-strong)` |
| Checked | Primary brand background with SVG checkmark | `var(--as-semantic-color-interactive-primary)` |
| Indeterminate | Primary brand background with horizontal dash | `var(--as-semantic-color-interactive-primary)` |
| Hover | High contrast border highlight | `var(--as-semantic-color-text-default)` |
| Focus-Visible | High contrast 2px focus outline | `var(--as-semantic-color-border-focus)` |
| Disabled | Muted opacity with not-allowed cursor | `opacity: 0.5; cursor: not-allowed` |
| Invalid / Error | Critical status border color | `var(--as-semantic-color-status-critical-text)` |

---

## 3. Interaction & Keyboard Accessibility

- Uses native `<input type="checkbox">` preserving keyboard operability (`Space` toggles state).
- Programmatic indeterminate state synced via `input.indeterminate = true` and `aria-checked="mixed"`.
- Focus visibility enforced via `:focus-visible` with 2px offset (`var(--as-elevation-border-focus) solid var(--as-semantic-color-border-focus)`).
- Touch target bounds satisfy WCAG 2.5.8 Level AA (minimum 24×24px; Aster checkbox hit container measures 32×32px in Comfortable and 28×28px in Compact).

---

## 4. Canonical Token Bindings

| Property / Area | CSS Custom Property Binding |
|---|---|
| Checked Fill | `var(--as-semantic-color-interactive-primary)` |
| Border (Rest) | `var(--as-semantic-color-border-strong)` |
| Border (Hover) | `var(--as-semantic-color-text-default)` |
| Focus Outline | `var(--as-elevation-border-focus) solid var(--as-semantic-color-border-focus)` |
| Error Border | `var(--as-semantic-color-status-critical-text)` |
| Label Color | `var(--as-semantic-color-text-default)` |
| Description Color | `var(--as-semantic-color-text-muted)` |
| Transition Duration | `var(--as-motion-duration-base)` |
| Transition Easing | `var(--as-motion-ease-out)` |

---

## 5. Requirements & Classification Framework

### 5.1 Normative Requirements (WCAG 2.2 Level AA Mandates)
1. **Non-text Contrast (SC 1.4.11 - Level AA):** The unselected checkbox border meets ≥3.0:1 contrast against adjacent canvas/card surfaces.
2. **Keyboard Operability (SC 2.1.1 - Level A):** Navigable via `Tab` key and toggled via `Space`.
3. **Focus Visible (SC 2.4.7 - Level A):** High-contrast focus ring appears upon keyboard navigation.
4. **Target Size (SC 2.5.8 - Level AA):** Minimum 24×24px hit bounds (32px comfortable, 28px compact).
5. **Name, Role, Value (SC 4.1.2 - Level A):** Native checkbox semantics communicate checked and indeterminate (`mixed`) values.

### 5.2 Aster Conventions
- Hit container margin offset `-6px` aligns visual checkbox box flush with preceding column text while preserving touch targets.
- 12px description floor (`var(--as-typography-font-size-xs)`).

---

## 6. Scope Disclosure & Implementation Boundaries

> [!WARNING]
> Automated unit assertions verify element bounding boxes, attributes, and mathematical color contrast. Screen reader speech output across operating systems (JAWS, NVDA, VoiceOver) and high-magnification zoom reflow (WCAG SC 1.4.10) require manual verification.
