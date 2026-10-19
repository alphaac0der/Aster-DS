# Aster Slider Component Contract

**Status:** APPROVED PROPOSAL (Phase 10 — Batch A)  
**Design System Alignment:** Aligns with [Design Principles](../principles.md) and [DEC-013](../../records/DECISION-LOG.md).

---

## 1. Component Overview & Anatomy

The Aster Slider component enables users to choose a numerical value from a continuous or discrete range.

```
+-------------------------------------------------------------+
| Slider Label                                          [ 65% ] <-- Header Area
+-------------------------------------------------------------+
| =======( O )----------------------------------------------- | <-- Active / Inactive Track
+-------------------------------------------------------------+
```

### Anatomical Sub-Elements

1. **Field Container (`.as-slider-field`):** Layout wrapper containing header and slider track.
2. **Header (`.as-slider-field__header`):** Contains the label and current numeric value display.
3. **Control Box (`.as-slider-box`):** Touch hit boundary surrounding the track.
4. **Range Input (`.as-slider`):** Native HTML `<input type="range">`.
5. **Thumb Indicator (`::-webkit-slider-thumb` / `::-moz-range-thumb`):** Draggable circular knob.

---

## 2. Properties & Supported States

| State / Variant | Description | Token / Value Binding |
|---|---|---|
| Active Track Fill | Primary brand color up to thumb position | `var(--as-semantic-color-interactive-primary)` |
| Inactive Track | Muted track border / surface | `color-mix(in srgb, var(--as-semantic-color-text-default) 14%, transparent)` |
| Thumb | Elevated card surface with primary brand border | `var(--as-semantic-color-surface-card)` / `var(--as-semantic-color-interactive-primary)` |
| Hover | Thumb scale expansion | `transform: scale(1.1)` |
| Focus-Visible | High contrast 2px focus outline with 4px offset | `var(--as-semantic-color-border-focus)` |
| Disabled | Muted opacity with not-allowed cursor | `opacity: 0.5; cursor: not-allowed` |

---

## 3. Interaction & Keyboard Accessibility

- Native `<input type="range">` provides native keyboard navigation (`ArrowLeft`, `ArrowRight`, `Home`, `End`, `PageUp`, `PageDown`).
- `aria-valuemin`, `aria-valuemax`, and `aria-valuenow` updated in real time.
- Visible focus indicator renders with 4px offset around slider track.
- Touch bounds: 32px hit container in Comfortable, 24px in Compact.

---

## 4. Canonical Token Bindings

| Property / Area | CSS Custom Property Binding |
|---|---|
| Active Track Fill | `var(--as-semantic-color-interactive-primary)` |
| Inactive Track | `color-mix(in srgb, var(--as-semantic-color-text-default) 14%, transparent)` |
| Thumb Surface | `var(--as-semantic-color-surface-card)` |
| Thumb Border | `var(--as-semantic-color-interactive-primary)` |
| Focus Outline | `var(--as-elevation-border-focus) solid var(--as-semantic-color-border-focus)` |
| Label Color | `var(--as-semantic-color-text-default)` |
| Value Color | `var(--as-semantic-color-text-muted)` |
| Transition Duration | `var(--as-motion-duration-base)` |
| Transition Easing | `var(--as-motion-ease-out)` |

---

## 5. Requirements & Classification Framework

### 5.1 Normative Requirements (WCAG 2.2 Level AA Mandates)
1. **Non-text Contrast (SC 1.4.11 - Level AA):** Active track and thumb border achieve ≥3.0:1 contrast against track and background.
2. **Keyboard Operability (SC 2.1.1 - Level A):** Operable via arrow and paging keys.
3. **Focus Visible (SC 2.4.7 - Level A):** Focus outline clearly visible when slider thumb is focused.
4. **Name, Role, Value (SC 4.1.2 - Level A):** Range slider value communicated via native input value and `aria-valuenow`.

### 5.2 Aster Conventions
- Real-time progress bar gradient `--_progress` synchronized via controller.
- Tabular numeric figures for jitter-free value display.

---

## 6. Scope Disclosure & Implementation Boundaries

> [!WARNING]
> Multi-thumb (dual range) sliders and custom tick marks are deferred to specialized chart/slider contracts. Touch drag precision on high-DPI touchscreens requires manual verification.
