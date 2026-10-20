# Aster Tooltip Component Contract

**Design System Alignment:** Aligns with [Design Principles](../principles.md) and [Token Architecture](../tokens.md).

---

## 1. Component Overview & Anatomy

The Aster Tooltip component displays a contextual micro-overlay containing supplementary information when hovering or focusing an interactive trigger.

```
          +------------------------+
          | Tooltip text advice    |  <-- Tooltip bubble
          +-----------v------------+
               [ Target Button ]       <-- Trigger Control
```

### Anatomical Sub-Elements

1. **Trigger Container (`.as-tooltip-trigger`):** Wrapper anchoring the tooltip.
2. **Tooltip Box (`.as-tooltip`):** Elevated text bubble with arrow indicator.
3. **Interactive Target:** Button, link, or input child element.

---

## 2. Properties & Supported States

| State / Variant | Description | Token / Value Binding |
|---|---|---|
| Hidden | Fully transparent and pointer-events none | `opacity: 0; visibility: hidden` |
| Visible | High-contrast bubble on hover or focus-visible | `opacity: 1; visibility: visible` |
| Background | Inverted high-contrast text color | `var(--as-semantic-color-text-default)` |
| Text Color | Card surface contrast color | `var(--as-semantic-color-surface-card)` |

---

## 3. Interaction & Keyboard Accessibility

- **WCAG 2.2 SC 1.4.13 (Content on Hover or Focus):**
  - **Dismissible:** Pressing `Escape` closes the tooltip immediately without moving focus.
  - **Hoverable:** Pointer can move over the tooltip content without it disappearing.
  - **Persistent:** Remains visible until hover or focus is removed.
- Connected via `aria-describedby` referencing the tooltip `id`.
- Geometry: Tooltip padding, text floor (12px), and offsets adhere to Aster's unified standard density scale.

---

## 4. Canonical Token Bindings

| Property / Area | CSS Custom Property Binding |
|---|---|
| Background Fill | `var(--as-semantic-color-text-default)` |
| Text Color | `var(--as-semantic-color-surface-card)` |
| Border Radius | `var(--as-radius-sm)` (6px) |
| Font Size | `var(--as-typography-font-size-xs)` (12px) |
| Transition Duration | `var(--as-motion-duration-base)` |

---

## 5. Requirements & Classification Framework

### 5.1 Normative Requirements (WCAG 2.2 Level AA Mandates)
1. **Content on Hover or Focus (SC 1.4.13 - Level AA):** Dismissible on Escape, hoverable, persistent.
2. **Text Contrast (SC 1.4.3 - Level AA):** Inverted text achieves >15:1 contrast against dark tooltip fill.
3. **Never Obscure Required Info:** Essential instructions must be placed in static label/helper text, not buried in tooltips.

### 5.2 Aster Conventions
- Inverted surface treatment provides high visual contrast against light or dark card surfaces.

---

## 6. Scope Disclosure & Implementation Boundaries

> [!WARNING]
> Tooltips must never be placed on native `<button disabled>` controls because disabled controls cannot receive hover/focus events. Use `aria-disabled="true"` if tooltip inspection is necessary.
