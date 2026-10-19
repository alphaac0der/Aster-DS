# Aster Radio Group Component Contract

**Status:** APPROVED PROPOSAL (Phase 10 — Batch A)  
**Governance:** Aligns with [`governance/SOUL.md`](../../governance/SOUL.md), [`governance/WORKFLOW.md`](../../governance/WORKFLOW.md), and DEC-013.

---

## 1. Component Overview & Anatomy

The Aster Radio Group component allows users to select exactly one option from a set of mutually exclusive choices.

```
+-------------------------------------------------------------+
| Group Legend / Title                                        | <-- Legend Area
| ( )  Option 1 Label                                         | <-- Radio Field
| (•)  Option 2 Label (Selected)                              | <-- Radio Field
+-------------------------------------------------------------+
```

### Anatomical Sub-Elements

1. **Group Container (`.as-radio-group`):** Fieldset wrapping all related radio options.
2. **Legend (`.as-radio-group__legend`):** Group label describing the selection context.
3. **Radio Field (`.as-radio-field`):** Inline flex container for an individual option.
4. **Radio Touch Container (`.as-radio`):** Outer hit boundary (32px comfortable, 28px compact).
5. **Native Radio Input (`.as-radio-input`):** Native `<input type="radio">` receiving arrow key focus.
6. **Radio Dot (`::after`):** Centered circular dot indicating active selection.

---

## 2. Properties & Supported States

| State / Variant | Description | Token / Value Binding |
|---|---|---|
| Unchecked | Card background with strong border | `var(--as-semantic-color-surface-card)` / `var(--as-semantic-color-border-strong)` |
| Checked | Primary brand border with centered filled dot | `var(--as-semantic-color-interactive-primary)` |
| Hover | High contrast border highlight | `var(--as-semantic-color-text-default)` |
| Focus-Visible | High contrast 2px focus outline | `var(--as-semantic-color-border-focus)` |
| Disabled | Muted opacity with not-allowed cursor | `opacity: 0.5; cursor: not-allowed` |
| Invalid / Error | Critical status border color | `var(--as-semantic-color-status-critical-text)` |

---

## 3. Interaction & Keyboard Accessibility

- Enclosed in native `<fieldset class="as-radio-group">` with `<legend>`.
- Arrow keys (`ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`) move selection natively between group options.
- Visible focus rings rendered on `:focus-visible` with 2px offset (`var(--as-elevation-border-focus) solid var(--as-semantic-color-border-focus)`).
- Minimum target hit bounds satisfy WCAG 2.5.8 Level AA (32×32px comfortable, 28×28px compact).

---

## 4. Canonical Token Bindings

| Property / Area | CSS Custom Property Binding |
|---|---|
| Checked Border & Dot | `var(--as-semantic-color-interactive-primary)` |
| Border (Rest) | `var(--as-semantic-color-border-strong)` |
| Border (Hover) | `var(--as-semantic-color-text-default)` |
| Focus Outline | `var(--as-elevation-border-focus) solid var(--as-semantic-color-border-focus)` |
| Error Border | `var(--as-semantic-color-status-critical-text)` |
| Legend & Label Color | `var(--as-semantic-color-text-default)` |
| Description Color | `var(--as-semantic-color-text-muted)` |
| Transition Duration | `var(--as-motion-duration-base)` |
| Transition Easing | `var(--as-motion-ease-out)` |

---

## 5. Requirements & Classification Framework

### 5.1 Normative Requirements (WCAG 2.2 Level AA Mandates)
1. **Non-text Contrast (SC 1.4.11 - Level AA):** Unselected circle border achieves ≥3.0:1 against card surface.
2. **Keyboard Operability (SC 2.1.1 - Level A):** Standard arrow navigation across radios in the same group.
3. **Focus Visible (SC 2.4.7 - Level A):** Focus visible clearly outlines the selected radio.
4. **Target Size (SC 2.5.8 - Level AA):** Exceeds 24×24px minimum target bounds.

### 5.2 Aster Conventions
- Group items stacked vertically with 12px gap (`var(--as-space-3)`) or horizontally with 16px gap (`var(--as-space-4)`).

---

## 6. Scope Disclosure & Implementation Boundaries

> [!WARNING]
> Automated tests confirm radio selection exclusivity and DOM attributes. Multi-field form validation announcements require verifying screen reader landmark recognition (`<fieldset>`) in live assistive technology testing.
